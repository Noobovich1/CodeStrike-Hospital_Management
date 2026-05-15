import { api } from '../api.js';

export async function renderAdminDashboard() {
    const container = document.createElement('div');
    
    container.innerHTML = `
        <div class="dashboard-grid" id="admin-stats-grid">
            <div class="glass-panel stat-card">
                <div class="stat-info">
                    <h3>Active Admissions</h3>
                    <div class="stat-value" id="stat-admissions">...</div>
                </div>
                <div class="stat-icon icon-blue">
                    <i class="fa-solid fa-bed-pulse"></i>
                </div>
            </div>
            
            <div class="glass-panel stat-card">
                <div class="stat-info">
                    <h3>Available Rooms</h3>
                    <div class="stat-value" id="stat-rooms">...</div>
                </div>
                <div class="stat-icon icon-green">
                    <i class="fa-solid fa-door-open"></i>
                </div>
            </div>
            
            <div class="glass-panel stat-card">
                <div class="stat-info">
                    <h3>Doctors on Duty</h3>
                    <div class="stat-value" id="stat-doctors">...</div>
                </div>
                <div class="stat-icon icon-amber">
                    <i class="fa-solid fa-user-doctor"></i>
                </div>
            </div>
            
            <div class="glass-panel stat-card">
                <div class="stat-info">
                    <h3>Total Revenue</h3>
                    <div class="stat-value" id="stat-revenue">...</div>
                </div>
                <div class="stat-icon icon-red">
                    <i class="fa-solid fa-sack-dollar"></i>
                </div>
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
            <div class="glass-panel" style="padding: 24px;">
                <h3 style="margin-bottom: 20px; font-weight: 600;">Room Occupancy</h3>
                <canvas id="occupancyChart"></canvas>
            </div>
            <div class="glass-panel" style="padding: 24px;">
                <h3 style="margin-bottom: 20px; font-weight: 600;">Revenue (Làm ccj để tính revenue đi nha)</h3>
                <canvas id="revenueChart"></canvas>
            </div>
        </div>
    `;

    // Load Chart.js dynamically if not present
    if (!window.Chart) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = () => loadDashboardData(container);
        document.head.appendChild(script);
    } else {
        setTimeout(() => loadDashboardData(container), 0);
    }

    return container;
}

async function loadDashboardData(container) {
    try {
        // Fetch all data in parallel for maximum speed
        const [admissions, rooms, staff, bills, doctors] = await Promise.all([
            api.get('/admissions/active').catch(() => []),
            api.get('/rooms').catch(() => []),
            api.get('/staff').catch(() => []),
            api.get('/bills').catch(() => []),
            api.get('/doctors').catch(() => [])
        ]);

        // Update stats
        container.querySelector('#stat-admissions').textContent = admissions.length;
        
        const availableRooms = rooms.filter(r => r.status === 'AVAILABLE').length;
        container.querySelector('#stat-rooms').textContent = availableRooms;
        
        const activeDoctors = doctors.filter(d => d.isActive).length;
        container.querySelector('#stat-doctors').textContent = activeDoctors;

        const totalRevenue = bills.reduce((sum, b) => sum + (b.paidAmount || 0), 0);
        container.querySelector('#stat-revenue').textContent = '$' + totalRevenue.toFixed(2);

        // Render Charts
        renderCharts(container, rooms, bills);
    } catch (e) {
        console.error("Dashboard error:", e);
    }
}

function renderCharts(container, rooms, bills) {
    const ctxOcc = container.querySelector('#occupancyChart').getContext('2d');
    const ctxRev = container.querySelector('#revenueChart').getContext('2d');

    const roomTypes = [...new Set(rooms.map(r => r.roomType))];
    const occupancyData = roomTypes.map(type => {
        const typeRooms = rooms.filter(r => r.roomType === type);
        const capacity = typeRooms.reduce((sum, r) => sum + r.capacity, 0);
        const occupied = typeRooms.reduce((sum, r) => sum + r.currentOccupancy, 0);
        return capacity > 0 ? (occupied / capacity) * 100 : 0;
    });

    new Chart(ctxOcc, {
        type: 'bar',
        data: {
            labels: roomTypes,
            datasets: [{
                label: 'Occupancy %',
                data: occupancyData,
                backgroundColor: 'rgba(14, 165, 233, 0.6)',
                borderColor: 'rgba(14, 165, 233, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: { y: { beginAtZero: true, max: 100 } }
        }
    });

    // Mock trend for revenue (In reality, group bills by date)
    new Chart(ctxRev, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Revenue Trend',
                data: [1200, 1900, 3000, 5000, 2000, 3000],
                borderColor: 'rgba(16, 185, 129, 1)',
                tension: 0.1,
                fill: false
            }]
        }
    });
}
