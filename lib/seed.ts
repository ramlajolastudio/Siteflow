/**
 * Seed data — populates the local database with demo data
 * matching the HTML prototype screens.
 */
import { getDatabase } from './database';

export async function seedDemoData(): Promise<void> {
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
