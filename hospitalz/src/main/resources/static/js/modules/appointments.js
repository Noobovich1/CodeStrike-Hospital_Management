import { api } from '../api.js';

const SPECIALTIES = ['Cardiology', 'Neurology', 'Surgery', 'Pediatrics', 'Orthopedics'];

const getStorageItem = (key) => localStorage.getItem(key) || sessionStorage.getItem(key);

export async function renderAppointments() {
    const container = document.createElement('div');
    const role = getStorageItem('role') || '';
    const isPatient = role === 'PATIENT';
    const isDoctor = role === 'DOCTOR';
    const isReceptionist = role === 'RECEPTIONIST' || role === 'ADMIN';

    container.innerHTML = `
        <div class="glass-panel" style="padding: 24px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 16px;">
                <h2 style="margin: 0;">Outpatient Appointments</h2>
                <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                    ${!isDoctor ? `
                        <button id="btn-book-appointment" class="btn btn-primary" style="padding: 8px 16px; background: var(--accent-primary); color: white; border: none; border-radius: 6px; cursor: pointer;">
                            <i class="fa-solid fa-calendar-plus"></i> Book Appointment
                        </button>
                    ` : ''}
                </div>
            </div>

            <!-- Appointments Table -->
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--border-color);">
                            <th style="padding: 12px;">ID</th>
                            <th style="padding: 12px;">Patient</th>
                            <th style="padding: 12px;">Specialty</th>
                            <th style="padding: 12px;">Assigned Doctor</th>
                            <th style="padding: 12px;">Date & Time</th>
                            <th style="padding: 12px;">Status</th>
                            <th style="padding: 12px;">Notes</th>
                            <th style="padding: 12px;">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="appointments-table-body">
                        <tr><td colspan="8" style="text-align: center; padding: 20px;">Loading appointments...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Book Appointment Pop-up Modal -->
        <div id="appointment-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
            <div class="glass-panel" style="background: var(--bg-primary); width: 90%; max-width: 550px; padding: 24px; max-height: 90vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
                    <h3 style="margin: 0;">Book Outpatient Appointment</h3>
                    <button id="close-appointment-modal" style="background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-primary);">&times;</button>
                </div>
                <form id="appointment-form">
                    <div style="display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 16px;">
                        
                        <!-- Patient Selection -->
                        ${isPatient ? `
                            <input type="hidden" id="appt-patient-id" value="${getStorageItem('patientId') || ''}">
                        ` : `
                            <div>
                                <label style="display: block; margin-bottom: 4px;">Patient *</label>
                                <input type="text" id="appt-patient-search" placeholder="Type patient name, ID or phone..." required
                                    style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); margin-bottom: 4px;">
                                <select id="appt-patient-id" required size="4"
                                    style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); display: none;">
                                </select>
                                <small id="appt-patient-hint" style="color: var(--text-secondary); font-size: 0.8em;">Type at least 2 characters to search</small>
                            </div>
                        `}

                        <!-- Specialty Selection -->
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Specialty *</label>
                            <select id="appt-specialty" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                                <option value="">Select Specialty</option>
                                ${SPECIALTIES.map(s => `<option value="${s}">${s}</option>`).join('')}
                            </select>
                        </div>



                        <!-- Date & Time Selection -->
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Appointment Date & Time *</label>
                            <input type="datetime-local" id="appt-datetime" required
                                style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>

                        <!-- Notes -->
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Notes</label>
                            <textarea id="appt-notes" rows="3" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);"></textarea>
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                        <button type="button" id="btn-cancel-appt" style="padding: 8px 16px; border: 1px solid var(--border-color); background: transparent; border-radius: 6px; cursor: pointer; color: var(--text-primary);">Cancel</button>
                        <button type="submit" style="padding: 8px 16px; background: var(--status-success); color: white; border: none; border-radius: 6px; cursor: pointer;">Book</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Assign Doctor Pop-up Modal -->
        <div id="assign-doctor-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
            <div class="glass-panel" style="background: var(--bg-primary); width: 90%; max-width: 450px; padding: 24px; max-height: 90vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
                    <h3 style="margin: 0;">Assign Doctor</h3>
                    <button id="close-assign-modal" style="background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-primary);">&times;</button>
                </div>
                <form id="assign-doctor-form">
                    <input type="hidden" id="assign-appt-id">
                    <div style="margin-bottom: 16px;">
                        <p><strong>Patient:</strong> <span id="assign-patient-name">-</span></p>
                        <p><strong>Specialty:</strong> <span id="assign-specialty">-</span></p>
                        <p><strong>Appointment Time:</strong> <span id="assign-time">-</span></p>
                    </div>
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 4px;">Select Doctor *</label>
                        <select id="assign-doctor-select" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                            <option value="">Loading doctors...</option>
                        </select>
                        <small style="color: var(--text-secondary); font-size: 0.85em;">Only active doctors of the matching specialty are listed.</small>
                    </div>
                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                        <button type="button" id="btn-cancel-assign" style="padding: 8px 16px; border: 1px solid var(--border-color); background: transparent; border-radius: 6px; cursor: pointer; color: var(--text-primary);">Cancel</button>
                        <button type="submit" style="padding: 8px 16px; background: var(--accent-primary); color: white; border: none; border-radius: 6px; cursor: pointer;">Assign</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    setTimeout(() => {
        loadAppointments(container, isPatient, isDoctor, isReceptionist);
        setupAppointmentsEvents(container, isPatient, isDoctor, isReceptionist);
    }, 0);

    return container;
}

async function loadAppointments(container, isPatient, isDoctor, isReceptionist) {
    const tbody = container.querySelector('#appointments-table-body');
    if (!tbody) return;

    try {
        let appts = [];
        if (isPatient) {
            const patientId = getStorageItem('patientId');
            if (patientId) {
                appts = await api.get(`/appointments/patient/${patientId}`);
            }
        } else if (isDoctor) {
            const doctorId = getStorageItem('doctorId');
            if (doctorId) {
                appts = await api.get(`/appointments/doctor/${doctorId}`);
            }
        } else {
            appts = await api.get('/appointments');
        }

        if (appts.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px;">No appointments found.</td></tr>';
            return;
        }

        tbody.innerHTML = appts.map(a => {
            const dateStr = new Date(a.appointmentDate).toLocaleString();
            let statusBadgeColor = 'var(--text-secondary)';
            if (a.status === 'PENDING') statusBadgeColor = 'var(--status-warning)';
            if (a.status === 'COMPLETED') statusBadgeColor = 'var(--status-success)';
            if (a.status === 'CANCELLED') statusBadgeColor = 'var(--status-danger)';

            return `
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 12px;">${a.id}</td>
                    <td style="padding: 12px; font-weight: 500;">
                        ${a.patient?.fullName || '-'} <span style="font-size:0.85em; color:var(--text-secondary);">(${a.patient?.patientId || '-'})</span>
                    </td>
                    <td style="padding: 12px;">${a.specialisation || '-'}</td>
                    <td style="padding: 12px; font-weight: ${a.doctor ? 'normal' : 'bold'}; color: ${a.doctor ? 'var(--text-primary)' : 'var(--status-warning)'};">
                        ${a.doctor?.fullName || '<i class="fa-solid fa-triangle-exclamation"></i> Unassigned'}
                    </td>
                    <td style="padding: 12px;">${dateStr}</td>
                    <td style="padding: 12px;">
                        <span style="color: ${statusBadgeColor}; font-weight: 600; text-transform: uppercase;">
                            ${a.status}
                        </span>
                    </td>
                    <td style="padding: 12px; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${a.notes || ''}">
                        ${a.notes || '-'}
                    </td>
                    <td style="padding: 12px;">
                        <div style="display: flex; gap: 6px;">
                            ${isReceptionist && a.status === 'PENDING' && !a.doctor ? `
                                <button class="btn btn-assign-appt" data-id="${a.id}" data-patient="${a.patient?.fullName}" data-specialty="${a.specialisation}" data-time="${dateStr}" style="padding: 4px 8px; background: var(--accent-primary); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85em;">
                                    <i class="fa-solid fa-user-doctor"></i> Assign
                                </button>
                            ` : ''}
                            ${(isReceptionist || isDoctor) && a.status === 'PENDING' && a.doctor ? `
                                <button class="btn btn-complete-appt" data-id="${a.id}" style="padding: 4px 8px; background: var(--status-success); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85em;">
                                    <i class="fa-solid fa-check"></i> Complete
                                </button>
                            ` : ''}
                            ${isReceptionist && a.status === 'COMPLETED' && !a.isBilled ? `
                                <button class="btn btn-generate-bill-appt" data-id="${a.id}" style="padding: 4px 8px; background: var(--accent-primary); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85em;">
                                    <i class="fa-solid fa-file-invoice-dollar"></i> Generate Bill
                                </button>
                            ` : ''}
                            ${isReceptionist && a.status === 'COMPLETED' && a.isBilled ? `
                                <span style="font-size: 0.85em; color: var(--text-secondary); font-weight: 500;">
                                    <i class="fa-solid fa-receipt"></i> Billed
                                </span>
                            ` : ''}
                            ${a.status === 'PENDING' ? `
                                <button class="btn btn-cancel-appt-action" data-id="${a.id}" style="padding: 4px 8px; background: var(--status-danger); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85em;">
                                    <i class="fa-solid fa-ban"></i> Cancel
                                </button>
                            ` : ''}
                            ${a.status === 'COMPLETED' && !isReceptionist ? `
                                <span style="font-size: 0.85em; color: var(--text-secondary); font-weight: 500;">
                                    Finished
                                </span>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // Attach events
        tbody.querySelectorAll('.btn-assign-appt').forEach(btn => {
            btn.onclick = () => {
                const modal = container.querySelector('#assign-doctor-modal');
                container.querySelector('#assign-appt-id').value = btn.dataset.id;
                container.querySelector('#assign-patient-name').textContent = btn.dataset.patient;
                container.querySelector('#assign-specialty').textContent = btn.dataset.specialty;
                container.querySelector('#assign-time').textContent = btn.dataset.time;
                loadDoctorsForAssignment(container, btn.dataset.specialty);
                modal.style.display = 'flex';
            };
        });

        tbody.querySelectorAll('.btn-complete-appt').forEach(btn => {
            btn.onclick = async () => {
                const id = btn.dataset.id;
                if (confirm('Mark appointment ID ' + id + ' as COMPLETED? This will freeze the visit and allow generating the bill.')) {
                    try {
                        await api.put(`/appointments/${id}/status?status=COMPLETED`);
                        alert('Appointment completed!');
                        loadAppointments(container, isPatient, isDoctor, isReceptionist);
                    } catch (error) {
                        alert('Error: ' + error.message);
                    }
                }
            };
        });

        tbody.querySelectorAll('.btn-generate-bill-appt').forEach(btn => {
            btn.onclick = async () => {
                const id = btn.dataset.id;
                if (confirm('Generate outpatient bill for appointment ID ' + id + '?')) {
                    try {
                        await api.post(`/bills/generate/outpatient/${id}`);
                        alert('Outpatient bill generated successfully!');
                        loadAppointments(container, isPatient, isDoctor, isReceptionist);
                    } catch (error) {
                        alert('Error: ' + error.message);
                    }
                }
            };
        });

        tbody.querySelectorAll('.btn-cancel-appt-action').forEach(btn => {
            btn.onclick = async () => {
                const id = btn.dataset.id;
                if (confirm('Cancel appointment ID ' + id + '?')) {
                    try {
                        await api.put(`/appointments/${id}/status?status=CANCELLED`);
                        alert('Appointment cancelled!');
                        loadAppointments(container, isPatient, isDoctor, isReceptionist);
                    } catch (error) {
                        alert('Error: ' + error.message);
                    }
                }
            };
        });

    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px; color: var(--status-danger);">Error loading appointments.</td></tr>';
    }
}

async function loadDoctorsForAssignment(container, specialty) {
    const select = container.querySelector('#assign-doctor-select');
    select.innerHTML = '<option value="">Loading doctors...</option>';

    try {
        const doctors = await api.get('/doctors/active');
        const filtered = doctors.filter(d => d.specialisation.toLowerCase() === specialty.toLowerCase());
        
        if (filtered.length === 0) {
            select.innerHTML = '<option value="">No doctors available for this specialty</option>';
            return;
        }

        select.innerHTML = '<option value="">Select Doctor</option>' + 
            filtered.map(d => `<option value="${d.doctorId}">${d.fullName} (Fee: $${d.consultationFee})</option>`).join('');
    } catch (e) {
        select.innerHTML = '<option value="">Error loading doctors</option>';
    }
}

async function setupAppointmentsEvents(container, isPatient, isDoctor, isReceptionist) {
    const modal = container.querySelector('#appointment-modal');
    const btnBook = container.querySelector('#btn-book-appointment');
    const btnClose = container.querySelector('#close-appointment-modal');
    const btnCancel = container.querySelector('#btn-cancel-appt');
    const form = container.querySelector('#appointment-form');

    let allPatients = [];

    if (btnBook) {
        btnBook.onclick = async () => {
            modal.style.display = 'flex';
            
            // Setup autocomplete for Receptionists
            if (!isPatient) {
                try {
                    allPatients = await api.get('/patients');
                } catch (e) {
                    console.error(e);
                }

                const searchInput = container.querySelector('#appt-patient-search');
                const patientSelect = container.querySelector('#appt-patient-id');
                const hint = container.querySelector('#appt-patient-hint');

                patientSelect.style.display = 'none';
                searchInput.value = '';
                hint.textContent = 'Type at least 2 characters to search';

                searchInput.oninput = () => {
                    const query = searchInput.value.toLowerCase().trim();
                    if (query.length < 2) {
                        patientSelect.style.display = 'none';
                        hint.textContent = 'Type at least 2 characters to search';
                        return;
                    }

                    const matches = allPatients.filter(p =>
                        p.fullName?.toLowerCase().includes(query) ||
                        p.patientId?.toLowerCase().includes(query) ||
                        p.phoneNumber?.includes(query)
                    );

                    if (matches.length === 0) {
                        patientSelect.style.display = 'none';
                        hint.textContent = `No patients matching "${searchInput.value}"`;
                        return;
                    }

                    patientSelect.innerHTML = matches.map(p =>
                        `<option value="${p.patientId}">${p.fullName} (${p.patientId})</option>`
                    ).join('');
                    patientSelect.style.display = 'block';
                    hint.textContent = `${matches.length} result(s) — click to select`;

                    if (matches.length === 1) {
                        patientSelect.selectedIndex = 0;
                        hint.textContent = `✓ Selected: ${matches[0].fullName} (${matches[0].patientId})`;
                    }
                };

                patientSelect.onchange = () => {
                    const selected = patientSelect.options[patientSelect.selectedIndex];
                    if (selected) {
                        hint.textContent = `✓ Selected: ${selected.text}`;
                        searchInput.value = selected.text;
                    }
                };
            }
        };
    }



    const closeModal = () => {
        modal.style.display = 'none';
        form.reset();
        if (!isPatient) {
            const searchInput = container.querySelector('#appt-patient-search');
            const patientSelect = container.querySelector('#appt-patient-id');
            const hint = container.querySelector('#appt-patient-hint');
            if (searchInput) searchInput.value = '';
            if (patientSelect) {
                patientSelect.style.display = 'none';
                patientSelect.innerHTML = '';
            }
            if (hint) hint.textContent = 'Type at least 2 characters to search';
        }
    };

    if (btnClose) btnClose.onclick = closeModal;
    if (btnCancel) btnCancel.onclick = closeModal;

    form.onsubmit = async (e) => {
        e.preventDefault();

        const patientIdSelect = container.querySelector('#appt-patient-id');
        let patientId = '';
        if (isPatient) {
            patientId = patientIdSelect.value;
        } else {
            patientId = patientIdSelect.value;
            if (!patientId) {
                alert('Please search and select a patient first.');
                container.querySelector('#appt-patient-search').focus();
                return;
            }
        }

        const spec = container.querySelector('#appt-specialty').value;
        const apptDate = container.querySelector('#appt-datetime').value;
        const notes = container.querySelector('#appt-notes').value;

        if (!spec) {
            alert('Please select a specialty.');
            return;
        }

        if (!apptDate) {
            alert('Please select a date and time.');
            return;
        }

        const payload = {
            patientId,
            specialisation: spec,
            appointmentDate: apptDate,
            notes
        };

        try {
            await api.post('/appointments', payload);
            alert('Appointment booked successfully!');
            closeModal();
            loadAppointments(container, isPatient, isDoctor, isReceptionist);
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    // Assign Doctor Modal Handlers
    const assignModal = container.querySelector('#assign-doctor-modal');
    const closeAssignBtn = container.querySelector('#close-assign-modal');
    const cancelAssignBtn = container.querySelector('#btn-cancel-assign');
    const assignForm = container.querySelector('#assign-doctor-form');

    const closeAssignModal = () => {
        assignModal.style.display = 'none';
        assignForm.reset();
    };

    if (closeAssignBtn) closeAssignBtn.onclick = closeAssignModal;
    if (cancelAssignBtn) cancelAssignBtn.onclick = closeAssignModal;

    if (assignForm) {
        assignForm.onsubmit = async (e) => {
            e.preventDefault();
            const id = container.querySelector('#assign-appt-id').value;
            const doctorId = container.querySelector('#assign-doctor-select').value;

            if (!doctorId) {
                alert('Please select a doctor.');
                return;
            }

            try {
                // Call PUT /api/v1/appointments/{id}/assign?doctorId=...
                const response = await fetch(`/api/v1/appointments/${id}/assign?doctorId=${doctorId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': 'Bearer ' + getStorageItem('token'),
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const err = await response.json().catch(() => ({}));
                    throw new Error(err.message || 'Scheduling conflict or validation error');
                }

                alert('Doctor assigned successfully!');
                closeAssignModal();
                loadAppointments(container, isPatient, isDoctor, isReceptionist);
            } catch (error) {
                alert('Error: ' + error.message);
            }
        };
    }
}
