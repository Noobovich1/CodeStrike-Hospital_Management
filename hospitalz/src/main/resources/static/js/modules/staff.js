import { api } from '../api.js';

export async function renderStaffList() {
    const container = document.createElement('div');
    
    container.innerHTML = `
        <div class="glass-panel" style="padding: 24px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0;">Staff & Doctor Management</h2>
                <div style="display: flex; gap: 12px;">
                    <button id="btn-tab-staff" class="btn active-tab" style="padding: 8px 16px; border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer; background: var(--bg-secondary); color: var(--text-primary);">Staff</button>
                    <button id="btn-tab-doctor" class="btn" style="padding: 8px 16px; border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer; background: transparent; color: var(--text-primary);">Doctors</button>
                </div>
            </div>

            <!-- STAFF SECTION -->
            <div id="section-staff">
                <div style="display: flex; justify-content: flex-end; margin-bottom: 16px;">
                    <button id="btn-register-staff" class="btn btn-primary" style="padding: 8px 16px; background: var(--accent-primary); color: white; border: none; border-radius: 6px; cursor: pointer;">
                        <i class="fa-solid fa-plus"></i> Register Staff
                    </button>
                </div>

                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; text-align: left;">
                        <thead>
                            <tr style="border-bottom: 2px solid var(--border-color);">
                                <th style="padding: 12px;">ID</th>
                                <th style="padding: 12px;">Name</th>
                                <th style="padding: 12px;">Role</th>
                                <th style="padding: 12px;">Phone</th>
                                <th style="padding: 12px;">Ward</th>
                                <th style="padding: 12px;">Shift</th>
                                <th style="padding: 12px;">Status</th>
                                <th style="padding: 12px;">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="staff-table-body">
                            <tr><td colspan="8" style="text-align: center; padding: 20px;">Loading staff...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- DOCTOR SECTION -->
            <div id="section-doctor" style="display: none;">
                <div style="display: flex; justify-content: flex-end; margin-bottom: 16px;">
                    <button id="btn-register-doctor" class="btn btn-primary" style="padding: 8px 16px; background: var(--accent-primary); color: white; border: none; border-radius: 6px; cursor: pointer;">
                        <i class="fa-solid fa-plus"></i> Register Doctor
                    </button>
                </div>

                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; text-align: left;">
                        <thead>
                            <tr style="border-bottom: 2px solid var(--border-color);">
                                <th style="padding: 12px;">ID</th>
                                <th style="padding: 12px;">Name</th>
                                <th style="padding: 12px;">Spec</th>
                                <th style="padding: 12px;">Phone</th>
                                <th style="padding: 12px;">Fee</th>
                                <th style="padding: 12px;">Status</th>
                                <th style="padding: 12px;">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="doctor-table-body">
                            <tr><td colspan="7" style="text-align: center; padding: 20px;">Loading doctors...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Staff Pop-up Modal -->
        <div id="staff-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
            <div class="glass-panel" style="background: var(--bg-primary); width: 90%; max-width: 600px; padding: 24px; max-height: 90vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
                    <h3 id="staff-form-title" style="margin: 0;">Register Staff</h3>
                    <button id="close-staff-modal" style="background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-primary);">&times;</button>
                </div>
                <form id="staff-form">
                    <input type="hidden" id="staff-id-val">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Full Name *</label>
                            <input type="text" id="staff-name" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Phone Number *</label>
                            <input type="text" id="staff-phone" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Role *</label>
                            <select id="staff-role" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                                <option value="NURSE">Nurse</option>
                                <option value="RECEPTIONIST">Receptionist</option>
                                <option value="WARD_BOY">Ward Boy</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Shift</label>
                            <select id="staff-shift" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                                <option value="MORNING">Morning</option>
                                <option value="AFTERNOON">Afternoon</option>
                                <option value="NIGHT">Night</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Assigned Ward</label>
                            <input type="text" id="staff-ward" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                        <button type="button" id="btn-cancel-staff" style="padding: 8px 16px; border: 1px solid var(--border-color); background: transparent; border-radius: 6px; cursor: pointer; color: var(--text-primary);">Cancel</button>
                        <button type="submit" style="padding: 8px 16px; background: var(--status-success); color: white; border: none; border-radius: 6px; cursor: pointer;">Save Staff</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Doctor Pop-up Modal -->
        <div id="doctor-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
            <div class="glass-panel" style="background: var(--bg-primary); width: 90%; max-width: 600px; padding: 24px; max-height: 90vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
                    <h3 id="doctor-form-title" style="margin: 0;">Register Doctor</h3>
                    <button id="close-doctor-modal" style="background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-primary);">&times;</button>
                </div>
                <form id="doctor-form">
                    <input type="hidden" id="doc-id-val">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Full Name *</label>
                            <input type="text" id="doc-name" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Specialisation *</label>
                            <input type="text" id="doc-spec" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Phone Number *</label>
                            <input type="text" id="doc-phone" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Email</label>
                            <input type="email" id="doc-email" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Experience Years</label>
                            <input type="number" id="doc-exp" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Consultation Fee *</label>
                            <input type="number" id="doc-fee" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                        <button type="button" id="btn-cancel-doctor" style="padding: 8px 16px; border: 1px solid var(--border-color); background: transparent; border-radius: 6px; cursor: pointer; color: var(--text-primary);">Cancel</button>
                        <button type="submit" style="padding: 8px 16px; background: var(--status-success); color: white; border: none; border-radius: 6px; cursor: pointer;">Save Doctor</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    setTimeout(() => {
        loadStaffData(container);
        loadDoctorData(container);
        setupEvents(container);
    }, 0);

    return container;
}

async function loadStaffData(container) {
    const tbody = document.getElementById('staff-table-body');
    if (!tbody) return;
    try {
        const list = await api.get('/staff');
        if (list.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 20px;">No staff found.</td></tr>';
            return;
        }
        tbody.innerHTML = list.map(s => {
            const statusColor = s.isActive ? 'var(--status-success)' : 'var(--text-secondary)';
            return `
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 12px;">${s.staffId || '-'}</td>
                    <td style="padding: 12px; font-weight: 500;">${s.fullName}</td>
                    <td style="padding: 12px;">${s.role}</td>
                    <td style="padding: 12px;">${s.phoneNumber}</td>
                    <td style="padding: 12px;">${s.assignedWard || '-'}</td>
                    <td style="padding: 12px;">${s.shift || '-'}</td>
                    <td style="padding: 12px;"><span style="color: ${statusColor}; font-weight: 600;">${s.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td style="padding: 12px;">
                        <div class="action-group">
                            <button class="btn-icon btn-icon-view btn-edit-staff" data-id="${s.staffId}" title="Edit Staff">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button class="btn-icon btn-deactivate-staff" data-id="${s.staffId}" title="Deactivate/Delete Staff">
                                <i class="fa-solid fa-user-slash" style="color: var(--status-danger);"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // Attach listeners safely
        container.querySelectorAll('.btn-edit-staff').forEach(btn => {
            btn.onclick = async () => {
                await openEditStaffForm(btn.dataset.id);
            };
        });

        container.querySelectorAll('.btn-deactivate-staff').forEach(btn => {
            btn.onclick = async () => {
                const staffId = btn.dataset.id;
                if (confirm(`Are you sure you want to deactivate staff ID ${staffId}?`)) {
                    try {
                        await api.delete(`/staff/${staffId}`);
                        alert('Staff deactivated successfully!');
                        loadStaffData();
                    } catch (error) {
                        alert('Error deactivating staff: ' + error.message);
                    }
                }
            };
        });

    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 20px; color: var(--status-danger);">Error loading data</td></tr>';
    }
}

async function loadDoctorData(container) {
    const tbody = document.getElementById('doctor-table-body');
    if (!tbody) return;
    try {
        const list = await api.get('/doctors');
        if (list.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 20px;">No doctors found.</td></tr>';
            return;
        }
        tbody.innerHTML = list.map(d => {
            const statusColor = d.isActive ? 'var(--status-success)' : 'var(--text-secondary)';
            return `
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 12px;">${d.doctorId || '-'}</td>
                    <td style="padding: 12px; font-weight: 500;">${d.fullName}</td>
                    <td style="padding: 12px;">${d.specialisation}</td>
                    <td style="padding: 12px;">${d.phoneNumber}</td>
                    <td style="padding: 12px;">$${d.consultationFee}</td>
                    <td style="padding: 12px;"><span style="color: ${statusColor}; font-weight: 600;">${d.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td style="padding: 12px;">
                        <div class="action-group">
                            <button class="btn-icon btn-icon-view btn-edit-doc" data-id="${d.doctorId}" title="Edit Doctor">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button class="btn-icon btn-deactivate-doc" data-id="${d.doctorId}" title="Deactivate/Delete Doctor">
                                <i class="fa-solid fa-user-slash" style="color: var(--status-danger);"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // Attach listeners safely
        container.querySelectorAll('.btn-edit-doc').forEach(btn => {
            btn.onclick = async () => {
                await openEditDocForm(btn.dataset.id);
            };
        });

        container.querySelectorAll('.btn-deactivate-doc').forEach(btn => {
            btn.onclick = async () => {
                const doctorId = btn.dataset.id;
                if (confirm(`Are you sure you want to deactivate doctor ID ${doctorId}?`)) {
                    try {
                        await api.delete(`/doctors/${doctorId}`);
                        alert('Doctor deactivated successfully!');
                        loadDoctorData();
                    } catch (error) {
                        alert('Error deactivating doctor: ' + error.message);
                    }
                }
            };
        });

    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 20px; color: var(--status-danger);">Error loading data</td></tr>';
    }
}

async function openEditStaffForm(staffId) {
    const modal = document.getElementById('staff-modal');
    const formTitle = document.getElementById('staff-form-title');
    
    formTitle.textContent = "Edit Staff Details";
    modal.style.display = 'flex';

    try {
        const staff = await api.get(`/staff/${staffId}`);
        document.getElementById('staff-id-val').value = staff.staffId;
        document.getElementById('staff-name').value = staff.fullName;
        document.getElementById('staff-phone').value = staff.phoneNumber;
        document.getElementById('staff-role').value = staff.role;
        document.getElementById('staff-shift').value = staff.shift || 'MORNING';
        document.getElementById('staff-ward').value = staff.assignedWard || '';
    } catch (error) {
        alert('Error loading staff details: ' + error.message);
        modal.style.display = 'none';
    }
}

async function openEditDocForm(doctorId) {
    const modal = document.getElementById('doctor-modal');
    const formTitle = document.getElementById('doctor-form-title');
    
    formTitle.textContent = "Edit Doctor Details";
    modal.style.display = 'flex';

    try {
        const doctor = await api.get(`/doctors/${doctorId}`);
        document.getElementById('doc-id-val').value = doctor.doctorId;
        document.getElementById('doc-name').value = doctor.fullName;
        document.getElementById('doc-spec').value = doctor.specialisation;
        document.getElementById('doc-phone').value = doctor.phoneNumber;
        document.getElementById('doc-email').value = doctor.email || '';
        document.getElementById('doc-exp').value = doctor.experienceYears || '';
        document.getElementById('doc-fee').value = doctor.consultationFee;
    } catch (error) {
        alert('Error loading doctor details: ' + error.message);
        modal.style.display = 'none';
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

    // Forms Staff
    const sfModal = container.querySelector('#staff-modal');
    const sfClose = container.querySelector('#close-staff-modal');
    const sfCancel = container.querySelector('#btn-cancel-staff');
    const sfForm = container.querySelector('#staff-form');

    container.querySelector('#btn-register-staff').onclick = () => {
        document.getElementById('staff-form-title').textContent = "Register Staff";
        document.getElementById('staff-id-val').value = '';
        sfForm.reset();
        sfModal.style.display = 'flex';
    };

    const closeStaff = () => {
        sfModal.style.display = 'none';
        sfForm.reset();
    };
    sfClose.onclick = closeStaff;
    sfCancel.onclick = closeStaff;

    sfForm.onsubmit = async (e) => {
        e.preventDefault();
        const staffId = document.getElementById('staff-id-val').value;
        const payload = {
            fullName: document.getElementById('staff-name').value,
            phoneNumber: document.getElementById('staff-phone').value,
            role: document.getElementById('staff-role').value,
            shift: document.getElementById('staff-shift').value,
            assignedWard: document.getElementById('staff-ward').value,
            isActive: true
        };
        try {
            if (staffId) {
                await api.put(`/staff/${staffId}`, payload);
                alert('Staff details updated!');
            } else {
                await api.post('/staff', payload);
                alert('Staff registered!');
            }
            closeStaff();
            loadStaffData();
        } catch (error) { 
            alert('Error: ' + error.message); 
        }
    };

    // Forms Doctor
    const docModal = container.querySelector('#doctor-modal');
    const docClose = container.querySelector('#close-doctor-modal');
    const docCancel = container.querySelector('#btn-cancel-doctor');
    const docForm = container.querySelector('#doctor-form');

    container.querySelector('#btn-register-doctor').onclick = () => {
        document.getElementById('doctor-form-title').textContent = "Register Doctor";
        document.getElementById('doc-id-val').value = '';
        docForm.reset();
        docModal.style.display = 'flex';
    };

    const closeDoctor = () => {
        docModal.style.display = 'none';
        docForm.reset();
    };
    docClose.onclick = closeDoctor;
    docCancel.onclick = closeDoctor;

    docForm.onsubmit = async (e) => {
        e.preventDefault();
        const doctorId = document.getElementById('doc-id-val').value;
        const payload = {
            fullName: document.getElementById('doc-name').value,
            specialisation: document.getElementById('doc-spec').value,
            phoneNumber: document.getElementById('doc-phone').value,
            email: document.getElementById('doc-email').value,
            experienceYears: document.getElementById('doc-exp').value ? parseInt(document.getElementById('doc-exp').value, 10) : null,
            consultationFee: parseFloat(document.getElementById('doc-fee').value),
            isActive: true
        };
        try {
            if (doctorId) {
                await api.put(`/doctors/${doctorId}`, payload);
                alert('Doctor details updated!');
            } else {
                await api.post('/doctors', payload);
                alert('Doctor registered!');
            }
            closeDoctor();
            loadDoctorData();
        } catch (error) { 
            alert('Error: ' + error.message); 
        }
    };
}