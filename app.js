(function () {
  const STORAGE_KEY = "record-keeper-receipts";

  const form = document.getElementById("receipt-form");
  const photoInput = document.getElementById("receipt-photo");
  const uploadZone = document.getElementById("upload-zone");
  const photoPreviewWrap = document.getElementById("photo-preview-wrap");
  const photoPreview = document.getElementById("photo-preview");
  const clearPhotoBtn = document.getElementById("clear-photo");
  const toast = document.getElementById("toast");
  const recentSection = document.getElementById("recent-section");
  const recentList = document.getElementById("recent-list");

  let objectUrl = null;

  function showError(id, message) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = message || "";
    el.classList.toggle("hidden", !message);
  }

  function clearFieldErrors() {
    ["photo", "date", "vendor", "amount", "car", "customer"].forEach((key) => {
      showError(`${key}-error`, "");
    });
  }

  function revokePreviewUrl() {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = null;
    }
  }

  function setPreview(file) {
    revokePreviewUrl();
    if (!file || !file.type.startsWith("image/")) {
      photoPreviewWrap.classList.add("hidden");
      uploadZone.querySelector(".upload-zone__prompt").classList.remove("hidden");
      photoPreview.removeAttribute("src");
      return;
    }
    objectUrl = URL.createObjectURL(file);
    photoPreview.src = objectUrl;
    photoPreviewWrap.classList.remove("hidden");
    uploadZone.querySelector(".upload-zone__prompt").classList.add("hidden");
    showError("photo-error", "");
  }

  photoInput.addEventListener("change", () => {
    const file = photoInput.files && photoInput.files[0];
    setPreview(file);
  });

  clearPhotoBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    photoInput.value = "";
    setPreview(null);
  });

  ["dragenter", "dragover", "dragleave", "drop"].forEach((evt) => {
    uploadZone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  });

  uploadZone.addEventListener("dragenter", () => uploadZone.classList.add("dragover"));
  uploadZone.addEventListener("dragleave", () => uploadZone.classList.remove("dragover"));
  uploadZone.addEventListener("drop", (e) => {
    uploadZone.classList.remove("dragover");
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      try {
        const dt = new DataTransfer();
        dt.items.add(file);
        photoInput.files = dt.files;
        setPreview(file);
      } catch {
        showError("photo-error", "Could not attach that file. Use Browse instead.");
      }
    } else {
      showError("photo-error", "Please drop an image file.");
    }
  });

  function validate() {
    clearFieldErrors();
    let ok = true;

    const file = photoInput.files && photoInput.files[0];
    if (!file) {
      showError("photo-error", "Add a receipt photo.");
      ok = false;
    } else if (!file.type.startsWith("image/")) {
      showError("photo-error", "File must be an image.");
      ok = false;
    }

    const dateEl = document.getElementById("expense-date");
    if (!dateEl.value) {
      showError("date-error", "Choose a date.");
      ok = false;
    }

    const vendor = document.getElementById("vendor").value.trim();
    if (!vendor) {
      showError("vendor-error", "Enter the vendor.");
      ok = false;
    }

    const amountRaw = document.getElementById("amount").value;
    const amount = parseFloat(amountRaw, 10);
    if (amountRaw === "" || Number.isNaN(amount) || amount < 0) {
      showError("amount-error", "Enter a valid amount (0 or more).");
      ok = false;
    }

    const car = document.getElementById("car").value.trim();
    if (!car) {
      showError("car-error", "Enter the car.");
      ok = false;
    }

    const customer = document.getElementById("customer").value.trim();
    if (!customer) {
      showError("customer-error", "Enter the customer.");
      ok = false;
    }

    return ok;
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  function loadStored() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveStored(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  function formatMoney(n) {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
    }).format(n);
  }

  function formatDate(iso) {
    if (!iso) return "";
    const d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function showToast(message, success) {
    toast.textContent = message;
    toast.classList.remove("hidden", "success");
    if (success) toast.classList.add("success");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
      toast.classList.add("hidden");
    }, 4000);
  }

  function renderRecent() {
    const entries = loadStored();
    if (!entries.length) {
      recentSection.classList.add("hidden");
      return;
    }
    recentSection.classList.remove("hidden");
    recentList.innerHTML = entries
      .slice()
      .reverse()
      .slice(0, 8)
      .map(
        (e) =>
          `<li><span><strong>${escapeHtml(e.vendor)}</strong> — ${escapeHtml(e.customer)} <span class="meta">· ${escapeHtml(e.car)}</span></span><span class="amt">${formatMoney(e.amount)} <span class="meta">${escapeHtml(formatDate(e.date))}</span></span></li>`
      )
      .join("");
  }

  function escapeHtml(s) {
    const div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const file = photoInput.files[0];
    let imageDataUrl;
    try {
      imageDataUrl = await readFileAsDataUrl(file);
    } catch {
      showToast("Could not read the image. Try another file.", false);
      return;
    }

    const entry = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      date: document.getElementById("expense-date").value,
      vendor: document.getElementById("vendor").value.trim(),
      amount: parseFloat(document.getElementById("amount").value, 10),
      car: document.getElementById("car").value.trim(),
      customer: document.getElementById("customer").value.trim(),
      imageDataUrl,
      fileName: file.name,
      savedAt: new Date().toISOString(),
    };

    const entries = loadStored();
    entries.push(entry);
    saveStored(entries);

    form.reset();
    setPreview(null);
    clearFieldErrors();
    renderRecent();
    showToast("Receipt saved locally in this browser.", true);
  });

  form.addEventListener("reset", () => {
    setTimeout(() => {
      setPreview(null);
      clearFieldErrors();
    }, 0);
  });

  renderRecent();
})();
