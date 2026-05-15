import { api } from '../api.js';

export async function renderRegisterForm() {
    const container = document.createElement('div');
    
    container.innerHTML = `
        <div class="glass-panel" style="padding: 24px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 16px;">
                <h2 style="margin: 0;">Patient Management</h2>
                <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                    <input type="text" id="patient-search" placeholder="Search name/phone/ID..." style="padding: 8px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-secondary); min-width: 200px;">
                    <button id="btn-register-patient" class="btn btn-primary" style="padding: 8px 16px; background: var(--accent-primary); color: white; border: none; border-radius: 6px; cursor: pointer;">
                        <i class="fa-solid fa-plus"></i> Register
                    </button>
                </div>
            </div>
            
            <div id="patient-form-container" style="display: none; margin-bottom: 24px; padding: 16px; border: 1px solid var(--border-color); border-radius: 8px; background: rgba(0,0,0,0.02);">
                <form id="patient-form">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Full Name *</label>
                            <input type="text" id="patient-name" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Date of Birth *</label>
                            <input type="date" id="patient-dob" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Gender *</label>
                            <select id="patient-gender" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Phone Number *</label>
                            <input type="text" id="patient-phone" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Blood Group</label>
                            <input type="text" id="patient-blood" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Emergency Contact</label>
                            <input type="text" id="patient-em-phone" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                        <button type="button" id="btn-cancel-patient" style="padding: 8px 16px; border: 1px solid var(--border-color); background: transparent; border-radius: 6px; cursor: pointer;">Cancel</button>
                        <button type="submit" style="padding: 8px 16px; background: var(--status-success); color: white; border: none; border-radius: 6px; cursor: pointer;">Save Patient</button>
                    </div>
                </form>
            </div>

            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--border-color);">
                            <th style="padding: 12px;">ID</th>
                            <th style="padding: 12px;">Name</th>
                            <th style="padding: 12px;">Gender</th>
                            <th style="padding: 12px;">Phone</th>
                            <th style="padding: 12px;">Status</th>
                            <th style="padding: 12px;">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="patient-table-body">
                        <tr><td colspan="6" style="text-align: center; padding: 20px;">Loading patients...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Patient Detail Modal -->
        <div id="patient-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
            <div class="glass-panel" style="background: var(--bg-primary); width: 90%; max-width: 700px; padding: 24px; max-height: 90vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
                    <h2 style="margin: 0;">Patient Details</h2>
                    <button id="close-patient-modal" style="background: transparent; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
                </div>
                <div id="patient-modal-content"></div>
            </div>
        </div>
    `;

    setTimeout(() => {
        let allPatients = [];
        loadPatientData().then(data => {
            allPatients = data || [];
            renderPatientTable(allPatients, container);
        });
        
        setupPatientEvents(container, () => allPatients);
    }, 0);

    return container;
}

async function loadPatientData() {
    try {
        return await api.get('/patients');
    } catch (error) {
        console.error(error);
        return [];
    }
}

function renderPatientTable(patientList, container) {
    const tbody = container.querySelector('#patient-table-body');
    if (!tbody) return;

    if (!patientList || patientList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px;">No patients found.</td></tr>`;
        return;
    }

    tbody.innerHTML = patientList.map(p => `
        <tr style="border-bottom: 1px solid var(--border-color);">
            <td style="padding: 12px;">${p.patientId || '-'}</td>
            <td style="padding: 12px; font-weight: 500;">${p.fullName}</td>
            <td style="padding: 12px;">${p.gender}</td>
            <td style="padding: 12px;">${p.phoneNumber}</td>
            <td style="padding: 12px;">
                <span style="background: var(--bg-secondary); padding: 4px 8px; border-radius: 4px; border: 1px solid var(--border-color); font-size: 0.85em;">
                    ${p.status || 'OUTPATIENT'}
                </span>
            </td>
            <td style="padding: 12px;">
                <button class="btn btn-view-patient" data-id="${p.patientId}" style="padding: 4px 8px; border-radius: 4px; cursor: pointer; border: 1px solid var(--border-color);">View</button>
            </td>
        </tr>
    `).join('');

    container.querySelectorAll('.btn-view-patient').forEach(btn => {
        btn.onclick = (e) => showPatientDetails(e.target.dataset.id, container);
    });
}

function setupPatientEvents(container, getAllPatientsFn) {
    const btnRegister = container.querySelector('#btn-register-patient');
    const formContainer = container.querySelector('#patient-form-container');
    const btnCancel = container.querySelector('#btn-cancel-patient');
    const form = container.querySelector('#patient-form');
    const searchInput = container.querySelector('#patient-search');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const allPatients = getAllPatientsFn();
        const filtered = allPatients.filter(p => 
            (p.fullName && p.fullName.toLowerCase().includes(query)) ||
            (p.phoneNumber && p.phoneNumber.includes(query)) ||
            (p.patientId && p.patientId.toLowerCase().includes(query))
        );
        renderPatientTable(filtered, container);
    });

    btnRegister.addEventListener('click', () => {
        formContainer.style.display = 'block';
    });

    btnCancel.addEventListener('click', () => {
        formContainer.style.display = 'none';
        form.reset();
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const payload = {
            fullName: document.getElementById('patient-name').value,
            dateOfBirth: document.getElementById('patient-dob').value,
            gender: document.getElementById('patient-gender').value,
            phoneNumber: document.getElementById('patient-phone').value,
            bloodGroup: document.getElementById('patient-blood').value,
            emergencyContactPhone: document.getElementById('patient-em-phone').value,
            status: 'OUTPATIENT'
        };

        try {
            await api.post('/patients', payload);
            alert('Patient registered successfully!');
            form.reset();
            formContainer.style.display = 'none';
            // Reload
            const updated = await loadPatientData();
            // Need a way to update the allPatients ref, but simple re-render works if we don't have search text.
            renderPatientTable(updated, container);
            searchInput.value = '';
        } catch (error) {
            alert('Error: ' + error.message);
        }
    });

    container.querySelector('#close-patient-modal').onclick = () => {
        container.querySelector('#patient-modal').style.display = 'none';
    };
}

async function showPatientDetails(patientId, container) {
    const modal = container.querySelector('#patient-modal');
    const content = container.querySelector('#patient-modal-content');
    
    content.innerHTML = '<div style="text-align:center; padding: 20px;">Loading details...</div>';
    modal.style.display = 'flex';

    try {
        const patient = await api.get(`/patients/${patientId}`);
        const doctors = await api.get(`/doctor-patient/patient/${patientId}`).catch(()=>[]);
        const treatments = await api.get(`/treatment-records/patient/${patientId}`).catch(()=>[]);

        content.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
                <div>
                    <p><strong>Name:</strong> ${patient.fullName}</p>
                    <p><strong>DOB:</strong> ${patient.dateOfBirth}</p>
                    <p><strong>Gender:</strong> ${patient.gender}</p>
                </div>
                <div>
                    <p><strong>Phone:</strong> ${patient.phoneNumber}</p>
                    <p><strong>Blood:</strong> ${patient.bloodGroup || '-'}</p>
                    <p><strong>Status:</strong> <span style="color: var(--accent-primary); font-weight: bold;">${patient.status}</span></p>
                </div>
            </div>
            
            <h3 style="margin-bottom: 12px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">Assigned Doctors</h3>
            <ul style="margin-bottom: 24px; padding-left: 20px;">
                ${doctors.length > 0 ? doctors.map(dp => `<li>${dp.doctor?.fullName} (${dp.isPrimary ? 'Primary' : 'Secondary'})</li>`).join('') : '<li>No doctors assigned</li>'}
            </ul>

            <h3 style="margin-bottom: 12px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">Treatment History</h3>
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9em;">
                <thead>
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <th style="padding: 8px;">Date</th>
                        <th style="padding: 8px;">Treatment</th>
                        <th style="padding: 8px;">Doctor</th>
                    </tr>
                </thead>
                <tbody>
                    ${treatments.length > 0 ? treatments.map(tr => `
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 8px;">${new Date(tr.recordDate).toLocaleDateString()}</td>
                            <td style="padding: 8px;">${tr.treatment?.treatmentName} (Qty: ${tr.quantity})</td>
                            <td style="padding: 8px;">${tr.doctor?.fullName || '-'}</td>
                        </tr>
                    `).join('') : '<tr><td colspan="3" style="padding: 8px; text-align: center;">No treatments recorded</td></tr>'}
                </tbody>
            </table>
        `;
    } catch (err) {
        content.innerHTML = '<div style="color: red;">Failed to load patient details.</div>';
    }
}

export async function renderDoctorPatientList() {
    const container = document.createElement('div');
    container.innerHTML = `
        <div class="glass-panel" style="padding: 24px;">
            <h3>My Patients</h3>
            <div style="overflow-x: auto; margin-top: 20px;">
                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--border-color);">
                            <th style="padding: 12px;">Patient ID</th>
                            <th style="padding: 12px;">Name</th>
                            <th style="padding: 12px;">Primary Doctor</th>
                            <th style="padding: 12px;">Notes</th>
                        </tr>
                    </thead>
                    <tbody id="doc-patient-list">
                        <tr><td colspan="4" style="text-align: center; padding: 20px;">Loading patients...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    setTimeout(async () => {
        const tbody = container.querySelector('#doc-patient-list');
        const doctorId = localStorage.getItem('username'); // Assuming username = doctorId

        try {
            const list = await api.get(`/doctor-patient/doctor/${doctorId}/patients`);
            if (!list || list.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No patients assigned.</td></tr>';
                return;
            }
            tbody.innerHTML = list.map(dp => `
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 12px;">${dp.patient?.patientId}</td>
                    <td style="padding: 12px; font-weight: 500;">${dp.patient?.fullName}</td>
                    <td style="padding: 12px;">${dp.isPrimary ? '<span style="color:var(--status-success)">Yes</span>' : 'No'}</td>
                    <td style="padding: 12px; color: var(--text-secondary);">${dp.notes || '-'}</td>
                </tr>
            `).join('');
        } catch (e) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color: var(--status-danger);">Error loading your patients</td></tr>';
        }
    }, 0);

    return container;
}
