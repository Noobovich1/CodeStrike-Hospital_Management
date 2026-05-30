import { api } from '../api.js';

const getStorageItem = (key) => localStorage.getItem(key) || sessionStorage.getItem(key);

export async function renderActiveAdmissions() {
    const container = document.createElement('div');
    const role = getStorageItem('role') || '';
    const isNurse = role === 'NURSE';
    const isWardBoy = role === 'WARD_BOY';
    const isReceptionist = role === 'RECEPTIONIST' || role === 'ADMIN';

    container.innerHTML = `
        <div class="glass-panel" style="padding: 24px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 16px;">
                <h2 style="margin: 0;">${isWardBoy ? 'Room Assignments' : (isNurse ? 'Inpatient Management' : 'Admission & Bed Assignment')}</h2>

                <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                    ${isReceptionist ? `
                        <button id="btn-tab-active" class="btn active-tab" style="padding: 8px 16px; border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer; background: var(--bg-secondary); color: var(--text-primary);">Active Treatments</button>
                        <button id="btn-tab-history" class="btn" style="padding: 8px 16px; border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer; background: transparent; color: var(--text-primary);">Admission History</button>
                        <button id="btn-admit-patient" class="btn btn-primary" style="padding: 8px 16px; background: var(--accent-primary); color: white; border: none; border-radius: 6px; cursor: pointer;">
                            <i class="fa-solid fa-bed-pulse"></i> Admit Patient
                        </button>
                        <button id="btn-assign-doctor" class="btn" style="padding: 8px 16px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer; color: var(--text-primary);">
                            <i class="fa-solid fa-user-doctor"></i> Assign Doctor
                        </button>
                    ` : `
                        <button id="btn-tab-active" class="btn active-tab" style="padding: 8px 16px; border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer; background: var(--bg-secondary); color: var(--text-primary); display: none;">Active Treatments</button>
                    `}
                    ${!isWardBoy ? `
                        <button id="btn-request-transport" class="btn" style="padding: 8px 16px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer; color: var(--text-primary);">
                            <i class="fa-solid fa-truck-medical"></i> Request Transport
                        </button>
                    ` : ''}
                </div>
            </div>

            <!-- Active Admissions Table -->
            <div id="section-active-admissions">
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; text-align: left;">
                        <thead>
                            <tr style="border-bottom: 2px solid var(--border-color);">
                                <th style="padding: 12px;">Admission ID</th>
                                <th style="padding: 12px;">Patient</th>
                                <th style="padding: 12px;">Room</th>
                                <th style="padding: 12px;">Admission Date</th>
                                <th style="padding: 12px;">Status</th>
                                ${!isWardBoy ? `<th style="padding: 12px;">Actions</th>` : ''}
                            </tr>
                        </thead>
                        <tbody id="admissions-table-body">
                            <tr><td colspan="6" style="text-align: center; padding: 20px;">Loading list...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Admission History Table (Hidden for Nurse and Ward Boy) -->
            ${isReceptionist ? `
                <div id="section-history-admissions" style="display: none;">
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; text-align: left;">
                            <thead>
                                <tr style="border-bottom: 2px solid var(--border-color);">
                                    <th style="padding: 12px;">Admission ID</th>
                                    <th style="padding: 12px;">Patient</th>
                                    <th style="padding: 12px;">Room</th>
                                    <th style="padding: 12px;">Admission Date</th>
                                    <th style="padding: 12px;">Discharge Date</th>
                                    <th style="padding: 12px;">Status</th>
                                    <th style="padding: 12px;">Length of Stay (Days)</th>
                                </tr>
                            </thead>
                            <tbody id="history-table-body">
                                <tr><td colspan="7" style="text-align: center; padding: 20px;">Loading history...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            ` : ''}
        </div>

        <!-- Admit Modal (Receptionist only) -->
        ${isReceptionist ? `
            <div id="admit-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
                <div class="glass-panel" style="background: var(--bg-primary); width: 90%; max-width: 600px; padding: 24px; max-height: 90vh; overflow-y: auto;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
                        <h3 style="margin: 0;">Admit Patient</h3>
                        <button id="close-admit-modal" style="background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-primary);">&times;</button>
                    </div>
                    <form id="admit-form">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                            <div>
                                <label style="display: block; margin-bottom: 4px;">Search Patient *</label>
                                <input type="text" id="admit-patient-search" placeholder="Type name, ID or phone..." required
                                    style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); margin-bottom: 4px; outline: none;">
                                <select id="admit-patient-id" size="4"
                                    style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); display: none; outline: none;">
                                </select>
                                <small id="admit-patient-hint" style="color: var(--text-secondary); font-size: 0.8em;">Type at least 2 characters to search</small>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 4px;">Select Room *</label>
                                <select id="admit-room-select" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                                    <option value="">Loading rooms...</option>
                                </select>
                            </div>
                            <div style="grid-column: span 2;">
                                <label style="display: block; margin-bottom: 4px;">Admission Notes</label>
                                <input type="text" id="admit-notes" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                            </div>
                        </div>
                        <div style="display: flex; gap: 12px; justify-content: flex-end;">
                            <button type="button" id="btn-cancel-admit" style="padding: 8px 16px; border: 1px solid var(--border-color); background: transparent; border-radius: 6px; cursor: pointer; color: var(--text-primary);">Cancel</button>
                            <button type="submit" style="padding: 8px 16px; background: var(--status-success); color: white; border: none; border-radius: 6px; cursor: pointer;">Confirm Admission</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Assign Doctor Modal -->
            <div id="assign-doc-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
                <div class="glass-panel" style="background: var(--bg-primary); width: 90%; max-width: 600px; padding: 24px; max-height: 90vh; overflow-y: auto;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
                        <h3 style="margin: 0;">Assign Attending Doctor</h3>
                        <button id="close-assign-doc-modal" style="background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-primary);">&times;</button>
                    </div>
                    <form id="assign-doc-form">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                            <div>
                                <label style="display: block; margin-bottom: 4px;">Search Inpatient *</label>
                                <input type="text" id="assign-patient-search" placeholder="Enter name/phone/ID..."
                                    style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); margin-bottom: 4px;">
                                <select id="assign-patient-id" required size="4"
                                    style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); display: none;">
                                </select>
                                <small id="assign-patient-hint" style="color: var(--text-secondary); font-size: 0.8em;">Enter at least 2 characters to search</small>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 4px;">Attending Doctor *</label>
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
                                <label style="display: block; margin-bottom: 4px;">Assignment Notes</label>
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
        ` : ''}

        <!-- Nurse Record Vitals Modal -->
        <div id="vitals-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
            <div class="glass-panel" style="background: var(--bg-primary); width: 90%; max-width: 450px; padding: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
                    <h3 style="margin: 0;"><i class="fa-solid fa-heart-pulse" style="color: var(--status-danger);"></i> Record Vitals</h3>
                    <button id="close-vitals-modal" style="background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-primary);">&times;</button>
                </div>
                <form id="vitals-form">
                    <input type="hidden" id="vitals-patient-id">
                    <div style="margin-bottom: 12px;">
                        <p><strong>Patient:</strong> <span id="vitals-patient-name">-</span></p>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                        <div>
                            <label style="display: block; font-size: 0.85em; margin-bottom: 4px;">Blood Pressure (mmHg)</label>
                            <input type="text" id="vitals-bp" placeholder="e.g. 120/80" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.85em; margin-bottom: 4px;">Temperature (°C)</label>
                            <input type="number" id="vitals-temp" step="0.1" placeholder="e.g. 37.0" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.85em; margin-bottom: 4px;">Pulse (bpm)</label>
                            <input type="number" id="vitals-pulse" placeholder="e.g. 80" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.85em; margin-bottom: 4px;">Oxygen Level (SpO2 %)</label>
                            <input type="number" id="vitals-oxygen" placeholder="e.g. 98" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                        <button type="button" id="btn-cancel-vitals" style="padding: 8px 16px; border: 1px solid var(--border-color); background: transparent; border-radius: 6px; cursor: pointer; color: var(--text-primary);">Cancel</button>
                        <button type="submit" style="padding: 8px 16px; background: var(--status-success); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Save Vitals</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Nurse Administer Treatments Modal -->
        <div id="treatments-checklist-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
            <div class="glass-panel" style="background: var(--bg-primary); width: 90%; max-width: 750px; padding: 24px; max-height: 80vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
                    <h3 style="margin: 0;"><i class="fa-solid fa-prescription-bottle-medical" style="color: var(--accent-primary);"></i> Execute Treatment Orders</h3>
                    <button id="close-checklist-modal" style="background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-primary);">&times;</button>
                </div>
                <div style="margin-bottom: 16px;">
                    <p><strong>Patient:</strong> <span id="checklist-patient-name">-</span></p>
                </div>
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9em;">
                        <thead>
                            <tr style="border-bottom: 1px solid var(--border-color); color: var(--text-secondary);">
                                <th style="padding: 8px;">Service / Medication</th>
                                <th style="padding: 8px;">Quantity</th>
                                <th style="padding: 8px;">Prescribed By</th>
                                <th style="padding: 8px;">Prescription Date</th>
                                <th style="padding: 8px;">Notes / Status</th>
                                <th style="padding: 8px;">Action</th>
                            </tr>
                        </thead>
                        <tbody id="checklist-table-body">
                            <tr><td colspan="6" style="text-align: center; padding: 10px;">Loading...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Transport Modal (Nurses/Receptionists/Admins) -->
        ${!isWardBoy ? `
            <div id="transport-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
                <div class="glass-panel" style="background: var(--bg-primary); width: 90%; max-width: 600px; padding: 24px; max-height: 90vh; overflow-y: auto;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
                        <h3 style="margin: 0;"><i class="fa-solid fa-truck-medical"></i> Request Patient Transport</h3>
                        <button id="close-transport-modal" style="background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-primary);">&times;</button>
                    </div>
                    <form id="transport-form">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                            <div>
                                <label style="display: block; margin-bottom: 4px;">Search Admitted Patient *</label>
                                <input type="text" id="transport-patient-search" placeholder="Type name, ID or phone..." required
                                    style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); margin-bottom: 4px; outline: none;">
                                <select id="transport-patient-id" size="4" required
                                    style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); display: none; outline: none;">
                                </select>
                                <small id="transport-patient-hint" style="color: var(--text-secondary); font-size: 0.8em;">Type at least 2 characters to search</small>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 4px;">Destination Room *</label>
                                <select id="transport-room-select" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                                    <option value="">Loading rooms...</option>
                                </select>
                            </div>
                            <div style="grid-column: span 2;">
                                <label style="display: block; margin-bottom: 4px;">Transport Notes / Instructions</label>
                                <input type="text" id="transport-notes" placeholder="e.g. Move to ICU for post-op monitoring, wheelchair needed" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                            </div>
                        </div>
                        <div style="display: flex; gap: 12px; justify-content: flex-end;">
                            <button type="button" id="btn-cancel-transport" style="padding: 8px 16px; border: 1px solid var(--border-color); background: transparent; border-radius: 6px; cursor: pointer; color: var(--text-primary);">Cancel</button>
                            <button type="submit" style="padding: 8px 16px; background: var(--accent-primary); color: white; border: none; border-radius: 6px; cursor: pointer;">Submit Request</button>
                        </div>
                    </form>
                </div>
            </div>
        ` : ''}
    `;

    // Load data and set up events
    setTimeout(() => {
        loadActiveAdmissions(container, isNurse);
        if (isReceptionist) {
            loadHistoryAdmissions(container);
            loadAvailableRooms(container);
        }
        setupAdmissionsEvents(container, isNurse);
    }, 0);

    return container;
}

async function loadAvailableRooms(container) {
    const select = container.querySelector('#admit-room-select');
    if (!select) return;
    try {
        const availableRooms = await api.get('/rooms/available');
        if (availableRooms.length === 0) {
            select.innerHTML = '<option value="">No vacant rooms found</option>';
            return;
        }
        select.innerHTML = '<option value="">Select vacant room...</option>' +
            availableRooms.map(r =>
                `<option value="${r.roomId}">Room ${r.roomNumber} - ${r.roomType} (${r.currentOccupancy}/${r.capacity}, $${r.dailyRate}/day)</option>`
            ).join('');
    } catch (error) {
        select.innerHTML = '<option value="">Error loading vacant rooms</option>';
    }
}

async function loadAllRoomsForTransport(container) {
    const select = container.querySelector('#transport-room-select');
    if (!select) return;
    try {
        const rooms = await api.get('/rooms');
        select.innerHTML = '<option value="">Select destination room...</option>' +
            rooms.map(r =>
                `<option value="${r.roomId}">Room ${r.roomNumber} - ${r.roomType} (${r.notes || ''})</option>`
            ).join('');
    } catch (error) {
        select.innerHTML = '<option value="">Error loading rooms</option>';
    }
}

async function loadActiveAdmissions(container, isNurse) {
    const tbody = container.querySelector('#admissions-table-body');
    if (!tbody) return;
    try {
        const role = getStorageItem('role') || '';
        const isWardBoy = role === 'WARD_BOY';
        const isReceptionist = role === 'RECEPTIONIST' || role === 'ADMIN';
        const admissions = await api.get('/admissions/active');
        
        let filtered = admissions;

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="${isWardBoy ? 5 : 6}" style="text-align: center; padding: 20px; color: var(--text-secondary);">No active inpatient admissions.</td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(a => {
            let actionsHTML = '';
            if (isNurse) {
                actionsHTML = `
                    <button class="btn btn-record-vitals" data-id="${a.patient?.patientId}" data-name="${a.patient?.fullName}" style="padding: 6px 12px; background: var(--status-success); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85em; margin-right: 6px;">
                        <i class="fa-solid fa-heart-pulse"></i> Record Vitals
                    </button>
                    <button class="btn btn-administer-treatments" data-id="${a.patient?.patientId}" data-name="${a.patient?.fullName}" style="padding: 6px 12px; background: var(--accent-primary); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85em;">
                        <i class="fa-solid fa-pills"></i> Execute Orders
                    </button>
                `;
            } else if (!isWardBoy) {
                actionsHTML = `
                    <button class="btn btn-discharge" data-id="${a.admissionId}" style="padding: 6px 12px; background: var(--status-danger); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85em;">
                        Discharge & Bill
                    </button>
                `;
            }

            return `
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 12px;">${a.admissionId}</td>
                    <td style="padding: 12px; font-weight: 500;">
                        ${a.patient?.fullName || '-'} <span style="font-size:0.85em; color:var(--text-secondary);">(${a.patient?.patientId || '-'})</span>
                    </td>
                    <td style="padding: 12px;">Room ${a.room?.roomNumber || '-'} (${a.room?.notes || '-'})</td>
                    <td style="padding: 12px;">${new Date(a.admissionDate).toLocaleString('en-US')}</td>
                    <td style="padding: 12px;"><span style="color: var(--status-success); font-weight: 600;"><i class="fa-solid fa-bed"></i> ${a.status}</span></td>
                    ${!isWardBoy ? `<td style="padding: 12px;">${actionsHTML}</td>` : ''}
                </tr>
            `;
        }).join('');

        // Bind discharge action
        if (!isNurse && !isWardBoy) {
            container.querySelectorAll('.btn-discharge').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const id = btn.dataset.id;
                    if (confirm('Discharge patient with admission ID ' + id + '? The bill will be generated automatically.')) {
                        try {
                            await api.put(`/admissions/${id}/discharge`);
                            showToast('Patient discharged successfully!', 'success');
                            loadActiveAdmissions(container, isNurse);
                            if (isReceptionist) {
                                loadHistoryAdmissions(container);
                                loadAvailableRooms(container);
                            }
                        } catch (error) {
                            showToast('Discharge error: ' + error.message, 'error');
                        }
                    }
                });
            });
        } else if (isNurse) {
            // Bind Nurse actions
            container.querySelectorAll('.btn-record-vitals').forEach(btn => {
                btn.onclick = () => {
                    const modal = container.querySelector('#vitals-modal');
                    container.querySelector('#vitals-patient-id').value = btn.dataset.id;
                    container.querySelector('#vitals-patient-name').textContent = btn.dataset.name;
                    modal.style.display = 'flex';
                };
            });

            container.querySelectorAll('.btn-administer-treatments').forEach(btn => {
                btn.onclick = () => {
                    const modal = container.querySelector('#treatments-checklist-modal');
                    container.querySelector('#checklist-patient-name').textContent = btn.dataset.name;
                    loadPatientChecklist(container, btn.dataset.id);
                    modal.style.display = 'flex';
                };
            });
        }

    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="${isWardBoy ? 5 : 6}" style="text-align: center; padding: 20px; color: var(--status-danger);">Error loading inpatient data.</td></tr>`;
    }
}

async function loadPatientChecklist(container, patientId) {
    const listBody = container.querySelector('#checklist-table-body');
    listBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 10px;">Loading orders list...</td></tr>';
    try {
        const records = await api.get(`/treatment-records/patient/${patientId}`);
        if (!records || records.length === 0) {
            listBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 10px; color: var(--text-secondary);">No medical orders from doctors.</td></tr>';
            return;
        }

        listBody.innerHTML = records.map(r => {
            const isDone = (r.notes || '').includes('[Executed');
            const statusLabel = isDone 
                ? '<span style="color: var(--status-success); font-weight: 600;"><i class="fa-solid fa-circle-check"></i> Executed</span>' 
                : '<span style="color: var(--status-warning); font-weight: 600;"><i class="fa-solid fa-clock"></i> Pending</span>';
            
            const actionBtn = isDone 
                ? '<button disabled style="padding: 4px 8px; opacity: 0.5; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-secondary); cursor: not-allowed;">Completed</button>'
                : `<button class="btn btn-done-treatment" data-id="${r.id}" data-notes="${r.notes || ''}" data-patient="${patientId}" style="padding: 4px 8px; background: var(--status-success); color: white; border: none; border-radius: 4px; cursor: pointer;">Execute</button>`;

            const displayNotes = (r.notes || '')
                .replace(/\|?\s*\[Executed[^\]]*\]/g, '')
                .trim();

            return `
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 8px; font-weight: 500;">${r.treatment?.name}</td>
                    <td style="padding: 8px;">${r.quantity}</td>
                    <td style="padding: 8px;">${r.doctor?.fullName || '-'}</td>
                    <td style="padding: 8px;">${r.sessionDate ? new Date(r.sessionDate).toLocaleDateString('en-US') : '-'}</td>
                    <td style="padding: 8px; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${displayNotes || ''}">
                        ${statusLabel} ${displayNotes ? `<span style="font-size: 0.85em; color: var(--text-secondary);">${displayNotes}</span>` : ''}
                    </td>
                    <td style="padding: 8px;">${actionBtn}</td>
                </tr>
            `;
        }).join('');

        // Bind treatment order execute actions
        listBody.querySelectorAll('.btn-done-treatment').forEach(btn => {
            btn.onclick = async () => {
                const id = btn.dataset.id;
                const prevNotes = btn.dataset.notes;
                const nurseName = getStorageItem('username') || 'Nurse';
                const today = new Date().toLocaleDateString('en-US');
                const updatedNotes = `${prevNotes ? prevNotes + ' | ' : ''}[Executed by ${nurseName} on ${today}]`;

                if (confirm('Confirm this treatment order has been administered?')) {
                    try {
                        await api.put(`/treatment-records/${id}/notes`, { notes: updatedNotes });
                        showToast('Treatment order status updated successfully!', 'success');
                        loadPatientChecklist(container, btn.dataset.patient);
                    } catch (err) {
                        showToast('Update error: ' + err.message, 'error');
                    }
                }
            };
        });

    } catch (err) {
        listBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 10px; color: var(--status-danger);">Error loading orders.</td></tr>';
    }
}

async function loadHistoryAdmissions(container) {
    const tbody = container.querySelector('#history-table-body');
    if (!tbody) return;
    try {
        const admissions = await api.get('/admissions');
        if (admissions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px; color: var(--text-secondary);">No admission history found.</td></tr>';
            return;
        }
        tbody.innerHTML = admissions.map(a => {
            const dischargeText = a.dischargeDate ? new Date(a.dischargeDate).toLocaleString('en-US') : '-';
            const statusColor = a.status === 'ACTIVE' ? 'var(--status-success)' : 'var(--text-secondary)';
            return `
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 12px;">${a.admissionId}</td>
                    <td style="padding: 12px; font-weight: 500;">
                        ${a.patient?.fullName || '-'} <span style="font-size:0.85em; color:var(--text-secondary);">(${a.patient?.patientId || '-'})</span>
                    </td>
                    <td style="padding: 12px;">Room ${a.room?.roomNumber || '-'}</td>
                    <td style="padding: 12px;">${new Date(a.admissionDate).toLocaleString('en-US')}</td>
                    <td style="padding: 12px;">${dischargeText}</td>
                    <td style="padding: 12px;"><span style="color: ${statusColor}; font-weight: 600;">${a.status}</span></td>
                    <td style="padding: 12px; text-align: center;">${a.totalDays ?? '-'}</td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px; color: var(--status-danger);">Error loading history.</td></tr>';
    }
}

function setupAdmissionsEvents(container, isNurse) {
    const role = getStorageItem('role') || '';
    const isWardBoy = role === 'WARD_BOY';
    if (isWardBoy) return;

    if (isNurse) {
        // Vitals modal setup
        const modal = container.querySelector('#vitals-modal');
        const vitalsForm = container.querySelector('#vitals-form');
        const closeVitalsBtn = container.querySelector('#close-vitals-modal');
        const cancelVitalsBtn = container.querySelector('#btn-cancel-vitals');

        const closeVitalsModal = () => {
            modal.style.display = 'none';
            vitalsForm.reset();
        };

        if (closeVitalsBtn) closeVitalsBtn.onclick = closeVitalsModal;
        if (cancelVitalsBtn) cancelVitalsBtn.onclick = closeVitalsModal;

        vitalsForm.onsubmit = async (e) => {
            e.preventDefault();
            const patientId = container.querySelector('#vitals-patient-id').value;
            const bp = container.querySelector('#vitals-bp').value;
            const temp = parseFloat(container.querySelector('#vitals-temp').value);
            const pulse = parseInt(container.querySelector('#vitals-pulse').value, 10);
            const oxygen = parseInt(container.querySelector('#vitals-oxygen').value, 10);
            const nurseName = getStorageItem('username') || 'Nurse';

            const payload = {
                patientId: patientId,
                bloodPressure: bp,
                temperature: temp,
                pulse: pulse,
                oxygenLevel: oxygen,
                recordedBy: nurseName
            };

            try {
                await api.post('/vitals', payload);
                showToast('Vitals saved successfully!', 'success');
                closeVitalsModal();
            } catch (err) {
                showToast('Error saving vitals: ' + err.message, 'error');
            }
        };

        // Checklist modal setup
        const checklistModal = container.querySelector('#treatments-checklist-modal');
        const closeChecklistBtn = container.querySelector('#close-checklist-modal');

        if (closeChecklistBtn) {
            closeChecklistBtn.onclick = () => {
                checklistModal.style.display = 'none';
                loadActiveAdmissions(container, isNurse);
            };
        }
        return;
    }

    // Receptionist logic
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
        loadHistoryAdmissions(container);
    });

    btnAdmit.onclick = async () => {
        modalAdmit.style.display = 'flex';
        loadAvailableRooms(container);

        // Preload patients for admit form autocomplete
        try {
            allPatients = await api.get('/patients');
        } catch (e) {
            console.error('Failed to preload patients for admit form', e);
        }

        const searchInput = container.querySelector('#admit-patient-search');
        const patientSelect = container.querySelector('#admit-patient-id');
        const hint = container.querySelector('#admit-patient-hint');

        patientSelect.style.display = 'none';
        patientSelect.removeAttribute('required');
        searchInput.value = '';
        hint.textContent = 'Type at least 2 characters to search';

        searchInput.oninput = () => {
            const query = searchInput.value.toLowerCase().trim();

            if (query.length < 2) {
                patientSelect.style.display = 'none';
                hint.textContent = 'Type at least 2 characters to search';
                return;
            }

            // Exclude already admitted patients
            const matches = allPatients.filter(p =>
                p.status?.toUpperCase() !== 'ADMITTED' &&
                (
                    p.fullName?.toLowerCase().includes(query) ||
                    p.patientId?.toLowerCase().includes(query) ||
                    p.phoneNumber?.includes(query)
                )
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
            hint.textContent = `Found ${matches.length} results — click to select`;

            if (matches.length === 1) {
                patientSelect.selectedIndex = 0;
                hint.textContent = `✓ Selected: ${matches[0].fullName} (${matches[0].patientId})`;
            }
        };

        patientSelect.onchange = () => {
            const selected = patientSelect.options[patientSelect.selectedIndex];
            if (selected && selected.value) {
                hint.textContent = `✓ Selected: ${selected.text}`;
                searchInput.value = selected.text;
            }
        };
    };

    const closeAdmit = () => {
        modalAdmit.style.display = 'none';
        container.querySelector('#admit-form').reset();
        const searchInput = container.querySelector('#admit-patient-search');
        const patientSelect = container.querySelector('#admit-patient-id');
        const hint = container.querySelector('#admit-patient-hint');
        if (searchInput) searchInput.value = '';
        if (patientSelect) {
            patientSelect.style.display = 'none';
            patientSelect.innerHTML = '';
        }
        if (hint) hint.textContent = 'Type at least 2 characters to search';
    };
    btnCancelAdmit.onclick = closeAdmit;
    btnCloseAdmit.onclick = closeAdmit;

    const closeAssign = () => {
        modalAssign.style.display = 'none';
        container.querySelector('#assign-doc-form').reset();
        container.querySelector('#assign-patient-search').value = '';
        container.querySelector('#assign-patient-id').style.display = 'none';
        container.querySelector('#assign-patient-hint').textContent = 'Enter at least 2 characters to search';
    };
    btnCancelAssign.onclick = closeAssign;
    btnCloseAssign.onclick = closeAssign;

    btnAssign.onclick = async () => {
        modalAssign.style.display = 'flex';

        // Load doctors
        try {
            const doctors = await api.get('/doctors/active');
            const doctorSelect = container.querySelector('#assign-doc-id');
            doctorSelect.innerHTML = '<option value="">Select doctor...</option>' +
                doctors.map(d =>
                    `<option value="${d.doctorId}">${d.fullName} - Specialisation: ${d.specialisation}</option>`
                ).join('');
        } catch (e) {
            container.querySelector('#assign-doc-id').innerHTML = '<option value="">Error loading doctors list</option>';
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

        patientSelect.style.display = 'none';
        patientSelect.removeAttribute('required');
        searchInput.value = '';
        hint.textContent = 'Enter at least 2 characters to search';

        searchInput.oninput = () => {
            const query = searchInput.value.toLowerCase().trim();

            if (query.length < 2) {
                patientSelect.style.display = 'none';
                hint.textContent = 'Enter at least 2 characters to search';
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
                hint.textContent = `No inpatient matching "${searchInput.value}"`;
                return;
            }

            patientSelect.innerHTML = matches.map(p =>
                `<option value="${p.patientId}">${p.fullName} (${p.patientId})</option>`
            ).join('');
            patientSelect.style.display = 'block';
            hint.textContent = `Found ${matches.length} results — click to select`;

            if (matches.length === 1) {
                patientSelect.selectedIndex = 0;
                hint.textContent = `✓ Selected: ${matches[0].fullName} (${matches[0].patientId})`;
            }
        };

        patientSelect.onchange = () => {
            const selected = patientSelect.options[patientSelect.selectedIndex];
            if (selected && selected.value) {
                hint.textContent = `✓ Selected: ${selected.text}`;
                searchInput.value = selected.text;
            }
        };
    };

    container.querySelector('#admit-form').onsubmit = async (e) => {
        e.preventDefault();
        const patientIdSelect = container.querySelector('#admit-patient-id');
        const patientId = patientIdSelect.value;
        if (!patientId) {
            showToast('Please search and select a patient first.', 'warning');
            container.querySelector('#admit-patient-search').focus();
            return;
        }
        const payload = {
            patientId: patientId,
            roomId: parseInt(container.querySelector('#admit-room-select').value, 10),
            notes: container.querySelector('#admit-notes').value
        };
        try {
            await api.post('/admissions', payload);
            showToast('Patient admitted successfully!', 'success');
            closeAdmit();
            loadActiveAdmissions(container, isNurse);
            loadAvailableRooms(container);
        } catch (err) {
            showToast('Error: ' + err.message, 'error');
        }
    };

    // Assign doctor form submit
    container.querySelector('#assign-doc-form').onsubmit = async (e) => {
        e.preventDefault();

        const patientSelect = container.querySelector('#assign-patient-id');
        const patientId = patientSelect.value;

        if (!patientId) {
            showToast('Please search and select an inpatient first.', 'warning');
            container.querySelector('#assign-patient-search').focus();
            return;
        }

        const doctorId = container.querySelector('#assign-doc-id').value;
        if (!doctorId) {
            showToast('Please select a doctor.', 'warning');
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
            showToast('Doctor assigned successfully!', 'success');
            closeAssign();
        } catch (err) {
            showToast('Error: ' + err.message, 'error');
        }
    };

    // Transport modal setup
    const btnRequestTransport = container.querySelector('#btn-request-transport');
    const transportModal = container.querySelector('#transport-modal');
    if (btnRequestTransport && transportModal) {
        const closeTransportBtn = container.querySelector('#close-transport-modal');
        const cancelTransportBtn = container.querySelector('#btn-cancel-transport');
        const transportForm = container.querySelector('#transport-form');
        const searchInput = container.querySelector('#transport-patient-search');
        const patientSelect = container.querySelector('#transport-patient-id');
        const hint = container.querySelector('#transport-patient-hint');

        const closeTransportModal = () => {
            transportModal.style.display = 'none';
            transportForm.reset();
            searchInput.value = '';
            patientSelect.style.display = 'none';
            patientSelect.innerHTML = '';
            hint.textContent = 'Type at least 2 characters to search';
        };

        if (closeTransportBtn) closeTransportBtn.onclick = closeTransportModal;
        if (cancelTransportBtn) cancelTransportBtn.onclick = closeTransportModal;

        let activeAdmissionsList = [];
        btnRequestTransport.onclick = async () => {
            transportModal.style.display = 'flex';
            loadAllRoomsForTransport(container);

            try {
                activeAdmissionsList = await api.get('/admissions/active');
            } catch (e) {
                console.error('Failed to load active admissions', e);
            }

            searchInput.value = '';
            patientSelect.style.display = 'none';
            patientSelect.removeAttribute('required');
            hint.textContent = 'Type at least 2 characters to search';
        };

        searchInput.oninput = () => {
            const query = searchInput.value.toLowerCase().trim();
            if (query.length < 2) {
                patientSelect.style.display = 'none';
                hint.textContent = 'Type at least 2 characters to search';
                return;
            }

            const matches = activeAdmissionsList.filter(a =>
                a.patient?.fullName?.toLowerCase().includes(query) ||
                a.patient?.patientId?.toLowerCase().includes(query) ||
                a.room?.roomNumber?.toLowerCase().includes(query)
            );

            if (matches.length === 0) {
                patientSelect.style.display = 'none';
                hint.textContent = `No admitted patients matching "${searchInput.value}"`;
                return;
            }

            patientSelect.innerHTML = matches.map(a =>
                `<option value="${a.patient.patientId}">[Room ${a.room?.roomNumber}] ${a.patient.fullName} (${a.patient.patientId})</option>`
            ).join('');
            patientSelect.style.display = 'block';
            hint.textContent = `Found ${matches.length} results — click to select`;

            if (matches.length === 1) {
                patientSelect.selectedIndex = 0;
                hint.textContent = `✓ Selected: ${matches[0].patient.fullName} (${matches[0].patient.patientId})`;
            }
        };

        patientSelect.onchange = () => {
            const selected = patientSelect.options[patientSelect.selectedIndex];
            if (selected && selected.value) {
                hint.textContent = `✓ Selected: ${selected.text}`;
                searchInput.value = selected.text;
            }
        };

        transportForm.onsubmit = async (e) => {
            e.preventDefault();
            const patientId = patientSelect.value;
            if (!patientId) {
                showToast('Please search and select an admitted patient first.', 'warning');
                searchInput.focus();
                return;
            }
            const roomId = parseInt(container.querySelector('#transport-room-select').value, 10);
            const notes = container.querySelector('#transport-notes').value;
            const requestedBy = getStorageItem('username') || 'Staff';

            const payload = {
                patient: { patientId: patientId },
                toRoom: { roomId: roomId },
                notes: notes,
                requestedBy: requestedBy
            };

            try {
                await api.post('/transport-tasks', payload);
                showToast('Transport request submitted successfully!', 'success');
                closeTransportModal();
            } catch (err) {
                showToast('Error submitting transport request: ' + err.message, 'error');
            }
        };
    }
}