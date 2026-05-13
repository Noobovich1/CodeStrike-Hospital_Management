// modules/admin.js

export function renderAdminDashboard() {
    const container = document.createElement('div');
    
    container.innerHTML = `
        <div class="dashboard-grid">
            <div class="glass-panel stat-card">
                <div class="stat-info">
                    <h3>Active Admissions</h3>
                    <div class="stat-value">124</div>
                </div>
                <div class="stat-icon icon-blue">
                    <i class="fa-solid fa-bed-pulse"></i>
                </div>
            </div>
            
            <div class="glass-panel stat-card">
                <div class="stat-info">
                    <h3>Available Rooms</h3>
                    <div class="stat-value">32</div>
                </div>
                <div class="stat-icon icon-green">
                    <i class="fa-solid fa-door-open"></i>
                </div>
            </div>
            
            <div class="glass-panel stat-card">
                <div class="stat-info">
                    <h3>Doctors on Duty</h3>
                    <div class="stat-value">18</div>
                </div>
                <div class="stat-icon icon-amber">
                    <i class="fa-solid fa-user-doctor"></i>
                </div>
            </div>
            
            <div class="glass-panel stat-card">
                <div class="stat-info">
                    <h3>Critical Alerts</h3>
                    <div class="stat-value">3</div>
                </div>
                <div class="stat-icon icon-red">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>
            </div>
        </div>
        
        <div class="glass-panel" style="padding: 24px; min-height: 300px;">
            <h3 style="margin-bottom: 20px; font-weight: 600;">Recent Activity</h3>
            <p style="color: var(--text-secondary);">Waiting for API integration to display real activity logs.</p>
        </div>
    `;
    
    return container;
}
