// script.js — robust show/hide approach (use with index.html that has #loginPage, #plannerPage, #thankYouPage)

const EXCHANGE_RATE = 0.012;
function formatCurrency(rs) {
  const usd = (rs * EXCHANGE_RATE).toFixed(2);
  return `Rs${rs} (≈ $${usd})`;
}

let tripData = null; // will hold calculated values

// ------- Data ----------
const cities = {
  "Paris": [
    { name: "Eiffel Tower", cost: 1200 },
    { name: "Louvre Museum", cost: 900 },
    { name: "Seine River Cruise", cost: 600 }
  ],
  "London": [
    { name: "British Museum", cost: 600 },
    { name: "London Eye", cost: 700 }
  ],
  "Seoul": [
    { name: "Gyeongbokgung Palace", cost: 800 },
    { name: "N Seoul Tower", cost: 700 },
    { name: "Myeongdong Shopping Street", cost: 500 }
  ],
  "Tokyo": [
    { name: "Tokyo Disneyland", cost: 4000 },
    { name: "Shinjuku Gyoen Garden", cost: 600 },
    { name: "Tokyo Skytree", cost: 1200 }
  ],
  "Hong Kong": [
    { name: "Victoria Peak", cost: 700 },
    { name: "Disneyland Hong Kong", cost: 3800 },
    { name: "Star Ferry Ride", cost: 300 }
  ],
  "Kerala": [
    { name: "Alleppey Houseboat", cost: 2500 },
    { name: "Munnar Tea Gardens", cost: 600 },
    { name: "Athirappilly Waterfalls", cost: 400 }
  ],
  "Mexico": [
    { name: "Chichen Itza", cost: 1500 },
    { name: "Cancun Beaches", cost: 2000 },
    { name: "Mexico City Historic Center", cost: 800 }
  ]
};

const cityImages = {
  "Paris": "images/paris.jpg",
  "London": "images/london.jpg",
  "Seoul": "images/seoul.jpg",
  "Tokyo": "images/tokyo.jpg",
  "Hong Kong": "images/hongkong.jpg",
  "Kerala": "images/kerala.jpg",
  "Mexico": "images/mexico.jpg"
};

const cuisines = [
  { name: "Local Specialties", cost: 350 },
  { name: "Street Food", cost: 200 },
  { name: "Fine Dining", cost: 1200 }
];

const hotels = [
  { name: "City Budget Inn", cost: 3000 },
  { name: "Grand Royale", cost: 12000 }
];

const travelClasses = [
  { name: "Economy", cost: 25000 },
  { name: "Business", cost: 90000 }
];

// ------- Initialization -------
window.addEventListener('DOMContentLoaded', () => {
  // populate dropdowns
  populateDropdown("citySelect", Object.keys(cities));
  populateDropdown("cuisineSelect", cuisines.map(c => c.name));
  populateDropdown("hotelSelect", hotels.map(h => h.name));
  populateDropdown("travelSelect", travelClasses.map(t => t.name));

  // initial destinations and image
  updateDestinations();

  // hook up events (use event listeners instead of inline onclick)
  document.getElementById("citySelect").addEventListener("change", updateDestinations);
  const calcBtn = document.querySelector("button[onclick='calculatePlan()']");
  if (calcBtn) calcBtn.addEventListener("click", calculatePlan);

  // login button (from existing HTML)
  const loginBtn = document.querySelector("#loginPage button");
  if (loginBtn) loginBtn.addEventListener("click", handleLogin);

  // Plan Another Trip button on thank-you page (if present at load)
  const restartBtn = document.querySelector("#thankYouPage button");
  if (restartBtn) restartBtn.addEventListener("click", restart);
});

// ------- Helpers -------
function populateDropdown(id, items) {
  const select = document.getElementById(id);
  if (!select) return;
  select.innerHTML = "";
  items.forEach((item, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = item;
    select.appendChild(opt);
  });
}

function updateDestinations() {
  const cityIndex = parseInt(document.getElementById("citySelect").value || 0);
  const city = Object.keys(cities)[cityIndex];

  const imgDiv = document.getElementById("cityImage");
  imgDiv.innerHTML = cityImages[city] ? `<img src="${cityImages[city]}" alt="${city}">` : "";

  const destDiv = document.getElementById("destinations");
  destDiv.innerHTML = "";
  if (!cities[city]) return;
  cities[city].forEach((dest, i) => {
    const label = document.createElement("label");
    label.style.display = "block";
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.value = i;
    label.appendChild(cb);
    label.appendChild(document.createTextNode(` ${dest.name} (${formatCurrency(dest.cost)})`));
    destDiv.appendChild(label);
  });
}

// ------- Calculation -------
function calculatePlan() {
  // gather inputs
  const cityIndex = parseInt(document.getElementById("citySelect").value || 0);
  const cityName = Object.keys(cities)[cityIndex];
  if (!cityName) { alert("Please select a city."); return; }

  const chosenDestIndexes = Array.from(document.querySelectorAll("#destinations input:checked"))
    .map(cb => parseInt(cb.value));

  const cuisineObj = cuisines[document.getElementById("cuisineSelect").value];
  const hotelObj = hotels[document.getElementById("hotelSelect").value];
  const travelObj = travelClasses[document.getElementById("travelSelect").value];

  const rooms = Math.max(1, parseInt(document.getElementById("rooms").value || 1));
  const travelers = Math.max(1, parseInt(document.getElementById("travelers").value || 1));
  const days = Math.max(1, parseInt(document.getElementById("days").value || 1));

  // compute costs
  let destCost = 0;
  chosenDestIndexes.forEach(idx => {
    const d = cities[cityName][idx];
    if (d) destCost += d.cost * days;
  });
  const foodCost = cuisineObj.cost * 3 * days * travelers;
  const hotelCost = hotelObj.cost * days * rooms;
  const travelCost = travelObj.cost * travelers;
  const subtotal = destCost + foodCost + hotelCost + travelCost;
  const tax = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + tax;

  // store tripData
  tripData = {
    city: cityName,
    destinations: chosenDestIndexes.map(i => cities[cityName][i]?.name).filter(Boolean),
    destCost,
    cuisine: cuisineObj.name,
    cuisineCostPerMeal: cuisineObj.cost,
    foodCost,
    hotel: hotelObj.name,
    hotelCostPerNight: hotelObj.cost,
    hotelCost,
    travelClass: travelObj.name,
    travelCost,
    rooms,
    travelers,
    days,
    subtotal,
    tax,
    grandTotal
  };

  // show the summary and then show login (keep planner visible until login)
  renderSummaryOnPlanner();
  // switch to login view so user enters details before final thank-you
  showOnly('loginPage');
}

// Render summary into #planSummary and #costBreakdown (so user sees before login)
function renderSummaryOnPlanner() {
  if (!tripData) return;
  const summary = document.getElementById("planSummary");
  const breakdown = document.getElementById("costBreakdown");
  if (summary) {
    summary.innerHTML = `
      <h3>Trip Summary (Preview)</h3>
      <p><b>City:</b> ${escapeHtml(tripData.city)}</p>
      <p><b>Destinations:</b> ${tripData.destinations.join(", ") || "None"}</p>
      <p><b>Days:</b> ${tripData.days}</p>
      <p><b>Travelers:</b> ${tripData.travelers}</p>
    `;
  }
  if (breakdown) {
    breakdown.innerHTML = `
      <h3>Cost Breakdown (Preview)</h3>
      <p>Destinations: ${formatCurrency(tripData.destCost)}</p>
      <p>Food: ${formatCurrency(tripData.foodCost)}</p>
      <p>Hotel: ${formatCurrency(tripData.hotelCost)}</p>
      <p>Travel: ${formatCurrency(tripData.travelCost)}</p>
      <p>Tax (5%): ${formatCurrency(tripData.tax)}</p>
      <h4>Total: ${formatCurrency(tripData.grandTotal)}</h4>
    `;
  }
}

// ------- Login handling -------
function handleLogin(evt) {
  // read login fields from the existing login form in index.html
  const name = (document.getElementById("username")?.value || "").trim();
  const phone = (document.getElementById("phone")?.value || "").trim();
  const email = (document.getElementById("email")?.value || "").trim();

  if (!name || !phone || !email) {
    alert("Please enter name, phone and email to continue.");
    return;
  }

  // render final thank-you content
  showThankYou(name, phone, email);
}

function showThankYou(name, phone, email) {
  // ensure tripData exists
  if (!tripData) {
    alert("Please calculate your trip before login.");
    // show planner so user can calculate
    showOnly('plannerPage');
    return;
  }

  // populate thank-you page elements (they exist in index.html)
  document.getElementById("displayName").textContent = name;
  document.getElementById("displayEmail").textContent = email;
  document.getElementById("displayPhone").textContent = phone;

  // final summary
  document.getElementById("finalSummary").innerHTML = `
    <p><b>City:</b> ${escapeHtml(tripData.city)}</p>
    <p><b>Days:</b> ${tripData.days}</p>
    <p><b>Destinations:</b> ${tripData.destinations.join(", ") || "None"}</p>
    <p><b>Travelers:</b> ${tripData.travelers}</p>
    <p><b>Rooms:</b> ${tripData.rooms}</p>
  `;

  document.getElementById("finalBreakdown").innerHTML = `
    Destination Cost: ${formatCurrency(tripData.destCost)}<br>
    Food Cost: ${formatCurrency(tripData.foodCost)}<br>
    Hotel Cost: ${formatCurrency(tripData.hotelCost)}<br>
    Travel Cost: ${formatCurrency(tripData.travelCost)}<br>
    Tax: ${formatCurrency(tripData.tax)}<br>
    <hr>
    <h4>Grand Total: ${formatCurrency(tripData.grandTotal)}</h4>
  `;

  // show thank-you page
  showOnly('thankYouPage');
}

// ------- Utility: show only one section by id -------
function showOnly(idToShow) {
  const sections = ['loginPage','plannerPage','thankYouPage'];
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = (id === idToShow) ? 'block' : 'none';
  });
}

// Restart / Plan Another Trip
function restart() {
  // clear trip data and UI, show planner
  tripData = null;
  document.getElementById("planSummary").innerHTML = "";
  document.getElementById("costBreakdown").innerHTML = "";
  // reset inputs optionally
  document.getElementById("rooms").value = 1;
  document.getElementById("travelers").value = 1;
  document.getElementById("days").value = 1;
  // go back to planner
  showOnly('plannerPage');
}

// simple escape for inserted text
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}
