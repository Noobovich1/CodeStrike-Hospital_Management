import { api } from '../api.js';

export async function renderActiveAdmissions() {
    const container = document.createElement('div');
    
    container.innerHTML = `
        <div class="glass-panel" style="padding: 24px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 16px;">
                <h2 style="margin: 0;">Admissions & Assignments</h2>
                <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                    <button id="btn-tab-active" class="btn active-tab" style="padding: 8px 16px; border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer; background: var(--bg-secondary); color: var(--text-primary);">Active Admissions</button>
                    <button id="btn-tab-history" class="btn" style="padding: 8px 16px; border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer; background: transparent; color: var(--text-primary);">Admission History</button>
                    <button id="btn-admit-patient" class="btn btn-primary" style="padding: 8px 16px; background: var(--accent-primary); color: white; border: none; border-radius: 6px; cursor: pointer;">
                        <i class="fa-solid fa-bed-pulse"></i> Admit Patient
                    </button>
                    <button id="btn-assign-doctor" class="btn" style="padding: 8px 16px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer; color: var(--text-primary);">
                        <i class="fa-solid fa-user-doctor"></i> Assign Doctor
                    </button>
                </div>
            </div>

            <div id="section-active-admissions">
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

            <div id="section-history-admissions" style="display: none;">
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; text-align: left;">
                        <thead>
                            <tr style="border-bottom: 2px solid var(--border-color);">
                                <th style="padding: 12px;">Admiss. ID</th>
                                <th style="padding: 12px;">Patient</th>
                                <th style="padding: 12px;">Room</th>
                                <th style="padding: 12px;">Admission Date</th>
                                <th style="padding: 12px;">Discharge Date</th>
                                <th style="padding: 12px;">Status</th>
                                <th style="padding: 12px;">Total Days</th>
                            </tr>
                        </thead>
                        <tbody id="history-table-body">
                            <tr><td colspan="7" style="text-align: center; padding: 20px;">Loading history...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Admit Modal -->
        <div id="admit-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
            <div class="glass-panel" style="background: var(--bg-primary); width: 90%; max-width: 600px; padding: 24px; max-height: 90vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
                    <h3 style="margin: 0;">Admit Patient</h3>
                    <button id="close-admit-modal" style="background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-primary);">&times;</button>
                </div>
                <form id="admit-form">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Patient ID *</label>
                            <input type="text" id="admit-patient-id" required placeholder="e.g. PAT-2024-0001"
                                style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Room *</label>
                            <select id="admit-room-select" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                                <option value="">Loading available rooms...</option>
                            </select>
                        </div>
                        <div style="grid-column: span 2;">
                            <label style="display: block; margin-bottom: 4px;">Notes</label>
                            <input type="text" id="admit-notes" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                        <button type="button" id="btn-cancel-admit" style="padding: 8px 16px; border: 1px solid var(--border-color); background: transparent; border-radius: 6px; cursor: pointer; color: var(--text-primary);">Cancel</button>
                        <button type="submit" style="padding: 8px 16px; background: var(--status-success); color: white; border: none; border-radius: 6px; cursor: pointer;">Admit</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Assign Doctor Modal -->
        <div id="assign-doc-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
            <div class="glass-panel" style="background: var(--bg-primary); width: 90%; max-width: 600px; padding: 24px; max-height: 90vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
                    <h3 style="margin: 0;">Assign Doctor to Patient</h3>
                    <button id="close-assign-doc-modal" style="background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-primary);">&times;</button>
                </div>
                <form id="assign-doc-form">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Patient *</label>
                            <input type="text" id="assign-patient-search" placeholder="Type name, ID or phone..."
                                style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); margin-bottom: 4px;">
                            <select id="assign-patient-id" required size="4"
                                style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); display: none;">
                            </select>
                            <small id="assign-patient-hint" style="color: var(--text-secondary); font-size: 0.8em;">Type at least 2 characters to search admitted patients</small>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Doctor *</label>
                            <select id="assign-doc-id" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                                <option value="">Loading doctors...</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Primary Doctor?</label>
                            <select id="assign-primary" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Notes</label>
                            <input type="text" id="assign-notes" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>
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
        loadActiveAdmissions();
        loadHistoryAdmissions();
        setupAdmissionsEvents(container);
        loadAvailableRooms();
    }, 0);

    return container;
}

async function loadAvailableRooms() {
    const select = document.getElementById('admit-room-select');
    if (!select) return;
    try {
        const availableRooms = await api.get('/rooms/available');
        if (availableRooms.length === 0) {
            select.innerHTML = '<option value="">No available rooms found</option>';
            return;
        }
        select.innerHTML = '<option value="">Select an available room</option>' +
            availableRooms.map(r =>
                `<option value="${r.roomId}">Room ${r.roomNumber} - ${r.roomType} (${r.currentOccupancy}/${r.capacity}, $${r.dailyRate}/day)</option>`
            ).join('');
    } catch (error) {
        select.innerHTML = '<option value="">Error loading available rooms</option>';
    }
}

async function loadActiveAdmissions() {
    const tbody = document.getElementById('admissions-table-body');
    if (!tbody) return;
    try {
        const admissions = await api.get('/admissions/active');
        if (admissions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">No active admissions.</td></tr>';
            return;
        }
        tbody.innerHTML = admissions.map(a => `
            <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 12px;">${a.admissionId}</td>
                <td style="padding: 12px; font-weight: 500;">${a.patient?.fullName || '-'} <span style="font-size:0.85em; color:var(--text-secondary);">(${a.patient?.patientId || '-'})</span></td>
                <td style="padding: 12px;">Room ${a.room?.roomNumber || '-'}</td>
                <td style="padding: 12px;">${new Date(a.admissionDate).toLocaleString()}</td>
                <td style="padding: 12px;"><span style="color: var(--status-success); font-weight: 600;"><i class="fa-solid fa-bed"></i> ${a.status}</span></td>
                <td style="padding: 12px;">
                    <button class="btn btn-discharge" data-id="${a.admissionId}" style="padding: 6px 12px; background: var(--status-danger); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85em;">Discharge</button>
                </td>
            </tr>
        `).join('');

        document.querySelectorAll('.btn-discharge').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                if (confirm('Discharge admission ID ' + id + '?')) {
                    try {
                        await api.put(`/admissions/${id}/discharge`);
                        alert('Patient discharged successfully!');
                        loadActiveAdmissions();
                        loadHistoryAdmissions();
                        loadAvailableRooms();
                    } catch (error) {
                        alert('Error discharging: ' + error.message);
                    }
                }
            });
        });
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px; color: var(--status-danger);">Error loading data.</td></tr>';
    }
}

async function loadHistoryAdmissions() {
    const tbody = document.getElementById('history-table-body');
    if (!tbody) return;
    try {
        const admissions = await api.get('/admissions');
        if (admissions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No admissions history.</td></tr>';
            return;
        }
        tbody.innerHTML = admissions.map(a => {
            const dischargeText = a.dischargeDate ? new Date(a.dischargeDate).toLocaleString() : '-';
            const statusColor = a.status === 'ACTIVE' ? 'var(--status-success)' : 'var(--text-secondary)';
            return `
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 12px;">${a.admissionId}</td>
                    <td style="padding: 12px; font-weight: 500;">${a.patient?.fullName || '-'} <span style="font-size:0.85em; color:var(--text-secondary);">(${a.patient?.patientId || '-'})</span></td>
                    <td style="padding: 12px;">Room ${a.room?.roomNumber || '-'}</td>
                    <td style="padding: 12px;">${new Date(a.admissionDate).toLocaleString()}</td>
                    <td style="padding: 12px;">${dischargeText}</td>
                    <td style="padding: 12px;"><span style="color: ${statusColor}; font-weight: 600;">${a.status}</span></td>
                    <td style="padding: 12px;">${a.totalDays ?? '-'}</td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px; color: var(--status-danger);">Error loading history.</td></tr>';
    }
}

function setupAdmissionsEvents(container) {

    let allPatients = [];

    const btnActiveTab = container.querySelector('#btn-tab-active');
    const btnHistoryTab = container.querySelector('#btn-tab-history');
    const sectionActive = container.querySelector('#section-active-admissions');
    const sectionHistory = container.querySelector('#section-history-admissions');

    const btnAdmit = container.querySelector('#btn-admit-patient');
    const modalAdmit = container.querySelector('#admit-modal');
    const btnCloseAdmit = container.querySelector('#close-admit-modal');
    const btnCancelAdmit = container.querySelector('#btn-cancel-admit');

    const btnAssign = container.querySelector('#btn-assign-doctor');
    const modalAssign = container.querySelector('#assign-doc-modal');
    const btnCloseAssign = container.querySelector('#close-assign-doc-modal');
    const btnCancelAssign = container.querySelector('#btn-cancel-assign');

    btnActiveTab.addEventListener('click', () => {
        sectionActive.style.display = 'block';
        sectionHistory.style.display = 'none';
        btnActiveTab.style.background = 'var(--bg-secondary)';
        btnHistoryTab.style.background = 'transparent';
    });

    btnHistoryTab.addEventListener('click', () => {
        sectionActive.style.display = 'none';
        sectionHistory.style.display = 'block';
        btnHistoryTab.style.background = 'var(--bg-secondary)';
        btnActiveTab.style.background = 'transparent';
        loadHistoryAdmissions();
    });

    btnAdmit.onclick = () => {
        modalAdmit.style.display = 'flex';
        loadAvailableRooms();
    };

    const closeAdmit = () => {
        modalAdmit.style.display = 'none';
        container.querySelector('#admit-form').reset();
    };
    btnCancelAdmit.onclick = closeAdmit;
    btnCloseAdmit.onclick = closeAdmit;

    const closeAssign = () => {
        modalAssign.style.display = 'none';
        container.querySelector('#assign-doc-form').reset();
        container.querySelector('#assign-patient-search').value = '';
        container.querySelector('#assign-patient-id').style.display = 'none';
        container.querySelector('#assign-patient-hint').textContent = 'Type at least 2 characters to search admitted patients';
    };
    btnCancelAssign.onclick = closeAssign;
    btnCloseAssign.onclick = closeAssign;

    btnAssign.onclick = async () => {
        modalAssign.style.display = 'flex';

        // Load doctors
        try {
            const doctors = await api.get('/doctors/active');
            const doctorSelect = container.querySelector('#assign-doc-id');
            doctorSelect.innerHTML = '<option value="">Select doctor</option>' +
                doctors.map(d =>
                    `<option value="${d.doctorId}">${d.fullName} - ${d.specialisation}</option>`
                ).join('');
        } catch (e) {
            container.querySelector('#assign-doc-id').innerHTML = '<option value="">Error loading doctors</option>';
        }

        // Pre-load patients
        try {
            allPatients = await api.get('/patients');
        } catch (e) {
            console.error('Failed to preload patients', e);
        }

        const searchInput = container.querySelector('#assign-patient-search');
        const patientSelect = container.querySelector('#assign-patient-id');
        const hint = container.querySelector('#assign-patient-hint');
        const selectedDisplay = container.querySelector('#assign-patient-selected');

        // Reset state
        patientSelect.style.display = 'none';
        patientSelect.removeAttribute('required');
        searchInput.value = '';
        hint.textContent = 'Type at least 2 characters to search admitted patients';

        searchInput.oninput = () => {
            const query = searchInput.value.toLowerCase().trim();

            if (query.length < 2) {
                patientSelect.style.display = 'none';
                hint.textContent = 'Type at least 2 characters to search admitted patients';
                return;
            }

            const matches = allPatients.filter(p =>
                p.status?.toUpperCase() === 'ADMITTED' &&
                (
                    p.fullName?.toLowerCase().includes(query) ||
                    p.patientId?.toLowerCase().includes(query) ||
                    p.phoneNumber?.includes(query)
                )
            );

            if (matches.length === 0) {
                patientSelect.style.display = 'none';
                hint.textContent = `No admitted patients matching "${searchInput.value}"`;
                return;
            }

            // Rebuild options
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

        // When user clicks an option — show confirmation
        patientSelect.onchange = () => {
            const selected = patientSelect.options[patientSelect.selectedIndex];
            if (selected && selected.value) {
                hint.textContent = `✓ Selected: ${selected.text}`;
                searchInput.value = selected.text; // fill search box with selected name
            }
        };
    };

    // Admit form submit
    container.querySelector('#admit-form').onsubmit = async (e) => {
        e.preventDefault();
        const payload = {
            patientId: container.querySelector('#admit-patient-id').value,
            roomId: parseInt(container.querySelector('#admit-room-select').value, 10),
            notes: container.querySelector('#admit-notes').value
        };
        try {
            await api.post('/admissions', payload);
            alert('Patient admitted!');
            closeAdmit();
            loadActiveAdmissions();
            loadHistoryAdmissions();
            loadAvailableRooms();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    // Assign doctor form submit
    container.querySelector('#assign-doc-form').onsubmit = async (e) => {
        e.preventDefault();

        const patientSelect = container.querySelector('#assign-patient-id');
        const patientId = patientSelect.value;

        if (!patientId) {
            alert('Please search and select an admitted patient first.');
            container.querySelector('#assign-patient-search').focus();
            return;
        }

        const doctorId = container.querySelector('#assign-doc-id').value;
        if (!doctorId) {
            alert('Please select a doctor.');
            return;
        }

        const payload = {
            patientId: patientId,
            doctorId: doctorId,
            isPrimary: container.querySelector('#assign-primary').value === 'true',
            notes: container.querySelector('#assign-notes').value
        };

        try {
            await api.post('/doctor-patient', payload);
            alert('Doctor assigned to patient!');
            closeAssign();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };
}