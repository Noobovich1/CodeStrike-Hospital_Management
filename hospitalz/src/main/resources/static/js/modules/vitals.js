import { api } from '../api.js';

export async function renderVitalsDashboard() {
    const container = document.createElement('div');
    
    container.innerHTML = `
        <!-- Dashboard Stats Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 24px;">
            <div class="glass-panel card-stats" style="padding: 20px; display: flex; align-items: center; gap: 16px; border-left: 4px solid var(--accent-primary);">
                <div style="background: rgba(14, 165, 233, 0.1); width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--accent-primary); font-size: 1.5rem;">
                    <i class="fa-solid fa-heart-pulse"></i>
                </div>
                <div>
                    <h3 id="stat-total-logs" style="margin: 0; font-size: 1.8rem; font-weight: 700; color: var(--text-primary);">0</h3>
                    <p style="margin: 4px 0 0 0; font-size: 0.85em; color: var(--text-secondary); font-weight: 500;">Total Readings Logged</p>
                </div>
            </div>
            
            <div class="glass-panel card-stats" style="padding: 20px; display: flex; align-items: center; gap: 16px; border-left: 4px solid var(--status-danger);">
                <div style="background: rgba(239, 68, 68, 0.1); width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--status-danger); font-size: 1.5rem;">
                    <i class="fa-solid fa-droplet-slash"></i>
                </div>
                <div>
                    <h3 id="stat-critical-spo2" style="margin: 0; font-size: 1.8rem; font-weight: 700; color: var(--status-danger);">0</h3>
                    <p style="margin: 4px 0 0 0; font-size: 0.85em; color: var(--text-secondary); font-weight: 500;">Critical Oxygen Levels (<95%)</p>
                </div>
            </div>
            
            <div class="glass-panel card-stats" style="padding: 20px; display: flex; align-items: center; gap: 16px; border-left: 4px solid var(--status-warning);">
                <div style="background: rgba(245, 158, 11, 0.1); width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--status-warning); font-size: 1.5rem;">
                    <i class="fa-solid fa-temperature-high"></i>
                </div>
                <div>
                    <h3 id="stat-avg-temp" style="margin: 0; font-size: 1.8rem; font-weight: 700; color: var(--text-primary);">0.0°C</h3>
                    <p style="margin: 4px 0 0 0; font-size: 0.85em; color: var(--text-secondary); font-weight: 500;">Average Temperature</p>
                </div>
            </div>
        </div>

        <div class="glass-panel" style="padding: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 16px;">
                <h2 style="margin: 0;">Patient Vitals & Health Logs</h2>
                <div style="display: flex; gap: 12px; align-items: center;">
                    <i class="fa-solid fa-magnifying-glass" style="color: var(--text-secondary); position: absolute; margin-left: 12px;"></i>
                    <input type="text" id="search-vitals" placeholder="Search by patient ID or name..." 
                        style="padding: 8px 12px 8px 36px; border: 1px solid var(--border-color); border-radius: 8px; background: var(--bg-secondary); color: var(--text-primary); width: 250px; font-size: 0.9em;">
                    <button id="btn-refresh-vitals" class="btn" style="padding: 8px 16px; border: 1px solid var(--border-color); border-radius: 8px; cursor: pointer; background: var(--bg-secondary); color: var(--text-primary); display: flex; align-items: center; gap: 6px;">
                        <i class="fa-solid fa-rotate"></i> Refresh
                    </button>
                </div>
            </div>

            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--border-color);">
                            <th style="padding: 12px;">Patient</th>
                            <th style="padding: 12px;">Blood Pressure</th>
                            <th style="padding: 12px;">Temperature</th>
                            <th style="padding: 12px;">Pulse (HR)</th>
                            <th style="padding: 12px;">Oxygen Level (SpO2)</th>
                            <th style="padding: 12px;">Recorded By</th>
                            <th style="padding: 12px;">Recorded At</th>
                        </tr>
                    </thead>
                    <tbody id="vitals-table-body">
                        <tr><td colspan="7" style="text-align: center; padding: 20px;">Loading health logs...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;

    setTimeout(() => loadVitalsData(container), 0);

    return container;
}

async function loadVitalsData(container) {
    const tbody = container.querySelector('#vitals-table-body');
    const searchInput = container.querySelector('#search-vitals');
    const refreshBtn = container.querySelector('#btn-refresh-vitals');

    let allLogs = [];
    let patientMap = new Map();

    async function fetchData() {
        try {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">Fetching logs...</td></tr>';
            
            // Fetch both logs and patient list to resolve names
            const [logs, patients] = await Promise.all([
                api.get('/vitals'),
                api.get('/patients')
            ]);

            allLogs = logs || [];
            
            patients.forEach(p => {
                patientMap.set(p.patientId, p.fullName);
            });

            updateStats();
            renderTable(allLogs);
        } catch (error) {
            console.error("Error loading vitals logs:", error);
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px; color: var(--status-danger);">Error loading health logs: ${error.message}</td></tr>`;
        }
    }

    function updateStats() {
        // Total logs
        container.querySelector('#stat-total-logs').textContent = allLogs.length;

        // Critical SpO2 (<95%)
        const criticalSpO2Count = allLogs.filter(l => l.oxygenLevel && l.oxygenLevel < 95).length;
        container.querySelector('#stat-critical-spo2').textContent = criticalSpO2Count;

        // Avg Temperature
        const validTemps = allLogs.filter(l => l.temperature && l.temperature > 30);
        const avgTemp = validTemps.length > 0 
            ? (validTemps.reduce((sum, l) => sum + l.temperature, 0) / validTemps.length).toFixed(1)
            : '0.0';
        container.querySelector('#stat-avg-temp').textContent = `${avgTemp}°C`;
    }

    function renderTable(logsToRender) {
        if (logsToRender.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px; color: var(--text-secondary);">No vitals records found.</td></tr>';
            return;
        }

        tbody.innerHTML = logsToRender.map(l => {
            const patientName = patientMap.get(l.patientId) || 'Unknown Patient';
            const tempVal = l.temperature || 0;
            const spo2Val = l.oxygenLevel || 0;

            // Temp coloring: Normal (36.0 - 37.5) -> standard; High (>37.5) -> danger; Low (<36.0) -> info
            let tempStyle = '';
            if (tempVal > 37.5) {
                tempStyle = 'background: rgba(239, 68, 68, 0.1); color: var(--status-danger); padding: 4px 8px; border-radius: 6px; font-weight: 600;';
            } else if (tempVal < 36.0 && tempVal > 0) {
                tempStyle = 'background: rgba(14, 165, 233, 0.1); color: var(--accent-primary); padding: 4px 8px; border-radius: 6px; font-weight: 600;';
            } else {
                tempStyle = 'font-weight: 500;';
            }

            // SpO2 coloring: Normal (>=95) -> success/normal; Critical (<95) -> danger badge
            let spo2Style = '';
            if (spo2Val < 95 && spo2Val > 0) {
                spo2Style = 'background: rgba(239, 68, 68, 0.1); color: var(--status-danger); padding: 4px 8px; border-radius: 6px; font-weight: 600; animation: pulse-opacity 2s infinite;';
            } else {
                spo2Style = 'color: var(--status-success); font-weight: 600;';
            }

            const recordedDate = l.recordedAt ? new Date(l.recordedAt).toLocaleString('en-US') : '-';

            return `
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 12px;">
                        <div style="font-weight: 600; color: var(--text-primary);">${patientName}</div>
                        <div style="font-size: 0.8em; color: var(--text-secondary);">${l.patientId}</div>
                    </td>
                    <td style="padding: 12px; font-weight: 500;">
                        <i class="fa-solid fa-gauge-high" style="color: var(--text-secondary); margin-right: 4px;"></i> ${l.bloodPressure || '-'}
                    </td>
                    <td style="padding: 12px;">
                        <span style="${tempStyle}"><i class="fa-solid fa-temperature-half"></i> ${tempVal ? tempVal.toFixed(1) + ' °C' : '-'}</span>
                    </td>
                    <td style="padding: 12px; font-weight: 500;">
                        <i class="fa-solid fa-heart" style="color: var(--status-danger); margin-right: 4px;"></i> ${l.pulse || '-'} bpm
                    </td>
                    <td style="padding: 12px;">
                        <span style="${spo2Style}"><i class="fa-solid fa-wind"></i> ${spo2Val ? spo2Val + '%' : '-'}</span>
                    </td>
                    <td style="padding: 12px; color: var(--text-secondary); font-size: 0.9em; font-weight: 500;">
                        <i class="fa-solid fa-user-nurse"></i> ${l.recordedBy || '-'}
                    </td>
                    <td style="padding: 12px; color: var(--text-secondary); font-size: 0.9em;">
                        ${recordedDate}
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Search filter listener
    searchInput.oninput = () => {
        const query = searchInput.value.toLowerCase().trim();
        if (!query) {
            renderTable(allLogs);
            return;
        }

        const filtered = allLogs.filter(l => {
            const name = (patientMap.get(l.patientId) || '').toLowerCase();
            const id = (l.patientId || '').toLowerCase();
            const recordedBy = (l.recordedBy || '').toLowerCase();
            return name.includes(query) || id.includes(query) || recordedBy.includes(query);
        });

        renderTable(filtered);
    };

    // Refresh listener
    refreshBtn.onclick = () => {
        fetchData();
    };

    // Initial fetch
    fetchData();
}
