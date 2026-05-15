import { api } from '../api.js';

export async function renderTreatments() {
    const container = document.createElement('div');
    
    container.innerHTML = `
        <div class="glass-panel" style="padding: 24px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0;">Treatments & Prescriptions</h2>
                <div style="display: flex; gap: 12px;">
                    <button id="btn-tab-prescribe" class="btn active-tab" style="padding: 8px 16px; border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer; background: var(--bg-secondary);">Prescribe Treatment</button>
                    <button id="btn-tab-master" class="btn" style="padding: 8px 16px; border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer; background: transparent;">Treatment Master List</button>
                </div>
            </div>

            <!-- PRESCRIBE SECTION -->
            <div id="section-prescribe">
                <form id="prescribe-form" style="margin-bottom: 24px; padding: 16px; border: 1px solid var(--border-color); border-radius: 8px; background: rgba(0,0,0,0.02);">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                        <div>
                            <label>Patient ID *</label>
                            <input type="text" id="presc-patient-id" required style="width: 100%; padding: 8px; border-radius: 4px;">
                        </div>
                        <div>
                            <label>Doctor ID *</label>
                            <input type="text" id="presc-doctor-id" required style="width: 100%; padding: 8px; border-radius: 4px;">
                        </div>
                        <div>
                            <label>Treatment *</label>
                            <select id="presc-treatment-id" required style="width: 100%; padding: 8px; border-radius: 4px;">
                                <option value="">Loading treatments...</option>
                            </select>
                        </div>
                        <div>
                            <label>Quantity *</label>
                            <input type="number" id="presc-quantity" value="1" min="1" required style="width: 100%; padding: 8px; border-radius: 4px;">
                        </div>
                        <div style="grid-column: span 2;">
                            <label>Notes/Instructions</label>
                            <input type="text" id="presc-notes" style="width: 100%; padding: 8px; border-radius: 4px;">
                        </div>
                    </div>
                    <div style="display: flex; justify-content: flex-end;">
                        <button type="submit" class="btn" style="padding: 8px 16px; background: var(--accent-primary); color: white; border: none; border-radius: 6px; cursor: pointer;">Prescribe</button>
                    </div>
                </form>
            </div>

            <!-- MASTER LIST SECTION -->
            <div id="section-master" style="display: none;">
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; text-align: left;">
                        <thead>
                            <tr style="border-bottom: 2px solid var(--border-color);">
                                <th style="padding: 12px;">ID</th>
                                <th style="padding: 12px;">Treatment Name</th>
                                <th style="padding: 12px;">Cost</th>
                                <th style="padding: 12px;">Description</th>
                            </tr>
                        </thead>
                        <tbody id="treatment-master-body">
                            <tr><td colspan="4" style="text-align: center; padding: 20px;">Loading treatments...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        setupTreatmentsEvents(container);
        loadMasterTreatments(container);
    }, 0);

    return container;
}

async function loadMasterTreatments(container) {
    const tbody = container.querySelector('#treatment-master-body');
    const select = container.querySelector('#presc-treatment-id');
    
    try {
        const treatments = await api.get('/treatments');
        
        if (treatments.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No treatments found.</td></tr>';
            select.innerHTML = '<option value="">No treatments available</option>';
            return;
        }

        // Populate table
        tbody.innerHTML = treatments.map(t => `
            <tr style="border-bottom: 1px solid var(--border-color);">
            <td style="padding: 12px;">${t.treatmentId}</td>
            <td style="padding: 12px; font-weight: 500;">${t.name}</td>   // ← was t.treatmentName
            <td style="padding: 12px;">$${t.unitCost}</td>                // ← was t.cost
            <td style="padding: 12px; color: var(--text-secondary);">${t.description || '-'}</td>
            </tr>
        `).join('');

        // Populate dropdown
        select.innerHTML = treatments.map(t => 
            <option value="${t.treatmentId}">${t.name} ($${t.unitCost})</option>  // ← same fix
        ).join('');

    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color: var(--status-danger);">Error loading treatments</td></tr>';
    }
}

function setupTreatmentsEvents(container) {
    const btnPresc = container.querySelector('#btn-tab-prescribe');
    const btnMaster = container.querySelector('#btn-tab-master');
    const secPresc = container.querySelector('#section-prescribe');
    const secMaster = container.querySelector('#section-master');

    btnPresc.addEventListener('click', () => {
        secPresc.style.display = 'block';
        secMaster.style.display = 'none';
        btnPresc.style.background = 'var(--bg-secondary)';
        btnMaster.style.background = 'transparent';
    });

    btnMaster.addEventListener('click', () => {
        secPresc.style.display = 'none';
        secMaster.style.display = 'block';
        btnMaster.style.background = 'var(--bg-secondary)';
        btnPresc.style.background = 'transparent';
    });

    const form = container.querySelector('#prescribe-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            patientId: document.getElementById('presc-patient-id').value,
            doctorId: document.getElementById('presc-doctor-id').value,
            treatmentId: parseInt(document.getElementById('presc-treatment-id').value, 10),
            quantity: parseInt(document.getElementById('presc-quantity').value, 10),
            notes: document.getElementById('presc-notes').value
        };

        try {
            await api.post('/treatment-records', payload);
            alert('Treatment prescribed successfully!');
            form.reset();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    });
}
