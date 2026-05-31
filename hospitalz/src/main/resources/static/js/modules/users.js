import { api } from '../api.js';

const PAGE_SIZE = 20;

export async function renderUsersList() {
    const container = document.createElement('div');
    let allUsers = [];
    let currentPage = 1;
    let searchQuery = '';
    let viewMode = 'role-compact'; // default view

    container.innerHTML = `
        <div class="glass-panel" style="padding: 24px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; margin-bottom: 20px;">
                <div>
                    <h2 style="margin-bottom: 8px;">User Management</h2>
                    <p style="color: var(--text-secondary);">
                        View and manage system accounts. Lock/unlock access, change roles, reset passwords, or add new Receptionist accounts.
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

            <!-- Search and View Toggle -->
            <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 20px; flex-wrap: wrap;">
                <input type="text" id="user-search" placeholder="Search username/role..." style="
                    padding: 8px 12px; border-radius: 6px;
                    border: 1px solid var(--border-color);
                    background: var(--bg-secondary); color: var(--text-primary);
                    min-width: 220px; flex: 1; max-width: 350px;
                ">
                <div style="display: flex; gap: 4px; border: 1px solid var(--border-color); border-radius: 6px; overflow: hidden;">
                    <button id="btn-view-role-compact" class="view-toggle-btn active" style="
                        padding: 8px 12px; border: none; cursor: pointer; font-size: 0.85em;
                        background: var(--accent-primary); color: white; font-weight: 600;
                    "><i class="fa-solid fa-layer-group"></i> Role</button>
                    <button id="btn-view-table" class="view-toggle-btn" style="
                        padding: 8px 12px; border: none; cursor: pointer; font-size: 0.85em;
                        background: var(--bg-secondary); color: var(--text-primary);
                    "><i class="fa-solid fa-table-list"></i> Table</button>
                </div>
            </div>

            <!-- Role Compact View (default) -->
            <div id="role-compact-view"></div>

            <!-- Table View (hidden by default) -->
            <div id="table-view" style="display: none; overflow-x: auto;">
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

            <!-- Pagination -->
            <div id="users-pagination" style="display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-color);"></div>
        </div>

        <!-- Credentials Modal (for new receptionist) -->
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

        <!-- Change Role Modal -->
        <div id="role-modal" style="
            display: none; position: fixed; inset: 0;
            background: rgba(0,0,0,0.5); z-index: 1000;
            align-items: center; justify-content: center;
        ">
            <div class="glass-panel" style="padding: 24px; max-width: 380px; width: 90%;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3>Change Role</h3>
                    <button id="role-modal-close" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-secondary);">&times;</button>
                </div>
                <div style="margin-bottom: 16px;">
                    <span style="color: var(--text-secondary); font-size: 0.85em;">User:</span>
                    <strong id="role-username-display"></strong>
                </div>
                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 6px; font-weight: 500;">New Role</label>
                    <select id="role-select-dropdown" style="
                        width: 100%; padding: 10px; border-radius: 6px;
                        border: 1px solid var(--border-color);
                        background: var(--bg-secondary);
                        color: var(--text-primary);
                        font-size: 1em;
                    ">
                        <option value="ADMIN">ADMIN</option>
                        <option value="DOCTOR">DOCTOR</option>
                        <option value="NURSE">NURSE</option>
                        <option value="WARD_BOY">WARD BOY</option>
                        <option value="RECEPTIONIST">RECEPTIONIST</option>
                        <option value="PATIENT">PATIENT</option>
                    </select>
                </div>
                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button id="role-modal-cancel" style="
                        padding: 8px 20px; border: 1px solid var(--border-color);
                        border-radius: 6px; background: transparent;
                        color: var(--text-primary); cursor: pointer; font-weight: 500;
                    ">Cancel</button>
                    <button id="role-modal-save" style="
                        padding: 8px 20px; border: none; border-radius: 6px;
                        background: var(--accent-primary); color: white;
                        cursor: pointer; font-weight: 600;
                    ">Save</button>
                </div>
            </div>
        </div>

        <!-- Reset Password Modal -->
        <div id="reset-password-modal" style="
            display: none; position: fixed; inset: 0;
            background: rgba(0,0,0,0.5); z-index: 1000;
            align-items: center; justify-content: center;
        ">
            <div class="glass-panel" style="padding: 24px; max-width: 400px; width: 90%;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3>Reset Password</h3>
                    <button id="reset-modal-close" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-secondary);">&times;</button>
                </div>
                <div style="margin-bottom: 16px;">
                    <span style="color: var(--text-secondary); font-size: 0.85em;">User:</span>
                    <strong id="reset-username-display"></strong>
                </div>
                <div style="margin-bottom: 24px;">
                    <label style="display: block; margin-bottom: 6px; font-weight: 500;">New Password</label>
                    <input type="password" id="reset-password-input" style="
                        width: 100%; padding: 10px; border-radius: 6px;
                        border: 1px solid var(--border-color);
                        background: var(--bg-secondary);
                        color: var(--text-primary);
                        font-size: 1em;
                    " placeholder="At least 8 chars, 1 uppercase, 1 lowercase, 1 number">
                    <div style="font-size: 0.8em; color: var(--text-secondary); margin-top: 4px;">
                        Must be at least 8 characters, include uppercase, lowercase, and a number.
                    </div>
                </div>
                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button id="reset-modal-cancel" style="
                        padding: 8px 20px; border: 1px solid var(--border-color);
                        border-radius: 6px; background: transparent;
                        color: var(--text-primary); cursor: pointer; font-weight: 500;
                    ">Cancel</button>
                    <button id="reset-modal-save" style="
                        padding: 8px 20px; border: none; border-radius: 6px;
                        background: var(--accent-primary); color: white;
                        cursor: pointer; font-weight: 600;
                    ">Reset Password</button>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        loadUsersData().then(data => {
            allUsers = data || [];
            renderAll();
        });

        // Search input
        container.querySelector('#user-search').addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            currentPage = 1;
            renderAll();
        });

        // View toggle: Role Compact
        container.querySelector('#btn-view-role-compact').addEventListener('click', () => {
            viewMode = 'role-compact';
            currentPage = 1;
            updateViewToggle(container);
            renderAll();
        });

        // View toggle: Table
        container.querySelector('#btn-view-table').addEventListener('click', () => {
            viewMode = 'table';
            currentPage = 1;
            updateViewToggle(container);
            renderAll();
        });

        // Add Receptionist button
        container.querySelector('#btn-add-receptionist').onclick = async () => {
            if (!confirm('Create a new Receptionist account? Username and password will be auto-generated.')) return;
            try {
                const result = await api.post('/users/receptionist', {});
                const modal = container.querySelector('#credentials-modal');
                container.querySelector('#cred-username').textContent = result.username;
                container.querySelector('#cred-password').textContent = result.defaultPassword;
                modal.style.display = 'flex';
                container.querySelector('#cred-close-btn').onclick = () => {
                    modal.style.display = 'none';
                    loadUsersData().then(data => {
                        allUsers = data || [];
                        renderAll();
                    });
                };
            } catch (err) {
                showToast('Error creating receptionist: ' + err.message, 'error');
            }
        };

        function updateViewToggle(container) {
            const roleCompactBtn = container.querySelector('#btn-view-role-compact');
            const tableBtn = container.querySelector('#btn-view-table');
            if (viewMode === 'role-compact') {
                roleCompactBtn.style.background = 'var(--accent-primary)';
                roleCompactBtn.style.color = 'white';
                tableBtn.style.background = 'var(--bg-secondary)';
                tableBtn.style.color = 'var(--text-primary)';
            } else {
                tableBtn.style.background = 'var(--accent-primary)';
                tableBtn.style.color = 'white';
                roleCompactBtn.style.background = 'var(--bg-secondary)';
                roleCompactBtn.style.color = 'var(--text-primary)';
            }
        }

        function getFilteredUsers() {
            if (!searchQuery) return allUsers;
            return allUsers.filter(u =>
                (u.username && u.username.toLowerCase().includes(searchQuery)) ||
                (u.role && u.role.toLowerCase().includes(searchQuery))
            );
        }

        function renderAll() {
            const filtered = getFilteredUsers();

            if (viewMode === 'role-compact') {
                // Role compact view: show ALL users grouped by role (no pagination)
                renderRoleCompactView(filtered, container);
                container.querySelector('#role-compact-view').style.display = '';
                container.querySelector('#table-view').style.display = 'none';
                // Hide pagination in role compact view
                container.querySelector('#users-pagination').innerHTML = `<span style="color: var(--text-secondary); font-size: 0.85em;">Showing ${filtered.length} of ${filtered.length} users</span>`;
            } else {
                // Table view: paginate as before
                const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
                if (currentPage > totalPages) currentPage = totalPages;
                const startIdx = (currentPage - 1) * PAGE_SIZE;
                const paged = filtered.slice(startIdx, startIdx + PAGE_SIZE);
                renderTableView(paged, container);
                container.querySelector('#role-compact-view').style.display = 'none';
                container.querySelector('#table-view').style.display = '';
                renderPagination(filtered.length, totalPages, container);
            }
        }

        function renderRoleCompactView(users, container) {
            const viewEl = container.querySelector('#role-compact-view');
            if (!users || users.length === 0) {
                viewEl.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--text-secondary);">No users found.</div>';
                return;
            }

            // Group by role
            const roleGroups = {};
            const roleOrder = ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'WARD_BOY', 'PATIENT'];
            users.forEach(u => {
                if (!roleGroups[u.role]) roleGroups[u.role] = [];
                roleGroups[u.role].push(u);
            });

            const roleColors = {
                'ADMIN': '#ef4444',
                'DOCTOR': '#3b82f6',
                'NURSE': '#10b981',
                'RECEPTIONIST': '#f59e0b',
                'WARD_BOY': '#8b5cf6',
                'PATIENT': '#6b7280'
            };

            const roleIcons = {
                'ADMIN': 'fa-user-shield',
                'DOCTOR': 'fa-user-doctor',
                'NURSE': 'fa-user-nurse',
                'RECEPTIONIST': 'fa-desktop',
                'WARD_BOY': 'fa-broom',
                'PATIENT': 'fa-user-injured'
            };

            let html = '';
            roleOrder.forEach(role => {
                const group = roleGroups[role];
                if (!group) return;
                const color = roleColors[role] || 'var(--accent-primary)';
                const icon = roleIcons[role] || 'fa-user';

                html += `
                    <div style="margin-bottom: 20px; border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden;">
                        <div style="background: ${color}15; padding: 10px 16px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 700; color: ${color}; display: flex; align-items: center; gap: 8px;">
                                <i class="fa-solid ${icon}"></i> ${role.replace('_', ' ')}
                            </span>
                            <span style="background: ${color}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.8em; font-weight: 600;">${group.length}</span>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px; padding: 12px;">
                            ${group.map(u => {
                                const isCurrentUser = u.username === (localStorage.getItem('username') || sessionStorage.getItem('username'));
                                const statusDot = u.active
                                    ? '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#10b981;margin-right:4px;"></span>'
                                    : '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#ef4444;margin-right:4px;"></span>';
                                return `
                                    <div style="
                                        display: flex; align-items: center; gap: 6px;
                                        padding: 6px 12px; border: 1px solid var(--border-color);
                                        border-radius: 6px; font-size: 0.88em;
                                        ${!u.active ? 'opacity: 0.5;' : ''}
                                        ${isCurrentUser ? 'border-color: var(--accent-primary); background: rgba(var(--accent-primary-rgb, 14,165,233), 0.05);' : ''}
                                    ">
                                        ${statusDot}
                                        <span style="font-weight: 500;">${u.username}</span>
                                        ${isCurrentUser ? '<span style="font-size:0.75em;color:var(--accent-primary);">(You)</span>' : ''}
                                        <span style="display: flex; gap: 4px; margin-left: 4px;">
                                            ${!isCurrentUser ? `
                                                <button class="btn-change-role" data-id="${u.id}" data-username="${u.username}" data-role="${u.role}" title="Change Role" style="background:none;border:none;cursor:pointer;color:#6366f1;font-size:0.9em;padding:2px;"><i class="fa-solid fa-user-tag"></i></button>
                                                <button class="btn-reset-pwd" data-id="${u.id}" data-username="${u.username}" title="Reset Password" style="background:none;border:none;cursor:pointer;color:#f59e0b;font-size:0.9em;padding:2px;"><i class="fa-solid fa-key"></i></button>
                                                ${u.active
                                                    ? `<button class="btn-lock" data-id="${u.id}" data-username="${u.username}" title="Lock" style="background:none;border:none;cursor:pointer;color:#ef4444;font-size:0.9em;padding:2px;"><i class="fa-solid fa-lock"></i></button>`
                                                    : `<button class="btn-unlock" data-id="${u.id}" data-username="${u.username}" title="Unlock" style="background:none;border:none;cursor:pointer;color:#10b981;font-size:0.9em;padding:2px;"><i class="fa-solid fa-lock-open"></i></button>`
                                                }
                                            ` : ''}
                                        </span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
            });

            viewEl.innerHTML = html;
            attachActionHandlers(container);
        }

        function renderTableView(users, container) {
            const tbody = container.querySelector('#users-table-body');
            const currentUser = localStorage.getItem('username') || sessionStorage.getItem('username');

            if (!users || users.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px;">No users found.</td></tr>';
                return;
            }

            tbody.innerHTML = users.map(u => {
                const isCurrentUser = u.username === currentUser;
                const statusBadge = u.active
                    ? `<span style="background: #d1fae5; color: #065f46; padding: 3px 10px; border-radius: 20px; font-size: 0.82em; font-weight: 600;">Active</span>`
                    : `<span style="background: #fee2e2; color: #991b1b; padding: 3px 10px; border-radius: 20px; font-size: 0.82em; font-weight: 600;">Locked</span>`;

                const lockBtn = u.active
                    ? `<button class="btn-lock" data-id="${u.id}" data-username="${u.username}"
                        style="padding: 5px 10px; background: #ef4444; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.82em;"
                        ${isCurrentUser ? 'disabled title="Cannot lock your own account"' : ''}>
                        <i class="fa-solid fa-lock"></i> Lock
                       </button>`
                    : `<button class="btn-unlock" data-id="${u.id}" data-username="${u.username}"
                        style="padding: 5px 10px; background: var(--status-success); color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.82em;">
                        <i class="fa-solid fa-lock-open"></i> Unlock
                       </button>`;

                const roleBtn = `<button class="btn-change-role" data-id="${u.id}" data-username="${u.username}" data-role="${u.role}"
                    style="padding: 5px 10px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.82em;"
                    ${isCurrentUser ? 'disabled title="Cannot change your own role"' : ''}>
                    <i class="fa-solid fa-user-tag"></i> Role
                   </button>`;

                const resetPwdBtn = `<button class="btn-reset-pwd" data-id="${u.id}" data-username="${u.username}"
                    style="padding: 5px 10px; background: #f59e0b; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.82em;">
                    <i class="fa-solid fa-key"></i> Password
                   </button>`;

                const actionsHtml = isCurrentUser
                    ? `<span style="color: var(--text-secondary); font-size: 0.82em;">—</span>`
                    : `<div style="display: flex; gap: 6px; flex-wrap: wrap;">
                            ${lockBtn}
                            ${roleBtn}
                            ${resetPwdBtn}
                       </div>`;

                return `
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <td style="padding: 12px; color: var(--text-secondary); font-size: 0.9em;">${u.id}</td>
                        <td style="padding: 12px; font-weight: 500;">
                            ${u.username}
                            ${isCurrentUser ? '<span style="font-size:0.8em;color:var(--accent-primary); margin-left: 4px;">(You)</span>' : ''}
                        </td>
                        <td style="padding: 12px;">
                            <span style="background: var(--bg-secondary); padding: 4px 8px; border-radius: 4px; border: 1px solid var(--border-color); font-size: 0.85em;">
                                ${u.role}
                            </span>
                        </td>
                        <td style="padding: 12px;">${statusBadge}</td>
                        <td style="padding: 12px;">${actionsHtml}</td>
                    </tr>
                `;
            }).join('');

            attachActionHandlers(container);
        }

        function renderPagination(totalItems, totalPages, container) {
            const pagEl = container.querySelector('#users-pagination');
            if (totalItems <= PAGE_SIZE) {
                pagEl.innerHTML = `<span style="color: var(--text-secondary); font-size: 0.85em;">Showing ${totalItems} of ${totalItems}</span>`;
                return;
            }

            const start = (currentPage - 1) * PAGE_SIZE + 1;
            const end = Math.min(currentPage * PAGE_SIZE, totalItems);

            let btns = '';
            btns += `<button class="pg-btn" data-page="1" style="padding: 6px 10px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); cursor: pointer; font-size: 0.85em;" ${currentPage === 1 ? 'disabled style="opacity:0.4;cursor:default;padding:6px 10px;border:1px solid var(--border-color);border-radius:4px;background:var(--bg-secondary);color:var(--text-primary);font-size:0.85em;"' : ''}><i class="fa-solid fa-angles-left"></i></button>`;
            btns += `<button class="pg-btn" data-page="${currentPage - 1}" style="padding: 6px 10px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); cursor: pointer; font-size: 0.85em;" ${currentPage === 1 ? 'disabled style="opacity:0.4;cursor:default;padding:6px 10px;border:1px solid var(--border-color);border-radius:4px;background:var(--bg-secondary);color:var(--text-primary);font-size:0.85em;"' : ''}><i class="fa-solid fa-chevron-left"></i></button>`;

            // Show page numbers (max 5 around current)
            const maxVisible = 5;
            let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
            let endPage = Math.min(totalPages, startPage + maxVisible - 1);
            if (endPage - startPage < maxVisible - 1) startPage = Math.max(1, endPage - maxVisible + 1);

            for (let i = startPage; i <= endPage; i++) {
                const isActive = i === currentPage;
                btns += `<button class="pg-btn" data-page="${i}" style="padding: 6px 12px; border: 1px solid ${isActive ? 'var(--accent-primary)' : 'var(--border-color)'}; border-radius: 4px; background: ${isActive ? 'var(--accent-primary)' : 'var(--bg-secondary)'}; color: ${isActive ? 'white' : 'var(--text-primary)'}; cursor: pointer; font-size: 0.85em; font-weight: ${isActive ? '700' : '400'};">${i}</button>`;
            }

            btns += `<button class="pg-btn" data-page="${currentPage + 1}" style="padding: 6px 10px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); cursor: pointer; font-size: 0.85em;" ${currentPage === totalPages ? 'disabled style="opacity:0.4;cursor:default;padding:6px 10px;border:1px solid var(--border-color);border-radius:4px;background:var(--bg-secondary);color:var(--text-primary);font-size:0.85em;"' : ''}><i class="fa-solid fa-chevron-right"></i></button>`;
            btns += `<button class="pg-btn" data-page="${totalPages}" style="padding: 6px 10px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); cursor: pointer; font-size: 0.85em;" ${currentPage === totalPages ? 'disabled style="opacity:0.4;cursor:default;padding:6px 10px;border:1px solid var(--border-color);border-radius:4px;background:var(--bg-secondary);color:var(--text-primary);font-size:0.85em;"' : ''}><i class="fa-solid fa-angles-right"></i></button>`;

            pagEl.innerHTML = `
                <span style="color: var(--text-secondary); font-size: 0.85em; margin-right: 8px;">${start}–${end} of ${totalItems}</span>
                ${btns}
            `;

            pagEl.querySelectorAll('.pg-btn').forEach(btn => {
                if (btn.disabled) return;
                btn.addEventListener('click', () => {
                    currentPage = parseInt(btn.dataset.page);
                    renderAll();
                });
            });
        }

        function attachActionHandlers(container) {
            // Lock buttons
            container.querySelectorAll('.btn-lock').forEach(btn => {
                if (btn.disabled) return;
                btn.onclick = async () => {
                    if (!confirm(`Lock account "${btn.dataset.username}"? They will not be able to login.`)) return;
                    try {
                        await api.patch(`/users/${btn.dataset.id}/status`, { active: false });
                        loadUsersData().then(data => { allUsers = data || []; renderAll(); });
                        showToast(`Account "${btn.dataset.username}" locked.`, 'warning');
                    } catch (err) {
                        showToast('Error locking account: ' + err.message, 'error');
                    }
                };
            });

            // Unlock buttons
            container.querySelectorAll('.btn-unlock').forEach(btn => {
                btn.onclick = async () => {
                    try {
                        await api.patch(`/users/${btn.dataset.id}/status`, { active: true });
                        loadUsersData().then(data => { allUsers = data || []; renderAll(); });
                        showToast(`Account "${btn.dataset.username}" unlocked.`, 'success');
                    } catch (err) {
                        showToast('Error unlocking account: ' + err.message, 'error');
                    }
                };
            });

            // Change Role buttons
            container.querySelectorAll('.btn-change-role').forEach(btn => {
                if (btn.disabled) return;
                btn.onclick = () => {
                    const modal = container.querySelector('#role-modal');
                    container.querySelector('#role-username-display').textContent = btn.dataset.username;
                    container.querySelector('#role-select-dropdown').value = btn.dataset.role;
                    modal.style.display = 'flex';
                    modal.dataset.userId = btn.dataset.id;
                    modal.dataset.username = btn.dataset.username;
                };
            });

            // Role modal: close/cancel
            const roleModal = container.querySelector('#role-modal');
            container.querySelector('#role-modal-close').onclick = () => roleModal.style.display = 'none';
            container.querySelector('#role-modal-cancel').onclick = () => roleModal.style.display = 'none';
            roleModal.addEventListener('click', (e) => {
                if (e.target === roleModal) roleModal.style.display = 'none';
            });
            // Role modal: save
            container.querySelector('#role-modal-save').onclick = async () => {
                const userId = roleModal.dataset.userId;
                const username = roleModal.dataset.username;
                const newRole = container.querySelector('#role-select-dropdown').value;
                try {
                    await api.patch(`/users/${userId}/role`, { role: newRole });
                    roleModal.style.display = 'none';
                    loadUsersData().then(data => { allUsers = data || []; renderAll(); });
                    showToast(`Role for "${username}" changed to ${newRole}.`, 'success');
                } catch (err) {
                    showToast('Error changing role: ' + err.message, 'error');
                }
            };

            // Reset Password buttons
            container.querySelectorAll('.btn-reset-pwd').forEach(btn => {
                btn.onclick = () => {
                    const modal = container.querySelector('#reset-password-modal');
                    container.querySelector('#reset-username-display').textContent = btn.dataset.username;
                    container.querySelector('#reset-password-input').value = '';
                    modal.style.display = 'flex';
                    modal.dataset.userId = btn.dataset.id;
                    modal.dataset.username = btn.dataset.username;
                };
            });

            // Reset password modal: close/cancel
            const resetModal = container.querySelector('#reset-password-modal');
            container.querySelector('#reset-modal-close').onclick = () => resetModal.style.display = 'none';
            container.querySelector('#reset-modal-cancel').onclick = () => resetModal.style.display = 'none';
            resetModal.addEventListener('click', (e) => {
                if (e.target === resetModal) resetModal.style.display = 'none';
            });
            // Reset password modal: save
            container.querySelector('#reset-modal-save').onclick = async () => {
                const userId = resetModal.dataset.userId;
                const username = resetModal.dataset.username;
                const newPassword = container.querySelector('#reset-password-input').value;

                if (!newPassword || newPassword.trim() === '') {
                    showToast('Please enter a new password.', 'error');
                    return;
                }

                if (!newPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/)) {
                    showToast('Password must be at least 8 characters, include uppercase, lowercase, and a number.', 'error');
                    return;
                }

                try {
                    await api.patch(`/users/${userId}/reset-password`, { newPassword });
                    resetModal.style.display = 'none';
                    showToast(`Password for "${username}" reset successfully.`, 'success');
                } catch (err) {
                    showToast('Error resetting password: ' + err.message, 'error');
                }
            };
        }

    }, 0);

    return container;
}

async function loadUsersData() {
    try {
        return await api.get('/users');
    } catch (error) {
        console.error(error);
        return [];
    }
}