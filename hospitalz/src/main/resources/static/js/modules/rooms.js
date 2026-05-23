import { api } from '../api.js';

export async function renderRoomList() {
    const container = document.createElement('div');
    
    container.innerHTML = `
        <div class="glass-panel" style="padding: 24px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 16px;">
                <h2 style="margin: 0;">Room Management</h2>
                <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                    <label style="font-weight: 500;">Filter Status:</label>
                    <select id="room-status-filter" style="padding: 8px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary);">
                        <option value="ALL">All</option>
                        <option value="AVAILABLE">Available</option>
                        <option value="OCCUPIED">Occupied</option>
                        <option value="FULL">Full</option>
                        <option value="MAINTENANCE">Maintenance</option>
                    </select>
                    <button id="btn-register-room" class="btn btn-primary" style="padding: 8px 16px; background: var(--accent-primary); color: white; border: none; border-radius: 6px; cursor: pointer;">
                        <i class="fa-solid fa-plus"></i> Create Room
                    </button>
                </div>
            </div>

            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--border-color);">
                            <th style="padding: 12px;">ID</th>
                            <th style="padding: 12px;">Room Number</th>
                            <th style="padding: 12px;">Type</th>
                            <th style="padding: 12px;">Floor</th>
                            <th style="padding: 12px;">Occupancy / Capacity</th>
                            <th style="padding: 12px;">Daily Rate</th>
                            <th style="padding: 12px;">Status</th>
                            <th style="padding: 12px;">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="room-table-body">
                        <tr><td colspan="8" style="text-align: center; padding: 20px;">Loading rooms...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Create/Edit Room Pop-up Modal -->
        <div id="room-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
            <div class="glass-panel" style="background: var(--bg-primary); width: 90%; max-width: 600px; padding: 24px; max-height: 90vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
                    <h2 id="room-form-title" style="margin: 0;">Create Room</h2>
                    <button id="close-room-modal" style="background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-primary);">&times;</button>
                </div>
                <form id="room-form">
                    <input type="hidden" id="room-id-val">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Room Number *</label>
                            <input type="text" id="room-number" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Room Type *</label>
                            <select id="room-type" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                                <option value="GENERAL">General</option>
                                <option value="ICU">ICU</option>
                                <option value="OPERATION_THEATER">Operation Theater</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Floor *</label>
                            <input type="number" id="room-floor" required min="0" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Capacity *</label>
                            <input type="number" id="room-capacity" required min="1" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Daily Rate ($) *</label>
                            <input type="number" id="room-rate" required min="0" step="0.01" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Notes</label>
                            <input type="text" id="room-notes" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                        <button type="button" id="btn-cancel-room" style="padding: 8px 16px; border: 1px solid var(--border-color); background: transparent; border-radius: 6px; cursor: pointer; color: var(--text-primary);">Cancel</button>
                        <button type="submit" style="padding: 8px 16px; background: var(--status-success); color: white; border: none; border-radius: 6px; cursor: pointer;">Save Room</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    setTimeout(() => {
        loadRoomData('ALL');
        setupRoomEvents(container);
    }, 0);

    return container;
}

async function loadRoomData(statusFilter) {
    const tbody = document.getElementById('room-table-body');
    if (!tbody) return;

    try {
        const roomList = await api.get('/rooms');
        
        const filteredList = statusFilter === 'ALL' 
            ? roomList 
            : roomList.filter(r => r.status === statusFilter);

        if (filteredList.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 20px;">No rooms found matching criteria.</td></tr>`;
            return;
        }

        tbody.innerHTML = filteredList.map(r => {
            let statusBadge = '';
            if (r.status === 'AVAILABLE') {
                statusBadge = `<span style="color: var(--status-success); font-weight: 600;"><i class="fa-solid fa-check"></i> Available</span>`;
            } else if (r.status === 'OCCUPIED' || r.status === 'FULL') {
                statusBadge = `<span style="color: var(--status-danger); font-weight: 600;"><i class="fa-solid fa-ban"></i> ${r.status}</span>`;
            } else {
                statusBadge = `<span style="color: var(--status-warning); font-weight: 600;"><i class="fa-solid fa-wrench"></i> ${r.status}</span>`;
            }

            const actionButtons = `
                <div class="action-group">
                    <button class="btn-icon btn-icon-view btn-edit-room" data-id="${r.roomId}" title="Edit Room">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-icon btn-toggle-status" data-id="${r.roomId}" data-status="${r.status}" title="Toggle Maintenance">
                        <i class="fa-solid ${r.status === 'MAINTENANCE' ? 'fa-square-check' : 'fa-screwdriver-wrench'}"></i>
                    </button>
                </div>
            `;

            return `
            <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 12px;">${r.roomId}</td>
                <td style="padding: 12px; font-weight: 500;">${r.roomNumber}</td>
                <td style="padding: 12px;">${r.roomType}</td>
                <td style="padding: 12px;">${r.floor || '-'}</td>
                <td style="padding: 12px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <progress value="${r.currentOccupancy}" max="${r.capacity}" style="width: 60px;"></progress>
                        <span>${r.currentOccupancy} / ${r.capacity}</span>
                    </div>
                </td>
                <td style="padding: 12px;">$${r.dailyRate}</td>
                <td style="padding: 12px;">${statusBadge}</td>
                <td style="padding: 12px;">${actionButtons}</td>
            </tr>
        `}).join('');

        // Attach listeners
        document.querySelectorAll('.btn-edit-room').forEach(btn => {
            btn.onclick = async (e) => {
                const roomId = e.currentTarget.dataset.id;
                await openEditRoomForm(roomId);
            };
        });

        document.querySelectorAll('.btn-toggle-status').forEach(btn => {
            btn.onclick = async (e) => {
                const roomId = e.currentTarget.dataset.id;
                const currentStatus = e.currentTarget.dataset.status;
                const newStatus = currentStatus === 'MAINTENANCE' ? 'AVAILABLE' : 'MAINTENANCE';
                
                try {
                    await api.patch(`/rooms/${roomId}/status?status=${newStatus}`);
                    alert(`Room status updated to ${newStatus}!`);
                    const filter = document.getElementById('room-status-filter').value;
                    loadRoomData(filter);
                } catch (error) {
                    alert('Error changing status: ' + error.message);
                }
            };
        });

    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 20px; color: var(--status-danger);">Error loading data.</td></tr>`;
    }
}

async function openEditRoomForm(roomId) {
    const modal = document.getElementById('room-modal');
    const formTitle = document.getElementById('room-form-title');
    const form = document.getElementById('room-form');

    formTitle.textContent = "Edit Room Details";
    modal.style.display = 'flex';

    try {
        const room = await api.get(`/rooms/${roomId}`);
        document.getElementById('room-id-val').value = room.roomId;
        document.getElementById('room-number').value = room.roomNumber;
        document.getElementById('room-type').value = room.roomType;
        document.getElementById('room-floor').value = room.floor;
        document.getElementById('room-capacity').value = room.capacity;
        document.getElementById('room-rate').value = room.dailyRate;
        document.getElementById('room-notes').value = room.notes || '';
    } catch (error) {
        alert('Error loading room details: ' + error.message);
        modal.style.display = 'none';
    }
}

function setupRoomEvents(container) {
    const btnRegister = container.querySelector('#btn-register-room');
    const modal = container.querySelector('#room-modal');
    const btnCancel = container.querySelector('#btn-cancel-room');
    const btnClose = container.querySelector('#close-room-modal');
    const form = container.querySelector('#room-form');
    const filterSelect = container.querySelector('#room-status-filter');

    filterSelect.addEventListener('change', (e) => {
        loadRoomData(e.target.value);
    });

    btnRegister.addEventListener('click', () => {
        document.getElementById('room-form-title').textContent = "Create Room";
        document.getElementById('room-id-val').value = '';
        form.reset();
        modal.style.display = 'flex';
    });

    const closeModal = () => {
        modal.style.display = 'none';
        form.reset();
    };

    btnCancel.addEventListener('click', closeModal);
    btnClose.addEventListener('click', closeModal);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const roomId = document.getElementById('room-id-val').value;
        const payload = {
            roomNumber: document.getElementById('room-number').value,
            roomType: document.getElementById('room-type').value,
            floor: parseInt(document.getElementById('room-floor').value, 10),
            capacity: parseInt(document.getElementById('room-capacity').value, 10),
            dailyRate: parseFloat(document.getElementById('room-rate').value),
            notes: document.getElementById('room-notes').value
        };

        try {
            if (roomId) {
                await api.put(`/rooms/${roomId}`, payload);
                alert('Room updated successfully!');
            } else {
                await api.post('/rooms', payload);
                alert('Room created successfully!');
            }
            closeModal();
            loadRoomData(filterSelect.value);
        } catch (error) {
            alert('Error: ' + error.message);
        }
    });
}
