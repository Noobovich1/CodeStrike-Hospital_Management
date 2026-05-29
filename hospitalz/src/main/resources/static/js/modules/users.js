import { api } from '../api.js';

export async function renderUsersList() {
    const container = document.createElement('div');
    
    container.innerHTML = `
        <div class="glass-panel" style="padding: 24px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; margin-bottom: 20px;">
                <div>
                    <h2 style="margin-bottom: 8px;">User Management</h2>
                    <p style="color: var(--text-secondary);">
                        View and manage system accounts. Lock/unlock access or add new Receptionist accounts.
                    </p>
                </div>
                <button id="btn-add-receptionist" style="
                    padding: 10px 18px;
                    background: var(--accent-primary);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    white-space: nowrap;
                ">
                    <i class="fa-solid fa-plus"></i> Add Receptionist
                </button>
            </div>
            
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--border-color);">
                            <th style="padding: 12px;">ID</th>
                            <th style="padding: 12px;">Username</th>
                            <th style="padding: 12px;">Role</th>
                            <th style="padding: 12px;">Status</th>
                            <th style="padding: 12px;">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="users-table-body">
                        <tr><td colspan="5" style="text-align: center; padding: 20px;">Loading users...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Modal credentials -->
        <div id="credentials-modal" style="
            display: none; position: fixed; inset: 0;
            background: rgba(0,0,0,0.5); z-index: 1000;
            align-items: center; justify-content: center;
        ">
            <div class="glass-panel" style="padding: 32px; max-width: 420px; width: 90%; text-align: center;">
                <i class="fa-solid fa-circle-check" style="font-size: 2.5rem; color: var(--status-success); margin-bottom: 16px;"></i>
                <h3 style="margin-bottom: 16px;">Receptionist Account Created</h3>
                <div style="background: var(--bg-secondary); border-radius: 8px; padding: 16px; margin-bottom: 20px; text-align: left;">
                    <div style="margin-bottom: 8px;">
                        <span style="color: var(--text-secondary); font-size: 0.85em;">USERNAME</span><br>
                        <strong id="cred-username" style="font-size: 1.1em; font-family: monospace;"></strong>
                    </div>
                    <div>
                        <span style="color: var(--text-secondary); font-size: 0.85em;">DEFAULT PASSWORD</span><br>
                        <strong id="cred-password" style="font-size: 1.1em; font-family: monospace;"></strong>
                    </div>
                </div>
                <p style="color: var(--text-secondary); font-size: 0.85em; margin-bottom: 20px;">
                    Please share these credentials with the receptionist. They can change their password after login.
                </p>
                <button id="cred-close-btn" style="
                    padding: 10px 24px;
                    background: var(--accent-primary);
                    color: white; border: none;
                    border-radius: 8px; cursor: pointer; font-weight: 600;
                ">Done</button>
            </div>
        </div>
    `;

    setTimeout(() => {
        loadUsers(container);

        // Add Receptionist button
        container.querySelector('#btn-add-receptionist').onclick = async () => {
            if (!confirm('Create a new Receptionist account? Username and password will be auto-generated.')) return;
            try {
                const result = await api.post('/users/receptionist', {});
                // Show credentials modal
                const modal = container.querySelector('#credentials-modal');
                container.querySelector('#cred-username').textContent = result.username;
                container.querySelector('#cred-password').textContent = result.defaultPassword;
                modal.style.display = 'flex';
                container.querySelector('#cred-close-btn').onclick = () => {
                    modal.style.display = 'none';
                    loadUsers(container);
                };
            } catch (err) {
                alert('Error creating receptionist: ' + err.message);
            }
        };
    }, 0);

    return container;
}

async function loadUsers(container) {
    const tbody = container.querySelector('#users-table-body');
    const currentUser = localStorage.getItem('username') || sessionStorage.getItem('username');

    try {
        const users = await api.get('/users');

        tbody.innerHTML = users.map(u => {
            const isCurrentUser = u.username === currentUser;
            const statusBadge = u.active
                ? `<span style="background: #d1fae5; color: #065f46; padding: 3px 10px; border-radius: 20px; font-size: 0.82em; font-weight: 600;">Active</span>`
                : `<span style="background: #fee2e2; color: #991b1b; padding: 3px 10px; border-radius: 20px; font-size: 0.82em; font-weight: 600;">Locked</span>`;

            const lockBtn = u.active
                ? `<button class="btn-lock" data-id="${u.id}" data-username="${u.username}"
                    style="padding: 5px 12px; background: #ef4444; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85em;"
                    ${isCurrentUser ? 'disabled title="Cannot lock your own account"' : ''}>
                    <i class="fa-solid fa-lock"></i> Lock
                   </button>`
                : `<button class="btn-unlock" data-id="${u.id}" data-username="${u.username}"
                    style="padding: 5px 12px; background: var(--status-success); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85em;">
                    <i class="fa-solid fa-lock-open"></i> Unlock
                   </button>`;

            return `
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 12px; color: var(--text-secondary); font-size: 0.9em;">${u.id}</td>
                    <td style="padding: 12px; font-weight: 500;">
                        ${u.username}
                        ${isCurrentUser ? '<span style="font-size:0.8em; color:var(--accent-primary); margin-left: 4px;">(You)</span>' : ''}
                    </td>
                    <td style="padding: 12px;">
                        <span style="background: var(--bg-secondary); padding: 4px 8px; border-radius: 4px; border: 1px solid var(--border-color); font-size: 0.85em;">
                            ${u.role}
                        </span>
                    </td>
                    <td style="padding: 12px;">${statusBadge}</td>
                    <td style="padding: 12px;">${lockBtn}</td>
                </tr>
            `;
        }).join('');

        // Lock buttons
        container.querySelectorAll('.btn-lock').forEach(btn => {
            if (btn.disabled) return;
            btn.onclick = async () => {
                if (!confirm(`Lock account "${btn.dataset.username}"? They will not be able to login.`)) return;
                try {
                    await api.patch(`/users/${btn.dataset.id}/status`, { active: false });
                    loadUsers(container);
                } catch (err) {
                    alert('Error locking account: ' + err.message);
                }
            };
        });

        // Unlock buttons
        container.querySelectorAll('.btn-unlock').forEach(btn => {
            btn.onclick = async () => {
                try {
                    await api.patch(`/users/${btn.dataset.id}/status`, { active: true });
                    loadUsers(container);
                } catch (err) {
                    alert('Error unlocking account: ' + err.message);
                }
            };
        });

    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--status-danger); padding: 20px;">Error loading users.</td></tr>`;
    }
}
