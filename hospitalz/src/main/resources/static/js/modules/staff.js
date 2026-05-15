import { api } from '../api.js';

export async function renderStaffList() {
    const container = document.createElement('div');
    
    container.innerHTML = `
        <div class="glass-panel" style="padding: 24px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0;">Staff & Doctor Management</h2>
                <div style="display: flex; gap: 12px;">
                    <button id="btn-tab-staff" class="btn active-tab" style="padding: 8px 16px; border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer; background: var(--bg-secondary);">Staff</button>
                    <button id="btn-tab-doctor" class="btn" style="padding: 8px 16px; border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer; background: transparent;">Doctors</button>
                </div>
            </div>

            <!-- STAFF SECTION -->
            <div id="section-staff">
                <div style="display: flex; justify-content: flex-end; margin-bottom: 16px;">
                    <button id="btn-register-staff" class="btn" style="padding: 8px 16px; background: var(--accent-primary); color: white; border: none; border-radius: 6px; cursor: pointer;">
                        <i class="fa-solid fa-plus"></i> Register Staff
                    </button>
                </div>
                
                <div id="staff-form-container" style="display: none; margin-bottom: 24px; padding: 16px; border: 1px solid var(--border-color); border-radius: 8px; background: rgba(0,0,0,0.02);">
                    <form id="staff-form">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                            <div><label>Full Name *</label><input type="text" id="staff-name" required style="width: 100%; padding: 8px; border-radius: 4px;"></div>
                            <div><label>Phone Number *</label><input type="text" id="staff-phone" required style="width: 100%; padding: 8px; border-radius: 4px;"></div>
                            <div>
                                <label>Role *</label>
                                <select id="staff-role" required style="width: 100%; padding: 8px; border-radius: 4px;">
                                    <option value="NURSE">Nurse</option>
                                    <option value="RECEPTIONIST">Receptionist</option>
                                    <option value="WARD_BOY">Ward Boy</option>
                                </select>
                            </div>
                            <div>
                                <label>Shift</label>
                                <select id="staff-shift" style="width: 100%; padding: 8px; border-radius: 4px;">
                                    <option value="MORNING">Morning</option>
                                    <option value="AFTERNOON">Afternoon</option>
                                    <option value="NIGHT">Night</option>
                                </select>
                            </div>
                            <div><label>Assigned Ward</label><input type="text" id="staff-ward" style="width: 100%; padding: 8px; border-radius: 4px;"></div>
                        </div>
                        <div style="display: flex; gap: 12px; justify-content: flex-end;">
                            <button type="button" id="btn-cancel-staff" class="btn" style="padding: 8px 16px;">Cancel</button>
                            <button type="submit" class="btn" style="padding: 8px 16px; background: var(--status-success); color: white;">Save Staff</button>
                        </div>
                    </form>
                </div>

                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; text-align: left;">
                        <thead>
                            <tr style="border-bottom: 2px solid var(--border-color);">
                                <th>ID</th><th>Name</th><th>Role</th><th>Phone</th><th>Ward</th><th>Shift</th><th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="staff-table-body"><tr><td colspan="7" style="text-align: center;">Loading staff...</td></tr></tbody>
                    </table>
                </div>
            </div>

            <!-- DOCTOR SECTION -->
            <div id="section-doctor" style="display: none;">
                <div style="display: flex; justify-content: flex-end; margin-bottom: 16px;">
                    <button id="btn-register-doctor" class="btn" style="padding: 8px 16px; background: var(--accent-primary); color: white; border: none; border-radius: 6px; cursor: pointer;">
                        <i class="fa-solid fa-plus"></i> Register Doctor
                    </button>
                </div>
                
                <div id="doctor-form-container" style="display: none; margin-bottom: 24px; padding: 16px; border: 1px solid var(--border-color); border-radius: 8px; background: rgba(0,0,0,0.02);">
                    <form id="doctor-form">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                            <div><label>Full Name *</label><input type="text" id="doc-name" required style="width: 100%; padding: 8px; border-radius: 4px;"></div>
                            <div><label>Specialisation *</label><input type="text" id="doc-spec" required style="width: 100%; padding: 8px; border-radius: 4px;"></div>
                            <div><label>Phone Number *</label><input type="text" id="doc-phone" required style="width: 100%; padding: 8px; border-radius: 4px;"></div>
                            <div><label>Email</label><input type="email" id="doc-email" style="width: 100%; padding: 8px; border-radius: 4px;"></div>
                            <div><label>Experience Years</label><input type="number" id="doc-exp" style="width: 100%; padding: 8px; border-radius: 4px;"></div>
                            <div><label>Consultation Fee *</label><input type="number" id="doc-fee" required style="width: 100%; padding: 8px; border-radius: 4px;"></div>
                        </div>
                        <div style="display: flex; gap: 12px; justify-content: flex-end;">
                            <button type="button" id="btn-cancel-doctor" class="btn" style="padding: 8px 16px;">Cancel</button>
                            <button type="submit" class="btn" style="padding: 8px 16px; background: var(--status-success); color: white;">Save Doctor</button>
                        </div>
                    </form>
                </div>

                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; text-align: left;">
                        <thead>
                            <tr style="border-bottom: 2px solid var(--border-color);">
                                <th>ID</th><th>Name</th><th>Spec</th><th>Phone</th><th>Fee</th><th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="doctor-table-body"><tr><td colspan="6" style="text-align: center;">Loading doctors...</td></tr></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        loadStaffData();
        loadDoctorData();
        setupEvents(container);
    }, 0);

    return container;
}

async function loadStaffData() {
    const tbody = document.getElementById('staff-table-body');
    if (!tbody) return;
    try {
        const list = await api.get('/staff');
        if (list.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No staff found.</td></tr>';
            return;
        }
        tbody.innerHTML = list.map(s => `
            <tr style="border-bottom: 1px solid var(--border-color);">
                <td>${s.staffId || '-'}</td>
                <td>${s.fullName}</td>
                <td>${s.role}</td>
                <td>${s.phoneNumber}</td>
                <td>${s.assignedWard || '-'}</td>
                <td>${s.shift || '-'}</td>
                <td>${s.isActive ? 'Active' : 'Inactive'}</td>
            </tr>
        `).join('');
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Error loading data</td></tr>';
    }
}

async function loadDoctorData() {
    const tbody = document.getElementById('doctor-table-body');
    if (!tbody) return;
    try {
        const list = await api.get('/doctors');
        if (list.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No doctors found.</td></tr>';
            return;
        }
        tbody.innerHTML = list.map(d => `
            <tr style="border-bottom: 1px solid var(--border-color);">
                <td>${d.doctorId || '-'}</td>
                <td>${d.fullName}</td>
                <td>${d.specialisation}</td>
                <td>${d.phoneNumber}</td>
                <td>$${d.consultationFee}</td>
                <td>${d.isActive ? 'Active' : 'Inactive'}</td>
            </tr>
        `).join('');
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Error loading data</td></tr>';
    }
}

function setupEvents(container) {
    // Tabs
    const btnStaff = container.querySelector('#btn-tab-staff');
    const btnDoc = container.querySelector('#btn-tab-doctor');
    const secStaff = container.querySelector('#section-staff');
    const secDoc = container.querySelector('#section-doctor');

    btnStaff.addEventListener('click', () => {
        secStaff.style.display = 'block';
        secDoc.style.display = 'none';
        btnStaff.style.background = 'var(--bg-secondary)';
        btnDoc.style.background = 'transparent';
    });

    btnDoc.addEventListener('click', () => {
        secStaff.style.display = 'none';
        secDoc.style.display = 'block';
        btnDoc.style.background = 'var(--bg-secondary)';
        btnStaff.style.background = 'transparent';
    });

    // Forms
    const sfForm = container.querySelector('#staff-form-container');
    container.querySelector('#btn-register-staff').onclick = () => sfForm.style.display = 'block';
    container.querySelector('#btn-cancel-staff').onclick = () => { sfForm.style.display = 'none'; container.querySelector('#staff-form').reset(); };

    container.querySelector('#staff-form').onsubmit = async (e) => {
        e.preventDefault();
        const payload = {
            fullName: document.getElementById('staff-name').value,
            phoneNumber: document.getElementById('staff-phone').value,
            role: document.getElementById('staff-role').value,
            shift: document.getElementById('staff-shift').value,
            assignedWard: document.getElementById('staff-ward').value,
            isActive: true
        };
        try {
            await api.post('/staff', payload);
            alert('Staff registered!');
            container.querySelector('#staff-form').reset();
            sfForm.style.display = 'none';
            loadStaffData();
        } catch (error) { alert('Error: ' + error.message); }
    };

    const docForm = container.querySelector('#doctor-form-container');
    container.querySelector('#btn-register-doctor').onclick = () => docForm.style.display = 'block';
    container.querySelector('#btn-cancel-doctor').onclick = () => { docForm.style.display = 'none'; container.querySelector('#doctor-form').reset(); };

    container.querySelector('#doctor-form').onsubmit = async (e) => {
        e.preventDefault();
        const payload = {
            fullName: document.getElementById('doc-name').value,
            specialisation: document.getElementById('doc-spec').value,
            phoneNumber: document.getElementById('doc-phone').value,
            email: document.getElementById('doc-email').value,
            experienceYears: document.getElementById('doc-exp').value,
            consultationFee: document.getElementById('doc-fee').value,
            isActive: true
        };
        try {
            await api.post('/doctors', payload);
            alert('Doctor registered!');
            container.querySelector('#doctor-form').reset();
            docForm.style.display = 'none';
            loadDoctorData();
        } catch (error) { alert('Error: ' + error.message); }
    };
}
    