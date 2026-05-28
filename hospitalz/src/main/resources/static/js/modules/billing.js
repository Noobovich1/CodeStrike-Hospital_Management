import { api } from '../api.js';

export async function renderBilling() {
    const container = document.createElement('div');
    const role = localStorage.getItem('role') || sessionStorage.getItem('role') || '';
    const isAdmin = role === 'ADMIN';
    const isPatient = role === 'PATIENT';
    
    container.innerHTML = `
        <div class="glass-panel" style="padding: 24px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 16px;">
                <h2 style="margin: 0;">${isPatient ? 'My Bills' : 'Billing & Payments'}</h2>
                ${!isPatient ? `
                <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                    <div style="display: flex; gap: 6px; align-items: center; border: 1px solid var(--border-color); padding: 4px; border-radius: 6px; background: var(--bg-secondary);">
                        <select id="bill-search-type" style="padding: 6px; border: none; background: transparent; outline: none; color: var(--text-primary);">
                            <option value="ALL">All Bills</option>
                            <option value="PATIENT">Patient ID</option>
                            <option value="ADMISSION">Admission ID</option>
                        </select>
                        <input type="text" id="bill-search-input" placeholder="Enter ID..." style="padding: 6px; border: none; border-left: 1px solid var(--border-color); outline: none; background: transparent; color: var(--text-primary); max-width: 150px; display: none;">
                        <button id="btn-bill-search" class="btn" style="padding: 6px 12px; background: var(--accent-primary); color: white; border: none; border-radius: 4px; cursor: pointer; display: none;">Search</button>
                    </div>
                    <button id="btn-generate-bill" class="btn" style="padding: 8px 16px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer; color: var(--text-primary);">
                        <i class="fa-solid fa-file-invoice"></i> Generate Bill
                    </button>
                </div>
                ` : ''}
            </div>

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

        <!-- Generate Bill Pop-up Modal -->
        <div id="gen-bill-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
            <div class="glass-panel" style="background: var(--bg-primary); width: 90%; max-width: 450px; padding: 24px; max-height: 90vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
                    <h3 style="margin: 0;">Generate Bill</h3>
                    <button id="close-gen-bill-modal" style="background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-primary);">&times;</button>
                </div>
                <form id="gen-bill-form">
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 4px;">Admission ID *</label>
                        <input type="number" id="gen-admission-id" required style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary);">
                    </div>
                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                        <button type="button" id="btn-cancel-gen-bill" style="padding: 8px 16px; border: 1px solid var(--border-color); background: transparent; border-radius: 6px; cursor: pointer; color: var(--text-primary);">Cancel</button>
                        <button type="submit" class="btn" style="padding: 8px 16px; background: var(--accent-primary); color: white; border: none; border-radius: 6px; cursor: pointer;">Generate</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Record Payment Pop-up Modal -->
        <div id="pay-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
            <div class="glass-panel" style="background: var(--bg-primary); width: 90%; max-width: 450px; padding: 24px; max-height: 90vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
                    <h3 style="margin: 0;">Record Payment</h3>
                    <button id="close-pay-modal" style="background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-primary);">&times;</button>
                </div>
                <form id="pay-form">
                    <input type="hidden" id="pay-bill-id">
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 4px;">Amount *</label>
                        <input type="number" id="pay-amount" step="0.01" required style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary);">
                    </div>
                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                        <button type="button" id="btn-cancel-pay" class="btn" style="padding: 8px 16px; border: 1px solid var(--border-color); background: transparent; border-radius: 6px; cursor: pointer; color: var(--text-primary);">Cancel</button>
                        <button type="submit" class="btn" style="padding: 8px 16px; background: var(--status-success); color: white; border: none; border-radius: 6px; cursor: pointer;">Record Payment</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Discount Pop-up Modal (Admin Only) -->
        ${isAdmin ? `
        <div id="discount-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
            <div class="glass-panel" style="background: var(--bg-primary); width: 90%; max-width: 450px; padding: 24px; max-height: 90vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
                    <h3 style="margin: 0;">Apply Discount</h3>
                    <button id="close-discount-modal" style="background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-primary);">&times;</button>
                </div>
                <form id="discount-form">
                    <input type="hidden" id="disc-bill-id">
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 4px;">Discount Percent (%) *</label>
                        <input type="number" id="disc-percent" step="0.1" max="100" min="0" required style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary);">
                    </div>
                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                        <button type="button" id="btn-cancel-disc" class="btn" style="padding: 8px 16px; border: 1px solid var(--border-color); background: transparent; border-radius: 6px; cursor: pointer; color: var(--text-primary);">Cancel</button>
                        <button type="submit" class="btn" style="padding: 8px 16px; background: var(--status-warning); color: white; border: none; border-radius: 6px; cursor: pointer;">Apply</button>
                    </div>
                </form>
            </div>
        </div>
        ` : ''}
        
        <!-- Bill Details Modal (Simple overlay) -->
        <div id="bill-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
            <div class="glass-panel" style="background: var(--bg-primary); width: 90%; max-width: 600px; padding: 24px; max-height: 90vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
                    <h2 style="margin: 0;">Bill Details</h2>
                    <button id="close-bill-modal" style="background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-primary);">&times;</button>
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

async function loadBillsData(container, isAdmin, searchType = 'ALL', searchId = '') {
    const tbody = container.querySelector('#bills-table-body');
    const isPatient = (localStorage.getItem('role') || sessionStorage.getItem('role')) === 'PATIENT';
    const patientId = localStorage.getItem('patientId');

    try {
        let bills = [];
        
        if (isPatient) {
            if (patientId) {
                bills = await api.get(`/bills/patient/${patientId}`);
            } else {
                tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px; color: var(--status-danger);">Error: Patient ID not found.</td></tr>`;
                return;
            }
        } else if (searchType === 'PATIENT' && searchId.trim() !== '') {
            bills = await api.get(`/bills/patient/${searchId}`);
        } else if (searchType === 'ADMISSION' && searchId.trim() !== '') {
            const bill = await api.get(`/bills/admission/${searchId}`);
            bills = bill ? [bill] : [];
        } else {
            bills = await api.get('/bills');
        }
        
        if (bills && !Array.isArray(bills)) {
            bills = [bills];
        }

        if (!bills || bills.length === 0) {
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
                <td style="padding: 12px; font-weight: 500;">${b.patient?.fullName || b.patient?.patientId || '-'} <span style="font-size:0.85em; color:var(--text-secondary);">(${b.patient?.patientId})</span></td>
                <td style="padding: 12px;">$${total.toFixed(2)}</td>
                <td style="padding: 12px; color: var(--status-success);">$${paid.toFixed(2)}</td>
                <td style="padding: 12px; color: var(--status-danger); font-weight: bold;">$${balance.toFixed(2)}</td>
                <td style="padding: 12px;">${b.paymentStatus}</td>
                <td style="padding: 12px;">
                    <div class="action-group">
                        <button class="btn-icon btn-icon-view btn-view-bill" data-id="${b.billId}" title="View Details">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        ${b.paymentStatus !== 'PAID' ? `
                            <button class="btn-icon btn-icon-pay btn-pay-bill" data-id="${b.billId}" title="Pay Bill">
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

        // Attach events safely
        container.querySelectorAll('.btn-view-bill').forEach(btn => btn.onclick = () => showBillDetails(btn.dataset.id, container));
        
        container.querySelectorAll('.btn-pay-bill').forEach(btn => btn.onclick = () => {
            container.querySelector('#pay-bill-id').value = btn.dataset.id;
            container.querySelector('#pay-modal').style.display = 'flex';
        });
        
        if (isAdmin) {
            container.querySelectorAll('.btn-disc-bill').forEach(btn => btn.onclick = () => {
                container.querySelector('#disc-bill-id').value = btn.dataset.id;
                container.querySelector('#discount-modal').style.display = 'flex';
            });
        }

    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px; color: var(--status-danger);">Error loading bills: ${error.message}</td></tr>`;
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
                    <td style="padding: 8px 0;">Doctor consultation charges (Inpatient)</td>
                    <td style="padding: 8px 0; text-align: right;">$${(bill.doctorCharges || 0).toFixed(2)}</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 8px 0;">Outpatient appointment charges</td>
                    <td style="padding: 8px 0; text-align: right;">$${(bill.outpatientCharges || 0).toFixed(2)}</td>
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
        
        container.querySelector('#btn-download-pdf').onclick = async () => {
            try {
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                const response = await fetch(`/api/v1/bills/${billId}/pdf`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) throw new Error('Could not download PDF invoice');

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Bill_${billId}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            } catch (error) {
                alert('Failed to generate PDF: ' + error.message);
            }
        };
    } catch (e) {
        content.innerHTML = '<span style="color:red;">Error loading details</span>';
    }
}

function setupBillingEvents(container, isAdmin) {
    const isPatient = (localStorage.getItem('role') || sessionStorage.getItem('role')) === 'PATIENT';
    // Đóng Modal chi tiết hóa đơn (Dùng chung)
    container.querySelector('#close-bill-modal').onclick = () => {
        container.querySelector('#bill-modal').style.display = 'none';
    };

    // Xử lý Modal thanh toán (Dùng chung)
    const modalPay = container.querySelector('#pay-modal');
    const closePay = container.querySelector('#close-pay-modal');
    const cancelPay = container.querySelector('#btn-cancel-pay');

    const closePayModal = () => {
        modalPay.style.display = 'none';
        container.querySelector('#pay-form').reset();
    };
    if (closePay) closePay.onclick = closePayModal;
    if (cancelPay) cancelPay.onclick = closePayModal;

    container.querySelector('#pay-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const billId = document.getElementById('pay-bill-id').value;
        const amount = document.getElementById('pay-amount').value;
        const searchType = container.querySelector('#bill-search-type');
        const searchInput = container.querySelector('#bill-search-input');
        try {
            await api.post(`/bills/${billId}/pay`, { amount: parseFloat(amount) });
            alert('Payment recorded!');
            closePayModal();
            loadBillsData(
                container, 
                isAdmin, 
                searchType ? searchType.value : 'ALL', 
                searchInput ? searchInput.value : ''
            );
        } catch (err) { alert('Error: ' + err.message); }
    });

    // Các sự kiện dành riêng cho Nhân viên (Staff/Admin)
    if (!isPatient) {
        const btnGen = container.querySelector('#btn-generate-bill');
        const modalGen = container.querySelector('#gen-bill-modal');
        const closeGen = container.querySelector('#close-gen-bill-modal');
        const cancelGen = container.querySelector('#btn-cancel-gen-bill');
        
        const searchType = container.querySelector('#bill-search-type');
        const searchInput = container.querySelector('#bill-search-input');
        const searchBtn = container.querySelector('#btn-bill-search');

        // Search input toggle
        searchType.addEventListener('change', (e) => {
            const val = e.target.value;
            if (val === 'ALL') {
                searchInput.style.display = 'none';
                searchBtn.style.display = 'none';
                loadBillsData(container, isAdmin, 'ALL');
            } else {
                searchInput.style.display = 'block';
                searchBtn.style.display = 'block';
                searchInput.placeholder = val === 'PATIENT' ? 'Patient ID (e.g. PAT-123)...' : 'Admission ID...';
            }
        });

        searchBtn.addEventListener('click', () => {
            loadBillsData(container, isAdmin, searchType.value, searchInput.value);
        });

        if (btnGen) {
            btnGen.onclick = () => {
                modalGen.style.display = 'flex';
            };
        }

        const closeGenModal = () => {
            modalGen.style.display = 'none';
            container.querySelector('#gen-bill-form').reset();
        };
        if (closeGen) closeGen.onclick = closeGenModal;
        if (cancelGen) cancelGen.onclick = closeGenModal;

        container.querySelector('#gen-bill-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const admId = document.getElementById('gen-admission-id').value;
            try {
                await api.post(`/bills/generate/${admId}`);
                alert('Bill generated!');
                closeGenModal();
                loadBillsData(container, isAdmin, searchType.value, searchInput.value);
            } catch (err) { alert('Error: ' + err.message); }
        });
    }

    if (isAdmin) {
        // Discount Modal
        const modalDiscount = container.querySelector('#discount-modal');
        const closeDiscount = container.querySelector('#close-discount-modal');
        const cancelDiscount = container.querySelector('#btn-cancel-disc');

        const closeDiscountModal = () => {
            modalDiscount.style.display = 'none';
            container.querySelector('#discount-form').reset();
        };
        if (closeDiscount) closeDiscount.onclick = closeDiscountModal;
        if (cancelDiscount) cancelDiscount.onclick = closeDiscountModal;

        container.querySelector('#discount-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const billId = document.getElementById('disc-bill-id').value;
            const percent = document.getElementById('disc-percent').value;
            const searchType = container.querySelector('#bill-search-type');
            const searchInput = container.querySelector('#bill-search-input');
            try {
                await requestPatch(`/bills/${billId}/discount?percent=${percent}`);
                alert('Discount applied!');
                closeDiscountModal();
                loadBillsData(container, isAdmin, searchType ? searchType.value : 'ALL', searchInput ? searchInput.value : '');
            } catch (err) { alert('Error: ' + err.message); }
        });
    }
}

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
