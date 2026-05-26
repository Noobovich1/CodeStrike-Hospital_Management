import { api } from '../api.js';

export async function renderUsersList() {
    const container = document.createElement('div');
    
    container.innerHTML = `
        <div class="glass-panel" style="padding: 24px; margin-bottom: 24px;">
            <h2 style="margin-bottom: 20px;">User Role Management</h2>
            <p style="color: var(--text-secondary); margin-bottom: 20px;">
                Assign or change system access roles for registered accounts.
            </p>
            
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--border-color);">
                            <th style="padding: 12px;">User ID</th>
                            <th style="padding: 12px;">Username</th>
                            <th style="padding: 12px;">Current Role</th>
                            <th style="padding: 12px;">Change Role</th>
                        </tr>
                    </thead>
                    <tbody id="users-table-body">
                        <tr><td colspan="4" style="text-align: center; padding: 20px;">Loading users...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    setTimeout(() => loadUsers(container), 0);
    return container;
}

async function loadUsers(container) {
    const tbody = container.querySelector('#users-table-body');
    const currentUser = localStorage.getItem('username'); // Để tránh Admin tự vô tình khóa mình

    try {
        const users = await api.get('/users');
        const roles = ['ADMIN', 'DOCTOR', 'NURSE', 'WARD_BOY', 'RECEPTIONIST', 'PATIENT'];

        tbody.innerHTML = users.map(u => {
            const roleOptions = roles.map(r => 
                `<option value="${r}" ${r === u.role ? 'selected' : ''}>${r}</option>`
            ).join('');

            return `
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 12px;">${u.id}</td>
                    <td style="padding: 12px; font-weight: 500;">
                        ${u.username} 
                        ${u.username === currentUser ? '<span style="font-size:0.8em; color:var(--accent-primary);">(You)</span>' : ''}
                    </td>
                    <td style="padding: 12px;">
                        <span style="background: var(--bg-secondary); padding: 4px 8px; border-radius: 4px; border: 1px solid var(--border-color); font-size: 0.85em;">
                            ${u.role}
                        </span>
                    </td>
                    <td style="padding: 12px; display: flex; gap: 8px;">
                        <select id="role-select-${u.id}" style="padding: 6px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary);">
                            ${roleOptions}
                        </select>
                        <button class="btn-update-role" data-id="${u.id}" data-username="${u.username}" style="padding: 6px 12px; background: var(--status-success); color: white; border: none; border-radius: 4px; cursor: pointer;">
                            Update
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        // Gắn sự kiện click cho các nút Update
        container.querySelectorAll('.btn-update-role').forEach(btn => {
            btn.onclick = async () => {
                const id = btn.dataset.id;
                const targetUsername = btn.dataset.username;
                const newRole = container.querySelector(`#role-select-${id}`).value;

                // Cảnh báo nếu Admin tự đổi Role của chính mình thành cái khác
                if (targetUsername === currentUser && newRole !== 'ADMIN') {
                    if (!confirm("WARNING: You are about to remove your own Admin privileges. Do you want to continue?")) {
                        return;
                    }
                }

                try {
                    await api.patch(`/users/${id}/role`, { role: newRole });
                    alert(`Role for ${targetUsername} updated to ${newRole} successfully!`);
                    
                    // Nếu tự đổi role của bản thân, tự động đăng xuất để đăng nhập lại
                    if (targetUsername === currentUser && newRole !== 'ADMIN') {
                        localStorage.clear();
                        window.location.href = '/auth.html';
                    } else {
                        loadUsers(container); // Tải lại bảng
                    }
                } catch (err) {
                    alert('Error updating role: ' + err.message);
                }
            };
        });

    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--status-danger); padding: 20px;">Error loading users.</td></tr>`;
    }
}

