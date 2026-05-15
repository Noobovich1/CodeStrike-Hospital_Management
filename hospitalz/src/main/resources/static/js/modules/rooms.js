import { api } from '../api.js';

export async function renderRoomList() {
    const container = document.createElement('div');
    
    container.innerHTML = `
        <div class="glass-panel" style="padding: 24px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0;">Room Management</h2>
                <div style="display: flex; gap: 12px; align-items: center;">
                    <label style="font-weight: 500;">Filter Status:</label>
                    <select id="room-status-filter" style="padding: 8px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-secondary);">
                        <option value="ALL">All</option>
                        <option value="AVAILABLE">Available</option>
                        <option value="FULL">Full</option>
                        <option value="MAINTENANCE">Maintenance</option>
                    </select>
                </div>
            </div>

            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--border-color);">
                            <th style="padding: 12px;">Room Number</th>
                            <th style="padding: 12px;">Type</th>
                            <th style="padding: 12px;">Floor</th>
                            <th style="padding: 12px;">Occupancy / Capacity</th>
                            <th style="padding: 12px;">Daily Rate</th>
                            <th style="padding: 12px;">Status</th>
                        </tr>
                    </thead>
                    <tbody id="room-table-body">
                        <tr><td colspan="6" style="text-align: center; padding: 20px;">Loading rooms...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    setTimeout(() => {
        loadRoomData('ALL');
        
        container.querySelector('#room-status-filter').addEventListener('change', (e) => {
            loadRoomData(e.target.value);
        });
    }, 0);

    return container;
}

async function loadRoomData(statusFilter) {
    const tbody = document.getElementById('room-table-body');
    if (!tbody) return;

    try {
        let endpoint = '/rooms';
        if (statusFilter !== 'ALL') {
            // Note: Update this endpoint if the backend has a specific query param for status.
            // Currently fetching all and filtering on client side for simplicity.
        }
        
        const roomList = await api.get(endpoint);
        
        const filteredList = statusFilter === 'ALL' 
            ? roomList 
            : roomList.filter(r => r.status === statusFilter);

        if (filteredList.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px;">No rooms found matching criteria.</td></tr>`;
            return;
        }

        tbody.innerHTML = filteredList.map(r => {
            let statusBadge = '';
            if (r.status === 'AVAILABLE') statusBadge = `<span style="color: var(--status-success);"><i class="fa-solid fa-check"></i> Available</span>`;
            else if (r.status === 'FULL') statusBadge = `<span style="color: var(--status-danger);"><i class="fa-solid fa-ban"></i> Full</span>`;
            else statusBadge = `<span style="color: var(--status-warning);"><i class="fa-solid fa-wrench"></i> ${r.status}</span>`;

            return `
            <tr style="border-bottom: 1px solid var(--border-color);">
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
            </tr>
        `}).join('');
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: var(--status-danger);">Error loading data.</td></tr>`;
    }
}
