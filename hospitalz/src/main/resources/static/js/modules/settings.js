import { api } from '../api.js';

export function initSettingsModal() {
    const settingsBtn = document.getElementById('settings-btn');
    const overlay = document.getElementById('settings-modal-overlay');
    const closeBtn = document.getElementById('settings-modal-close');
    const closeTriggers = document.querySelectorAll('.settings-close-trigger');
    const tabButtons = document.querySelectorAll('.settings-tab-btn');
    const profileTabBtn = document.getElementById('settings-tab-profile-btn');
    
    const passwordForm = document.getElementById('settings-password-form');
    const profileForm = document.getElementById('settings-profile-form');
    
    const successAlert = document.getElementById('settings-alert-success');
    const errorAlert = document.getElementById('settings-alert-error');
    
    // Toggle Password Visibility
    const togglePassBtns = document.querySelectorAll('.settings-toggle-pass');
    togglePassBtns.forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            const targetId = btn.dataset.target;
            const input = document.getElementById(targetId);
            const icon = btn.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fa-solid fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fa-solid fa-eye';
            }
        };
    });

    const getStorageItem = (key) => localStorage.getItem(key) || sessionStorage.getItem(key);

    function showAlert(type, message) {
        if (type === 'success') {
            errorAlert.style.display = 'none';
            successAlert.textContent = message;
            successAlert.style.display = 'block';
        } else {
            successAlert.style.display = 'none';
            errorAlert.textContent = message;
            errorAlert.style.display = 'block';
        }
    }

    function clearAlerts() {
        successAlert.style.display = 'none';
        errorAlert.style.display = 'none';
        successAlert.textContent = '';
        errorAlert.textContent = '';
    }

    async function openModal() {
        clearAlerts();
        passwordForm.reset();
        profileForm.reset();
        
        // Reset password visibility fields to password
        togglePassBtns.forEach(btn => {
            const targetId = btn.dataset.target;
            const input = document.getElementById(targetId);
            const icon = btn.querySelector('i');
            input.type = 'password';
            icon.className = 'fa-solid fa-eye';
        });

        // Determine if patient role
        const role = getStorageItem('role');
        if (role === 'PATIENT') {
            profileTabBtn.style.display = 'block';
        } else {
            profileTabBtn.style.display = 'none';
        }

        // Always activate password tab on open
        switchTab('tab-password');

        overlay.style.display = 'flex';
        // Trigger reflow for transition animation
        setTimeout(() => {
            overlay.classList.add('active');
        }, 10);
    }

    function closeModal() {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    }

    function switchTab(tabId) {
        clearAlerts();
        tabButtons.forEach(btn => {
            if (btn.dataset.tab === tabId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        document.querySelectorAll('.settings-tab-panel').forEach(panel => {
            if (panel.id === tabId) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });

        if (tabId === 'tab-profile') {
            loadPatientProfile();
        }
    }

    async function loadPatientProfile() {
        const patientId = getStorageItem('patientId');
        if (!patientId) {
            showAlert('error', 'Patient ID not found in session.');
            return;
        }

        try {
            const patient = await api.get(`/patients/${patientId}`);
            document.getElementById('settings-profile-patient-id').textContent = patient.patientId || 'N/A';
            document.getElementById('settings-profile-blood-group').textContent = patient.bloodGroup || 'N/A';
            document.getElementById('settings-profile-fullname').value = patient.fullName || '';
            document.getElementById('settings-profile-dob').value = patient.dateOfBirth || '';
            document.getElementById('settings-profile-gender').value = patient.gender || 'MALE';
            document.getElementById('settings-profile-phone').value = patient.phoneNumber || '';
            document.getElementById('settings-profile-email').value = patient.email || '';
            document.getElementById('settings-profile-address').value = patient.address || '';
            document.getElementById('settings-profile-emergency-name').value = patient.emergencyContactName || '';
            document.getElementById('settings-profile-emergency-phone').value = patient.emergencyContactPhone || '';
        } catch (error) {
            showAlert('error', 'Failed to load profile: ' + error.message);
        }
    }

    // Event Listeners
    if (settingsBtn) {
        settingsBtn.onclick = openModal;
    }
    if (closeBtn) {
        closeBtn.onclick = closeModal;
    }
    closeTriggers.forEach(trigger => {
        trigger.onclick = closeModal;
    });

    // Close on overlay click
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    };

    // Close on Esc key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeModal();
        }
    });

    // Tab switching
    tabButtons.forEach(btn => {
        btn.onclick = () => {
            switchTab(btn.dataset.tab);
        };
    });

    // Change password form submission
    passwordForm.onsubmit = async (e) => {
        e.preventDefault();
        clearAlerts();

        const currentPassword = document.getElementById('settings-current-password').value;
        const newPassword = document.getElementById('settings-new-password').value;
        const confirmPassword = document.getElementById('settings-confirm-password').value;

        if (newPassword !== confirmPassword) {
            showAlert('error', 'New passwords do not match.');
            return;
        }

        try {
            await api.patch('/users/me/password', { currentPassword, newPassword });
            showAlert('success', 'Password updated successfully! Closing settings...');
            setTimeout(() => {
                closeModal();
            }, 2000);
        } catch (error) {
            showAlert('error', error.message || 'Failed to update password.');
        }
    };

    // Profile form submission
    profileForm.onsubmit = async (e) => {
        e.preventDefault();
        clearAlerts();

        const data = {
            fullName: document.getElementById('settings-profile-fullname').value,
            dateOfBirth: document.getElementById('settings-profile-dob').value,
            gender: document.getElementById('settings-profile-gender').value,
            phoneNumber: document.getElementById('settings-profile-phone').value,
            email: document.getElementById('settings-profile-email').value,
            address: document.getElementById('settings-profile-address').value,
            emergencyContactName: document.getElementById('settings-profile-emergency-name').value,
            emergencyContactPhone: document.getElementById('settings-profile-emergency-phone').value
        };

        try {
            await api.patch('/patients/me', data);
            showAlert('success', 'Profile updated successfully! Closing settings...');
            
            // Cập nhật lại tên hiển thị nếu ở dashboard/sidebar
            const userDetailsName = document.querySelector('.user-details .user-name');
            if (userDetailsName) {
                userDetailsName.textContent = data.fullName;
            }

            setTimeout(() => {
                closeModal();
            }, 2000);
        } catch (error) {
            showAlert('error', error.message || 'Failed to update profile.');
        }
    };
}
