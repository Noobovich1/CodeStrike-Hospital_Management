-- ============================================================
-- HOSPITAL MANAGEMENT SYSTEM - CLEAN TEST DATA (SEED-CLEAN)
-- Compatibility: Matches exact Java JPA Entity fields and enums (Ordinals)
-- Passwords: All user passwords are set to "password" (BCrypt hash)
-- ============================================================

-- Disable foreign keys to safely truncate all tables
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE users;
TRUNCATE TABLE doctors;
TRUNCATE TABLE patients;
TRUNCATE TABLE rooms;
TRUNCATE TABLE staff;
TRUNCATE TABLE admissions;
TRUNCATE TABLE treatments;
TRUNCATE TABLE treatment_records;
TRUNCATE TABLE doctor_patient;
TRUNCATE TABLE bills;
TRUNCATE TABLE appointments;

SET FOREIGN_KEY_CHECKS = 1;

-- ── 1. USERS ────────────────────────────────────────────────
-- Password for all accounts is 'password' (encrypted with BCrypt)
-- Role is stored as String enum: ADMIN, RECEPTIONIST, DOCTOR, NURSE, WARD_BOY, PATIENT
INSERT INTO users (id, username, password, role, is_active) VALUES
(1, 'admin', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'ADMIN', 1),
(2, 'receptionist', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'RECEPTIONIST', 1),
(3, 'dr_an', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'DOCTOR', 1),
(4, 'dr_bich', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'DOCTOR', 1),
(5, 'dr_duc', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'DOCTOR', 1),
(6, 'nurse_mai', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'NURSE', 1),
(7, 'wardboy_hoa', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'WARD_BOY', 1),
(8, 'patient_lan', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(9, 'patient_anh', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(10, 'patient_kim', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1);

-- ── 2. DOCTORS ──────────────────────────────────────────────
INSERT INTO doctors (doctor_id, user_id, full_name, specialisation, phone_number, email, qualification, experience_years, consultation_fee, is_active) VALUES
('DOC-2024-0001', 3, 'Nguyen Van An', 'Cardiology', '0901234567', 'dr.an@hospital.com', 'MD, PhD', 12, 150.0, 1),
('DOC-2024-0002', 4, 'Tran Thi Bich', 'Neurology', '0902345678', 'dr.bich@hospital.com', 'MD, MSc', 8, 120.0, 1),
('DOC-2024-0003', 5, 'Le Minh Duc', 'Surgery', '0903456789', 'dr.duc@hospital.com', 'MD, PhD', 15, 200.0, 1);

-- ── 3. STAFF ────────────────────────────────────────────────
-- Role ordinal: 0 = NURSE, 1 = WARD_BOY
-- Shift ordinal: 0 = MORNING, 1 = AFTERNOON, 2 = NIGHT
INSERT INTO staff (staff_id, full_name, role, phone_number, assigned_ward, shift, is_active, created_at) VALUES
('NRS-2024-0001', 'Nurse Mai', 0, '0912345678', 'Medical Ward', 0, 1, NOW()),
('WRD-2024-0001', 'Wardboy Hoa', 1, '0913456789', 'Emergency Room', 1, 1, NOW());

-- ── 4. ROOMS ────────────────────────────────────────────────
-- RoomType ordinal: 0 = GENERAL, 1 = ICU, 2 = OPERATION_THEATER
-- RoomStatus ordinal: 0 = AVAILABLE, 1 = OCCUPIED, 2 = MAINTENANCE
INSERT INTO rooms (room_id, room_number, room_type, floor, capacity, current_occupancy, daily_rate, status, notes) VALUES
(1, 'ROOM-101', 0, 1, 4, 0, 50.0, 0, 'General Ward Room A'),
(2, 'ROOM-102', 1, 1, 1, 1, 300.0, 1, 'ICU Unit 01'),
(3, 'ROOM-103', 2, 2, 1, 0, 500.0, 0, 'Operation Theater 01');

-- ── 5. TREATMENTS ───────────────────────────────────────────
INSERT INTO treatments (treatment_id, name, category, unit_cost, description, is_active) VALUES
(1, 'ECG', 'Diagnostic', 30.0, 'Electrocardiogram monitoring', 1),
(2, 'X-Ray', 'Diagnostic', 50.0, 'Chest X-Ray Imaging', 1),
(3, 'Physiotherapy', 'Therapeutic', 75.0, 'Physical therapy rehabilitation session', 1),
(4, 'CT Scan', 'Diagnostic', 250.0, 'Computed Tomography Scan', 1);

-- ── 6. PATIENTS ─────────────────────────────────────────────
-- Gender ordinal: 0 = MALE, 1 = FEMALE, 2 = OTHER
-- PatientStatus ordinal: 0 = OUTPATIENT, 1 = ADMITTED, 2 = DISCHARGED
INSERT INTO patients (patient_id, full_name, date_of_birth, gender, blood_group, phone_number, email, address, emergency_contact_name, emergency_contact_phone, disease_description, current_treatment_notes, status, user_id) VALUES
('PAT-2024-0001', 'Tran Thi Lan', '2003-05-15', 1, 'O+', '0921234567', 'lan.tran@gmail.com', '123 Nguyen Hue St, District 1, HCMC', 'Tran Van Thuong', '0981234567', 'Mild Gastritis', 'Prescribed antacids and dietary guidance', 0, 8),
('PAT-2024-0002', 'Le Minh Anh', '2002-11-20', 0, 'B+', '0922345678', 'anh.le@gmail.com', '456 Le Loi St, District 3, HCMC', 'Le Van Thuong', '0982345678', 'Ankle Sprain', 'Rest and ice compress recommendation', 0, 9),
('PAT-2024-0003', 'Pham Hoang Kim', '2001-08-10', 1, 'AB+', '0923456789', 'kim.pham@gmail.com', '789 Tran Hung Dao St, District 5, HCMC', 'Pham Van Thuong', '0983456789', 'Acute Appendicitis', 'Admitted for immediate laparoscopic appendectomy', 1, 10);

-- ── 7. ADMISSIONS ───────────────────────────────────────────
-- AdmissionStatus ordinal: 0 = ACTIVE, 1 = DISCHARGED
INSERT INTO admissions (admission_id, patient_id, room_id, admission_date, discharge_date, total_days, status, notes, created_at) VALUES
(1, 'PAT-2024-0003', 2, '2026-05-20 08:00:00', NULL, NULL, 0, 'Emergency acute appendicitis patient', NOW());

-- ── 8. DOCTOR_PATIENT (ASSIGNMENTS) ─────────────────────────
INSERT INTO doctor_patient (id, doctor_id, patient_id, assigned_date, is_primary, notes) VALUES
(1, 'DOC-2024-0001', 'PAT-2024-0001', '2026-05-27', 1, 'Primary cardiac consultant'),
(2, 'DOC-2024-0003', 'PAT-2024-0003', '2026-05-20', 1, 'Primary surgeon assigned');

-- ── 9. TREATMENT_RECORDS ────────────────────────────────────
INSERT INTO treatment_records (id, patient_id, doctor_id, treatment_id, session_date, quantity, unit_cost_snapshot, notes) VALUES
(1, 'PAT-2024-0003', 'DOC-2024-0003', 4, '2026-05-21 10:00:00', 1, 250.0, 'CT Scan completed for pre-op check');

-- ── 10. APPOINTMENTS ────────────────────────────────────────
-- AppointmentStatus String: PENDING, COMPLETED, CANCELLED
INSERT INTO appointments (id, patient_id, doctor_id, specialisation, appointment_date, status, notes, is_billed) VALUES
(1, 'PAT-2024-0001', 'DOC-2024-0001', 'Cardiology', '2026-05-28 09:00:00', 'PENDING', 'Regular cardiac checkup request', 0),
(2, 'PAT-2024-0002', 'DOC-2024-0002', 'Neurology', '2026-05-27 14:00:00', 'COMPLETED', 'Consultation for recurring migraines', 0);

-- ── 11. BILLS ───────────────────────────────────────────────
-- PaymentStatus ordinal: 0 = PENDING, 1 = PARTIAL, 2 = PAID
INSERT INTO bills (bill_id, admission_id, patient_id, room_charges, treatment_charges, doctor_charges, other_charges, outpatient_charges, discount, tax_percent, total_amount, payment_status, paid_amount, generated_at) VALUES
(1, 1, 'PAT-2024-0003', 2100.0, 250.0, 200.0, 0.0, 0.0, 0.0, 10.0, 2805.0, 0, 0.0, NOW());
