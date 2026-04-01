/**
 * Seed data — populates the local database with demo data
 * matching the HTML prototype screens.
 */
import { getDatabase, isWebPlatform, getWebStore } from './database';

export async function seedDemoData(): Promise<void> {
  if (isWebPlatform()) {
    return seedWebData();
  }

  const db = await getDatabase();

  // Check if already seeded
  const existing = await db.getFirstAsync('SELECT COUNT(*) as count FROM jobs');
  if ((existing as any)?.count > 0) return;

  // ── Jobs ────────────────────────────────────────────────────────
  await db.execAsync(`
    INSERT INTO jobs (id, address, client_name, client_phone, client_email, status, phase, damage_type, estimated_value, paid_amount, approved_amount, pending_amount, insurance_carrier, claim_number, adjuster_name, adjuster_phone, lien_deadline, day_count, equipment_count, risk_level, notes_count, photos_count, synced)
    VALUES
    ('job_001', '4821 E Cactus Rd', 'Martinez Family', '(602) 555-0142', 'martinez@email.com', 'active', 'mitigation', 'Water Damage', 28500, 15000, 8000, 5500, 'State Farm', 'SF-2026-88291', 'Tom Bradley', '(602) 555-0199', '2026-04-04', 17, 6, 'high', 6, 24, 1),
    ('job_002', '1190 W Camelback Rd', 'Johnson Family', '(602) 555-0188', 'johnson@email.com', 'active', 'reconstruction', 'Fire Restoration', 67000, 30000, 20000, 17000, 'Allstate', 'AL-2026-44521', 'Maria Lopez', '(602) 555-0201', '2026-04-15', 42, 8, 'high', 4, 18, 1),
    ('job_003', '7632 N 15th Ave', 'Chen Family', '(602) 555-0155', 'chen@email.com', 'active', 'mitigation', 'Mold Remediation', 18200, 5000, 8200, 5000, 'USAA', 'US-2026-77123', 'David Kim', '(602) 555-0177', '2026-04-20', 8, 3, 'medium', 3, 12, 1),
    ('job_004', '2201 S Priest Dr', 'Williams Family', '(602) 555-0166', 'williams@email.com', 'active', 'drying', 'Water Damage', 12400, 0, 6200, 6200, 'State Farm', 'SF-2026-99112', 'Tom Bradley', '(602) 555-0199', '2026-05-01', 3, 14, 'normal', 2, 8, 1);
  `);

  // ── Contacts ────────────────────────────────────────────────────
  await db.execAsync(`
    INSERT INTO contacts (id, name, company, role, phone, email, referral_count, total_revenue, last_contact, status, synced)
    VALUES
    ('con_001', 'Sarah Mitchell', 'State Farm', 'agent', '(602) 555-0101', 'sarah.m@statefarm.com', 12, 156000, '2026-03-29', 'active', 1),
    ('con_002', 'David Park', 'Allstate', 'agent', '(602) 555-0102', 'david.p@allstate.com', 8, 98000, '2026-03-25', 'active', 1),
    ('con_003', 'Maria Gonzalez', 'USAA', 'agent', '(602) 555-0103', 'maria.g@usaa.com', 15, 210000, '2026-03-28', 'active', 1),
    ('con_004', 'James O''Brien', 'Liberty Mutual', 'agent', '(602) 555-0104', 'james.o@libertymutual.com', 5, 45000, '2026-02-10', 'stale', 1),
    ('con_005', 'Tom Bradley', 'State Farm', 'adjuster', '(602) 555-0199', 'tom.b@statefarm.com', 6, 72000, '2026-03-30', 'active', 1),
    ('con_006', 'Kevin Tran', 'Tran Properties', 'property_mgr', '(602) 555-0106', 'kevin@tranprops.com', 7, 89000, '2026-03-27', 'active', 1),
    ('con_007', 'Mike Hernandez', 'Hernandez Plumbing', 'plumber', '(602) 555-0107', 'mike@hernplumbing.com', 9, 112000, '2026-03-26', 'active', 1);
  `);

  // ── Notes ───────────────────────────────────────────────────────
  await db.execAsync(`
    INSERT INTO notes (id, job_id, category, content, author, has_voice, photo_count, created_at, synced)
    VALUES
    ('note_001', 'job_001', 'insurance', 'Adjuster called. Requested moisture logs for Master Bedroom for the last 48 hours.', 'Juan Rodriguez', 0, 0, datetime('now', '-2 hours'), 1),
    ('note_002', 'job_001', 'internal', 'Crew noted heavy saturation behind the vanity. May need to pull cabinets tomorrow.', 'Juan Rodriguez', 0, 0, datetime('now', '-5 hours'), 1),
    ('note_003', 'job_003', 'internal', 'Found unexpected structural damage in the west wing foundation. Need inspector appraisal before proceeding with slab pour.', 'A. Miller', 0, 2, datetime('now', '-14 minutes'), 1),
    ('note_004', 'job_001', 'insurance', 'Claim #PX-992 verification complete. All water damage points documented for the adjuster meeting tomorrow at 8AM.', 'A. Miller', 1, 0, datetime('now', '-2 hours'), 1),
    ('note_005', 'job_002', 'customer', 'Client requested a change to the backsplash tile pattern. Swapped from subway to herringbone. Signed off on additional labor costs.', 'A. Miller', 0, 0, datetime('now', '-1 day'), 1);
  `);

  // ── Tasks ───────────────────────────────────────────────────────
  await db.execAsync(`
    INSERT INTO tasks (id, job_id, assignee, title, description, status, due_date, synced)
    VALUES
    ('task_001', 'job_001', 'Juan Rodriguez', 'Sign Contract - Miller Residence', 'Residential Roof Repair', 'overdue', '2026-03-28', 1),
    ('task_002', 'job_001', 'Juan Rodriguez', 'Equipment Return Check', 'Main Warehouse', 'pending', '2026-04-01', 1),
    ('task_003', 'job_002', 'Matt Kowalski', 'Permit Approval Follow-up', 'Oak Street Plaza', 'pending', '2026-04-02', 1),
    ('task_004', 'job_001', 'Juan Rodriguez', 'Demolition - Phase 1', 'Complete demo of affected areas', 'completed', '2026-03-25', 1),
    ('task_005', 'job_001', 'Juan Rodriguez', 'Daily Moisture Log', 'Log readings for all rooms', 'pending', '2026-04-01', 1),
    ('task_006', 'job_001', 'Juan Rodriguez', 'Equip. Maintenance Check', 'Check all on-site equipment', 'pending', '2026-04-02', 1);
  `);

  // ── Equipment ───────────────────────────────────────────────────
  await db.execAsync(`
    INSERT INTO equipment (id, job_id, name, daily_rate, quantity, synced)
    VALUES
    ('eq_001', 'job_001', 'LGR Dehumidifier', 85.00, 2, 1),
    ('eq_002', 'job_001', 'Axial Air Mover', 32.00, 12, 1),
    ('eq_003', 'job_003', 'HEPA Air Scrubber', 75.00, 3, 1),
    ('eq_004', 'job_004', 'LGR Dehumidifier', 85.00, 4, 1),
    ('eq_005', 'job_004', 'Axial Air Mover', 32.00, 10, 1);
  `);

  // ── Moisture Readings ───────────────────────────────────────────
  await db.execAsync(`
    INSERT INTO moisture_readings (id, job_id, location, reading_value, reading_date, synced)
    VALUES
    ('mr_001', 'job_001', 'Master Bedroom', 82, '2026-03-30', 1),
    ('mr_002', 'job_001', 'Master Bedroom', 18, '2026-03-31', 1),
    ('mr_003', 'job_001', 'Master Bath', 94, '2026-03-30', 1),
    ('mr_004', 'job_001', 'Master Bath', 62, '2026-03-31', 1),
    ('mr_005', 'job_001', 'Hallway', 45, '2026-03-30', 1),
    ('mr_006', 'job_001', 'Hallway', 12, '2026-03-31', 1);
  `);

  // ── User Session ────────────────────────────────────────────────
  await db.execAsync(`
    INSERT OR REPLACE INTO user_session (id, user_name, user_role, company, access_code, logged_in)
    VALUES (1, 'Juan Rodriguez', 'Project Manager', 'ABC Restoration Services', 'SITE2026', 0);
  `);
}

// ─── Web in-memory seed ─────────────────────────────────────────────
function seedWebData() {
  const store = getWebStore();
  if (store.jobs && store.jobs.length > 0) return;

  store.jobs = [
    { id: 'job_001', address: '4821 E Cactus Rd', client_name: 'Martinez Family', client_phone: '(602) 555-0142', client_email: 'martinez@email.com', status: 'active', phase: 'mitigation', damage_type: 'Water Damage', estimated_value: 28500, paid_amount: 15000, approved_amount: 8000, pending_amount: 5500, insurance_carrier: 'State Farm', claim_number: 'SF-2026-88291', adjuster_name: 'Tom Bradley', adjuster_phone: '(602) 555-0199', lien_deadline: '2026-04-04', day_count: 17, equipment_count: 6, risk_level: 'high', notes_count: 6, photos_count: 24, created_at: '2026-03-15T08:00:00Z', synced: 1 },
    { id: 'job_002', address: '1190 W Camelback Rd', client_name: 'Johnson Family', client_phone: '(602) 555-0188', client_email: 'johnson@email.com', status: 'active', phase: 'reconstruction', damage_type: 'Fire Restoration', estimated_value: 67000, paid_amount: 30000, approved_amount: 20000, pending_amount: 17000, insurance_carrier: 'Allstate', claim_number: 'AL-2026-44521', adjuster_name: 'Maria Lopez', adjuster_phone: '(602) 555-0201', lien_deadline: '2026-04-15', day_count: 42, equipment_count: 8, risk_level: 'high', notes_count: 4, photos_count: 18, created_at: '2026-02-18T08:00:00Z', synced: 1 },
    { id: 'job_003', address: '7632 N 15th Ave', client_name: 'Chen Family', client_phone: '(602) 555-0155', client_email: 'chen@email.com', status: 'active', phase: 'mitigation', damage_type: 'Mold Remediation', estimated_value: 18200, paid_amount: 5000, approved_amount: 8200, pending_amount: 5000, insurance_carrier: 'USAA', claim_number: 'US-2026-77123', adjuster_name: 'David Kim', adjuster_phone: '(602) 555-0177', lien_deadline: '2026-04-20', day_count: 8, equipment_count: 3, risk_level: 'medium', notes_count: 3, photos_count: 12, created_at: '2026-03-24T08:00:00Z', synced: 1 },
    { id: 'job_004', address: '2201 S Priest Dr', client_name: 'Williams Family', client_phone: '(602) 555-0166', client_email: 'williams@email.com', status: 'active', phase: 'drying', damage_type: 'Water Damage', estimated_value: 12400, paid_amount: 0, approved_amount: 6200, pending_amount: 6200, insurance_carrier: 'State Farm', claim_number: 'SF-2026-99112', adjuster_name: 'Tom Bradley', adjuster_phone: '(602) 555-0199', lien_deadline: '2026-05-01', day_count: 3, equipment_count: 14, risk_level: 'normal', notes_count: 2, photos_count: 8, created_at: '2026-03-29T08:00:00Z', synced: 1 },
  ];

  store.contacts = [
    { id: 'con_001', name: 'Sarah Mitchell', company: 'State Farm', role: 'agent', phone: '(602) 555-0101', email: 'sarah.m@statefarm.com', referral_count: 12, total_revenue: 156000, last_contact: '2026-03-29', status: 'active', created_at: '2025-01-01T00:00:00Z' },
    { id: 'con_002', name: 'David Park', company: 'Allstate', role: 'agent', phone: '(602) 555-0102', email: 'david.p@allstate.com', referral_count: 8, total_revenue: 98000, last_contact: '2026-03-25', status: 'active', created_at: '2025-02-01T00:00:00Z' },
    { id: 'con_003', name: 'Maria Gonzalez', company: 'USAA', role: 'agent', phone: '(602) 555-0103', email: 'maria.g@usaa.com', referral_count: 15, total_revenue: 210000, last_contact: '2026-03-28', status: 'active', created_at: '2025-01-15T00:00:00Z' },
    { id: 'con_004', name: "James O'Brien", company: 'Liberty Mutual', role: 'agent', phone: '(602) 555-0104', email: 'james.o@libertymutual.com', referral_count: 5, total_revenue: 45000, last_contact: '2026-02-10', status: 'stale', created_at: '2025-03-01T00:00:00Z' },
    { id: 'con_005', name: 'Tom Bradley', company: 'State Farm', role: 'adjuster', phone: '(602) 555-0199', email: 'tom.b@statefarm.com', referral_count: 6, total_revenue: 72000, last_contact: '2026-03-30', status: 'active', created_at: '2025-01-20T00:00:00Z' },
    { id: 'con_006', name: 'Kevin Tran', company: 'Tran Properties', role: 'property_mgr', phone: '(602) 555-0106', email: 'kevin@tranprops.com', referral_count: 7, total_revenue: 89000, last_contact: '2026-03-27', status: 'active', created_at: '2025-04-01T00:00:00Z' },
    { id: 'con_007', name: 'Mike Hernandez', company: 'Hernandez Plumbing', role: 'plumber', phone: '(602) 555-0107', email: 'mike@hernplumbing.com', referral_count: 9, total_revenue: 112000, last_contact: '2026-03-26', status: 'active', created_at: '2025-02-15T00:00:00Z' },
  ];

  store.notes = [
    { id: 'note_001', job_id: 'job_001', category: 'insurance', content: 'Adjuster called. Requested moisture logs for Master Bedroom for the last 48 hours.', author: 'Juan Rodriguez', has_voice: 0, photo_count: 0, created_at: new Date(Date.now() - 2 * 3600000).toISOString() },
    { id: 'note_002', job_id: 'job_001', category: 'internal', content: 'Crew noted heavy saturation behind the vanity. May need to pull cabinets tomorrow.', author: 'Juan Rodriguez', has_voice: 0, photo_count: 0, created_at: new Date(Date.now() - 5 * 3600000).toISOString() },
    { id: 'note_003', job_id: 'job_003', category: 'internal', content: 'Found unexpected structural damage in the west wing foundation. Need inspector appraisal before proceeding with slab pour.', author: 'A. Miller', has_voice: 0, photo_count: 2, created_at: new Date(Date.now() - 14 * 60000).toISOString() },
    { id: 'note_004', job_id: 'job_001', category: 'insurance', content: 'Claim #PX-992 verification complete. All water damage points documented for the adjuster meeting tomorrow at 8AM.', author: 'A. Miller', has_voice: 1, photo_count: 0, created_at: new Date(Date.now() - 2 * 3600000).toISOString() },
    { id: 'note_005', job_id: 'job_002', category: 'customer', content: 'Client requested a change to the backsplash tile pattern. Swapped from subway to herringbone. Signed off on additional labor costs.', author: 'A. Miller', has_voice: 0, photo_count: 0, created_at: new Date(Date.now() - 86400000).toISOString() },
  ];

  store.tasks = [
    { id: 'task_001', job_id: 'job_001', assignee: 'Juan Rodriguez', title: 'Sign Contract - Miller Residence', description: 'Residential Roof Repair', status: 'overdue', due_date: '2026-03-28', created_at: '2026-03-20T00:00:00Z' },
    { id: 'task_002', job_id: 'job_001', assignee: 'Juan Rodriguez', title: 'Equipment Return Check', description: 'Main Warehouse', status: 'pending', due_date: '2026-04-01', created_at: '2026-03-25T00:00:00Z' },
    { id: 'task_003', job_id: 'job_002', assignee: 'Matt Kowalski', title: 'Permit Approval Follow-up', description: 'Oak Street Plaza', status: 'pending', due_date: '2026-04-02', created_at: '2026-03-26T00:00:00Z' },
    { id: 'task_004', job_id: 'job_001', assignee: 'Juan Rodriguez', title: 'Demolition - Phase 1', description: 'Complete demo of affected areas', status: 'completed', due_date: '2026-03-25', created_at: '2026-03-18T00:00:00Z' },
    { id: 'task_005', job_id: 'job_001', assignee: 'Juan Rodriguez', title: 'Daily Moisture Log', description: 'Log readings for all rooms', status: 'pending', due_date: '2026-04-01', created_at: '2026-03-28T00:00:00Z' },
    { id: 'task_006', job_id: 'job_001', assignee: 'Juan Rodriguez', title: 'Equip. Maintenance Check', description: 'Check all on-site equipment', status: 'pending', due_date: '2026-04-02', created_at: '2026-03-29T00:00:00Z' },
  ];

  store.equipment = [
    { id: 'eq_001', job_id: 'job_001', name: 'LGR Dehumidifier', daily_rate: 85.00, quantity: 2, created_at: '2026-03-15T00:00:00Z' },
    { id: 'eq_002', job_id: 'job_001', name: 'Axial Air Mover', daily_rate: 32.00, quantity: 12, created_at: '2026-03-15T00:00:00Z' },
    { id: 'eq_003', job_id: 'job_003', name: 'HEPA Air Scrubber', daily_rate: 75.00, quantity: 3, created_at: '2026-03-24T00:00:00Z' },
    { id: 'eq_004', job_id: 'job_004', name: 'LGR Dehumidifier', daily_rate: 85.00, quantity: 4, created_at: '2026-03-29T00:00:00Z' },
    { id: 'eq_005', job_id: 'job_004', name: 'Axial Air Mover', daily_rate: 32.00, quantity: 10, created_at: '2026-03-29T00:00:00Z' },
  ];

  store.moisture_readings = [
    { id: 'mr_001', job_id: 'job_001', location: 'Master Bedroom', reading_value: 82, reading_date: '2026-03-30', created_at: '2026-03-30T00:00:00Z' },
    { id: 'mr_002', job_id: 'job_001', location: 'Master Bedroom', reading_value: 18, reading_date: '2026-03-31', created_at: '2026-03-31T00:00:00Z' },
    { id: 'mr_003', job_id: 'job_001', location: 'Master Bath', reading_value: 94, reading_date: '2026-03-30', created_at: '2026-03-30T00:00:00Z' },
    { id: 'mr_004', job_id: 'job_001', location: 'Master Bath', reading_value: 62, reading_date: '2026-03-31', created_at: '2026-03-31T00:00:00Z' },
    { id: 'mr_005', job_id: 'job_001', location: 'Hallway', reading_value: 45, reading_date: '2026-03-30', created_at: '2026-03-30T00:00:00Z' },
    { id: 'mr_006', job_id: 'job_001', location: 'Hallway', reading_value: 12, reading_date: '2026-03-31', created_at: '2026-03-31T00:00:00Z' },
  ];
}
