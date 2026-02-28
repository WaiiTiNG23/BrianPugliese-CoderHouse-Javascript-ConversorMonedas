const STORAGE_RATES = "cj_rates";
const STORAGE_HISTORY = "cj_history";

class Moneda {
    constructor(codigo, nombre, valor) {
        this.codigo = codigo.toUpperCase();
        this.nombre = nombre;
        this.valor = Number(valor);
    }
}

const state = {
    rates: [],
    history: []
};

const elements = {
    amountInput: document.getElementById("amountInput"),
    fromSelect: document.getElementById("fromSelect"),
    toSelect: document.getElementById("toSelect"),
    resultOutput: document.getElementById("resultOutput"),
    convertBtn: document.getElementById("convertBtn"),
    swapBtn: document.getElementById("swapBtn"),
    addRateBtn: document.getElementById("addRateBtn"),
    resetRatesBtn: document.getElementById("resetRatesBtn"),
    clearHistoryBtn: document.getElementById("clearHistoryBtn"),
    rateCode: document.getElementById("rateCode"),
    rateName: document.getElementById("rateName"),
    rateValue: document.getElementById("rateValue"),
    ratesList: document.getElementById("ratesList"),
    historyList: document.getElementById("historyList"),
    statusMessage: document.getElementById("statusMessage")
};

const defaultRates = [
    new Moneda("ARS", "Peso Argentino", 1),
    new Moneda("USD", "Dólar", 1000),
    new Moneda("EUR", "Euro", 1100),
    new Moneda("BRL", "Real", 200),
    new Moneda("CLP", "Peso Chileno", 1.2)
];

function formatAmount(value) {
    return new Intl.NumberFormat("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

function saveRates() {
    localStorage.setItem(STORAGE_RATES, JSON.stringify(state.rates));
}

function loadRates() {
    const stored = localStorage.getItem(STORAGE_RATES);
    if (stored) {
        const parsed = JSON.parse(stored);
        state.rates = parsed.map(item => new Moneda(item.codigo, item.nombre, item.valor));
        return;
    }
    state.rates = [...defaultRates];
}

function saveHistory() {
    localStorage.setItem(STORAGE_HISTORY, JSON.stringify(state.history));
}

function loadHistory() {
    const stored = localStorage.getItem(STORAGE_HISTORY);
    state.history = stored ? JSON.parse(stored) : [];
}

function setStatus(message) {
    elements.statusMessage.textContent = message;
    if (message) {
        setTimeout(() => {
            elements.statusMessage.textContent = "";
        }, 2500);
    }
}

function renderSelects() {
    const options = state.rates
        .map(rate => `<option value="${rate.codigo}">${rate.codigo} - ${rate.nombre}</option>`)
        .join("");

    elements.fromSelect.innerHTML = options;
    elements.toSelect.innerHTML = options;
    elements.fromSelect.value = "ARS";
    elements.toSelect.value = "USD";
}

function renderRates() {
    elements.ratesList.innerHTML = "";

    state.rates.forEach(rate => {
        const row = document.createElement("div");
        row.className = "table__row";
        row.innerHTML = `
            <span>${rate.codigo}</span>
            <span>${rate.nombre}</span>
            <span>${formatAmount(rate.valor)}</span>
            <div class="table__actions">
                <button class="btn btn--ghost" data-code="${rate.codigo}">Eliminar</button>
            </div>
        `;

        row.querySelector("button").addEventListener("click", () => removeRate(rate.codigo));
        elements.ratesList.appendChild(row);
    });
}

function renderHistory() {
    elements.historyList.innerHTML = "";

    if (!state.history.length) {
        elements.historyList.innerHTML = "<p class=\"subtitle\">Sin conversiones registradas.</p>";
        return;
    }

    state.history.slice().reverse().forEach(item => {
        const card = document.createElement("div");
        card.className = "history__item";
        card.innerHTML = `
            <div>
                <strong>${item.from} ${formatAmount(item.amount)} → ${item.to} ${formatAmount(item.result)}</strong>
                <small>${item.date}</small>
            </div>
            <div>
                <small>Tipo: ${item.rate}</small>
            </div>
        `;
        elements.historyList.appendChild(card);
    });
}

function convert() {
    const amount = Number(elements.amountInput.value);
    const from = elements.fromSelect.value;
    const to = elements.toSelect.value;

    if (!amount || amount <= 0) {
        setStatus("Ingresá un monto válido.");
        return;
    }

    const fromRate = state.rates.find(rate => rate.codigo === from);
    const toRate = state.rates.find(rate => rate.codigo === to);

    if (!fromRate || !toRate) {
        setStatus("Seleccioná monedas válidas.");
        return;
    }

    const amountInARS = amount * fromRate.valor;
    const result = amountInARS / toRate.valor;
    elements.resultOutput.value = formatAmount(result);

    const historyItem = {
        amount,
        from,
        to,
        result,
        rate: `${fromRate.valor} ARS = 1 ${fromRate.codigo}`,
        date: new Date().toLocaleString("es-AR")
    };

    state.history.push(historyItem);
    saveHistory();
    renderHistory();
}

function swapCurrencies() {
    const from = elements.fromSelect.value;
    elements.fromSelect.value = elements.toSelect.value;
    elements.toSelect.value = from;
}

function addRate() {
    const code = elements.rateCode.value.trim().toUpperCase();
    const name = elements.rateName.value.trim();
    const value = Number(elements.rateValue.value);

    if (!code || !name || !value || value <= 0) {
        setStatus("Completá todos los campos de tipo de cambio.");
        return;
    }

    const existing = state.rates.find(rate => rate.codigo === code);
    if (existing) {
        existing.nombre = name;
        existing.valor = value;
    } else {
        state.rates.push(new Moneda(code, name, value));
    }

    saveRates();
    renderRates();
    renderSelects();
    setStatus("Tipo de cambio guardado.");

    elements.rateCode.value = "";
    elements.rateName.value = "";
    elements.rateValue.value = "";
}

function removeRate(code) {
    if (code === "ARS") {
        setStatus("ARS no se puede eliminar.");
        return;
    }
    state.rates = state.rates.filter(rate => rate.codigo !== code);
    saveRates();
    renderRates();
    renderSelects();
}

function resetRates() {
    state.rates = [...defaultRates];
    saveRates();
    renderRates();
    renderSelects();
    setStatus("Tipos de cambio restaurados.");
}

function clearHistory() {
    state.history = [];
    saveHistory();
    renderHistory();
    setStatus("Historial limpio.");
}

function init() {
    loadRates();
    loadHistory();
    renderSelects();
    renderRates();
    renderHistory();

    elements.convertBtn.addEventListener("click", convert);
    elements.swapBtn.addEventListener("click", swapCurrencies);
    elements.addRateBtn.addEventListener("click", addRate);
    elements.resetRatesBtn.addEventListener("click", resetRates);
    elements.clearHistoryBtn.addEventListener("click", clearHistory);
}

init();
