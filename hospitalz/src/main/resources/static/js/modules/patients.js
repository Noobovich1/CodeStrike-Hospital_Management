import { api } from "../api.js";

const PAGE_SIZE = 20;

export async function renderRegisterForm() {
  const container = document.createElement("div");

  // Sort state: { field, direction }
  const sortState = { field: null, direction: "asc" };

  container.innerHTML = `
        <div class="glass-panel" style="padding: 24px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 16px;">
                <h2 style="margin: 0;">Patient Management</h2>
                <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                    <input type="text" id="patient-search" placeholder="Search name/phone/ID..." style="padding: 8px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-secondary); color: var(--text-primary); min-width: 200px;">
                    <button id="btn-register-patient" class="btn btn-primary" style="padding: 8px 16px; background: var(--accent-primary); color: white; border: none; border-radius: 6px; cursor: pointer;">
                        <i class="fa-solid fa-plus"></i> Register
                    </button>
                </div>
            </div>

            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--border-color);">
                            <th style="padding: 12px;">ID</th>
                            <th style="padding: 12px; cursor: pointer; user-select: none;" id="th-name">Name <i class="fa-solid fa-sort" style="margin-left: 4px; font-size: 0.75em; opacity: 0.5;"></i></th>
                            <th style="padding: 12px;">Gender</th>
                            <th style="padding: 12px;">Phone</th>
                            <th style="padding: 12px;">Status</th>
                            <th style="padding: 12px;">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="patient-table-body">
                        <tr><td colspan="6" style="text-align: center; padding: 20px;">Loading patients...</td></tr>
                    </tbody>
                </table>
            </div>
            <div id="patient-pagination" style="display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border-color);"></div>
        </div>

        <!-- Register Patient Pop-up Modal -->
        <div id="patient-reg-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
            <div class="glass-panel" style="background: var(--bg-primary); width: 90%; max-width: 600px; padding: 24px; max-height: 90vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
                    <h2 style="margin: 0;">Register Patient</h2>
                    <button id="close-patient-reg-modal" style="background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-primary);">&times;</button>
                </div>
                <form id="patient-form">
                    <div class="grid-2-col" style="margin-bottom: 16px;">
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Full Name *</label>
                            <input type="text" id="patient-name" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Date of Birth *</label>
                            <input type="date" id="patient-dob" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Gender *</label>
                            <select id="patient-gender" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Phone Number *</label>
                            <input type="text" id="patient-phone" required style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Blood Group</label>
                            <input type="text" id="patient-blood" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px;">Emergency Contact</label>
                            <input type="text" id="patient-em-phone" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary);">
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px; justify-content: flex-end;">
                        <button type="button" id="btn-cancel-patient" style="padding: 8px 16px; border: 1px solid var(--border-color); background: transparent; border-radius: 6px; cursor: pointer; color: var(--text-primary);">Cancel</button>
                        <button type="submit" style="padding: 8px 16px; background: var(--status-success); color: white; border: none; border-radius: 6px; cursor: pointer;">Save Patient</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Patient Detail Modal -->
        <div id="patient-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
            <div class="glass-panel" style="background: var(--bg-primary); width: 90%; max-width: 700px; padding: 24px; max-height: 90vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
                    <h2 style="margin: 0;">Patient Details</h2>
                    <button id="close-patient-modal" style="background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-primary);">&times;</button>
                </div>
                <div id="patient-modal-content"></div>
            </div>
        </div>
    `;

  setTimeout(() => {
    let allPatients = [];
    let currentPage = 1;

    function renderAll() {
      const searchInput = container.querySelector('#patient-search');
      const query = searchInput ? searchInput.value.toLowerCase() : '';
      const filtered = query
        ? allPatients.filter(p =>
            (p.fullName && p.fullName.toLowerCase().includes(query)) ||
            (p.phoneNumber && p.phoneNumber.includes(query)) ||
            (p.patientId && p.patientId.toLowerCase().includes(query))
          )
        : allPatients;
      renderPatientTableWithPagination(filtered, container, sortState, currentPage, (newPage) => {
        currentPage = newPage;
        renderAll();
      });
    }

    loadPatientData().then((data) => {
      allPatients = data || [];
      renderAll();
    });

    setupPatientEvents(container, () => allPatients, sortState, () => {
      currentPage = 1;
      renderAll();
    });

    // Listen for data changes from activate/deactivate actions
    container.addEventListener("patient-data-changed", async () => {
      const updated = await loadPatientData();
      allPatients = updated || [];
      renderAll();
    });
  }, 0);

  return container;
}

async function loadPatientData() {
  try {
    return await api.get("/patients");
  } catch (error) {
    console.error(error);
    return [];
  }
}

function sortPatients(patientList, sortState) {
  if (!patientList || patientList.length === 0) return patientList;
  
  const sorted = [...patientList];
  
  // Always sort: active first, inactive to bottom
  sorted.sort((a, b) => {
    const aActive = a.isActive !== false ? 1 : 0;
    const bActive = b.isActive !== false ? 1 : 0;
    if (aActive !== bActive) return bActive - aActive; // active (1) before inactive (0)
    return 0;
  });

  // Then apply secondary sort by the chosen column
  if (sortState && sortState.field) {
    sorted.sort((a, b) => {
      const aActive = a.isActive !== false ? 1 : 0;
      const bActive = b.isActive !== false ? 1 : 0;
      if (aActive !== bActive) return bActive - aActive; // keep active/inactive grouping

      let valA, valB;
      if (sortState.field === "name") {
        valA = (a.fullName || "").toLowerCase();
        valB = (b.fullName || "").toLowerCase();
      } else if (sortState.field === "id") {
        valA = (a.patientId || "").toLowerCase();
        valB = (b.patientId || "").toLowerCase();
      } else if (sortState.field === "phone") {
        valA = (a.phoneNumber || "").toLowerCase();
        valB = (b.phoneNumber || "").toLowerCase();
      } else {
        return 0;
      }

      if (valA < valB) return sortState.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortState.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  return sorted;
}

function renderPatientTableWithPagination(patientList, container, sortState, currentPage, onPageChange) {
  const tbody = container.querySelector("#patient-table-body");
  const pagEl = container.querySelector("#patient-pagination");
  if (!tbody) return;

  const sorted = sortPatients(patientList, sortState);

  if (!sorted || sorted.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px;">No patients found.</td></tr>`;
    if (pagEl) pagEl.innerHTML = "";
    return;
  }

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  if (currentPage > totalPages) currentPage = totalPages;
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const paged = sorted.slice(startIdx, startIdx + PAGE_SIZE);

  renderPatientTableRows(paged, container, sortState);
  renderPatientPagination(sorted.length, totalPages, currentPage, pagEl, onPageChange);
}

function renderPatientTable(patientList, container, sortState) {
  const tbody = container.querySelector("#patient-table-body");
  if (!tbody) return;

  if (!patientList || patientList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px;">No patients found.</td></tr>`;
    return;
  }

  const sorted = sortPatients(patientList, sortState);

  renderPatientTableRows(sorted, container, sortState);
}

function renderPatientTableRows(sorted, container, sortState) {
  const tbody = container.querySelector("#patient-table-body");
  if (!tbody) return;

  tbody.innerHTML = sorted
    .map(
      (p) => `
        <tr style="border-bottom: 1px solid var(--border-color); ${p.isActive === false ? 'opacity: 0.6; background: var(--bg-secondary);' : ''}">
            <td style="padding: 12px;">${p.patientId || "-"}</td>
            <td style="padding: 12px; font-weight: 500;">${p.fullName}</td>
            <td style="padding: 12px;">${p.gender}</td>
            <td style="padding: 12px;">${p.phoneNumber}</td>
            <td style="padding: 12px;">
                <span style="background: ${p.isActive === false ? 'var(--status-error)' : 'var(--status-success)'}; padding: 4px 8px; border-radius: 4px; color: white; font-size: 0.85em;">
                    ${p.isActive === false ? "INACTIVE" : "ACTIVE"}
                </span>
            </td>
            <td style="padding: 12px;">
                <div class="action-group">
                    <button class="btn-icon btn-icon-view btn-view-patient" data-id="${p.patientId}" title="View Details">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    ${p.isActive !== false ? `
                        <button class="btn-icon btn-icon-deactivate btn-deactivate-patient" data-id="${p.patientId}" data-name="${p.fullName}" title="Deactivate Patient">
                            <i class="fa-solid fa-ban"></i>
                        </button>
                    ` : `
                        <button class="btn-icon btn-icon-activate btn-activate-patient" data-id="${p.patientId}" data-name="${p.fullName}" title="Activate Patient">
                            <i class="fa-solid fa-check"></i>
                        </button>
                    `}
                </div>
            </td>
        </tr>
    `,
    )
    .join("");

  container.querySelectorAll(".btn-view-patient").forEach((btn) => {
    btn.onclick = () => showPatientDetails(btn.dataset.id, container);
  });

  container.querySelectorAll(".btn-deactivate-patient").forEach((btn) => {
    btn.onclick = () => deactivatePatient(btn.dataset.id, btn.dataset.name, container);
  });

  container.querySelectorAll(".btn-activate-patient").forEach((btn) => {
    btn.onclick = () => activatePatient(btn.dataset.id, btn.dataset.name, container);
  });
}

function renderPatientPagination(totalItems, totalPages, currentPage, pagEl, onPageChange) {
  if (!pagEl) return;
  if (totalItems <= PAGE_SIZE) {
    pagEl.innerHTML = `<span style="color: var(--text-secondary); font-size: 0.85em;">Showing ${totalItems} of ${totalItems}</span>`;
    return;
  }

  const start = (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(currentPage * PAGE_SIZE, totalItems);

  let btns = '';
  const disabledStyle = 'opacity:0.4;cursor:default;padding:6px 10px;border:1px solid var(--border-color);border-radius:4px;background:var(--bg-secondary);color:var(--text-primary);font-size:0.85em;';
  const normalStyle = 'padding: 6px 10px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); cursor: pointer; font-size: 0.85em;';

  btns += `<button class="pg-btn" data-page="1" style="${currentPage === 1 ? disabledStyle : normalStyle}" ${currentPage === 1 ? 'disabled' : ''}><i class="fa-solid fa-angles-left"></i></button>`;
  btns += `<button class="pg-btn" data-page="${currentPage - 1}" style="${currentPage === 1 ? disabledStyle : normalStyle}" ${currentPage === 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>`;

  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  if (endPage - startPage < maxVisible - 1) startPage = Math.max(1, endPage - maxVisible + 1);

  for (let i = startPage; i <= endPage; i++) {
    const isActive = i === currentPage;
    btns += `<button class="pg-btn" data-page="${i}" style="padding: 6px 12px; border: 1px solid ${isActive ? 'var(--accent-primary)' : 'var(--border-color)'}; border-radius: 4px; background: ${isActive ? 'var(--accent-primary)' : 'var(--bg-secondary)'}; color: ${isActive ? 'white' : 'var(--text-primary)'}; cursor: pointer; font-size: 0.85em; font-weight: ${isActive ? '700' : '400'};">${i}</button>`;
  }

  btns += `<button class="pg-btn" data-page="${currentPage + 1}" style="${currentPage === totalPages ? disabledStyle : normalStyle}" ${currentPage === totalPages ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button>`;
  btns += `<button class="pg-btn" data-page="${totalPages}" style="${currentPage === totalPages ? disabledStyle : normalStyle}" ${currentPage === totalPages ? 'disabled' : ''}><i class="fa-solid fa-angles-right"></i></button>`;

  pagEl.innerHTML = `
    <span style="color: var(--text-secondary); font-size: 0.85em; margin-right: 8px;">${start}–${end} of ${totalItems}</span>
    ${btns}
  `;

  pagEl.querySelectorAll('.pg-btn').forEach(btn => {
    if (btn.disabled) return;
    btn.addEventListener('click', () => {
      onPageChange(parseInt(btn.dataset.page));
    });
  });
}

async function deactivatePatient(patientId, patientName, container) {
  if (!confirm(`Are you sure you want to deactivate patient "${patientName}"?\n\nThis will archive the patient record. The patient and their associated user account will be deactivated.`)) {
    return;
  }

  try {
    await api.delete(`/patients/${patientId}`);
    showToast(`Patient "${patientName}" deactivated successfully!`, "success");
    // Trigger a full refresh via the custom event
    container.dispatchEvent(new CustomEvent("patient-data-changed"));
  } catch (error) {
    showToast("Error deactivating patient: " + error.message, "error");
  }
}

async function activatePatient(patientId, patientName, container) {
  if (!confirm(`Are you sure you want to activate patient "${patientName}"?\n\nThis will restore the patient record.`)) {
    return;
  }

  try {
    await api.post(`/patients/${patientId}/activate`);
    showToast(`Patient "${patientName}" activated successfully!`, "success");
    container.dispatchEvent(new CustomEvent("patient-data-changed"));
  } catch (error) {
    showToast("Error activating patient: " + error.message, "error");
  }
}

function setupPatientEvents(container, getAllPatientsFn, sortState, onDataChanged) {
  const btnRegister = container.querySelector("#btn-register-patient");
  const regModal = container.querySelector("#patient-reg-modal");
  const btnCancel = container.querySelector("#btn-cancel-patient");
  const btnCloseReg = container.querySelector("#close-patient-reg-modal");
  const form = container.querySelector("#patient-form");
  const searchInput = container.querySelector("#patient-search");
  const thName = container.querySelector("#th-name");

  // Helper: re-render with current search filter and sort (resets to page 1)
  function rerenderFiltered() {
    const query = searchInput.value.toLowerCase();
    const allPatients = getAllPatientsFn();
    const source = query
      ? allPatients.filter(
          (p) =>
            (p.fullName && p.fullName.toLowerCase().includes(query)) ||
            (p.phoneNumber && p.phoneNumber.includes(query)) ||
            (p.patientId && p.patientId.toLowerCase().includes(query)),
        )
      : allPatients;
    onDataChanged && onDataChanged();
  }

  // Name column sort toggle
  thName.addEventListener("click", () => {
    if (sortState.field === "name") {
      sortState.direction = sortState.direction === "asc" ? "desc" : "asc";
    } else {
      sortState.field = "name";
      sortState.direction = "asc";
    }
    // Update sort icon
    const icon = thName.querySelector("i");
    if (sortState.direction === "asc") {
      icon.className = "fa-solid fa-sort-up";
    } else {
      icon.className = "fa-solid fa-sort-down";
    }
    icon.style.opacity = "1";

    rerenderFiltered();
  });

  searchInput.addEventListener("input", (e) => {
    onDataChanged && onDataChanged();
  });

  btnRegister.addEventListener("click", () => {
    regModal.style.display = "flex";
  });

  const closeRegModal = () => {
    regModal.style.display = "none";
    form.reset();
  };

  btnCancel.addEventListener("click", closeRegModal);
  btnCloseReg.addEventListener("click", closeRegModal);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      fullName: document.getElementById("patient-name").value,
      dateOfBirth: document.getElementById("patient-dob").value,
      gender: document.getElementById("patient-gender").value,
      phoneNumber: document.getElementById("patient-phone").value,
      bloodGroup: document.getElementById("patient-blood").value,
      emergencyContactPhone: document.getElementById("patient-em-phone").value,
      status: "OUTPATIENT",
    };

    try {
      await api.post("/patients", payload);
      showToast("Patient registered successfully!", "success");
      closeRegModal();
      searchInput.value = "";
      onDataChanged && onDataChanged();
    } catch (error) {
      showToast("Error: " + error.message, "error");
    }
  });

  container.querySelector("#close-patient-modal").onclick = () => {
    container.querySelector("#patient-modal").style.display = "none";
  };
}

async function showPatientDetails(patientId, container) {
  const modal = container.querySelector("#patient-modal");
  const content = container.querySelector("#patient-modal-content");

  content.innerHTML =
    '<div style="text-align:center; padding: 20px;">Loading details...</div>';
  modal.style.display = "flex";

  try {
    const patient = await api.get(`/patients/${patientId}`);
    const doctors = await api
      .get(`/doctor-patient/patient/${patientId}/doctors`)
      .catch(() => []);
    const treatments = await api
      .get(`/treatment-records/patient/${patientId}`)
      .catch(() => []);

    content.innerHTML = `
            <div class="grid-2-col" style="margin-bottom: 24px;">
                <div>
                    <p><strong>Name:</strong> ${patient.fullName}</p>
                    <p><strong>DOB:</strong> ${patient.dateOfBirth}</p>
                    <p><strong>Gender:</strong> ${patient.gender}</p>
                </div>
                <div>
                    <p><strong>Phone:</strong> ${patient.phoneNumber}</p>
                    <p><strong>Blood:</strong> ${patient.bloodGroup || "-"}</p>
                    <p><strong>Status:</strong> <span style="color: var(--accent-primary); font-weight: bold;">${patient.status}</span></p>
                </div>
            </div>
            
            <h3 style="margin-bottom: 12px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">Assigned Doctors</h3>
            <ul style="margin-bottom: 24px; padding-left: 20px;">
                ${doctors.length > 0 ? doctors.map((dp) => `<li>${dp.doctor?.fullName} (${dp.isPrimary ? "Primary" : "Secondary"})</li>`).join("") : "<li>No doctors assigned</li>"}
            </ul>

            <h3 style="margin-bottom: 12px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">Treatment History</h3>
            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9em;">
                <thead>
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <th style="padding: 8px;">Date</th>
                        <th style="padding: 8px;">Treatment</th>
                        <th style="padding: 8px;">Doctor</th>
                    </tr>
                </thead>
                <tbody>
                    ${
                      treatments.length > 0
                        ? treatments
                            .map(
                              (tr) => `
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 8px;">${new Date(tr.sessionDate).toLocaleDateString()}</td>
                            <td style="padding: 8px;">${tr.treatment?.name} (Qty: ${tr.quantity})</td>
                            <td style="padding: 8px;">${tr.doctor?.fullName || "-"}</td>
                        </tr>
                    `,
                            )
                            .join("")
                        : '<tr><td colspan="3" style="padding: 8px; text-align: center;">No treatments recorded</td></tr>'
                    }
                </tbody>
            </table>
        `;
  } catch (err) {
    content.innerHTML =
      '<div style="color: red;">Failed to load patient details.</div>';
  }
}

export async function renderDoctorPatientList() {
  const container = document.createElement("div");
  container.innerHTML = `
        <div class="glass-panel" style="padding: 24px;">
            <h3>My Patients</h3>
            <div style="overflow-x: auto; margin-top: 20px;">
                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--border-color);">
                            <th style="padding: 12px;">Patient ID</th>
                            <th style="padding: 12px;">Full Name</th>
                            <th style="padding: 12px;">Primary Doctor?</th>
                            <th style="padding: 12px;">Assignment Notes</th>
                            <th style="padding: 12px;">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="doc-patient-list">
                        <tr><td colspan="5" style="text-align: center; padding: 20px;">Loading patient list...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Doctor Patient Detail & Clinical Modal -->
        <div id="doc-patient-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center;">
            <div class="glass-panel" style="background: var(--bg-primary); width: 95%; max-width: 850px; padding: 24px; max-height: 90vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
                    <h3 style="margin: 0;"><i class="fa-solid fa-user-doctor" style="color: var(--accent-primary);"></i> Manage Patient Record & Prescriptions</h3>
                    <button id="close-doc-patient-modal" style="background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-primary);">&times;</button>
                </div>
                
                <div class="grid-2-col" style="gap: 20px; margin-bottom: 20px;">
                    <!-- Demographics info -->
                    <div style="background: rgba(100,116,139,0.03); padding: 16px; border-radius: 8px; border: 1px solid var(--border-color);">
                        <h4 style="margin-top: 0; margin-bottom: 12px; border-bottom: 1px solid var(--border-color); padding-bottom: 6px; color: var(--accent-primary);">Administrative Information</h4>
                        <p style="margin: 6px 0;"><strong>Full Name:</strong> <span id="doc-p-name">-</span></p>
                        <p style="margin: 6px 0;"><strong>Patient ID:</strong> <span id="doc-p-id">-</span></p>
                        <p style="margin: 6px 0;"><strong>Date of Birth:</strong> <span id="doc-p-dob">-</span></p>
                        <p style="margin: 6px 0;"><strong>Gender:</strong> <span id="doc-p-gender">-</span></p>
                        <p style="margin: 6px 0;"><strong>Phone:</strong> <span id="doc-p-phone">-</span></p>
                        <p style="margin: 6px 0;"><strong>Blood Group:</strong> <span id="doc-p-blood">-</span></p>
                        <p style="margin: 6px 0;"><strong>Status:</strong> <span id="doc-p-status" style="font-weight: 600;">-</span></p>
                    </div>

                    <!-- Clinical Edit Form -->
                    <div style="background: rgba(100,116,139,0.03); padding: 16px; border-radius: 8px; border: 1px solid var(--border-color);">
                        <h4 style="margin-top: 0; margin-bottom: 12px; border-bottom: 1px solid var(--border-color); padding-bottom: 6px; color: var(--accent-primary);">Diagnosis & Clinical Notes</h4>
                        <form id="doc-clinical-form">
                            <input type="hidden" id="clinical-p-id">
                            <div style="margin-bottom: 10px;">
                                <label style="display: block; font-size: 0.85em; font-weight: 500; margin-bottom: 4px;">Clinical Diagnosis (disease_description)</label>
                                <textarea id="clinical-disease-desc" rows="2" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); font-family: inherit; font-size: 0.9em;"></textarea>
                            </div>
                            <div style="margin-bottom: 12px;">
                                <label style="display: block; font-size: 0.85em; font-weight: 500; margin-bottom: 4px;">Current Treatment Notes</label>
                                <textarea id="clinical-treatment-notes" rows="2" style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); font-family: inherit; font-size: 0.9em;"></textarea>
                            </div>
                            <button type="submit" style="width: 100%; padding: 8px; background: var(--status-success); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                                <i class="fa-solid fa-floppy-disk"></i> Save Clinical Notes
                            </button>
                        </form>
                    </div>
                </div>

                <div class="grid-1-2-col" style="gap: 20px;">
                    <!-- Treatment History -->
                    <div>
                        <h4 style="margin-top: 0; margin-bottom: 12px; color: var(--accent-primary); border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">Treatment & Orders History</h4>
                        <div style="overflow-y: auto; max-height: 250px;">
                            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85em;">
                                <thead>
                                    <tr style="border-bottom: 1px solid var(--border-color); color: var(--text-secondary);">
                                        <th style="padding: 6px;">Date</th>
                                        <th style="padding: 6px;">Treatment / Order</th>
                                        <th style="padding: 6px; text-align: right;">Qty</th>
                                        <th style="padding: 6px;">Doctor</th>
                                    </tr>
                                </thead>
                                <tbody id="doc-p-treatment-history">
                                    <tr><td colspan="4" style="text-align: center; padding: 10px;">No data available</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Prescribe Form -->
                    <div style="background: rgba(14, 165, 233, 0.03); padding: 16px; border-radius: 8px; border: 1px solid rgba(14, 165, 233, 0.2);">
                        <h4 style="margin-top: 0; margin-bottom: 12px; color: var(--accent-primary); border-bottom: 1px solid rgba(14, 165, 233, 0.2); padding-bottom: 6px;">New Prescription & Order</h4>
                        <form id="doc-prescribe-form">
                            <div style="margin-bottom: 8px;">
                                <label style="display: block; font-size: 0.8em; margin-bottom: 2px;">Service / Medication *</label>
                                <select id="doc-presc-treatment-id" required style="width: 100%; padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); font-size: 0.85em;">
                                    <option value="">Loading services...</option>
                                </select>
                            </div>
                            <div style="margin-bottom: 8px;">
                                <label style="display: block; font-size: 0.8em; margin-bottom: 2px;">Quantity *</label>
                                <input type="number" id="doc-presc-qty" min="1" value="1" required style="width: 100%; padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); font-size: 0.85em;">
                            </div>
                            <div style="margin-bottom: 10px;">
                                <label style="display: block; font-size: 0.8em; margin-bottom: 2px;">Instructions / Notes</label>
                                <input type="text" id="doc-presc-notes" placeholder="Dosage, usage directions..." style="width: 100%; padding: 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-secondary); color: var(--text-primary); font-size: 0.85em;">
                            </div>
                            <button type="submit" style="width: 100%; padding: 8px; background: var(--accent-primary); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.85em;">
                                <i class="fa-solid fa-file-prescription"></i> Submit Order
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

  setTimeout(async () => {
    const tbody = container.querySelector("#doc-patient-list");
    const doctorId = localStorage.getItem("doctorId") || sessionStorage.getItem("doctorId");

    if (!doctorId) {
      tbody.innerHTML =
        '<tr><td colspan="5" style="text-align:center; color: var(--status-danger);">This account is not linked to any doctor profile.</td></tr>';
      return;
    }

    // Load doctor's patients
    async function loadDoctorPatients() {
      try {
        const list = await api.get(`/doctor-patient/doctor/${doctorId}/patients`);
        if (!list || list.length === 0) {
          tbody.innerHTML =
            '<tr><td colspan="5" style="text-align:center;">You are not assigned to any patient.</td></tr>';
          return;
        }
        tbody.innerHTML = list
          .map(
            (dp) => `
                  <tr style="border-bottom: 1px solid var(--border-color);">
                      <td style="padding: 12px;">${dp.patient?.patientId}</td>
                      <td style="padding: 12px; font-weight: 500;">${dp.patient?.fullName}</td>
                      <td style="padding: 12px;">${dp.isPrimary ? '<span style="color:var(--status-success); font-weight: 600;"><i class="fa-solid fa-circle-check"></i> Yes</span>' : "No"}</td>
                      <td style="padding: 12px; color: var(--text-secondary);">${dp.notes || "-"}</td>
                      <td style="padding: 12px;">
                          <button class="btn btn-primary btn-manage-p" data-id="${dp.patient?.patientId}" style="padding: 4px 8px; background: var(--accent-primary); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85em; display: flex; align-items: center; gap: 4px;">
                              <i class="fa-solid fa-user-md"></i> Manage
                          </button>
                      </td>
                  </tr>
              `,
          )
          .join("");

        // Attach click events
        container.querySelectorAll(".btn-manage-p").forEach(btn => {
          btn.onclick = () => openPatientClinicalModal(btn.dataset.id);
        });

      } catch (e) {
        tbody.innerHTML =
          '<tr><td colspan="5" style="text-align:center; color: var(--status-danger);">Error loading patient list.</td></tr>';
      }
    }

    await loadDoctorPatients();

    // Modal management
    const modal = container.querySelector("#doc-patient-modal");
    const closeBtn = container.querySelector("#close-doc-patient-modal");
    const clinicalForm = container.querySelector("#doc-clinical-form");
    const prescribeForm = container.querySelector("#doc-prescribe-form");

    closeBtn.onclick = () => {
      modal.style.display = "none";
      clinicalForm.reset();
      prescribeForm.reset();
    };

    // Open clinical modal
    async function openPatientClinicalModal(patientId) {
      modal.style.display = "flex";
      container.querySelector("#clinical-p-id").value = patientId;

      // Populate info
      try {
        const p = await api.get(`/patients/${patientId}`);
        container.querySelector("#doc-p-name").textContent = p.fullName;
        container.querySelector("#doc-p-id").textContent = p.patientId;
        container.querySelector("#doc-p-dob").textContent = p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString("en-US") : "-";
        container.querySelector("#doc-p-gender").textContent = p.gender === "MALE" ? "Male" : (p.gender === "FEMALE" ? "Female" : "Other");
        container.querySelector("#doc-p-phone").textContent = p.phoneNumber || "-";
        container.querySelector("#doc-p-blood").textContent = p.bloodGroup || "-";
        
        const statusEl = container.querySelector("#doc-p-status");
        statusEl.textContent = p.status || "OUTPATIENT";
        if (p.status === "INPATIENT") {
          statusEl.style.color = "var(--status-success)";
        } else {
          statusEl.style.color = "var(--accent-primary)";
        }

        container.querySelector("#clinical-disease-desc").value = p.diseaseDescription || "";
        container.querySelector("#clinical-treatment-notes").value = p.currentTreatmentNotes || "";

        // Load treatment history
        await loadTreatmentHistory(patientId);

        // Load master active treatments for select list
        await loadActiveTreatmentsDropdown();

      } catch (err) {
        showToast("Error loading patient details: " + err.message, "error");
      }
    }

    async function loadTreatmentHistory(patientId) {
      const histBody = container.querySelector("#doc-p-treatment-history");
      histBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 10px;">Loading...</td></tr>';
      try {
        const records = await api.get(`/treatment-records/patient/${patientId}`);
        if (!records || records.length === 0) {
          histBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 10px; color: var(--text-secondary);">No treatment services prescribed yet.</td></tr>';
          return;
        }
        histBody.innerHTML = records.map(r => `
          <tr style="border-bottom: 1px solid var(--border-color);">
            <td style="padding: 6px;">${r.sessionDate ? new Date(r.sessionDate).toLocaleDateString("en-US") : "-"}</td>
            <td style="padding: 6px; font-weight: 500;">${r.treatment?.name}</td>
            <td style="padding: 6px; text-align: right;">${r.quantity}</td>
            <td style="padding: 6px;">${r.doctor?.fullName || "-"}</td>
          </tr>
        `).join("");
      } catch (err) {
        histBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 10px; color: var(--status-danger);">Error loading treatment history.</td></tr>';
      }
    }

    async function loadActiveTreatmentsDropdown() {
      const select = container.querySelector("#doc-presc-treatment-id");
      try {
        const treatments = await api.get("/treatments/active");
        if (treatments.length === 0) {
          select.innerHTML = '<option value="">No services available</option>';
          return;
        }
        select.innerHTML = '<option value="">Select service/order...</option>' + 
          treatments.map(t => `<option value="${t.treatmentId}">${t.name} ($${t.unitCost})</option>`).join("");
      } catch (err) {
        select.innerHTML = '<option value="">Error loading services</option>';
      }
    }

    // Submit clinical details
    clinicalForm.onsubmit = async (e) => {
      e.preventDefault();
      const patientId = container.querySelector("#clinical-p-id").value;
      const payload = {
        diseaseDescription: container.querySelector("#clinical-disease-desc").value,
        currentTreatmentNotes: container.querySelector("#clinical-treatment-notes").value
      };

      try {
        await api.patch(`/patients/${patientId}/clinical`, payload);
        showToast("Diagnosis updated successfully!", "success");
        // Refresh doctor's patients list
        await loadDoctorPatients();
      } catch (err) {
        showToast("Error saving clinical info: " + err.message, "error");
      }
    };

    // Submit prescription / treatment record
    prescribeForm.onsubmit = async (e) => {
      e.preventDefault();
      const patientId = container.querySelector("#clinical-p-id").value;
      const treatmentId = parseInt(container.querySelector("#doc-presc-treatment-id").value, 10);
      const qty = parseInt(container.querySelector("#doc-presc-qty").value, 10);
      const notes = container.querySelector("#doc-presc-notes").value;

      if (!treatmentId) {
        showToast("Please select a treatment service.", "warning");
        return;
      }

      const payload = {
        patientId: patientId,
        doctorId: doctorId,
        treatmentId: treatmentId,
        quantity: qty,
        notes: notes
      };

      try {
        await api.post("/treatment-records", payload);
        showToast("Prescription/order submitted successfully!", "success");
        prescribeForm.reset();
        container.querySelector("#doc-presc-qty").value = 1;
        // Refresh history
        await loadTreatmentHistory(patientId);
      } catch (err) {
        showToast("Error submitting order: " + err.message, "error");
      }
    };

  }, 0);

  return container;
}
