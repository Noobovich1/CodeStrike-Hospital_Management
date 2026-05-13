-- ============================================================
-- HOSPITAL MANAGEMENT SYSTEM - ULTIMATE SEED DATA (FINAL FIX)
-- Metadata: English | Names: Vietnamese No Accents
-- Logic: No NULLs, No Duplicates, Verified Foreign Keys
-- ============================================================
USE hospital_db;

-- ── 0. SYSTEM INITIALIZATION ────────────────────────────────
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE users; TRUNCATE TABLE doctors; TRUNCATE TABLE patients; 
TRUNCATE TABLE rooms; TRUNCATE TABLE staff; TRUNCATE TABLE admissions; 
TRUNCATE TABLE treatments; TRUNCATE TABLE treatment_records; 
TRUNCATE TABLE doctor_patient; TRUNCATE TABLE bills;

-- Standardize ID formats
ALTER TABLE patients MODIFY patient_id VARCHAR(20);
ALTER TABLE doctors MODIFY doctor_id VARCHAR(20);
ALTER TABLE staff MODIFY staff_id VARCHAR(20);
ALTER TABLE admissions MODIFY patient_id VARCHAR(20);
ALTER TABLE bills MODIFY patient_id VARCHAR(20);
ALTER TABLE doctor_patient MODIFY patient_id VARCHAR(20), MODIFY doctor_id VARCHAR(20);
ALTER TABLE treatment_records MODIFY patient_id VARCHAR(20), MODIFY doctor_id VARCHAR(20), MODIFY administered_by VARCHAR(20);
SET FOREIGN_KEY_CHECKS = 1;

-- ── 1. USERS (142 ACCOUNTS) ──────────────────────────────────
-- 1:Admin, 2:Recept, 3-22:Doctors, 23-42:Staff, 43-142:Patients
INSERT INTO users (id, username, password, role) VALUES 
(1, 'admin_system', 'pass', 'ADMIN'), 
(2, 'recept_01', 'pass', 'RECEPTIONIST');

INSERT INTO users (id, username, password, role)
WITH RECURSIVE seq AS (SELECT 3 AS n UNION ALL SELECT n + 1 FROM seq WHERE n <= 142)
SELECT n, CONCAT('user_', LPAD(n, 3, '0')), 'password_encrypted', 
       CASE WHEN n <= 22 THEN 'DOCTOR' WHEN n <= 42 THEN 'NURSE' ELSE 'PATIENT' END FROM seq;

-- ── 2. DOCTORS (20 RECORDS) ──────────────────────────────────
INSERT INTO doctors (doctor_id, user_id, full_name, specialisation, phone_number, email, qualification, experience_years, consultation_fee)
WITH RECURSIVE seq AS (SELECT 1 AS n UNION ALL SELECT n + 1 FROM seq WHERE n <= 20)
SELECT 
    CONCAT('DOC-2024-', LPAD(n, 4, '0')), n + 2, 
    CONCAT(ELT((n%5)+1, 'Nguyen','Tran','Le','Pham','Hoang'), ' ', ELT((n%5)+1, 'Van An','Thi Bich','Minh Duc','Thu Thao','Hoang Khai')),
    ELT((n%5)+1, 'Cardiology', 'Neurology', 'Surgery', 'Pediatrics', 'Orthopedics'), 
    CONCAT('090', LPAD(n, 7, '0')), CONCAT('doctor.', n, '@hospital.com'), 'MD, PhD', 10 + (n%10), 150 + (n*10)
FROM seq;

-- ── 3. STAFF (20 RECORDS - FIXED NULL ERROR) ─────────────────
INSERT INTO staff (staff_id, user_id, full_name, role, phone_number, assigned_ward, shift)
WITH RECURSIVE seq AS (SELECT 1 AS n UNION ALL SELECT n + 1 FROM seq WHERE n <= 20)
SELECT 
    CONCAT(IF(n<=12,'NRS-2024-','WRD-2024-'), LPAD(n, 4, '0')), n + 22, 
    CONCAT(ELT((n%5)+1, 'Nurse','Assistant','Staff','Senior','Specialist'), ' ', ELT((n%5)+1, 'Mai','Lan','Hoa','Kim','Nga')),
    IF(n<=12,'nurse','ward_boy'), CONCAT('092', LPAD(n, 7, '0')), 
    ELT((n%4)+1, 'Medical Ward', 'ICU', 'Operating Theater', 'Emergency'),
    ELT((n%3)+1, 'morning', 'afternoon', 'night')
FROM seq;

-- ── 4. ROOMS (20 RECORDS) ────────────────────────────────────
INSERT INTO rooms (room_id, room_number, room_type, floor, capacity, daily_rate, status, notes)
WITH RECURSIVE seq AS (SELECT 1 AS n UNION ALL SELECT n + 1 FROM seq WHERE n <= 20)
SELECT n, CONCAT('ROOM-', 100+n), 
       IF(n<=10,'general',IF(n<=15,'icu','operation_theater')), (n%5)+1, IF(n<=10,4,1), IF(n<=10,50,300), 'available', 
       ELT((n%5)+1, 'Newly sanitized room', 'Standard medical setup', 'Equipped with ICU monitors', 'High-end VIP room', 'Emergency theater ready')
FROM seq;

-- ── 5. TREATMENTS (20 RECORDS) ───────────────────────────────
INSERT INTO treatments (treatment_id, name, category, unit_cost, description) VALUES
(1,'ECG','Diagnostic',30,'Heart rhythm monitoring'), (2,'Blood Test','Diagnostic',20,'General blood analysis'),
(3,'X-Ray','Diagnostic',50,'Radiographic imaging'), (4,'MRI Scan','Diagnostic',300,'High-res resonance imaging'),
(5,'CT Scan','Diagnostic',250,'Computed tomography'), (6,'Ultrasound','Diagnostic',80,'Internal organ imaging'),
(7,'Physiotherapy','Therapeutic',75,'Motor recovery therapy'), (8,'Chemotherapy','Surgical',500,'Cancer treatment cycle'),
(9,'Hemodialysis','Therapeutic',250,'Kidney support process'), (10,'Endoscopy','Diagnostic',200,'Internal gastric exam'),
(11,'BP Check','Diagnostic',15,'Blood pressure tracking'), (12,'Insulin','Medicine',25,'Diabetes regulation'),
(13,'Oxygen','Therapeutic',60,'Respiratory support'), (14,'Wound Care','Therapeutic',35,'Sterile dressing'),
(15,'Vaccine','Medicine',40,'Preventive immunization'), (16,'Appendectomy','Surgical',1500,'Appendix removal surgery'),
(17,'Colonoscopy','Diagnostic',180,'Colon cancer screening'), (18,'Echo','Diagnostic',150,'Heart valve ultrasound'),
(19,'Bone Scan','Diagnostic',120,'Bone density test'), (20,'IV Infusion','Therapeutic',45,'Intravenous hydration');

-- ── 6. PATIENTS (100 RECORDS - FULL DATA - NO EMPTY COLUMNS) ─
INSERT INTO patients (patient_id, full_name, date_of_birth, gender, blood_group, phone_number, email, address, emergency_contact_name, emergency_contact_phone, disease_description, current_treatment_notes, status)
WITH RECURSIVE seq AS (SELECT 1 AS n UNION ALL SELECT n + 1 FROM seq WHERE n <= 100)
SELECT 
    CONCAT('PAT-2024-', LPAD(n, 4, '0')),
    CONCAT(ELT((n%10)+1, 'Nguyen','Tran','Le','Pham','Hoang','Huynh','Phan','Vu','Vo','Dang'), ' ', ELT((n%5)+1, 'Van Tu','Thi Lan','Minh Anh','Hoang Kim','Ngoc Son')),
    DATE_SUB('2024-01-01', INTERVAL (20 + (n%40)) YEAR), IF(n%2=0, 'male', 'female'), ELT((n%8)+1, 'O+','A+','B+','AB+','O-','A-','B-','AB-'),
    CONCAT('091', LPAD(n, 7, '0')), CONCAT('patient_', n, '@gmail.com'), 
    CONCAT(n, ' ', ELT((n%5)+1, 'Le Loi','Nguyen Hue','Hai Ba Trung','Tran Hung Dao','Ly Tu Trong'), ' St, Dist ', (n%10)+1, ', HCM City'),
    CONCAT(ELT((n%5)+1, 'Nguyen','Tran','Le','Pham','Hoang'), ' Van Thuong'),
    CONCAT('098', LPAD(n, 7, '0')),
    ELT((n%5)+1, 'Persistent chest pain and dyspnea', 'Chronic gastric ulcer symptoms', 'Ligament injury after fall', 'High fever of unknown origin', 'Diabetes type 2 management'),
    ELT((n%5)+1, 'Scheduled for morning surgery', 'Awaiting laboratory results', 'Under continuous monitoring', 'Prescribed daily medication', 'Stable for discharge'),
    'outpatient'
FROM seq;

-- ── 7. ADMISSIONS (50 RECORDS - NO EMPTY COLUMNS) ────────────
INSERT INTO admissions (patient_id, room_id, admitted_by, admission_date, status, notes)
WITH RECURSIVE seq AS (SELECT 1 AS n UNION ALL SELECT n + 1 FROM seq WHERE n <= 50)
SELECT 
    CONCAT('PAT-2024-', LPAD(n, 4, '0')), (n % 20) + 1, 2, 
    DATE_SUB(NOW(), INTERVAL n+5 DAY), 'active', 
    ELT((n%5)+1, 'Emergency trauma admission', 'Scheduled surgical procedure', 'Acute infection monitoring', 'Post-operative care unit', 'Long-term chronic treatment')
FROM seq;

-- ── 8. DOCTOR_PATIENT (100 RECORDS) ──────────────────────────
INSERT INTO doctor_patient (doctor_id, patient_id, assigned_date, is_primary, notes)
WITH RECURSIVE seq AS (SELECT 1 AS n UNION ALL SELECT n + 1 FROM seq WHERE n <= 100)
SELECT 
    CONCAT('DOC-2024-', LPAD((n % 20) + 1, 4, '0')), CONCAT('PAT-2024-', LPAD(n, 4, '0')), 
    CURDATE(), TRUE, 'Assigned as primary consultant'
FROM seq;

-- ── 9. TREATMENT_RECORDS (200 RECORDS) ───────────────────────
INSERT INTO treatment_records (patient_id, treatment_id, doctor_id, administered_by, session_date, quantity, notes)
WITH RECURSIVE seq AS (SELECT 1 AS n UNION ALL SELECT n + 1 FROM seq WHERE n <= 200)
SELECT 
    CONCAT('PAT-2024-', LPAD((n % 100) + 1, 4, '0')), (n % 20) + 1, 
    CONCAT('DOC-2024-', LPAD((n % 20) + 1, 4, '0')), 
    CONCAT('NRS-2024-', LPAD((n % 12) + 1, 4, '0')), 
    DATE_SUB(NOW(), INTERVAL n HOUR), 1, 
    ELT((n%5)+1, 'Procedure successful', 'Vital signs stable', 'Patient resting', 'Medication given', 'Sample sent to lab')
FROM seq;

-- ── 10. BILLS (50 RECORDS) ───────────────────────────────────
INSERT INTO bills (admission_id, patient_id, room_charges, treatment_charges, doctor_charges, total_amount, payment_status, generated_by)
WITH RECURSIVE seq AS (SELECT 1 AS n UNION ALL SELECT n + 1 FROM seq WHERE n <= 50)
SELECT n, CONCAT('PAT-2024-', LPAD(n, 4, '0')), 500, 300, 200, 1050, 'pending', 1 FROM seq;