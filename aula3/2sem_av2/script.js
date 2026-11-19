const STORAGE_KEY = "vaccinationsjournal_sverige_v1";

let vaccinations = [];
let registrations = {};
let selectedVaccinationId = null;

const els = {};

document.addEventListener("DOMContentLoaded", async () => {
  mapElements();
  bindEvents();
  await loadVaccinationProgram();
  restoreLocalDraft(false);
  updateAgeAndStatuses();
});

function mapElements() {
  els.form = document.getElementById("child-form");
  els.name = document.getElementById("child-name");
  els.birthDate = document.getElementById("birth-date");
  els.ageDisplay = document.getElementById("age-display");
  els.personnummer = document.getElementById("personnummer");
  els.guardian1 = document.getElementById("guardian-1");
  els.guardian2 = document.getElementById("guardian-2");
  els.formStatus = document.getElementById("form-status");
  els.vaccineList = document.getElementById("vaccine-list");
  els.saveMessage = document.getElementById("save-message");
  els.btnLoad = document.getElementById("btn-load");
  els.errorName = document.getElementById("error-name");
  els.errorBirth = document.getElementById("error-birth");
  els.errorPersonnummer = document.getElementById("error-personnummer");
  els.errorGuardian = document.getElementById("error-guardian");

  els.modal = document.getElementById("modal");
  els.modalTitle = document.getElementById("modal-title");
  els.modalDose = document.getElementById("modal-dose");
  els.modalTime = document.getElementById("modal-time");
  els.modalProtection = document.getElementById("modal-protection");
  els.givenCheck = document.getElementById("given-check");
  els.applicationFields = document.getElementById("application-fields");
  els.applicationDate = document.getElementById("application-date");
  els.batchNumber = document.getElementById("batch-number");
  els.clinic = document.getElementById("clinic");
  els.professional = document.getElementById("professional");
  els.note = document.getElementById("note");
  els.modalError = document.getElementById("modal-error");
}

function bindEvents() {
  els.birthDate.addEventListener("change", updateAgeAndStatuses);
  els.personnummer.addEventListener("input", formatPersonnummerInput);
  els.personnummer.addEventListener("blur", validatePersonnummerField);
  els.givenCheck.addEventListener("change", () => {
    els.applicationFields.classList.toggle("hidden", !els.givenCheck.checked);
  });
  document
    .getElementById("modal-confirm")
    .addEventListener("click", saveVaccinationRegistration);
  document.getElementById("modal-cancel").addEventListener("click", closeModal);
  document
    .getElementById("modal-close-x")
    .addEventListener("click", closeModal);
  els.modal.addEventListener("click", (event) => {
    if (event.target === els.modal) closeModal();
  });
  els.form.addEventListener("submit", saveJournal);
  els.btnLoad.addEventListener("click", () => restoreLocalDraft(true));
}

async function loadVaccinationProgram() {
  try {
    const response = await fetch("vaccinationsprogram.json", {
      cache: "no-store",
    });
    if (!response.ok)
      throw new Error("Kunde inte läsa vaccinationsprogrammet.");
    const data = await response.json();
    vaccinations = data.vaccinations || [];
    renderVaccinations();
  } catch (error) {
    els.vaccineList.innerHTML =
      "<p>Vaccinationsprogrammet kunde inte laddas. Starta projektet med Live Server.</p>";
    console.error(error);
  }
}

function updateAgeAndStatuses() {
  const birthDate = parseISODate(els.birthDate.value);
  if (!birthDate) {
    els.ageDisplay.value = "";
    renderVaccinations();
    return;
  }

  const today = startOfDay(new Date());
  if (birthDate > today) {
    els.errorBirth.textContent = "Födelsedatum kan inte ligga i framtiden.";
    els.ageDisplay.value = "";
    renderVaccinations();
    return;
  }

  els.errorBirth.textContent = "";
  const { years, months } = calculateAge(birthDate, today);
  els.ageDisplay.value =
    years > 0 ? `${years} år och ${months} månader` : `${months} månader`;
  renderVaccinations();
}

function calculateAge(birthDate, today) {
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  if (today.getDate() < birthDate.getDate()) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, totalMonths: years * 12 + months };
}

function getAgeInMonths() {
  const birthDate = parseISODate(els.birthDate.value);
  if (!birthDate || birthDate > new Date()) return null;
  return calculateAge(birthDate, startOfDay(new Date())).totalMonths;
}

function renderVaccinations() {
  if (!els.vaccineList || vaccinations.length === 0) return;
  const ageMonths = getAgeInMonths();
  els.vaccineList.innerHTML = "";

  vaccinations.forEach((vaccine) => {
    const registration = registrations[vaccine.id];
    const isCompleted = Boolean(registration && registration.given);
    const isOverdue =
      !isCompleted && ageMonths !== null && ageMonths >= vaccine.minAgeMonths;
    const status = isCompleted
      ? "Registrerad"
      : isOverdue
        ? "Försenad"
        : "Kommande";

    const card = document.createElement("article");
    card.className =
      `vaccine-card ${isCompleted ? "completed" : ""} ${isOverdue ? "overdue" : ""}`.trim();
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute(
      "aria-label",
      `${vaccine.vaccin}, ${vaccine.dos}, ${status}`,
    );
    card.innerHTML = `
      <span class="dose-tag">${escapeHtml(vaccine.dos)}</span>
      <h3>${escapeHtml(vaccine.vaccin)}</h3>
      <p><strong>Tidpunkt:</strong> ${escapeHtml(vaccine.tidpunkt)}</p>
      <p class="card-status">${status}</p>
    `;
    card.addEventListener("click", () => openModal(vaccine.id));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(vaccine.id);
      }
    });
    els.vaccineList.appendChild(card);
  });
}

function openModal(id) {
  const vaccine = vaccinations.find((item) => item.id === id);
  if (!vaccine) return;
  selectedVaccinationId = id;
  const current = registrations[id] || {};

  els.modalTitle.textContent = vaccine.vaccin;
  els.modalDose.textContent = vaccine.dos;
  els.modalTime.textContent = vaccine.tidpunkt;
  els.modalProtection.textContent = vaccine.skydd;
  els.givenCheck.checked = Boolean(current.given);
  els.applicationFields.classList.toggle("hidden", !els.givenCheck.checked);
  els.applicationDate.value = current.date || "";
  els.batchNumber.value = current.batch || "";
  els.clinic.value = current.clinic || "";
  els.professional.value = current.professional || "";
  els.note.value = current.note || "";
  els.modalError.textContent = "";
  els.modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  els.modal.classList.add("hidden");
  document.body.style.overflow = "";
  selectedVaccinationId = null;
}

function saveVaccinationRegistration() {
  if (!selectedVaccinationId) return;
  els.modalError.textContent = "";

  if (els.givenCheck.checked) {
    if (
      !els.applicationDate.value ||
      !els.batchNumber.value.trim() ||
      !els.clinic.value.trim() ||
      !els.professional.value.trim()
    ) {
      els.modalError.textContent =
        "Fyll i datum, batch-/lotnummer, vårdenhet och ansvarig vårdpersonal.";
      return;
    }
    registrations[selectedVaccinationId] = {
      given: true,
      date: els.applicationDate.value,
      batch: els.batchNumber.value.trim(),
      clinic: els.clinic.value.trim(),
      professional: els.professional.value.trim(),
      note: els.note.value.trim(),
    };
  } else {
    delete registrations[selectedVaccinationId];
  }

  persistDraft();
  renderVaccinations();
  closeModal();
}

function saveJournal(event) {
  event.preventDefault();
  if (!validateChildForm()) return;

  const journal = buildJournalObject();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(journal));
  downloadJson(journal, buildFileName());

  els.formStatus.textContent = "Sparad lokalt";
  els.formStatus.className = "status-pill saved";
  els.saveMessage.textContent =
    "Journalen sparades lokalt och JSON-filen laddades ned.";
}

function validateChildForm() {
  let valid = true;
  clearErrors();

  if (!els.name.value.trim()) {
    els.errorName.textContent = "Ange barnets namn.";
    valid = false;
  }
  if (!els.birthDate.value) {
    els.errorBirth.textContent = "Ange födelsedatum.";
    valid = false;
  }
  if (!els.guardian1.value.trim()) {
    els.errorGuardian.textContent = "Ange minst en vårdnadshavare.";
    valid = false;
  }
  if (!validatePersonnummerField()) valid = false;

  return valid;
}

function validatePersonnummerField() {
  const value = els.personnummer.value.trim();
  if (!value) {
    els.errorPersonnummer.textContent = "Ange personnummer.";
    return false;
  }

  const result = validateSwedishPersonnummer(value, els.birthDate.value);
  els.errorPersonnummer.textContent = result.valid ? "" : result.message;
  return result.valid;
}

function validateSwedishPersonnummer(value, birthDateISO) {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 10 && digits.length !== 12) {
    return {
      valid: false,
      message: "Personnumret ska innehålla 10 eller 12 siffror.",
    };
  }

  const tenDigits = digits.length === 12 ? digits.slice(2) : digits;
  const datePart = tenDigits.slice(0, 6);
  const month = Number(datePart.slice(2, 4));
  const day = Number(datePart.slice(4, 6));
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return { valid: false, message: "Personnumrets datumdel är ogiltig." };
  }

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let product = Number(tenDigits[i]) * (i % 2 === 0 ? 2 : 1);
    sum += product > 9 ? product - 9 : product;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  if (checkDigit !== Number(tenDigits[9])) {
    return {
      valid: false,
      message: "Personnumrets kontrollsiffra stämmer inte.",
    };
  }

  if (birthDateISO) {
    const birthDigits = birthDateISO.replace(/-/g, "");
    const expectedYYMMDD = birthDigits.slice(2);
    if (datePart !== expectedYYMMDD) {
      return {
        valid: false,
        message: "Personnumret matchar inte angivet födelsedatum.",
      };
    }
  }

  return { valid: true, message: "" };
}

function formatPersonnummerInput() {
  let digits = els.personnummer.value.replace(/\D/g, "").slice(0, 12);
  if (digits.length <= 10) {
    if (digits.length > 6) digits = `${digits.slice(0, 6)}-${digits.slice(6)}`;
  }
  els.personnummer.value = digits;
}

function buildJournalObject() {
  return {
    land: "Sverige",
    skapad: new Date().toISOString(),
    barn: {
      namn: els.name.value.trim(),
      fodelsedatum: els.birthDate.value,
      personnummer: els.personnummer.value.trim(),
      vardnadshavare1: els.guardian1.value.trim(),
      vardnadshavare2: els.guardian2.value.trim() || null,
    },
    vaccinationer: vaccinations.map((vaccine) => ({
      id: vaccine.id,
      vaccin: vaccine.vaccin,
      dos: vaccine.dos,
      tidpunkt: vaccine.tidpunkt,
      status: registrations[vaccine.id]?.given
        ? "REGISTRERAD"
        : isVaccinationOverdue(vaccine)
          ? "FORSENAD"
          : "KOMMANDE",
      registrering: registrations[vaccine.id] || null,
    })),
  };
}

function isVaccinationOverdue(vaccine) {
  const ageMonths = getAgeInMonths();
  return (
    !registrations[vaccine.id]?.given &&
    ageMonths !== null &&
    ageMonths >= vaccine.minAgeMonths
  );
}

function persistDraft() {
  const draft = {
    land: "Sverige",
    barn: {
      namn: els.name.value.trim(),
      fodelsedatum: els.birthDate.value,
      personnummer: els.personnummer.value.trim(),
      vardnadshavare1: els.guardian1.value.trim(),
      vardnadshavare2: els.guardian2.value.trim(),
    },
    registrations,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

function restoreLocalDraft(showMessage) {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    if (showMessage)
      els.saveMessage.textContent =
        "Det finns ingen lokalt sparad journal i den här webbläsaren.";
    return;
  }

  try {
    const data = JSON.parse(raw);
    const child = data.barn || {};
    els.name.value = child.namn || "";
    els.birthDate.value = child.fodelsedatum || "";
    els.personnummer.value = child.personnummer || "";
    els.guardian1.value = child.vardnadshavare1 || "";
    els.guardian2.value = child.vardnadshavare2 || "";
    registrations =
      data.registrations || extractRegistrations(data.vaccinationer || []);
    updateAgeAndStatuses();
    els.formStatus.textContent = "Sparad lokalt";
    els.formStatus.className = "status-pill saved";
    if (showMessage)
      els.saveMessage.textContent =
        "Den lokalt sparade journalen har lästs in.";
  } catch (error) {
    if (showMessage)
      els.saveMessage.textContent = "Den lokala journalen kunde inte läsas.";
    console.error(error);
  }
}

function extractRegistrations(items) {
  const result = {};
  items.forEach((item) => {
    if (item.id && item.registrering) result[item.id] = item.registrering;
  });
  return result;
}

function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function buildFileName() {
  const safeName =
    els.name.value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "barn";
  return `vaccinationsjournal-${safeName}.json`;
}

function clearErrors() {
  [
    els.errorName,
    els.errorBirth,
    els.errorPersonnummer,
    els.errorGuardian,
  ].forEach((el) => (el.textContent = ""));
  els.saveMessage.textContent = "";
}

function parseISODate(value) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
