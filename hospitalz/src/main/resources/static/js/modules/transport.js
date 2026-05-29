import { api } from '../api.js';

const getStorageItem = (key) => localStorage.getItem(key) || sessionStorage.getItem(key);

export async function renderTransportTasks() {
    const container = document.createElement('div');
    const role = getStorageItem('role') || '';
    const staffId = getStorageItem('staffId') || '';
    const isWardBoy = role === 'WARD_BOY';

    container.innerHTML = `
        <div class="glass-panel" style="padding: 24px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 16px;">
                <h2 style="margin: 0;"><i class="fa-solid fa-truck-medical" style="color: var(--accent-primary);"></i> Patient Transport Tasks</h2>
                <button id="btn-refresh-transport" class="btn btn-secondary" style="padding: 8px 16px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); border-radius: 6px; cursor: pointer;">
                    <i class="fa-solid fa-rotate"></i> Refresh
                </button>
            </div>

            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--border-color);">
                            <th style="padding: 12px;">Task ID</th>
                            <th style="padding: 12px;">Patient</th>
                            <th style="padding: 12px;">From Room</th>
                            <th style="padding: 12px;">To Room</th>
                            <th style="padding: 12px;">Requested By</th>
                            <th style="padding: 12px;">Assigned Ward Boy</th>
                            <th style="padding: 12px;">Status</th>
                            <th style="padding: 12px;">Notes</th>
                            <th style="padding: 12px; text-align: center;">Action</th>
                        </tr>
                    </thead>
                    <tbody id="transport-table-body">
                        <tr><td colspan="9" style="text-align: center; padding: 20px;">Loading transport tasks...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    setTimeout(() => {
        loadTransportData(container, isWardBoy, staffId);
        
        const refreshBtn = container.querySelector('#btn-refresh-transport');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                loadTransportData(container, isWardBoy, staffId);
            });
        }
    }, 0);

    return container;
}

async function loadTransportData(container, isWardBoy, staffId) {
    const tbody = container.querySelector('#transport-table-body');
    if (!tbody) return;

    try {
        const tasks = await api.get('/transport-tasks/active');

        if (tasks.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 20px; color: var(--text-secondary);">No active transport tasks found.</td></tr>';
            return;
        }

        tbody.innerHTML = tasks.map(t => {
            let statusBadge = '';
            if (t.status === 'PENDING') {
                statusBadge = `<span style="color: var(--status-danger); font-weight: 600;"><i class="fa-solid fa-clock"></i> Pending</span>`;
            } else if (t.status === 'ACCEPTED') {
                statusBadge = `<span style="color: var(--status-warning); font-weight: 600;"><i class="fa-solid fa-circle-check"></i> Accepted</span>`;
            } else if (t.status === 'IN_PROGRESS') {
                statusBadge = `<span style="color: var(--accent-primary); font-weight: 600;"><i class="fa-solid fa-truck-ramp-box"></i> In Progress</span>`;
            } else {
                statusBadge = `<span style="color: var(--text-secondary);">${t.status}</span>`;
            }

            let actionHTML = '-';
            if (isWardBoy) {
                if (t.status === 'PENDING') {
                    actionHTML = `
                        <button class="btn btn-accept-task" data-id="${t.taskId}" style="padding: 6px 12px; background: var(--accent-primary); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85em; font-weight: 600;">
                            Accept Task
                        </button>
                    `;
                } else if (t.status === 'ACCEPTED' && t.assignedStaff?.staffId === staffId) {
                    actionHTML = `
                        <button class="btn btn-start-task" data-id="${t.taskId}" style="padding: 6px 12px; background: var(--status-warning); color: black; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85em; font-weight: 600;">
                            Start Transport
                        </button>
                    `;
                } else if (t.status === 'IN_PROGRESS' && t.assignedStaff?.staffId === staffId) {
                    actionHTML = `
                        <button class="btn btn-complete-task" data-id="${t.taskId}" style="padding: 6px 12px; background: var(--status-success); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85em; font-weight: 600;">
                            Complete
                        </button>
                    `;
                } else if (t.assignedStaff?.staffId !== staffId) {
                    actionHTML = `<span style="font-size: 0.85em; color: var(--text-secondary);">Assigned to another</span>`;
                }
            } else {
                actionHTML = `<span style="font-size: 0.85em; color: var(--text-secondary);">Read-only</span>`;
            }

            return `
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 12px;">${t.taskId}</td>
                    <td style="padding: 12px; font-weight: 500;">
                        ${t.patient?.fullName || '-'} <span style="font-size: 0.85em; color: var(--text-secondary);">(${t.patient?.patientId || '-'})</span>
                    </td>
                    <td style="padding: 12px;">Room ${t.fromRoom?.roomNumber || 'Emergency / Clinic'}</td>
                    <td style="padding: 12px; font-weight: 500; color: var(--accent-primary);">Room ${t.toRoom?.roomNumber || '-'}</td>
                    <td style="padding: 12px;">${t.requestedBy || '-'}</td>
                    <td style="padding: 12px;">${t.assignedStaff?.fullName || '<span style="color: var(--text-secondary); font-style: italic;">Unassigned</span>'}</td>
                    <td style="padding: 12px;">${statusBadge}</td>
                    <td style="padding: 12px; font-size: 0.9em; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${t.notes || ''}">
                        ${t.notes || '-'}
                    </td>
                    <td style="padding: 12px; text-align: center;">${actionHTML}</td>
                </tr>
            `;
        }).join('');

        // Attach listeners for Ward Boy actions
        if (isWardBoy) {
            container.querySelectorAll('.btn-accept-task').forEach(btn => {
                btn.onclick = async (e) => {
                    const id = e.currentTarget.dataset.id;
                    if (confirm('Do you want to accept this transport task?')) {
                        try {
                            await api.patch(`/transport-tasks/${id}/status?status=ACCEPTED&staffId=${staffId}`);
                            alert('Task accepted successfully!');
                            loadTransportData(container, isWardBoy, staffId);
                        } catch (err) {
                            alert('Error: ' + err.message);
                        }
                    }
                };
            });

            container.querySelectorAll('.btn-start-task').forEach(btn => {
                btn.onclick = async (e) => {
                    const id = e.currentTarget.dataset.id;
                    try {
                        await api.patch(`/transport-tasks/${id}/status?status=IN_PROGRESS`);
                        alert('Patient transport started!');
                        loadTransportData(container, isWardBoy, staffId);
                    } catch (err) {
                        alert('Error: ' + err.message);
                    }
                };
            });

            container.querySelectorAll('.btn-complete-task').forEach(btn => {
                btn.onclick = async (e) => {
                    const id = e.currentTarget.dataset.id;
                    if (confirm('Confirm patient has been safely transported to destination room?')) {
                        try {
                            await api.patch(`/transport-tasks/${id}/status?status=COMPLETED`);
                            alert('Patient transport completed successfully!');
                            loadTransportData(container, isWardBoy, staffId);
                        } catch (err) {
                            alert('Error: ' + err.message);
                        }
                    }
                };
            });
        }

    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 20px; color: var(--status-danger);">Error loading transport tasks data.</td></tr>';
    }
}
