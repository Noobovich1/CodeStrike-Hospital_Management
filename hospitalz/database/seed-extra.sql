-- ============================================================
-- HOSPITAL MANAGEMENT SYSTEM - ADDITIONAL SEED DATA (SEED-EXTRA)
-- Matches exact Java JPA Entity fields and enums (Ordinals)
-- Passwords: All new users have password "password" (BCrypt hash)
-- ============================================================

-- Disable foreign keys to safely insert new records
SET FOREIGN_KEY_CHECKS = 0;

-- ── 1. USERS ────────────────────────────────────────────────
-- IDs 11 to 80
-- Password for all accounts is 'password'
-- Role: ADMIN, RECEPTIONIST, DOCTOR, NURSE, WARD_BOY, PATIENT
INSERT INTO users (id, username, password, role, is_active) VALUES
-- 50 Patients (IDs 11 to 60)
(11, 'patient_hung', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(12, 'patient_mai', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(13, 'patient_tuan', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(14, 'patient_nam', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(15, 'patient_huong', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(16, 'patient_ducanh', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(17, 'patient_tri', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(18, 'patient_dat', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(19, 'patient_bao', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(20, 'patient_diep', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(21, 'patient_cuong', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(22, 'patient_le', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(23, 'patient_minhduc', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(24, 'patient_son', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(25, 'patient_thao', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(26, 'patient_long', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(27, 'patient_thihoa', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(28, 'patient_quyet', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(29, 'patient_hanh', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(30, 'patient_hoang', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(31, 'patient_lam', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(32, 'patient_khanh', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(33, 'patient_linh', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(34, 'patient_binh', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(35, 'patient_yen', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(36, 'patient_dung', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(37, 'patient_ngoc', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(38, 'patient_bach', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(39, 'patient_tung', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(40, 'patient_thang', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(41, 'patient_loan', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(42, 'patient_tu', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(43, 'patient_mitri', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(44, 'patient_vidung', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(45, 'patient_phuc', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(46, 'patient_khoa', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(47, 'patient_trung', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(48, 'patient_xuanbinh', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(49, 'patient_trang', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(50, 'patient_loc', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(51, 'patient_duy', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(52, 'patient_phong', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(53, 'patient_tuyet', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(54, 'patient_vanson', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(55, 'patient_baongoc', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(56, 'patient_hai', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(57, 'patient_huy', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(58, 'patient_ha', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(59, 'patient_quang', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),
(60, 'patient_thanha', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'PATIENT', 1),

-- 10 Doctors (IDs 61 to 70)
(61, 'dr_quocanh', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'DOCTOR', 1),
(62, 'dr_minhtu', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'DOCTOR', 1),
(63, 'dr_thanhhuong', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'DOCTOR', 1),
(64, 'dr_hoanglong', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'DOCTOR', 1),
(65, 'dr_vanhung', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'DOCTOR', 1),
(66, 'dr_ducthang', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'DOCTOR', 1),
(67, 'dr_thingoc', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'DOCTOR', 1),
(68, 'dr_quocbao', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'DOCTOR', 1),
(69, 'dr_minhtri', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'DOCTOR', 1),
(70, 'dr_thanhson', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'DOCTOR', 1),

-- 5 Nurses (IDs 71 to 75)
(71, 'nurse_lan', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'NURSE', 1),
(72, 'nurse_hoa', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'NURSE', 1),
(73, 'nurse_diem', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'NURSE', 1),
(74, 'nurse_ngoc', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'NURSE', 1),
(75, 'nurse_hang', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'NURSE', 1),

-- 5 Ward Boys (IDs 76 to 80)
(76, 'wardboy_thanh', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'WARD_BOY', 1),
(77, 'wardboy_dung', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'WARD_BOY', 1),
(78, 'wardboy_binh', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'WARD_BOY', 1),
(79, 'wardboy_son', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'WARD_BOY', 1),
(80, 'wardboy_long', '$2a$10$kOqakIz61JhqfRK5mO/2UOkx1Yo4MHmpgDwzeL0OSdHHXEK4WpQBK', 'WARD_BOY', 1);

-- ── 2. DOCTORS ──────────────────────────────────────────────
-- 10 Doctors, 2 for each speciality, fee = 100.0
INSERT INTO doctors (doctor_id, user_id, full_name, specialisation, phone_number, email, qualification, experience_years, consultation_fee, is_active) VALUES
('DOC-2024-0004', 61, 'Nguyen Quoc Anh', 'Cardiology', '0900000004', 'dr.quocanh@hospital.com', 'MD, PhD', 10, 100.0, 1),
('DOC-2024-0005', 62, 'Pham Minh Tu', 'Cardiology', '0900000005', 'dr.minhtu@hospital.com', 'MD, PhD', 11, 100.0, 1),
('DOC-2024-0006', 63, 'Tran Thanh Huong', 'Neurology', '0900000006', 'dr.thanhhuong@hospital.com', 'MD, MSc', 8, 100.0, 1),
('DOC-2024-0007', 64, 'Le Hoang Long', 'Neurology', '0900000007', 'dr.hoanglong@hospital.com', 'MD, PhD', 9, 100.0, 1),
('DOC-2024-0008', 65, 'Vu Van Hung', 'Surgery', '0900000008', 'dr.vanhung@hospital.com', 'MD, PhD', 15, 100.0, 1),
('DOC-2024-0009', 66, 'Hoang Duc Thang', 'Surgery', '0900000009', 'dr.ducthang@hospital.com', 'MD, PhD', 12, 100.0, 1),
('DOC-2024-0010', 67, 'Phan Thi Ngoc', 'Pediatrics', '0900000010', 'dr.thingoc@hospital.com', 'MD, MSc', 7, 100.0, 1),
('DOC-2024-0011', 68, 'Do Quoc Bao', 'Pediatrics', '0900000011', 'dr.quocbao@hospital.com', 'MD, PhD', 6, 100.0, 1),
('DOC-2024-0012', 69, 'Ngo Minh Tri', 'Orthopedics', '0900000012', 'dr.minhtri@hospital.com', 'MD, PhD', 14, 100.0, 1),
('DOC-2024-0013', 70, 'Dang Thanh Son', 'Orthopedics', '0900000013', 'dr.thanhson@hospital.com', 'MD, PhD', 13, 100.0, 1);

-- ── 3. STAFF ────────────────────────────────────────────────
-- 5 Nurses (role=0), 5 Ward Boys (role=1)
-- Shift: 0=MORNING, 1=AFTERNOON, 2=NIGHT
INSERT INTO staff (staff_id, user_id, full_name, role, phone_number, assigned_ward, shift, is_active, created_at) VALUES
('NRS-2024-0002', 71, 'Nurse Lan', 0, '0910000002', 'Cardiology Ward', 0, 1, NOW()),
('NRS-2024-0003', 72, 'Nurse Hoa', 0, '0910000003', 'Neurology Ward', 1, 1, NOW()),
('NRS-2024-0004', 73, 'Nurse Diem', 0, '0910000004', 'General ICU', 2, 1, NOW()),
('NRS-2024-0005', 74, 'Nurse Ngoc', 0, '0910000005', 'Pediatrics Ward', 0, 1, NOW()),
('NRS-2024-0006', 75, 'Nurse Hang', 0, '0910000006', 'Surgical Ward', 1, 1, NOW()),
('WRD-2024-0002', 76, 'Wardboy Thanh', 1, '0911000002', 'Emergency Room', 0, 1, NOW()),
('WRD-2024-0003', 77, 'Wardboy Dung', 1, '0911000003', 'Operating Ward', 1, 1, NOW()),
('WRD-2024-0004', 78, 'Wardboy Binh', 1, '0911000004', 'Outpatient Area', 2, 1, NOW()),
('WRD-2024-0005', 79, 'Wardboy Son', 1, '0911000005', 'General ICU', 0, 1, NOW()),
('WRD-2024-0006', 80, 'Wardboy Long', 1, '0911000006', 'Recovery Area', 1, 1, NOW());

-- ── 4. ROOMS ────────────────────────────────────────────────
-- 30 rooms starting from ROOM-104 (ID 4 to 33)
-- General = 0 (rate 50, capacity 4)
-- ICU = 1 (rate 300, capacity 1)
-- Operation Theater = 2 (rate 500, capacity 1)
-- Status: 0 = AVAILABLE, 1 = OCCUPIED
INSERT INTO rooms (room_id, room_number, room_type, floor, capacity, current_occupancy, daily_rate, status, notes) VALUES
-- 10 General Rooms (IDs 4 to 13)
(4, 'ROOM-104', 0, 1, 4, 0, 50.0, 0, 'General Ward Room D'),
(5, 'ROOM-105', 0, 1, 4, 0, 50.0, 0, 'General Ward Room E'),
(6, 'ROOM-106', 0, 1, 4, 0, 50.0, 0, 'General Ward Room F'),
(7, 'ROOM-107', 0, 1, 4, 0, 50.0, 0, 'General Ward Room G'),
(8, 'ROOM-108', 0, 1, 4, 0, 50.0, 0, 'General Ward Room H'),
(9, 'ROOM-109', 0, 1, 4, 0, 50.0, 0, 'General Ward Room I'),
(10, 'ROOM-110', 0, 2, 4, 0, 50.0, 0, 'General Ward Room J'),
(11, 'ROOM-111', 0, 2, 4, 0, 50.0, 0, 'General Ward Room K'),
(12, 'ROOM-112', 0, 2, 4, 0, 50.0, 0, 'General Ward Room L'),
(13, 'ROOM-113', 0, 2, 4, 0, 50.0, 0, 'General Ward Room M'),
-- 10 ICU Rooms (IDs 14 to 23)
(14, 'ROOM-114', 1, 2, 1, 0, 300.0, 0, 'ICU Unit 02'),
(15, 'ROOM-115', 1, 2, 1, 0, 300.0, 0, 'ICU Unit 03'),
(16, 'ROOM-116', 1, 2, 1, 0, 300.0, 0, 'ICU Unit 04'),
(17, 'ROOM-117', 1, 2, 1, 0, 300.0, 0, 'ICU Unit 05'),
(18, 'ROOM-118', 1, 3, 1, 0, 300.0, 0, 'ICU Unit 06'),
(19, 'ROOM-119', 1, 3, 1, 0, 300.0, 0, 'ICU Unit 07'),
(20, 'ROOM-120', 1, 3, 1, 0, 300.0, 0, 'ICU Unit 08'),
(21, 'ROOM-121', 1, 3, 1, 0, 300.0, 0, 'ICU Unit 09'),
(22, 'ROOM-122', 1, 3, 1, 0, 300.0, 0, 'ICU Unit 10'),
(23, 'ROOM-123', 1, 3, 1, 0, 300.0, 0, 'ICU Unit 11'),
-- 10 Operation Theaters (IDs 24 to 33)
(24, 'ROOM-124', 2, 4, 1, 0, 500.0, 0, 'Operation Theater 02'),
(25, 'ROOM-125', 2, 4, 1, 0, 500.0, 0, 'Operation Theater 03'),
(26, 'ROOM-126', 2, 4, 1, 0, 500.0, 0, 'Operation Theater 04'),
(27, 'ROOM-127', 2, 4, 1, 0, 500.0, 0, 'Operation Theater 05'),
(28, 'ROOM-128', 2, 4, 1, 0, 500.0, 0, 'Operation Theater 06'),
(29, 'ROOM-129', 2, 4, 1, 0, 500.0, 0, 'Operation Theater 07'),
(30, 'ROOM-130', 2, 5, 1, 0, 500.0, 0, 'Operation Theater 08'),
(31, 'ROOM-131', 2, 5, 1, 0, 500.0, 0, 'Operation Theater 09'),
(32, 'ROOM-132', 2, 5, 1, 0, 500.0, 0, 'Operation Theater 10'),
(33, 'ROOM-133', 2, 5, 1, 0, 500.0, 0, 'Operation Theater 11');

-- ── 5. TREATMENTS ───────────────────────────────────────────
-- 10 Treatments (IDs 5 to 14)
INSERT INTO treatments (treatment_id, name, category, unit_cost, description, is_active) VALUES
(5, 'Blood Glucose Test', 'Diagnostic', 15.0, 'Fast checking of blood sugar levels', 1),
(6, 'Ultrasound Abdomen', 'Diagnostic', 45.0, 'Sonography examination of abdominal organs', 1),
(7, 'MRI Brain Scan', 'Diagnostic', 350.0, 'Magnetic Resonance Imaging of the brain', 1),
(8, 'Urine Analysis', 'Diagnostic', 20.0, 'Standard urinalysis laboratory screen', 1),
(9, 'Endoscopy Gastric', 'Diagnostic', 120.0, 'Esophagogastroduodenoscopy diagnostic check', 1),
(10, 'Physical Therapy Session', 'Therapeutic', 60.0, 'Standard rehab physical therapy session', 1),
(11, 'Echocardiography', 'Diagnostic', 130.0, 'Ultrasound imaging of the heart chambers', 1),
(12, 'Wound Suture Removal', 'Therapeutic', 25.0, 'Minor surgical suture extraction procedure', 1),
(13, 'X-Ray Chest PA View', 'Diagnostic', 40.0, 'Standard posteroanterior chest X-Ray', 1),
(14, 'Flu Vaccination', 'Therapeutic', 10.0, 'Annual influenza immunisation dose', 1);

-- ── 6. PATIENTS ─────────────────────────────────────────────
-- 50 Patients (IDs PAT-2024-0004 to PAT-2024-0053)
-- Status: 0 = OUTPATIENT
-- Gender: 0 = MALE, 1 = FEMALE
INSERT INTO patients (patient_id, full_name, date_of_birth, gender, blood_group, phone_number, email, address, emergency_contact_name, emergency_contact_phone, disease_description, current_treatment_notes, status, user_id) VALUES
('PAT-2024-0004', 'Nguyen Van Hung', '1988-03-12', 0, 'A+', '0930000004', 'hung.nguyen@gmail.com', '12 Le Loi St, Dist 1, HCMC', 'Nguyen Quoc Cuong', '0980000104', 'Mild hypertension', 'Monitor blood pressure daily', 0, 11),
('PAT-2024-0005', 'Tran Thi Mai', '1992-07-24', 1, 'O+', '0930000005', 'mai.tran@gmail.com', '45 Nguyen Hue St, Dist 1, HCMC', 'Tran Thanh Tung', '0980000105', 'Gastritis checkup', 'Prescribed antacids', 0, 12),
('PAT-2024-0006', 'Pham Minh Tuan', '1995-11-05', 0, 'B+', '0930000006', 'tuan.pham@gmail.com', '78 Tran Hung Dao St, Dist 5, HCMC', 'Pham Hoang Nam', '0980000106', 'Routine medical exam', 'No abnormal findings', 0, 13),
('PAT-2024-0007', 'Le Hoang Nam', '1990-01-30', 0, 'AB+', '0930000007', 'nam.le@gmail.com', '101 Hai Ba Trung St, Dist 3, HCMC', 'Le Van Thuong', '0980000107', 'Allergic rhinitis', 'Antihistamine tablets', 0, 14),
('PAT-2024-0008', 'Vu Thi Huong', '1985-05-18', 1, 'O-', '0930000008', 'huong.vu@gmail.com', '144 Ly Tu Trong St, Dist 1, HCMC', 'Vu Xuan Bach', '0980000108', 'Pregnancy checkup', 'Prenatal vitamins', 0, 15),
('PAT-2024-0009', 'Hoang Duc Anh', '1998-09-02', 0, 'A-', '0930000009', 'anh.hoang@gmail.com', '210 Le Lai St, Dist 1, HCMC', 'Hoang Thanh Ha', '0980000109', 'Ankle sprain followup', 'Elastic bandage support', 0, 16),
('PAT-2024-0010', 'Phan Minh Tri', '1983-02-14', 0, 'B-', '0930000010', 'tri.phan@gmail.com', '88 Nguyen Hue St, Dist 7, HCMC', 'Phan Van Quyet', '0980000110', 'Type 2 Diabetes screening', 'Awaiting test results', 0, 17),
('PAT-2024-0011', 'Do Thanh Dat', '1996-06-25', 0, 'AB-', '0930000011', 'dat.do@gmail.com', '15 Tran Hung Dao St, Dist 5, HCMC', 'Do Duc Duy', '0980000111', 'Acute headache symptoms', 'Prescribed paracetamol', 0, 18),
('PAT-2024-0012', 'Ngo Quoc Bao', '1991-12-10', 0, 'O+', '0930000012', 'bao.ngo@gmail.com', '67 Ly Tu Trong St, Dist 10, HCMC', 'Ngo Minh Hoang', '0980000112', 'Gastroesophageal reflux', 'Avoid spicy foods and caffeine', 0, 19),
('PAT-2024-0013', 'Dang Ngoc Diep', '1987-04-05', 1, 'A+', '0930000013', 'diep.dang@gmail.com', '22 Le Loi St, Dist 1, HCMC', 'Dang Van Lam', '0980000113', 'Routine visual acuity check', 'Glasses prescription updated', 0, 20),
('PAT-2024-0014', 'Bui Van Cuong', '1994-08-16', 0, 'B+', '0930000014', 'cuong.bui@gmail.com', '122 Nguyen Hue St, Dist 2, HCMC', 'Bui Quoc Khanh', '0980000114', 'Common cold', 'Symptomatic rest', 0, 21),
('PAT-2024-0015', 'Nguyen Thi Le', '1989-10-22', 1, 'AB+', '0930000015', 'le.nguyen@gmail.com', '88 Ly Tu Trong St, Dist 5, HCMC', 'Nguyen Viet Dung', '0980000115', 'Routine physical checkup', 'Maintain healthy diet', 0, 22),
('PAT-2024-0016', 'Tran Minh Duc', '1993-01-14', 0, 'O-', '0930000016', 'duc.tran@gmail.com', '24 Le Loi St, Dist 1, HCMC', 'Tran Hoang Phuc', '0980000116', 'Chronic back pain', 'Physical therapy recommended', 0, 23),
('PAT-2024-0017', 'Pham Thanh Son', '1997-03-30', 0, 'A-', '0930000017', 'son.pham@gmail.com', '54 Hai Ba Trung St, Dist 3, HCMC', 'Pham Minh Khoa', '0980000117', 'Pharyngitis', 'Warm saline gargle and rest', 0, 24),
('PAT-2024-0018', 'Le Thu Thao', '1999-05-18', 1, 'B-', '0930000018', 'thao.le@gmail.com', '19 Le Loi St, Dist 6, HCMC', 'Le Quoc Trung', '0980000118', 'Iron deficiency anemia', 'Iron supplements prescribed', 0, 25),
('PAT-2024-0019', 'Vu Hoang Long', '1991-09-02', 0, 'AB-', '0930000019', 'long.vu@gmail.com', '105 Hai Ba Trung St, Dist 8, HCMC', 'Vu Xuan Binh', '0980000119', 'Mild anxiety disorder', 'Counseling recommended', 0, 26),
('PAT-2024-0020', 'Hoang Thi Hoa', '1984-12-12', 1, 'O+', '0930000020', 'hoa.hoang@gmail.com', '99 Tran Hung Dao St, Dist 9, HCMC', 'Hoang Thu Trang', '0980000120', 'Obesity management', 'Dietary tracking', 0, 27),
('PAT-2024-0021', 'Phan Van Quyet', '1986-07-21', 0, 'A+', '0930000021', 'quyet.phan@gmail.com', '166 Nguyen Hue St, Dist 7, HCMC', 'Phan Huu Loc', '0980000121', 'Insomnia', 'Sleep hygiene education', 0, 28),
('PAT-2024-0022', 'Do Thi Hanh', '1990-11-29', 1, 'B+', '0930000022', 'hanh.do@gmail.com', '18 Tran Hung Dao St, Dist 5, HCMC', 'Do Duc Duy', '0980000122', 'Osteoarthritis checkup', 'Pain relief gel', 0, 29),
('PAT-2024-0023', 'Ngo Minh Hoang', '1995-02-15', 0, 'AB+', '0930000023', 'hoang.ngo@gmail.com', '57 Ly Tu Trong St, Dist 10, HCMC', 'Ngo Van Phong', '0980000123', 'Asthma followup', 'Continue inhaler use', 0, 30),
('PAT-2024-0024', 'Dang Van Lam', '2001-05-10', 0, 'O-', '0930000024', 'lam.dang@gmail.com', '29 Ly Tu Trong St, Dist 10, HCMC', 'Dang Thi Tuyet', '0980000124', 'Dermatitis checkup', 'Topical cream applied', 0, 31),
('PAT-2024-0025', 'Bui Quoc Khanh', '1988-12-25', 0, 'A-', '0930000025', 'khanh.bui@gmail.com', '28 Tran Hung Dao St, Dist 9, HCMC', 'Bui Van Son', '0980000125', 'General checkup', 'None', 0, 32),
('PAT-2024-0026', 'Nguyen Hoang Linh', '1993-04-18', 1, 'B-', '0930000026', 'linh.nguyen@gmail.com', '51 Nguyen Hue St, Dist 2, HCMC', 'Nguyen Bao Ngoc', '0980000126', 'Ear infection check', 'Ear drops prescribed', 0, 33),
('PAT-2024-0027', 'Tran Van Binh', '1987-08-05', 0, 'AB-', '0930000027', 'binh.tran@gmail.com', '41 Nguyen Hue St, Dist 2, HCMC', 'Tran Duc Hai', '0980000127', 'Mild gastritis', 'Dietary counsel', 0, 34),
('PAT-2024-0028', 'Pham Hoang Yen', '1990-10-12', 1, 'O+', '0930000028', 'yen.pham@gmail.com', '13 Tran Hung Dao St, Dist 4, HCMC', 'Pham Quoc Huy', '0980000128', 'Fatigue checkup', 'Vitamin B complex', 0, 35),
('PAT-2024-0029', 'Le Van Dung', '1975-01-30', 0, 'A+', '0930000029', 'dung.le@gmail.com', '11 Hai Ba Trung St, Dist 3, HCMC', 'Le Thi Ha', '0980000129', 'Hypertension follow-up', 'Continue medication', 0, 36),
('PAT-2024-0030', 'Vu Thi Ngoc', '1982-05-18', 1, 'B+', '0930000030', 'ngoc.vu@gmail.com', '12 Hai Ba Trung St, Dist 3, HCMC', 'Vu Minh Quang', '0980000130', 'Sinusitis chronic', 'Nasal spray prescribed', 0, 37),
('PAT-2024-0031', 'Hoang Viet Bach', '1998-09-02', 0, 'AB+', '0930000031', 'bach.hoang@gmail.com', '31 Nguyen Hue St, Dist 2, HCMC', 'Hoang Thanh Ha', '0980000131', 'Acne vulgaris', 'Dermatological lotion', 0, 38),
('PAT-2024-0032', 'Phan Thanh Tung', '1981-02-14', 0, 'O-', '0930000032', 'tung.phan@gmail.com', '26 Nguyen Hue St, Dist 7, HCMC', 'Phan Huu Loc', '0980000132', 'Back muscle strain', 'Rest and warm compress', 0, 39),
('PAT-2024-0033', 'Do Van Thang', '1996-06-25', 0, 'A-', '0930000033', 'thang.do@gmail.com', '78 Tran Hung Dao St, Dist 5, HCMC', 'Do Duc Duy', '0980000133', 'Routine check', 'None', 0, 40),
('PAT-2024-0034', 'Ngo Thi Loan', '1991-12-10', 1, 'B-', '0930000034', 'loan.ngo@gmail.com', '34 Ly Tu Trong St, Dist 5, HCMC', 'Ngo Van Phong', '0980000143', 'Migraine screening', 'Painkillers prescribed', 0, 41),
('PAT-2024-0035', 'Dang Minh Tu', '1987-04-05', 0, 'AB-', '0930000035', 'tu.dang@gmail.com', '29 Ly Tu Trong St, Dist 10, HCMC', 'Dang Thi Tuyet', '0980000135', 'Conjunctivitis', 'Antibiotic eye drops', 0, 42),
('PAT-2024-0036', 'Bui Minh Tri', '1994-08-16', 0, 'O+', '0930000036', 'tri.bui@gmail.com', '28 Tran Hung Dao St, Dist 9, HCMC', 'Bui Van Son', '0980000136', 'Dry cough', 'Cough syrup', 0, 43),
('PAT-2024-0037', 'Nguyen Viet Dung', '1989-10-22', 0, 'A+', '0930000037', 'dung.viet@gmail.com', '36 Nguyen Hue St, Dist 7, HCMC', 'Nguyen Bao Ngoc', '0980000137', 'Eczema flareup', 'Moisturizing ointment', 0, 44),
('PAT-2024-0038', 'Tran Hoang Phuc', '1993-01-14', 0, 'B+', '0930000038', 'phuc.tran@gmail.com', '38 Tran Hung Dao St, Dist 9, HCMC', 'Tran Duc Hai', '0980000138', 'Hypercholesterolemia', 'Lipid lowering counseling', 0, 45),
('PAT-2024-0039', 'Pham Minh Khoa', '1997-03-30', 0, 'AB+', '0930000039', 'khoa.pham@gmail.com', '39 Ly Tu Trong St, Dist 10, HCMC', 'Pham Quoc Huy', '0980000139', 'Dental pain referral', 'Refer to dental clinic', 0, 46),
('PAT-2024-0040', 'Le Quoc Trung', '1999-05-18', 0, 'O-', '0930000040', 'trung.le@gmail.com', '48 Tran Hung Dao St, Dist 9, HCMC', 'Le Thi Ha', '0980000140', 'Common cold', 'Rest and hydration', 0, 47),
('PAT-2024-0041', 'Vu Xuan Binh', '1991-09-02', 0, 'A-', '0930000041', 'binh.vu@gmail.com', '41 Nguyen Hue St, Dist 2, HCMC', 'Vu Minh Quang', '0980000141', 'Mild tension headache', 'Aspirin prescribed', 0, 48),
('PAT-2024-0042', 'Hoang Thu Trang', '1984-12-12', 1, 'B-', '0930000042', 'trang.hoang@gmail.com', '42 Hai Ba Trung St, Dist 3, HCMC', 'Hoang Thanh Ha', '0980000142', 'Gastric discomfort', 'Avoid late meals', 0, 49),
('PAT-2024-0043', 'Phan Huu Loc', '1986-07-21', 0, 'AB-', '0930000043', 'loc.phan@gmail.com', '43 Tran Hung Dao St, Dist 4, HCMC', 'Phan Van Quyet', '0980000143', 'Food allergy check', 'Antihistamines', 0, 50),
('PAT-2024-0044', 'Do Duc Duy', '1990-11-29', 0, 'O+', '0930000044', 'duy.do@gmail.com', '44 Ly Tu Trong St, Dist 5, HCMC', 'Do Thi Hanh', '0980000144', 'Knee joint pain', 'Prescribed anti-inflammatory', 0, 51),
('PAT-2024-0045', 'Ngo Van Phong', '1995-02-15', 0, 'A+', '0930000045', 'phong.ngo@gmail.com', '45 Le Loi St, Dist 6, HCMC', 'Ngo Minh Hoang', '0980000145', 'Throat irritation', 'Warm fluid recommendation', 0, 52),
('PAT-2024-0046', 'Dang Thi Tuyet', '2001-05-10', 1, 'B+', '0930000046', 'tuyet.dang@gmail.com', '46 Nguyen Hue St, Dist 7, HCMC', 'Dang Van Lam', '0980000146', 'Dry skin problem', 'Emollient cream', 0, 53),
('PAT-2024-0047', 'Bui Van Son', '1988-12-25', 0, 'AB+', '0930000047', 'son.bui@gmail.com', '47 Hai Ba Trung St, Dist 8, HCMC', 'Bui Quoc Khanh', '0980000147', 'Routine check', 'None', 0, 54),
('PAT-2024-0048', 'Nguyen Bao Ngoc', '1993-04-18', 1, 'O-', '0930000048', 'ngoc.bao@gmail.com', '48 Tran Hung Dao St, Dist 9, HCMC', 'Nguyen Hoang Linh', '0980000148', 'Laryngitis checkup', 'Voice rest', 0, 55),
('PAT-2024-0049', 'Tran Duc Hai', '1987-08-05', 0, 'A-', '0930000049', 'hai.tran@gmail.com', '49 Ly Tu Trong St, Dist 10, HCMC', 'Tran Van Binh', '0980000149', 'Indigestion symptoms', 'Antacids prescribed', 0, 56),
('PAT-2024-0050', 'Pham Quoc Huy', '1990-10-12', 0, 'B-', '0930000050', 'huy.pham@gmail.com', '50 Le Loi St, Dist 1, HCMC', 'Pham Hoang Yen', '0980000150', 'Muscle spasm', 'Muscle relaxant prescription', 0, 57),
('PAT-2024-0051', 'Le Thi Ha', '1975-01-30', 1, 'AB-', '0930000051', 'ha.le@gmail.com', '51 Nguyen Hue St, Dist 2, HCMC', 'Le Van Dung', '0980000151', 'Routine follow-up', 'No modification', 0, 58),
('PAT-2024-0052', 'Vu Minh Quang', '1982-05-18', 0, 'O+', '0930000052', 'quang.vu@gmail.com', '52 Hai Ba Trung St, Dist 3, HCMC', 'Vu Thi Ngoc', '0980000152', 'Cough and congestion', 'Expectorant prescribed', 0, 59),
('PAT-2024-0053', 'Hoang Thanh Ha', '1998-09-02', 1, 'A+', '0930000053', 'thanha.hoang@gmail.com', '53 Tran Hung Dao St, Dist 4, HCMC', 'Hoang Viet Bach', '0980000153', 'Routine checkup', 'Healthy status', 0, 60);

-- Enable foreign keys back
SET FOREIGN_KEY_CHECKS = 1;
