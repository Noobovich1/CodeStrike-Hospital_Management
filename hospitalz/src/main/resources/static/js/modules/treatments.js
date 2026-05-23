import { api } from "../api.js";

export async function renderTreatments() {
  const container = document.createElement("div");

  container.innerHTML = `
        <div class="glass-panel" style="padding: 24px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 16px;">
                <h2 style="margin: 0;">Treatments & Prescriptions</h2>
                <div style="display: flex; gap: 12px; align-items: center;">
                    <button id="btn-tab-prescribe" class="btn active-tab" style="padding: 8px 16px; border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer; background: var(--bg-secondary); color: var(--text-primary);">Prescriptions History</button>
                    <button id="btn-tab-master" class="btn" style="padding: 8px 16px; border: 1px solid var(--border-color); border-radius: 6px; cursor: pointer; background: transparent; color: var(--text-primary);">Treatment Master List</button>
                    <button id="btn-prescribe-action" class="btn btn-primary" style="padding: 8px 16px; background: var(--accent-primary); color: white; border: none; border-radius: 6px; cursor: pointer;">
                        <i class="fa-solid fa-file-medical"></i> Prescribe Treatment
                    </button>
                    <button id="btn-create-treatment" class="btn btn-primary" style="padding: 8px 16px; background: var(--accent-primary); color: white; border: none; border-radius: 6px; cursor: pointer; display: none;">
                        <i class="fa-solid fa-plus"></i> Create Treatment
                    </button>
                </div>
            </div>

            <!-- PRESCRIBE SECTION (Prescriptions history query) -->
            <div id="section-prescribe">
                <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 20px; flex-wrap: wrap; background: rgba(0,0,0,0.02); padding: 12px; border-radius: 6px; border: 1px solid var(--border-color);">
                    <label style="font-weight: 500;">Search Prescriptions By:</label>
                    <select id="presc-search-type" style="padding: 8px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary);">
                        <option value="PATIENT">Patient ID</option>
                        <option value="DOCTOR">Doctor ID</option>
                    </select>
                    <input type="text" id="presc-search-id" placeholder="Enter ID..." style="padding: 8px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary);">
                    <button id="btn-presc-search" class="btn btn-primary" style="padding: 8px 16px; background: var(--accent-primary); color: white; border: none; border-radius: 6px; cursor: pointer;">Search</button>
                </div>
                
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; text-align: left;">
                        <thead>
                            <tr style="border-bottom: 2px solid var(--border-color);">
                                <th style="padding: 12px;">ID</th>
                                <th style="padding: 12px;">Patient</th>
                                <th style="padding: 12px;">Doctor</th>
                                <th style="padding: 12px;">Treatment</th>
                                <th style="padding: 12px;">Qty</th>
                                <th style="padding: 12px;">Date</th>
                                <th style="padding: 12px;">Cost</th>
                            </tr>
                        </thead>
                        <tbody id="presc-history-body">
                            <tr><td colspan="7" style="text-align: center; padding: 20px; color: var(--text-secondary);">Enter a Doctor or Patient ID to search prescription records.</td></tr>
                        </tbody>
                    </table>
                </div>
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
                                <th style="padding: 12px;">Status</th>
                                <th style="padding: 12px;">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="treatment-master-body">
                            <tr><td colspan="6" style="text-align: center; padding: 20px;">Loading treatments...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Prescribe Treatment Modal -->
        <div id="prescribe-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
            <div class="glass-panel" style="background: var(--bg-primary); width: 90%; max-width: 600px; padding: 24px; max-height: 90vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
                    <h3 style="margin: 0;">Prescribe Treatment</h3>
                    <button id="close-prescribe-modal" style="background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-primary);">&times;</button>
                </div>
                <form id="prescribe-form">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Patient ID *</label>
                            <input type="text" id="presc-patient-id" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Doctor ID *</label>
                            <input type="text" id="presc-doctor-id" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Treatment *</label>
                            <select id="presc-treatment-id" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                                <option value="">Loading treatments...</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Quantity *</label>
                            <input type="number" id="presc-quantity" value="1" min="1" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>
                        <div style="grid-column: span 2;">
                            <label style="display: block; margin-bottom: 4px;">Notes/Instructions</label>
                            <input type="text" id="presc-notes" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                        <button type="button" id="btn-cancel-prescribe" style="padding: 8px 16px; border: 1px solid var(--border-color); background: transparent; border-radius: 6px; cursor: pointer; color: var(--text-primary);">Cancel</button>
                        <button type="submit" class="btn" style="padding: 8px 16px; background: var(--accent-primary); color: white; border: none; border-radius: 6px; cursor: pointer;">Prescribe</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Create/Edit Treatment Pop-up Modal -->
        <div id="treatment-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
            <div class="glass-panel" style="background: var(--bg-primary); width: 90%; max-width: 600px; padding: 24px; max-height: 90vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
                    <h3 id="treatment-form-title" style="margin: 0;">Create Treatment</h3>
                    <button id="close-treatment-modal" style="background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-primary);">&times;</button>
                </div>
                <form id="treatment-form">
                    <input type="hidden" id="treatment-id-val">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Treatment Name *</label>
                            <input type="text" id="treatment-name" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Unit Cost ($) *</label>
                            <input type="number" id="treatment-cost" required min="0" step="0.01" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>
                        <div style="grid-column: span 2;">
                            <label style="display: block; margin-bottom: 4px;">Description</label>
                            <input type="text" id="treatment-description" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                        <button type="button" id="btn-cancel-treatment" style="padding: 8px 16px; border: 1px solid var(--border-color); background: transparent; border-radius: 6px; cursor: pointer; color: var(--text-primary);">Cancel</button>
                        <button type="submit" style="padding: 8px 16px; background: var(--status-success); color: white; border: none; border-radius: 6px; cursor: pointer;">Save Treatment</button>
                    </div>
                </form>
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
  const tbody = container.querySelector("#treatment-master-body");
  const select = container.querySelector("#presc-treatment-id");

  try {
    const treatments = await api.get("/treatments");

    if (treatments.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="6" style="text-align:center; padding: 20px;">No treatments found.</td></tr>';
      select.innerHTML = '<option value="">No treatments available</option>';
      return;
    }

    tbody.innerHTML = treatments
      .map((t) => {
        const statusColor = t.isActive
          ? "var(--status-success)"
          : "var(--text-secondary)";
        const actionLabel = t.isActive ? "Deactivate" : "Activate";
        const actionIcon = t.isActive ? "fa-trash-can" : "fa-circle-check";
        const actionColor = t.isActive
          ? "var(--status-danger)"
          : "var(--status-success)";
        return `
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 12px;">${t.treatmentId}</td>
                    <td style="padding: 12px; font-weight: 500;">${t.name}</td>
                    <td style="padding: 12px;">$${t.unitCost}</td>
                    <td style="padding: 12px; color: var(--text-secondary);">${t.description || "-"}</td>
                    <td style="padding: 12px;"><span style="color: ${statusColor}; font-weight: 600;">${t.isActive ? "Active" : "Inactive"}</span></td>
                    <td style="padding: 12px;">
                        <div class="action-group">
                            <button class="btn-icon btn-icon-view btn-edit-treatment" data-id="${t.treatmentId}" title="Edit Treatment">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button class="btn-icon btn-toggle-treatment-status" data-id="${t.treatmentId}" data-active="${t.isActive ? "true" : "false"}" title="${actionLabel} Treatment">
                                <i class="fa-solid ${actionIcon}" style="color: ${actionColor};"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
      })
      .join("");

    const activeTreatments = treatments.filter((t) => t.isActive);
    select.innerHTML = activeTreatments
      .map(
        (t) =>
          `<option value="${t.treatmentId}">${t.name} ($${t.unitCost})</option>`,
      )
      .join("");

    // Attach listeners safely
    container.querySelectorAll(".btn-edit-treatment").forEach((btn) => {
      btn.onclick = async () => {
        await openEditTreatmentForm(btn.dataset.id);
      };
    });

    container
      .querySelectorAll(".btn-toggle-treatment-status")
      .forEach((btn) => {
        btn.onclick = async () => {
          const treatmentId = btn.dataset.id;
          const isActive = btn.dataset.active === "true";
          const confirmMessage = isActive
            ? `Are you sure you want to deactivate treatment ID ${treatmentId}?`
            : `Are you sure you want to activate treatment ID ${treatmentId}?`;

          if (confirm(confirmMessage)) {
            try {
              if (isActive) {
                await api.delete(`/treatments/${treatmentId}`);
                alert("Treatment deactivated successfully!");
              } else {
                await api.post(`/treatments/${treatmentId}/activate`);
                alert("Treatment activated successfully!");
              }
              loadMasterTreatments(container);
            } catch (error) {
              alert("Error updating treatment status: " + error.message);
            }
          }
        };
      });
  } catch (e) {
    tbody.innerHTML =
      '<tr><td colspan="6" style="text-align:center; color: var(--status-danger); padding: 20px;">Error loading treatments</td></tr>';
  }
}

async function openEditTreatmentForm(treatmentId) {
  const modal = document.getElementById("treatment-modal");
  const formTitle = document.getElementById("treatment-form-title");

  formTitle.textContent = "Edit Treatment Details";
  modal.style.display = "flex";

  try {
    const t = await api.get(`/treatments/${treatmentId}`);
    document.getElementById("treatment-id-val").value = t.treatmentId;
    document.getElementById("treatment-name").value = t.name;
    document.getElementById("treatment-cost").value = t.unitCost;
    document.getElementById("treatment-description").value =
      t.description || "";
  } catch (error) {
    alert("Error loading treatment details: " + error.message);
    modal.style.display = "none";
  }
}

function setupTreatmentsEvents(container) {
  const btnPresc = container.querySelector("#btn-tab-prescribe");
  const btnMaster = container.querySelector("#btn-tab-master");
  const btnPrescribeAction = container.querySelector("#btn-prescribe-action");
  const btnCreate = container.querySelector("#btn-create-treatment");

  const secPresc = container.querySelector("#section-prescribe");
  const secMaster = container.querySelector("#section-master");

  const modalPrescribe = container.querySelector("#prescribe-modal");
  const closePrescribe = container.querySelector("#close-prescribe-modal");
  const cancelPrescribe = container.querySelector("#btn-cancel-prescribe");
  const prescribeForm = container.querySelector("#prescribe-form");

  const modalTreatment = container.querySelector("#treatment-modal");
  const closeTreatment = container.querySelector("#close-treatment-modal");
  const cancelTreatment = container.querySelector("#btn-cancel-treatment");
  const treatmentForm = container.querySelector("#treatment-form");

  const searchType = container.querySelector("#presc-search-type");
  const searchIdInput = container.querySelector("#presc-search-id");
  const searchBtn = container.querySelector("#btn-presc-search");
  const prescHistoryBody = container.querySelector("#presc-history-body");

  // Tab toggles
  btnPresc.addEventListener("click", () => {
    secPresc.style.display = "block";
    secMaster.style.display = "none";
    btnPrescribeAction.style.display = "block";
    btnCreate.style.display = "none";
    btnPresc.style.background = "var(--bg-secondary)";
    btnMaster.style.background = "transparent";
  });

  btnMaster.addEventListener("click", () => {
    secPresc.style.display = "none";
    secMaster.style.display = "block";
    btnPrescribeAction.style.display = "none";
    btnCreate.style.display = "block";
    btnMaster.style.background = "var(--bg-secondary)";
    btnPresc.style.background = "transparent";
    loadMasterTreatments(container);
  });

  // Prescribe Modal events
  btnPrescribeAction.onclick = () => {
    modalPrescribe.style.display = "flex";
    loadMasterTreatments(container);
  };

  const closePrescModal = () => {
    modalPrescribe.style.display = "none";
    prescribeForm.reset();
  };
  closePrescribe.onclick = closePrescModal;
  cancelPrescribe.onclick = closePrescModal;

  prescribeForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      patientId: document.getElementById("presc-patient-id").value,
      doctorId: document.getElementById("presc-doctor-id").value,
      treatmentId: parseInt(
        document.getElementById("presc-treatment-id").value,
        10,
      ),
      quantity: parseInt(document.getElementById("presc-quantity").value, 10),
      notes: document.getElementById("presc-notes").value,
    };

    try {
      await api.post("/treatment-records", payload);
      alert("Treatment prescribed successfully!");
      closePrescModal();
      // Refresh search list if the user has queried
      if (searchIdInput.value.trim() !== "") {
        searchBtn.click();
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  });

  // Create Treatment modal events
  btnCreate.addEventListener("click", () => {
    document.getElementById("treatment-form-title").textContent =
      "Create Treatment";
    document.getElementById("treatment-id-val").value = "";
    treatmentForm.reset();
    modalTreatment.style.display = "flex";
  });

  const closeTreatModal = () => {
    modalTreatment.style.display = "none";
    treatmentForm.reset();
  };
  closeTreatment.onclick = closeTreatModal;
  cancelTreatment.onclick = closeTreatModal;

  treatmentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const treatmentId = document.getElementById("treatment-id-val").value;
    const payload = {
      name: document.getElementById("treatment-name").value,
      unitCost: parseFloat(document.getElementById("treatment-cost").value),
      description: document.getElementById("treatment-description").value,
      isActive: true,
    };

    try {
      if (treatmentId) {
        await api.put(`/treatments/${treatmentId}`, payload);
        alert("Treatment updated successfully!");
      } else {
        await api.post("/treatments", payload);
        alert("Treatment created successfully!");
      }
      closeTreatModal();
      loadMasterTreatments(container);
    } catch (error) {
      alert("Error: " + error.message);
    }
  });

  // History Searching
  searchBtn.addEventListener("click", async () => {
    const queryVal = searchIdInput.value.trim();
    if (queryVal === "") {
      alert("Please enter an ID");
      return;
    }

    prescHistoryBody.innerHTML =
      '<tr><td colspan="7" style="text-align: center; padding: 20px;">Searching...</td></tr>';

    try {
      let records = [];
      if (searchType.value === "PATIENT") {
        records = await api.get(`/treatment-records/patient/${queryVal}`);
      } else {
        records = await api.get(`/treatment-records/doctor/${queryVal}`);
      }

      if (!records || records.length === 0) {
        prescHistoryBody.innerHTML =
          '<tr><td colspan="7" style="text-align: center; padding: 20px;">No prescription records found.</td></tr>';
        return;
      }

      prescHistoryBody.innerHTML = records
        .map(
          (r) => `
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 12px;">${r.recordId}</td>
                    <td style="padding: 12px;">${r.patient?.fullName || r.patient?.patientId || "-"} <span style="font-size:0.85em; color:var(--text-secondary);">(${r.patient?.patientId})</span></td>
                    <td style="padding: 12px;">${r.doctor?.fullName || r.doctor?.doctorId || "-"} <span style="font-size:0.85em; color:var(--text-secondary);">(${r.doctor?.doctorId})</span></td>
                    <td style="padding: 12px; font-weight: 500;">${r.treatment?.name}</td>
                    <td style="padding: 12px;">${r.quantity}</td>
                    <td style="padding: 12px;">${new Date(r.sessionDate).toLocaleDateString()}</td>
                    <td style="padding: 12px;">$${(r.quantity * (r.treatment?.unitCost || 0)).toFixed(2)}</td>
                </tr>
            `,
        )
        .join("");
    } catch (error) {
      prescHistoryBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px; color: var(--status-danger);">Error fetching records: ${error.message}</td></tr>`;
    }
  });
}
