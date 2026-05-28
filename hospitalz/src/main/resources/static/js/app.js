// app.js - Main Application Logic
import { initSettingsModal } from './modules/settings.js';

const sidebarNav = document.getElementById('sidebar-nav');
const roleSelect = document.getElementById('role-select');
const displayRole = document.getElementById('display-role');
const themeToggle = document.getElementById('theme-toggle');
const contentArea = document.getElementById('content-area');
const pageTitle = document.getElementById('page-title');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');

// Role Configurations based on the provided table
const roleConfig = {
    ADMIN: {
        name: 'Admin',
        menu: [
            { id: 'dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
            { id: 'users', icon: 'fa-user-shield', label: 'User Roles' },
            { id: 'staff', icon: 'fa-users-gear', label: 'Staff Management' },
            { id: 'rooms', icon: 'fa-door-open', label: 'Room Management' },
            { id: 'register', icon: 'fa-address-card', label: 'Patient Management' },
            { id: 'reports', icon: 'fa-file-lines', label: 'Billing & Reports' }
        ]
    },
    DOCTOR: {
        name: 'Doctor',
        menu: [
            { id: 'my-patients', icon: 'fa-user-injured', label: 'My Patients' },
            { id: 'appointments', icon: 'fa-calendar-check', label: 'My Appointments' },
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
            { id: 'ward-patients', icon: 'fa-bed-pulse', label: 'Admissions' },
            { id: 'appointments', icon: 'fa-calendar-check', label: 'Appointments' }
        ]
    },
    PATIENT: {
        name: 'Patient',
        menu: [
            { id: 'my-records', icon: 'fa-folder-open', label: 'My Records' },
            { id: 'my-bills', icon: 'fa-file-invoice-dollar', label: 'My Bills' },
            { id: 'appointments', icon: 'fa-calendar-check', label: 'Book Appointment' }
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
const moduleCache = {};
async function loadModule(moduleId, moduleTitle) {
    pageTitle.textContent = moduleTitle;
    contentArea.innerHTML = `<div class="loading-spinner"><i class="fa-solid fa-circle-notch fa-spin"></i> Loading...</div>`;
    
    // If already cached, reuse it — no API call
    if (moduleCache[moduleId]) {
        contentArea.innerHTML = '';
        contentArea.appendChild(moduleCache[moduleId]);
        return;
    }

    try {
        let module;
        let renderFunction;

        switch (moduleId) {
            case 'dashboard':
                module = await import('./modules/admin.js');
                renderFunction = module.renderAdminDashboard;
                break;
            case 'users': 
                module = await import('./modules/users.js');
                renderFunction = module.renderUsersList;
                break;
            case 'staff':
                module = await import('./modules/staff.js');
                renderFunction = module.renderStaffList;
                break;
            case 'rooms':
                module = await import('./modules/rooms.js');
                renderFunction = module.renderRoomList;
                break;
            case 'register':
                module = await import('./modules/patients.js');
                renderFunction = module.renderRegisterForm;
                break;
            case 'my-patients':
                module = await import('./modules/patients.js');
                renderFunction = module.renderDoctorPatientList;
                break;
            case 'ward-patients':
                module = await import('./modules/admissions.js');
                renderFunction = module.renderActiveAdmissions;
                break;
            case 'prescriptions':
                module = await import('./modules/treatments.js');
                renderFunction = module.renderTreatments;
                break;
            case 'my-bills':
            case 'reports': // Reusing reports tab for billing management for now
                module = await import('./modules/billing.js');
                renderFunction = module.renderBilling;
                break;
            // app.js — add inside the switch statemen
            case 'vitals':
                module = await import('./modules/vitals.js');
                renderFunction = module.renderVitalsDashboard;
                break;
            case 'appointments':
                module = await import('./modules/appointments.js');
                renderFunction = module.renderAppointments;
                break;
            case 'my-records':
                module = await import('./modules/records.js');
                renderFunction = module.renderPatientRecords;
                break;
            // Add other module cases as they are implemented
            default:
                contentArea.innerHTML = `<div class="glass-panel" style="padding: 20px;">Module <strong>${moduleId}</strong> is not yet implemented.</div>`;
                return;
        }

        if (renderFunction) {
            const content = await renderFunction();
            moduleCache[moduleId] = content;  // ← cache it
            contentArea.innerHTML = '';
            contentArea.appendChild(content);
        }
    } catch (error) {
        console.error("Error loading module:", error);
        contentArea.innerHTML = `<div class="glass-panel" style="padding: 20px; color: var(--status-danger);">Error loading module: ${error.message}</div>`;
    }
}

function decodeJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

function checkAuth() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
        window.location.href = '/auth.html';
        return false;
    }
    
    const decoded = decodeJwt(token);
    if (!decoded || !decoded.role) {
        logout();
        return false;
    }
    
    currentRole = decoded.role;
    // Sync to storage
    if (localStorage.getItem('token')) {
        localStorage.setItem('role', currentRole);
    } else {
        sessionStorage.setItem('role', currentRole);
    }

    const username = decoded.sub || localStorage.getItem('username') || sessionStorage.getItem('username');
    
    // Cập nhật tên hiển thị trên sidebar
    document.querySelector('.user-name').textContent = username || 'User';
    document.getElementById('display-role').textContent = roleConfig[currentRole]?.name || currentRole;
    
    return true;
}

// Thêm nút Logout trong Sidebar UI (tùy chọn) hoặc JS
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("doctorId");
    localStorage.removeItem("staffId");
    localStorage.removeItem("assignedWard");
    sessionStorage.clear();
    window.location.href = '/auth.html';
}

// --- Responsive UI ---
function initResponsiveUI() {
    if (mobileMenuBtn && sidebar && sidebarOverlay) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
        });

        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });

        // Close sidebar on window resize if moving to larger screen
        window.addEventListener('resize', () => {
            if (window.innerWidth > 767) {
                sidebar.classList.remove('active');
                sidebarOverlay.classList.remove('active');
            }
        });
        
        // Auto close sidebar when an item is clicked on mobile
        sidebarNav.addEventListener('click', (e) => {
            if (window.innerWidth <= 767 && e.target.closest('a.nav-item')) {
                sidebar.classList.remove('active');
                sidebarOverlay.classList.remove('active');
            }
        });
    }
}

// --- Initialization ---
function init() {
    if (!checkAuth()) return;
    
    initTheme();
    initResponsiveUI();
    initSettingsModal();
    
    // Setup Role Switcher - Disabled/Hidden in production and since JWT is source of truth
    if (roleSelect) {
        roleSelect.style.display = 'none';
        const label = roleSelect.previousElementSibling;
        if (label && label.tagName === 'LABEL') {
            label.style.display = 'none';
        }
        const parent = roleSelect.closest('.role-switcher');
        if (parent) {
            parent.style.display = 'none';
        }
    }

    // Setup Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Initial render
    renderSidebar();
    const firstModule = roleConfig[currentRole]?.menu[0];
    if (firstModule) {
        loadModule(firstModule.id, firstModule.label);
    } else {
        loadModule('dashboard', 'Dashboard');
    }
}

// Start app
document.addEventListener('DOMContentLoaded', init);
