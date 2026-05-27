import { api } from "../api.js";

export async function renderPatientRecords() {
  const container = document.createElement("div");
  
  const patientId = localStorage.getItem("patientId") || sessionStorage.getItem("patientId");

  if (!patientId) {
    container.innerHTML = `
      <div class="glass-panel" style="padding: 24px; text-align: center; color: var(--status-danger);">
        <i class="fa-solid fa-triangle-exclamation" style="font-size: 2.5rem; margin-bottom: 16px;"></i>
        <h3>Patient Record Not Found</h3>
        <p style="color: var(--text-secondary); margin-top: 8px;">This account is not linked to any patient information in the system.</p>
      </div>
    `;
    return container;
  }

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      
      <!-- Patient Card Header -->
      <div class="glass-panel" style="padding: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 20px;">
          <div style="width: 70px; height: 70px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-primary), var(--accent-hover)); color: white; display: flex; align-items: center; justify-content: center; font-size: 2rem; box-shadow: var(--shadow-md);">
            <i class="fa-solid fa-user-injured"></i>
          </div>
          <div>
            <h2 id="patient-record-fullname" style="margin: 0;">Loading...</h2>
            <div style="display: flex; gap: 8px; align-items: center; margin-top: 6px;">
              <span class="badge-patient-id" style="font-size: 0.85em; font-weight: 600; color: var(--text-secondary); background: rgba(100, 116, 139, 0.1); padding: 4px 8px; border-radius: 4px;">ID: ${patientId}</span>
              <span id="patient-record-status" style="font-size: 0.85em; font-weight: 600; padding: 4px 8px; border-radius: 4px;">-</span>
            </div>
          </div>
        </div>
        <div style="display: flex; gap: 12px;">
          <button id="btn-refresh-records" class="btn btn-secondary" style="padding: 8px 16px; border: 1px solid var(--border-color); background: var(--bg-secondary); border-radius: 8px; cursor: pointer; color: var(--text-primary); transition: all 0.2s;">
            <i class="fa-solid fa-rotate"></i> Refresh
          </button>
        </div>
      </div>

      <!-- Info Details Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
        
        <!-- Personal Information Panel -->
        <div class="glass-panel" style="padding: 24px;">
          <h3 style="margin-bottom: 16px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
            <i class="fa-solid fa-id-card" style="color: var(--accent-primary);"></i> Personal Information
          </h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <p style="color: var(--text-secondary); font-size: 0.85em; margin: 0;">Date of Birth</p>
              <p id="patient-record-dob" style="font-weight: 500; margin: 4px 0 12px 0;">-</p>
            </div>
            <div>
              <p style="color: var(--text-secondary); font-size: 0.85em; margin: 0;">Gender</p>
              <p id="patient-record-gender" style="font-weight: 500; margin: 4px 0 12px 0;">-</p>
            </div>
            <div>
              <p style="color: var(--text-secondary); font-size: 0.85em; margin: 0;">Phone Number</p>
              <p id="patient-record-phone" style="font-weight: 500; margin: 4px 0 12px 0;">-</p>
            </div>
            <div>
              <p style="color: var(--text-secondary); font-size: 0.85em; margin: 0;">Blood Group</p>
              <p id="patient-record-blood" style="font-weight: 500; margin: 4px 0 12px 0;">-</p>
            </div>
            <div style="grid-column: span 2;">
              <p style="color: var(--text-secondary); font-size: 0.85em; margin: 0;">Email</p>
              <p id="patient-record-email" style="font-weight: 500; margin: 4px 0 12px 0;">-</p>
            </div>
            <div style="grid-column: span 2;">
              <p style="color: var(--text-secondary); font-size: 0.85em; margin: 0;">Address</p>
              <p id="patient-record-address" style="font-weight: 500; margin: 4px 0 12px 0;">-</p>
            </div>
          </div>
        </div>

        <!-- Emergency Contact Panel -->
        <div class="glass-panel" style="padding: 24px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <h3 style="margin-bottom: 16px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
              <i class="fa-solid fa-address-book" style="color: var(--status-warning);"></i> Emergency Contact
            </h3>
            <div style="margin-bottom: 16px;">
              <p style="color: var(--text-secondary); font-size: 0.85em; margin: 0;">Contact Person</p>
              <p id="patient-record-em-name" style="font-weight: 500; margin: 4px 0 12px 0;">-</p>
            </div>
            <div>
              <p style="color: var(--text-secondary); font-size: 0.85em; margin: 0;">Emergency Phone</p>
              <p id="patient-record-em-phone" style="font-weight: 500; margin: 4px 0 12px 0;">-</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="glass-panel" style="padding: 24px;">
        <div style="display: flex; gap: 16px; border-bottom: 1px solid var(--border-color); margin-bottom: 20px; padding-bottom: 8px;">
          <button class="record-tab-btn active" data-tab="tab-treatments" style="background: none; border: none; padding: 8px 16px; font-weight: 600; color: var(--text-secondary); cursor: pointer; border-radius: 8px; transition: all 0.2s; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-file-medical"></i> Treatment History & Orders
          </button>
          <button class="record-tab-btn" data-tab="tab-vitals" style="background: none; border: none; padding: 8px 16px; font-weight: 600; color: var(--text-secondary); cursor: pointer; border-radius: 8px; transition: all 0.2s; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-heart-pulse"></i> Vitals History
          </button>
        </div>

        <!-- Treatments Tab Panel -->
        <div class="record-tab-panel active" id="tab-treatments">
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95em;">
              <thead>
                <tr style="border-bottom: 2px solid var(--border-color); color: var(--text-secondary);">
                  <th style="padding: 12px;">Execution Date</th>
                  <th style="padding: 12px;">Treatment Service / Order</th>
                  <th style="padding: 12px;">Prescribed By (Doctor)</th>
                  <th style="padding: 12px; text-align: right;">Quantity</th>
                  <th style="padding: 12px; text-align: right;">Unit Price</th>
                  <th style="padding: 12px; text-align: right;">Total Amount</th>
                </tr>
              </thead>
              <tbody id="patient-treatments-body">
                <tr><td colspan="6" style="text-align: center; padding: 20px; color: var(--text-secondary);">Loading treatment history...</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Vitals Tab Panel -->
        <div class="record-tab-panel" id="tab-vitals">
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95em;">
              <thead>
                <tr style="border-bottom: 2px solid var(--border-color); color: var(--text-secondary);">
                  <th style="padding: 12px;">Record Date</th>
                  <th style="padding: 12px;">Blood Pressure (mmHg)</th>
                  <th style="padding: 12px;">Temperature (°C)</th>
                  <th style="padding: 12px;">Pulse (bpm)</th>
                  <th style="padding: 12px;">Oxygen Level (SpO2 %)</th>
                  <th style="padding: 12px;">Recorded By (Nurse)</th>
                </tr>
              </thead>
              <tbody id="patient-vitals-body">
                <tr><td colspan="6" style="text-align: center; padding: 20px; color: var(--text-secondary);">Loading vitals data...</td></tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  `;

  // Define styling dynamically in container to match layout
  const style = document.createElement("style");
  style.innerHTML = `
    .record-tab-btn:hover {
      color: var(--text-primary);
      background: rgba(14, 165, 233, 0.05);
    }
    .record-tab-btn.active {
      color: var(--accent-primary);
      background: rgba(14, 165, 233, 0.1);
    }
    .record-tab-panel {
      display: none;
    }
    .record-tab-panel.active {
      display: block;
    }
  `;
  container.appendChild(style);

  // Set up events and load data
  setTimeout(() => {
    loadAllPatientData(patientId, container);
    setupEvents(container, patientId);
  }, 0);

  return container;
}

async function loadAllPatientData(patientId, container) {
  // Load Personal details
  try {
    const patient = await api.get(`/patients/${patientId}`);
    
    container.querySelector("#patient-record-fullname").textContent = patient.fullName;
    
    // Status Badge Styling
    const statusEl = container.querySelector("#patient-record-status");
    statusEl.textContent = patient.status || "OUTPATIENT";
    if (patient.status === "INPATIENT") {
      statusEl.style.background = "rgba(16, 185, 129, 0.15)";
      statusEl.style.color = "var(--status-success)";
      statusEl.style.border = "1px solid rgba(16, 185, 129, 0.3)";
    } else {
      statusEl.style.background = "rgba(14, 165, 233, 0.15)";
      statusEl.style.color = "var(--accent-primary)";
      statusEl.style.border = "1px solid rgba(14, 165, 233, 0.3)";
    }

    container.querySelector("#patient-record-dob").textContent = patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString("vi-VN") : "-";
    container.querySelector("#patient-record-gender").textContent = patient.gender === "MALE" ? "Male" : (patient.gender === "FEMALE" ? "Female" : "Other");
    container.querySelector("#patient-record-phone").textContent = patient.phoneNumber || "-";
    container.querySelector("#patient-record-blood").textContent = patient.bloodGroup || "-";
    container.querySelector("#patient-record-email").textContent = patient.email || "-";
    container.querySelector("#patient-record-address").textContent = patient.address || "-";
    container.querySelector("#patient-record-em-name").textContent = patient.emergencyContactName || "-";
    container.querySelector("#patient-record-em-phone").textContent = patient.emergencyContactPhone || "-";
  } catch (error) {
    console.error("Error loading patient details:", error);
    container.querySelector("#patient-record-fullname").textContent = "Error loading info";
  }

  // Load treatment records
  const treatmentsBody = container.querySelector("#patient-treatments-body");
  try {
    const records = await api.get(`/treatment-records/patient/${patientId}`);
    if (!records || records.length === 0) {
      treatmentsBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: var(--text-secondary);">No treatment history or medical services recorded.</td></tr>`;
    } else {
      treatmentsBody.innerHTML = records.map(r => {
        const date = r.sessionDate ? new Date(r.sessionDate).toLocaleString("en-US") : "-";
        const treatmentName = r.treatment ? r.treatment.name : "Medical Service";
        const doctorName = r.doctor ? r.doctor.fullName : "-";
        const quantity = r.quantity || 1;
        const price = r.treatment ? r.treatment.cost : 0;
        const total = quantity * price;

        return `
          <tr style="border-bottom: 1px solid var(--border-color); hover: background-color: rgba(100,116,139,0.02)">
            <td style="padding: 12px;">${date}</td>
            <td style="padding: 12px; font-weight: 500;">${treatmentName}</td>
            <td style="padding: 12px;">${doctorName}</td>
            <td style="padding: 12px; text-align: right;">${quantity}</td>
            <td style="padding: 12px; text-align: right; color: var(--text-secondary);">$${price.toFixed(2)}</td>
            <td style="padding: 12px; text-align: right; font-weight: 600; color: var(--accent-primary);">$${total.toFixed(2)}</td>
          </tr>
        `;
      }).join("");
    }
  } catch (error) {
    console.error("Error loading treatments:", error);
    treatmentsBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: var(--status-danger);">Error loading treatment list.</td></tr>`;
  }

  // Load vitals logs (with graceful fallback if not implemented or errors out)
  const vitalsBody = container.querySelector("#patient-vitals-body");
  try {
    const vitals = await api.get(`/vitals/patient/${patientId}`);
    if (!vitals || vitals.length === 0) {
      vitalsBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: var(--text-secondary);">No vitals logs recorded recently.</td></tr>`;
    } else {
      vitalsBody.innerHTML = vitals.map(v => {
        const date = v.recordedAt ? new Date(v.recordedAt).toLocaleString("en-US") : "-";
        const bp = v.bloodPressure || "-";
        const temp = v.temperature ? `${v.temperature}°C` : "-";
        const pulse = v.pulse ? `${v.pulse} bpm` : "-";
        const oxygen = v.oxygenLevel ? `${v.oxygenLevel}%` : "-";
        const recorder = v.recordedBy || "-"; // Nurse name or ID

        return `
          <tr style="border-bottom: 1px solid var(--border-color);">
            <td style="padding: 12px;">${date}</td>
            <td style="padding: 12px; font-weight: 500;">${bp}</td>
            <td style="padding: 12px;">${temp}</td>
            <td style="padding: 12px;">${pulse}</td>
            <td style="padding: 12px; color: var(--status-success); font-weight: 600;">${oxygen}</td>
            <td style="padding: 12px; color: var(--text-secondary);">${recorder}</td>
          </tr>
        `;
      }).join("");
    }
  } catch (error) {
    console.error("Error loading vitals:", error);
    vitalsBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: var(--text-secondary);">No vitals data available.</td></tr>`;
  }
}

function setupEvents(container, patientId) {
  // Tab switching logic
  const tabBtns = container.querySelectorAll(".record-tab-btn");
  const tabPanels = container.querySelectorAll(".record-tab-panel");

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      tabPanels.forEach(p => p.classList.remove("active"));

      btn.classList.add("active");
      const activeTabId = btn.dataset.tab;
      container.querySelector(`#${activeTabId}`).classList.add("active");
    });
  });

  // Refresh button
  container.querySelector("#btn-refresh-records").addEventListener("click", () => {
    loadAllPatientData(patientId, container);
  });
}
