import { api } from '../api.js';

export async function renderBilling() {
    const container = document.createElement('div');
    const role = localStorage.getItem('role') || '';
    const isAdmin = role === 'ADMIN';
    
    container.innerHTML = `
        <div class="glass-panel" style="padding: 24px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0;">Billing & Payments</h2>
                <div style="display: flex; gap: 12px;">
                    <button id="btn-generate-bill" class="btn" style="padding: 8px 16px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer;">
                        <i class="fa-solid fa-file-invoice"></i> Generate Bill
                    </button>
                </div>
            </div>

            <!-- Generate Bill Form -->
            <div id="gen-bill-form-container" style="display: none; margin-bottom: 24px; padding: 16px; border: 1px solid var(--border-color); border-radius: 8px; background: rgba(0,0,0,0.02);">
                <form id="gen-bill-form" style="display: flex; gap: 16px; align-items: flex-end;">
                    <div style="flex: 1;">
                        <label style="display: block; margin-bottom: 4px;">Admission ID *</label>
                        <input type="number" id="gen-admission-id" required style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--border-color);">
                    </div>
                    <button type="submit" class="btn" style="padding: 8px 16px; background: var(--accent-primary); color: white; border: none; border-radius: 6px; cursor: pointer;">Generate</button>
                </form>
            </div>

            <!-- Record Payment Form -->
            <div id="pay-form-container" style="display: none; margin-bottom: 24px; padding: 16px; border: 1px solid var(--border-color); border-radius: 8px; background: rgba(0,0,0,0.02);">
                <h3 style="margin-bottom: 12px;">Record Payment</h3>
                <form id="pay-form" style="display: flex; gap: 16px; align-items: flex-end;">
                    <input type="hidden" id="pay-bill-id">
                    <div style="flex: 1;">
                        <label style="display: block; margin-bottom: 4px;">Amount *</label>
                        <input type="number" id="pay-amount" step="0.01" required style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--border-color);">
                    </div>
                    <button type="button" id="btn-cancel-pay" class="btn" style="padding: 8px 16px; border: 1px solid var(--border-color); background: transparent; border-radius: 6px; cursor: pointer;">Cancel</button>
                    <button type="submit" class="btn" style="padding: 8px 16px; background: var(--status-success); color: white; border: none; border-radius: 6px; cursor: pointer;">Record Payment</button>
                </form>
            </div>

            <!-- Discount Form (Admin Only) -->
            ${isAdmin ? `
            <div id="discount-form-container" style="display: none; margin-bottom: 24px; padding: 16px; border: 1px solid var(--border-color); border-radius: 8px; background: rgba(0,0,0,0.02);">
                <h3 style="margin-bottom: 12px;">Apply Discount</h3>
                <form id="discount-form" style="display: flex; gap: 16px; align-items: flex-end;">
                    <input type="hidden" id="disc-bill-id">
                    <div style="flex: 1;">
                        <label style="display: block; margin-bottom: 4px;">Discount Percent (%) *</label>
                        <input type="number" id="disc-percent" step="0.1" max="100" min="0" required style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--border-color);">
                    </div>
                    <button type="button" id="btn-cancel-disc" class="btn" style="padding: 8px 16px; border: 1px solid var(--border-color); background: transparent; border-radius: 6px; cursor: pointer;">Cancel</button>
                    <button type="submit" class="btn" style="padding: 8px 16px; background: var(--status-warning); color: white; border: none; border-radius: 6px; cursor: pointer;">Apply</button>
                </form>
            </div>
            ` : ''}

            <!-- Bills Table -->
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--border-color);">
                            <th style="padding: 12px;">Bill ID</th>
                            <th style="padding: 12px;">Patient</th>
                            <th style="padding: 12px;">Total</th>
                            <th style="padding: 12px;">Paid</th>
                            <th style="padding: 12px;">Balance</th>
                            <th style="padding: 12px;">Status</th>
                            <th style="padding: 12px;">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="bills-table-body">
                        <tr><td colspan="7" style="text-align: center; padding: 20px;">Loading bills...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
        
        <!-- Bill Details Modal (Simple overlay) -->
        <div id="bill-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
            <div class="glass-panel" style="background: var(--bg-primary); width: 90%; max-width: 600px; padding: 24px; max-height: 90vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
                    <h2 style="margin: 0;">Bill Details</h2>
                    <button id="close-bill-modal" style="background: transparent; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
                </div>
                <div id="bill-modal-content"></div>
                <div style="margin-top: 20px; text-align: right;">
                    <button id="btn-download-pdf" class="btn" style="padding: 8px 16px; background: var(--accent-primary); color: white; border: none; border-radius: 6px; cursor: pointer;">
                        <i class="fa-solid fa-download"></i> Download PDF
                    </button>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        loadBillsData(container, isAdmin);
        setupBillingEvents(container, isAdmin);
    }, 0);

    return container;
}

async function loadBillsData(container, isAdmin) {
    const tbody = container.querySelector('#bills-table-body');
    const isPatient = localStorage.getItem('role') === 'PATIENT';
    const username = localStorage.getItem('username'); // In a real app, we'd use patientId. Assuming API gets correct data based on token or we pass it.

    try {
        let bills = [];
        if (isPatient) {
            // Placeholder: we'd need to know the patient's ID. Let's assume there's a `/bills/my` or similar.
            // Using /bills for now, and ideally backend filters based on JWT.
            bills = await api.get('/bills');
        } else {
            bills = await api.get('/bills');
        }
        
        if (bills.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px;">No bills found.</td></tr>`;
            return;
        }

        tbody.innerHTML = bills.map(b => {
            const paid = b.paidAmount || 0;
            const total = b.totalAmount || 0;
            const balance = total - paid;
            return `
            <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 12px;">${b.billId}</td>
                <td style="padding: 12px; font-weight: 500;">${b.patient?.fullName || b.patient?.patientId || '-'}</td>
                <td style="padding: 12px;">$${total.toFixed(2)}</td>
                <td style="padding: 12px; color: var(--status-success);">$${paid.toFixed(2)}</td>
                <td style="padding: 12px; color: var(--status-danger); font-weight: bold;">$${balance.toFixed(2)}</td>
                <td style="padding: 12px;">${b.paymentStatus}</td>
                <td style="padding: 12px;">
                    <div class="action-group">
                        <button class="btn-icon btn-icon-view btn-view-bill" data-id="${b.billId}" title="View Details">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        ${!isPatient && b.paymentStatus !== 'PAID' ? `
                            <button class="btn-icon btn-icon-pay btn-pay-bill" data-id="${b.billId}" title="Record Payment">
                                <i class="fa-solid fa-wallet"></i>
                            </button>
                        ` : ''}
                        ${isAdmin && b.paymentStatus !== 'PAID' ? `
                            <button class="btn-icon btn-icon-discount btn-disc-bill" data-id="${b.billId}" title="Apply Discount">
                                <i class="fa-solid fa-tag"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `}).join('');

        // Attach events to dynamic buttons
        container.querySelectorAll('.btn-view-bill').forEach(btn => btn.onclick = (e) => showBillDetails(e.target.dataset.id, container));
        
        if (!isPatient) {
            container.querySelectorAll('.btn-pay-bill').forEach(btn => btn.onclick = (e) => {
                container.querySelector('#pay-bill-id').value = e.target.dataset.id;
                container.querySelector('#pay-form-container').style.display = 'block';
                container.querySelector('#discount-form-container')?.style.setProperty('display', 'none');
            });
        }
        
        if (isAdmin) {
            container.querySelectorAll('.btn-disc-bill').forEach(btn => btn.onclick = (e) => {
                container.querySelector('#disc-bill-id').value = e.target.dataset.id;
                container.querySelector('#discount-form-container').style.display = 'block';
                container.querySelector('#pay-form-container').style.display = 'none';
            });
        }

    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px; color: var(--status-danger);">Error loading bills.</td></tr>`;
    }
}

async function showBillDetails(billId, container) {
    const modal = container.querySelector('#bill-modal');
    const content = container.querySelector('#bill-modal-content');
    
    content.innerHTML = 'Loading...';
    modal.style.display = 'flex';

    try {
        const bill = await api.get(`/bills/${billId}`);
        const paid = bill.paidAmount || 0;
        const total = bill.totalAmount || 0;
        const balance = total - paid;
        
        content.innerHTML = `
            <div style="margin-bottom: 16px;">
                <p><strong>Patient:</strong> ${bill.patient?.fullName || bill.patient?.patientId}</p>
                <p><strong>Admission ID:</strong> ${bill.admission?.admissionId}</p>
                <p><strong>Bill Date:</strong> ${new Date(bill.generatedAt).toLocaleDateString()}</p>
            </div>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 8px 0;">Room Charges (${bill.admission?.totalDays || 0} days)</td>
                    <td style="padding: 8px 0; text-align: right;">$${(bill.roomCharges || 0).toFixed(2)}</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 8px 0;">Treatment Charges</td>
                    <td style="padding: 8px 0; text-align: right;">$${(bill.treatmentCharges || 0).toFixed(2)}</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 8px 0;">Discount (${bill.discount}%)</td>
                    <td style="padding: 8px 0; text-align: right;">-$${((bill.totalAmount * (bill.discount / 100)) || 0).toFixed(2)}</td>
                </tr>
                <tr style="font-weight: bold; border-top: 2px solid var(--text-primary);">
                    <td style="padding: 8px 0;">Total Amount</td>
                    <td style="padding: 8px 0; text-align: right;">$${total.toFixed(2)}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; color: var(--status-success);">Amount Paid</td>
                    <td style="padding: 8px 0; text-align: right; color: var(--status-success);">-$${paid.toFixed(2)}</td>
                </tr>
                <tr style="font-weight: bold; font-size: 1.1em;">
                    <td style="padding: 8px 0; color: var(--status-danger);">Balance Due</td>
                    <td style="padding: 8px 0; text-align: right; color: var(--status-danger);">$${balance.toFixed(2)}</td>
                </tr>
            </table>
            <p><strong>Status:</strong> ${bill.paymentStatus}</p>
        `;
        
        container.querySelector('#btn-download-pdf').onclick = () => {
            alert('PDF downloading is not fully implemented in the backend yet, but UI is ready! (Req 21)');
            // In reality, this would fetch a blob or open a new window to a PDF endpoint
        };
    } catch (e) {
        content.innerHTML = '<span style="color:red;">Error loading details</span>';
    }
}

function setupBillingEvents(container, isAdmin) {
    const btnGen = container.querySelector('#btn-generate-bill');
    const formGen = container.querySelector('#gen-bill-form-container');

    if (btnGen) {
        btnGen.onclick = () => {
            formGen.style.display = formGen.style.display === 'none' ? 'block' : 'none';
        };
    }

    container.querySelector('#gen-bill-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const admId = document.getElementById('gen-admission-id').value;
        try {
            await api.post(`/bills/generate/${admId}`);
            alert('Bill generated!');
            document.getElementById('gen-admission-id').value = '';
            formGen.style.display = 'none';
            loadBillsData(container, isAdmin);
        } catch (err) { alert('Error: ' + err.message); }
    });

    container.querySelector('#pay-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const billId = document.getElementById('pay-bill-id').value;
        const amount = document.getElementById('pay-amount').value;
        try {
            await api.post(`/bills/${billId}/pay`, { amount: parseFloat(amount) });
            alert('Payment recorded!');
            document.getElementById('pay-amount').value = '';
            container.querySelector('#pay-form-container').style.display = 'none';
            loadBillsData(container, isAdmin);
        } catch (err) { alert('Error: ' + err.message); }
    });

    container.querySelector('#btn-cancel-pay')?.addEventListener('click', () => {
        container.querySelector('#pay-form-container').style.display = 'none';
    });

    if (isAdmin) {
        container.querySelector('#discount-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const billId = document.getElementById('disc-bill-id').value;
            const percent = document.getElementById('disc-percent').value;
            try {
                // PATCH request for discount
                await requestPatch(`/bills/${billId}/discount?percent=${percent}`);
                alert('Discount applied!');
                document.getElementById('disc-percent').value = '';
                container.querySelector('#discount-form-container').style.display = 'none';
                loadBillsData(container, isAdmin);
            } catch (err) { alert('Error: ' + err.message); }
        });

        container.querySelector('#btn-cancel-disc')?.addEventListener('click', () => {
            container.querySelector('#discount-form-container').style.display = 'none';
        });
    }

    container.querySelector('#close-bill-modal').onclick = () => {
        container.querySelector('#bill-modal').style.display = 'none';
    };
}

// Helper for patch request since api.js doesn't have patch
async function requestPatch(endpoint) {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/v1' + endpoint, {
        method: 'PATCH',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) throw new Error('Failed to patch');
    return response.json();
}
