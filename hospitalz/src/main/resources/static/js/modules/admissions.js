import { api } from '../api.js';

export async function renderActiveAdmissions() {
    const container = document.createElement('div');
    
    container.innerHTML = `
        <div class="glass-panel" style="padding: 24px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0;">Active Admissions & Assignments</h2>
                <div style="display: flex; gap: 12px;">
                    <button id="btn-admit-patient" class="btn btn-primary" style="padding: 8px 16px; background: var(--accent-primary); color: white; border: none; border-radius: 6px; cursor: pointer;">
                        <i class="fa-solid fa-bed-pulse"></i> Admit Patient
                    </button>
                    <button id="btn-assign-doctor" class="btn" style="padding: 8px 16px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer;">
                        <i class="fa-solid fa-user-doctor"></i> Assign Doctor
                    </button>
                </div>
            </div>

            <!-- Admit Form -->
            <div id="admit-form-container" style="display: none; margin-bottom: 24px; padding: 16px; border: 1px solid var(--border-color); border-radius: 8px; background: rgba(0,0,0,0.02);">
                <h3 style="margin-bottom: 12px;">Admit Patient</h3>
                <form id="admit-form">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                        <div>
                            <label>Patient ID *</label>
                            <input type="text" id="admit-patient-id" required style="width: 100%; padding: 8px; border-radius: 4px;">
                        </div>
                        <div>
                            <label>Room ID *</label>
                            <input type="number" id="admit-room-id" required style="width: 100%; padding: 8px; border-radius: 4px;">
                        </div>
                        <div style="grid-column: span 2;">
                            <label>Notes</label>
                            <input type="text" id="admit-notes" style="width: 100%; padding: 8px; border-radius: 4px;">
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                        <button type="button" id="btn-cancel-admit" class="btn" style="padding: 8px 16px;">Cancel</button>
                        <button type="submit" class="btn" style="padding: 8px 16px; background: var(--status-success); color: white;">Admit</button>
                    </div>
                </form>
            </div>

            <!-- Assign Doctor Form -->
            <div id="assign-doc-form-container" style="display: none; margin-bottom: 24px; padding: 16px; border: 1px solid var(--border-color); border-radius: 8px; background: rgba(0,0,0,0.02);">
                <h3 style="margin-bottom: 12px;">Assign Doctor to Patient</h3>
                <form id="assign-doc-form">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                        <div>
                            <label>Patient ID *</label>
                            <input type="text" id="assign-patient-id" required style="width: 100%; padding: 8px; border-radius: 4px;">
                        </div>
                        <div>
                            <label>Doctor ID *</label>
                            <input type="text" id="assign-doc-id" required style="width: 100%; padding: 8px; border-radius: 4px;">
                        </div>
                        <div>
                            <label>Primary Doctor?</label>
                            <select id="assign-primary" style="width: 100%; padding: 8px; border-radius: 4px;">
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>
                        </div>
                        <div>
                            <label>Notes</label>
                            <input type="text" id="assign-notes" style="width: 100%; padding: 8px; border-radius: 4px;">
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                        <button type="button" id="btn-cancel-assign" class="btn" style="padding: 8px 16px;">Cancel</button>
                        <button type="submit" class="btn" style="padding: 8px 16px; background: var(--accent-primary); color: white;">Assign</button>
                    </div>
                </form>
            </div>

            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--border-color);">
                            <th style="padding: 12px;">Admiss. ID</th>
                            <th style="padding: 12px;">Patient</th>
                            <th style="padding: 12px;">Room</th>
                            <th style="padding: 12px;">Admission Date</th>
                            <th style="padding: 12px;">Status</th>
                            <th style="padding: 12px;">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="admissions-table-body">
                        <tr><td colspan="6" style="text-align: center; padding: 20px;">Loading active admissions...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    setTimeout(() => {
        loadActiveAdmissions();
        setupAdmissionsEvents(container);
    }, 0);

    return container;
}

async function loadActiveAdmissions() {
    const tbody = document.getElementById('admissions-table-body');
    if (!tbody) return;

    try {
        const admissions = await api.get('/admissions/active');
        
        if (admissions.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px;">No active admissions.</td></tr>`;
            return;
        }

        tbody.innerHTML = admissions.map(a => `
            <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 12px;">${a.admissionId}</td>
                <td style="padding: 12px; font-weight: 500;">${a.patient?.fullName || a.patient?.patientId || '-'}</td>
                <td style="padding: 12px;">${a.room?.roomNumber || a.room?.roomId || '-'}</td>
                <td style="padding: 12px;">${new Date(a.admissionDate).toLocaleString()}</td>
                <td style="padding: 12px;"><span style="color: var(--status-success);"><i class="fa-solid fa-bed"></i> ${a.status}</span></td>
                <td style="padding: 12px;">
                    <button class="btn btn-discharge" data-id="${a.admissionId}" style="padding: 4px 8px; background: var(--status-danger); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85em;">Discharge</button>
                </td>
            </tr>
        `).join('');

        // Attach discharge event listeners
        document.querySelectorAll('.btn-discharge').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                if (confirm('Are you sure you want to discharge admission ID ' + id + '?')) {
                    try {
                        await api.put(`/admissions/${id}/discharge`);
                        alert('Patient discharged successfully!');
                        loadActiveAdmissions();
                    } catch (error) {
                        alert('Error discharging: ' + error.message);
                    }
                }
            });
        });

    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: var(--status-danger);">Error loading data.</td></tr>`;
    }
}

function setupAdmissionsEvents(container) {
    const btnAdmit = container.querySelector('#btn-admit-patient');
    const formAdmit = container.querySelector('#admit-form-container');
    const btnAssign = container.querySelector('#btn-assign-doctor');
    const formAssign = container.querySelector('#assign-doc-form-container');

    btnAdmit.onclick = () => { formAdmit.style.display = 'block'; formAssign.style.display = 'none'; };
    container.querySelector('#btn-cancel-admit').onclick = () => { formAdmit.style.display = 'none'; container.querySelector('#admit-form').reset(); };

    btnAssign.onclick = () => { formAssign.style.display = 'block'; formAdmit.style.display = 'none'; };
    container.querySelector('#btn-cancel-assign').onclick = () => { formAssign.style.display = 'none'; container.querySelector('#assign-doc-form').reset(); };

    container.querySelector('#admit-form').onsubmit = async (e) => {
        e.preventDefault();
        const payload = {
            patientId: document.getElementById('admit-patient-id').value,
            roomId: parseInt(document.getElementById('admit-room-id').value, 10),
            notes: document.getElementById('admit-notes').value
        };
        try {
            await api.post('/admissions', payload);
            alert('Patient admitted!');
            container.querySelector('#admit-form').reset();
            formAdmit.style.display = 'none';
            loadActiveAdmissions();
        } catch (err) { alert('Error: ' + err.message); }
    };

    container.querySelector('#assign-doc-form').onsubmit = async (e) => {
        e.preventDefault();
        const payload = {
            patientId: document.getElementById('assign-patient-id').value,
            doctorId: document.getElementById('assign-doc-id').value,
            isPrimary: document.getElementById('assign-primary').value === 'true',
            notes: document.getElementById('assign-notes').value
        };
        try {
            await api.post('/doctor-patient', payload);
            alert('Doctor assigned to patient!');
            container.querySelector('#assign-doc-form').reset();
            formAssign.style.display = 'none';
        } catch (err) { alert('Error: ' + err.message); }
    };
}
