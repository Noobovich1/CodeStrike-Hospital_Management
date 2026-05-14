// app.js - Main Application Logic

const sidebarNav = document.getElementById('sidebar-nav');
const roleSelect = document.getElementById('role-select');
const displayRole = document.getElementById('display-role');
const themeToggle = document.getElementById('theme-toggle');
const contentArea = document.getElementById('content-area');
const pageTitle = document.getElementById('page-title');

// Role Configurations based on the provided table
const roleConfig = {
    ADMIN: {
        name: 'Admin',
        menu: [
            { id: 'dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
            { id: 'staff', icon: 'fa-users-gear', label: 'Staff Management' },
            { id: 'reports', icon: 'fa-file-lines', label: 'Reports' }
        ]
    },
    DOCTOR: {
        name: 'Doctor',
        menu: [
            { id: 'my-patients', icon: 'fa-user-injured', label: 'My Patients' },
            { id: 'prescriptions', icon: 'fa-pills', label: 'Prescriptions' }
        ]
    },
    NURSE: {
        name: 'Nurse',
        menu: [
            { id: 'ward-patients', icon: 'fa-bed-pulse', label: 'Ward Patients' },
            { id: 'vitals', icon: 'fa-heart-pulse', label: 'Vitals & Logs' }
        ]
    },
    WARD_BOY: {
        name: 'Ward Boy',
        menu: [
            { id: 'rooms', icon: 'fa-door-open', label: 'Room Status' }
        ]
    },
    RECEPTIONIST: {
        name: 'Receptionist',
        menu: [
            { id: 'register', icon: 'fa-address-card', label: 'Register Patient' },
            { id: 'appointments', icon: 'fa-calendar-check', label: 'Appointments' }
        ]
    },
    PATIENT: {
        name: 'Patient',
        menu: [
            { id: 'my-records', icon: 'fa-folder-open', label: 'My Records' },
            { id: 'my-bills', icon: 'fa-file-invoice-dollar', label: 'My Bills' }
        ]
    }
};

let currentRole = 'ADMIN';

// --- Theme Management ---
function initTheme() {
    // Check local storage or set light as default
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fa-solid fa-sun';
    } else {
        icon.className = 'fa-solid fa-moon';
    }
}

// --- Navigation Management ---
function renderSidebar() {
    const config = roleConfig[currentRole];
    sidebarNav.innerHTML = '';
    
    config.menu.forEach((item, index) => {
        const a = document.createElement('a');
        a.href = '#';
        a.className = `nav-item ${index === 0 ? 'active' : ''}`;
        a.innerHTML = `<i class="fa-solid ${item.icon}"></i> <span>${item.label}</span>`;
        
        a.addEventListener('click', (e) => {
            e.preventDefault();
            // Update active state
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
            a.classList.add('active');
            
            // Load content
            loadModule(item.id, item.label);
        });
        
        sidebarNav.appendChild(a);
    });
}

// --- Content Loading ---
async function loadModule(moduleId, moduleTitle) {
    pageTitle.textContent = moduleTitle;
    contentArea.innerHTML = `<div class="loading-spinner"><i class="fa-solid fa-circle-notch fa-spin"></i> Loading...</div>`;
    
    try {
        // Dynamically import the module if it exists
        // Since we don't have a bundler, we'll simulate loading
        if (currentRole === 'ADMIN' && moduleId === 'dashboard') {
            const { renderAdminDashboard } = await import('./modules/admin.js');
            contentArea.innerHTML = '';
            contentArea.appendChild(renderAdminDashboard());
        } else {
            // Mock UI for un-implemented modules
            setTimeout(() => {
                contentArea.innerHTML = `
                    <div class="glass-panel" style="padding: 40px; text-align: center;">
                        <i class="fa-solid fa-person-digging" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 20px;"></i>
                        <h2 style="margin-bottom: 10px;">${moduleTitle} Module</h2>
                        <p style="color: var(--text-secondary);">This module is currently under development or mocked for the <strong>${roleConfig[currentRole].name}</strong> role.</p>
                    </div>
                `;
            }, 500);
        }
    } catch (error) {
        console.error("Error loading module:", error);
        contentArea.innerHTML = `<div class="glass-panel" style="padding: 20px; color: var(--status-danger);">Error loading module: ${error.message}</div>`;
    }
}
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/auth.html';
        return false;
    }
    
    // Lấy thông tin từ localStorage để hiển thị UI
    currentRole = localStorage.getItem('role') || 'PATIENT';
    const username = localStorage.getItem('username');
    
    // Cập nhật tên hiển thị trên sidebar
    document.querySelector('.user-name').textContent = username;
    document.getElementById('display-role').textContent = currentRole;
    
    return true;
}

// Thêm nút Logout trong Sidebar UI (tùy chọn) hoặc JS
function logout() {
    localStorage.clear();
    window.location.href = '/auth.html';
}

// --- Initialization ---
function init() {
    
    initTheme();
    
    // Setup Role Switcher
    roleSelect.value = currentRole;
    roleSelect.addEventListener('change', (e) => {
        currentRole = e.target.value;
        displayRole.textContent = roleConfig[currentRole].name;
        renderSidebar();
        
        // Auto load first module of the new role
        const firstModule = roleConfig[currentRole].menu[0];
        if (firstModule) {
            loadModule(firstModule.id, firstModule.label);
        }
    });
    
    // Initial render
    renderSidebar();
    loadModule('dashboard', 'Dashboard');
}

// Start app
document.addEventListener('DOMContentLoaded', init);
