import { api } from "../api.js";

export async function renderTreatments() {
  const container = document.createElement("div");
  const currentDoctorId = localStorage.getItem('doctorId') || sessionStorage.getItem('doctorId') || '';

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
                    <select id="presc-search-type" style="padding: 8px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); outline: none;">
                        <option value="PATIENT">Patient</option>
                        <option value="DOCTOR">Doctor</option>
                    </select>
                    <div style="position: relative; display: inline-block;">
                        <input type="text" id="presc-search-term" placeholder="Type name, ID or phone..." style="padding: 8px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); outline: none; min-width: 250px;">
                        <select id="presc-search-id" size="4" style="position: absolute; left: 0; top: 100%; width: 100%; z-index: 10; padding: 4px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); display: none; outline: none;"></select>
                    </div>
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
                        <div style="${currentDoctorId ? 'grid-column: span 2;' : ''}">
                            <label style="display: block; margin-bottom: 4px;">Search Patient *</label>
                            <input type="text" id="presc-patient-search" placeholder="Type name, ID or phone..." required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); outline: none; margin-bottom: 4px;">
                            <select id="presc-patient-id" size="4" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); display: none; outline: none;"></select>
                            <small id="presc-patient-hint" style="color: var(--text-secondary); font-size: 0.8em;">Type at least 2 characters to search</small>
                        </div>
                        <div style="${currentDoctorId ? 'display: none;' : ''}">
                            <label style="display: block; margin-bottom: 4px;">Search Doctor *</label>
                            <input type="text" id="presc-doctor-search" placeholder="Type name, ID or specialty..." ${currentDoctorId ? '' : 'required'} style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); outline: none; margin-bottom: 4px;">
                            <select id="presc-doctor-id" size="4" style="width: 100%; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); display: none; outline: none;">
                                ${currentDoctorId ? `<option value="${currentDoctorId}" selected>${currentDoctorId}</option>` : ''}
                            </select>
                            <small id="presc-doctor-hint" style="color: var(--text-secondary); font-size: 0.8em;">Type at least 2 characters to search</small>
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
    const treatments = await api.get("/treatments/active");
    
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
                showToast("Treatment deactivated successfully!", "success");
              } else {
                await api.post(`/treatments/${treatmentId}/activate`);
                showToast("Treatment activated successfully!", "success");
              }
              loadMasterTreatments(container);
            } catch (error) {
              showToast("Error updating treatment status: " + error.message, "error");
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
    showToast("Error loading treatment details: " + error.message, "error");
    modal.style.display = "none";
  }
}

function setupTreatmentsEvents(container) {
  const currentDoctorId = localStorage.getItem('doctorId') || sessionStorage.getItem('doctorId') || '';
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
  const prescSearchTerm = container.querySelector("#presc-search-term");

  let searchPatients = [];
  let searchDoctors = [];

  async function loadSearchData() {
    try {
      searchPatients = await api.get('/patients');
      searchDoctors = await api.get('/doctors');
    } catch (e) {
      console.error("Failed to load patient/doctor data for main search", e);
    }
  }
  loadSearchData();

  searchType?.addEventListener("change", () => {
    if (prescSearchTerm) prescSearchTerm.value = "";
    if (searchIdInput) {
      searchIdInput.style.display = "none";
      searchIdInput.innerHTML = "";
    }
    if (prescSearchTerm) {
      prescSearchTerm.placeholder = searchType.value === "PATIENT" ? "Type patient name, ID or phone..." : "Type doctor name, ID or specialty...";
    }
  });

  prescSearchTerm?.addEventListener("input", () => {
    const type = searchType.value;
    const query = prescSearchTerm.value.toLowerCase().trim();
    if (query.length < 2) {
      searchIdInput.style.display = "none";
      return;
    }

    if (type === "PATIENT") {
      const matches = searchPatients.filter(p =>
        p.fullName?.toLowerCase().includes(query) ||
        p.patientId?.toLowerCase().includes(query) ||
        p.phoneNumber?.includes(query)
      );

      if (matches.length === 0) {
        searchIdInput.style.display = "none";
        return;
      }

      searchIdInput.innerHTML = matches.map(p =>
        `<option value="${p.patientId}">${p.fullName} (${p.patientId})</option>`
      ).join('');
      searchIdInput.style.display = "block";
    } else {
      const matches = searchDoctors.filter(d =>
        d.fullName?.toLowerCase().includes(query) ||
        d.doctorId?.toLowerCase().includes(query) ||
        d.specialisation?.toLowerCase().includes(query)
      );

      if (matches.length === 0) {
        searchIdInput.style.display = "none";
        return;
      }

      searchIdInput.innerHTML = matches.map(d =>
        `<option value="${d.doctorId}">${d.fullName} (${d.doctorId}) - ${d.specialisation}</option>`
      ).join('');
      searchIdInput.style.display = "block";
    }
  });

  searchIdInput?.addEventListener("change", () => {
    const selected = searchIdInput.options[searchIdInput.selectedIndex];
    if (selected) {
      prescSearchTerm.value = selected.text;
      searchIdInput.style.display = "none";
    }
  });

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

  let allPatients = [];
  let allDoctors = [];

  const prescPatientSearch = container.querySelector('#presc-patient-search');
  const prescPatientId = container.querySelector('#presc-patient-id');
  const prescPatientHint = container.querySelector('#presc-patient-hint');

  const prescDoctorSearch = container.querySelector('#presc-doctor-search');
  const prescDoctorId = container.querySelector('#presc-doctor-id');
  const prescDoctorHint = container.querySelector('#presc-doctor-hint');

  // Prescribe Modal events
  btnPrescribeAction.onclick = async () => {
    modalPrescribe.style.display = "flex";
    loadMasterTreatments(container);
    closePrescModal();
    modalPrescribe.style.display = "flex";

    try {
      allPatients = await api.get('/patients');
      allDoctors = await api.get('/doctors/active');
    } catch (e) {
      console.error('Failed to preload data for prescribe form', e);
    }
  };

  prescPatientSearch?.addEventListener('input', () => {
    const query = prescPatientSearch.value.toLowerCase().trim();
    if (query.length < 2) {
      prescPatientId.style.display = 'none';
      prescPatientHint.textContent = 'Type at least 2 characters to search';
      return;
    }

    const matches = allPatients.filter(p =>
      p.fullName?.toLowerCase().includes(query) ||
      p.patientId?.toLowerCase().includes(query) ||
      p.phoneNumber?.includes(query)
    );

    if (matches.length === 0) {
      prescPatientId.style.display = 'none';
      prescPatientHint.textContent = 'No patients matching';
      return;
    }

    prescPatientId.innerHTML = matches.map(p =>
      `<option value="${p.patientId}">${p.fullName} (${p.patientId})</option>`
    ).join('');
    prescPatientId.style.display = 'block';
    prescPatientHint.textContent = `Found ${matches.length} results — click to select`;

    if (matches.length === 1) {
      prescPatientId.selectedIndex = 0;
      prescPatientHint.textContent = `✓ Selected: ${matches[0].fullName} (${matches[0].patientId})`;
    }
  });

  prescPatientId?.addEventListener('change', () => {
    const selected = prescPatientId.options[prescPatientId.selectedIndex];
    if (selected) {
      prescPatientHint.textContent = `✓ Selected: ${selected.text}`;
      prescPatientSearch.value = selected.text;
    }
  });

  prescDoctorSearch?.addEventListener('input', () => {
    const query = prescDoctorSearch.value.toLowerCase().trim();
    if (query.length < 2) {
      prescDoctorId.style.display = 'none';
      prescDoctorHint.textContent = 'Type at least 2 characters to search';
      return;
    }

    const matches = allDoctors.filter(d =>
      d.fullName?.toLowerCase().includes(query) ||
      d.doctorId?.toLowerCase().includes(query) ||
      d.specialisation?.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      prescDoctorId.style.display = 'none';
      prescDoctorHint.textContent = 'No active doctors matching';
      return;
    }

    prescDoctorId.innerHTML = matches.map(d =>
      `<option value="${d.doctorId}">${d.fullName} (${d.doctorId}) - ${d.specialisation}</option>`
    ).join('');
    prescDoctorId.style.display = 'block';
    prescDoctorHint.textContent = `Found ${matches.length} results — click to select`;

    if (matches.length === 1) {
      prescDoctorId.selectedIndex = 0;
      prescDoctorHint.textContent = `✓ Selected: ${matches[0].fullName} (${matches[0].doctorId})`;
    }
  });

  prescDoctorId?.addEventListener('change', () => {
    const selected = prescDoctorId.options[prescDoctorId.selectedIndex];
    if (selected) {
      prescDoctorHint.textContent = `✓ Selected: ${selected.text}`;
      prescDoctorSearch.value = selected.text;
    }
  });

  const closePrescModal = () => {
    modalPrescribe.style.display = "none";
    prescribeForm.reset();
    
    if (prescPatientSearch) prescPatientSearch.value = '';
    if (prescPatientId) {
      prescPatientId.style.display = 'none';
      prescPatientId.innerHTML = '';
    }
    if (prescPatientHint) prescPatientHint.textContent = 'Type at least 2 characters to search';

    if (prescDoctorSearch) prescDoctorSearch.value = '';
    if (prescDoctorId) {
      prescDoctorId.style.display = 'none';
      if (currentDoctorId) {
        prescDoctorId.innerHTML = `<option value="${currentDoctorId}" selected>${currentDoctorId}</option>`;
      } else {
        prescDoctorId.innerHTML = '';
      }
    }
    if (prescDoctorHint) prescDoctorHint.textContent = 'Type at least 2 characters to search';
  };
  closePrescribe.onclick = closePrescModal;
  cancelPrescribe.onclick = closePrescModal;

  prescribeForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const patientId = prescPatientId.value;
    const doctorId = prescDoctorId.value;

    if (!patientId) {
      showToast('Please search and select a patient first.', 'warning');
      prescPatientSearch.focus();
      return;
    }
    if (!doctorId) {
      showToast('Please search and select a doctor first.', 'warning');
      prescDoctorSearch.focus();
      return;
    }

    const payload = {
      patientId: patientId,
      doctorId: doctorId,
      treatmentId: parseInt(
        document.getElementById("presc-treatment-id").value,
        10,
      ),
      quantity: parseInt(document.getElementById("presc-quantity").value, 10),
      notes: document.getElementById("presc-notes").value,
    };

    try {
      await api.post("/treatment-records", payload);
      showToast("Treatment prescribed successfully!", "success");
      closePrescModal();
      // Refresh search list if the user has queried
      if (searchIdInput.value.trim() !== "") {
        searchBtn.click();
      }
    } catch (error) {
      showToast("Error: " + error.message, "error");
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
        showToast("Treatment updated successfully!", "success");
      } else {
        await api.post("/treatments", payload);
        showToast("Treatment created successfully!", "success");
      }
      closeTreatModal();
      loadMasterTreatments(container);
    } catch (error) {
      showToast("Error: " + error.message, "error");
    }
  });

  // History Searching
  searchBtn.addEventListener("click", async () => {
    const queryVal = searchIdInput.value.trim();
    if (queryVal === "") {
      showToast("Please search and select a patient or doctor first.", "warning");
      if (prescSearchTerm) prescSearchTerm.focus();
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
