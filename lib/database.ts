/**
 * SiteFlow Local Database — SQLite offline-first storage
 * ALL data writes go here first. Cloud sync happens later via sync queue.
 */
import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('siteflow.db');
  await initSchema(db);
  return db;
}

async function initSchema(database: SQLite.SQLiteDatabase) {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    -- Jobs table
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      address TEXT NOT NULL,
      client_name TEXT,
      client_phone TEXT,
      client_email TEXT,
      status TEXT DEFAULT 'lead',
      phase TEXT DEFAULT 'mitigation',
      damage_type TEXT,
      estimated_value REAL DEFAULT 0,
      paid_amount REAL DEFAULT 0,
      approved_amount REAL DEFAULT 0,
      pending_amount REAL DEFAULT 0,
      insurance_carrier TEXT,
      claim_number TEXT,
      adjuster_name TEXT,
      adjuster_phone TEXT,
      lien_deadline TEXT,
      day_count INTEGER DEFAULT 0,
      equipment_count INTEGER DEFAULT 0,
      risk_level TEXT DEFAULT 'normal',
      notes_count INTEGER DEFAULT 0,
      photos_count INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      synced INTEGER DEFAULT 0
    );

    -- Contacts table
    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT,
      role TEXT DEFAULT 'agent',
      phone TEXT,
      email TEXT,
      referral_count INTEGER DEFAULT 0,
      total_revenue REAL DEFAULT 0,
      last_contact TEXT,
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      synced INTEGER DEFAULT 0
    );

    -- Notes table
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      job_id TEXT,
      category TEXT DEFAULT 'internal',
      content TEXT NOT NULL,
      author TEXT,
      has_voice INTEGER DEFAULT 0,
      voice_uri TEXT,
      photo_count INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      synced INTEGER DEFAULT 0,
      FOREIGN KEY (job_id) REFERENCES jobs(id)
    );

    -- Photos table
    CREATE TABLE IF NOT EXISTS photos (
      id TEXT PRIMARY KEY,
      job_id TEXT NOT NULL,
      local_uri TEXT NOT NULL,
      remote_url TEXT,
      category TEXT DEFAULT 'active',
      room TEXT,
      caption TEXT,
      taken_at TEXT DEFAULT (datetime('now')),
      synced INTEGER DEFAULT 0,
      FOREIGN KEY (job_id) REFERENCES jobs(id)
    );

    -- Moisture readings table
    CREATE TABLE IF NOT EXISTS moisture_readings (
      id TEXT PRIMARY KEY,
      job_id TEXT NOT NULL,
      location TEXT NOT NULL,
      reading_value REAL NOT NULL,
      reading_date TEXT DEFAULT (datetime('now')),
      synced INTEGER DEFAULT 0,
      FOREIGN KEY (job_id) REFERENCES jobs(id)
    );

    -- Equipment table
    CREATE TABLE IF NOT EXISTS equipment (
      id TEXT PRIMARY KEY,
      job_id TEXT NOT NULL,
      name TEXT NOT NULL,
      daily_rate REAL DEFAULT 0,
      quantity INTEGER DEFAULT 1,
      deployed_at TEXT DEFAULT (datetime('now')),
      returned_at TEXT,
      synced INTEGER DEFAULT 0,
      FOREIGN KEY (job_id) REFERENCES jobs(id)
    );

    -- Tasks table
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      job_id TEXT,
      assignee TEXT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending',
      due_date TEXT,
      completed_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      synced INTEGER DEFAULT 0,
      FOREIGN KEY (job_id) REFERENCES jobs(id)
    );

    -- Sync queue — tracks every change that needs to go to the cloud
    CREATE TABLE IF NOT EXISTS sync_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      table_name TEXT NOT NULL,
      record_id TEXT NOT NULL,
      action TEXT NOT NULL,
      payload TEXT,
      status TEXT DEFAULT 'pending',
      retry_count INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      synced_at TEXT
    );

    -- User session
    CREATE TABLE IF NOT EXISTS user_session (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      user_name TEXT,
      user_role TEXT,
      company TEXT,
      access_code TEXT,
      logged_in INTEGER DEFAULT 0
    );
  `);
}

// ─── Generic helpers ────────────────────────────────────────────────

export async function insertRecord(
  table: string,
  record: Record<string, any>
): Promise<void> {
  const database = await getDatabase();
  const keys = Object.keys(record);
  const placeholders = keys.map(() => '?').join(', ');
  const values = keys.map((k) => record[k]);

  await database.runAsync(
    `INSERT OR REPLACE INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`,
    values
  );

  // Add to sync queue
  await database.runAsync(
    `INSERT INTO sync_queue (table_name, record_id, action, payload) VALUES (?, ?, ?, ?)`,
    [table, record.id, 'upsert', JSON.stringify(record)]
  );
}

export async function updateRecord(
  table: string,
  id: string,
  updates: Record<string, any>
): Promise<void> {
  const database = await getDatabase();
  const keys = Object.keys(updates);
  const setClause = keys.map((k) => `${k} = ?`).join(', ');
  const values = [...keys.map((k) => updates[k]), id];

  await database.runAsync(
    `UPDATE ${table} SET ${setClause}, updated_at = datetime('now') WHERE id = ?`,
    values
  );

  await database.runAsync(
    `INSERT INTO sync_queue (table_name, record_id, action, payload) VALUES (?, ?, ?, ?)`,
    [table, id, 'update', JSON.stringify(updates)]
  );
}

export async function getAll<T>(table: string): Promise<T[]> {
  const database = await getDatabase();
  return (await database.getAllAsync(`SELECT * FROM ${table} ORDER BY created_at DESC`)) as T[];
}

export async function getById<T>(table: string, id: string): Promise<T | null> {
  const database = await getDatabase();
  return (await database.getFirstAsync(`SELECT * FROM ${table} WHERE id = ?`, [id])) as T | null;
}

export async function getWhere<T>(table: string, where: string, params: any[] = []): Promise<T[]> {
  const database = await getDatabase();
  return (await database.getAllAsync(
    `SELECT * FROM ${table} WHERE ${where} ORDER BY created_at DESC`,
    params
  )) as T[];
}

export async function getPendingSyncCount(): Promise<number> {
  const database = await getDatabase();
  const result = await database.getFirstAsync(
    `SELECT COUNT(*) as count FROM sync_queue WHERE status = 'pending'`
  );
  return (result as any)?.count ?? 0;
}

export async function getPendingSyncItems(): Promise<any[]> {
  const database = await getDatabase();
  return await database.getAllAsync(
    `SELECT * FROM sync_queue WHERE status = 'pending' ORDER BY created_at ASC LIMIT 50`
  );
}

export async function markSynced(syncId: number): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    `UPDATE sync_queue SET status = 'synced', synced_at = datetime('now') WHERE id = ?`,
    [syncId]
  );
}

export async function markSyncFailed(syncId: number): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    `UPDATE sync_queue SET retry_count = retry_count + 1 WHERE id = ?`,
    [syncId]
  );
}
