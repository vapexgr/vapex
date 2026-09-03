/**
 * VAPEX App Main Logic
 * Handles i18n language engine, currency switcher, and interactive tank simulator
 */

document.addEventListener("DOMContentLoaded", () => {
  // Current State
  let currentLang = localStorage.getItem("vapex_lang") || "ru";
  let currentCurrency = localStorage.getItem("vapex_currency") || "USD"; // USD or EUR

  // DOM Elements
  const langBtns = document.querySelectorAll(".lang-btn");
  const currencyBtns = document.querySelectorAll(".currency-btn");
  const priceDisplays = document.querySelectorAll(".dynamic-price");
  const priceAltDisplays = document.querySelectorAll(".dynamic-price-alt");
  const ledToggleBtn = document.getElementById("ledToggleBtn");
  const ledDot = document.getElementById("ledDot");
  const ledText = document.getElementById("ledText");

  // --- 1. LANGUAGE SWITCHER ENGINE ---
  function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem("vapex_lang", lang);

    // Update active button states
    langBtns.forEach(btn => {
      if (btn.dataset.lang === lang) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Update all data-i18n DOM elements
    const i18nElements = document.querySelectorAll("[data-i18n]");
    i18nElements.forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (translations[lang][key] !== undefined) {
        el.innerHTML = translations[lang][key];
      }
    });

    // Update LED status text based on active status state
    updateLEDText();
    // Update prices with correct currency symbol formatting for language
    updatePrices();
  }

  // Language button event listeners
  langBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      setLanguage(btn.dataset.lang);
    });
  });

  // --- 2. CURRENCY SWITCHER ENGINE ---
  function setCurrency(currency) {
    currentCurrency = currency;
    localStorage.setItem("vapex_currency", currency);

    currencyBtns.forEach(btn => {
      if (btn.dataset.currency === currency) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    updatePrices();
  }

  function updatePrices() {
    const isUSD = currentCurrency === "USD";
    const mainPriceText = isUSD ? "$700" : "600€";

    // Primary dynamic price tags
    priceDisplays.forEach(el => {
      el.textContent = mainPriceText;
    });

    // Secondary Alt dynamic price tags (Shows OPPOSITE currency cleanly!)
    priceAltDisplays.forEach(el => {
      if (isUSD) {
        // Primary is USD ($700), alt is EUR (€600)
        el.textContent = translations[currentLang]["price_alt_eur"] || "or €600";
      } else {
        // Primary is EUR (€600), alt is USD ($700)
        el.textContent = translations[currentLang]["price_alt_usd"] || "or $700";
      }
    });
  }

  currencyBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      setCurrency(btn.dataset.currency);
    });
  });

  // --- 3. INTERACTIVE PRE-HEAT LED SIMULATOR ---
  let isGreen = true;
  function updateLEDText() {
    if (!ledDot || !ledText) return;
    if (isGreen) {
      ledDot.className = "led-dot green";
      ledText.textContent = translations[currentLang]["tank_status_green"];
    } else {
      ledDot.className = "led-dot orange";
      ledText.textContent = translations[currentLang]["tank_status_orange"];
    }
  }

  if (ledToggleBtn) {
    ledToggleBtn.addEventListener("click", () => {
      isGreen = !isGreen;
      updateLEDText();
    });
  }

  // --- 4. INITIALIZATION ---
  setLanguage(currentLang);
  setCurrency(currentCurrency);
});
