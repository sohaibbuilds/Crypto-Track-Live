/**
 * CryptoTrack Live — script.js
 * Web Programming Languages Lab — Iqra University
 * Features: Live API, Portfolio, Alerts, Dark/Light Mode,
 *           Form Validation, Mobile Nav, Charts, Filtering
 */

// =============================================
//  GLOBAL STATE
// =============================================
let allCoins = [];
let portfolio = JSON.parse(localStorage.getItem('ctl_portfolio') || '[]');
let alerts   = JSON.parse(localStorage.getItem('ctl_alerts')    || '[]');
let currentFilter = 'all';

const API_BASE = 'https://api.coingecko.com/api/v3';

// =============================================
//  INIT
// =============================================
document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  initNav();
  await fetchMarketData();
  renderPortfolio();
  renderAlerts();
  populateSelects();
  initForms();
  setInterval(fetchMarketData, 60000); // refresh every 60s
});

// =============================================
//  PROJECTS — Dynamic Content Loading
// =============================================
const projectsData = [
  {
    emoji: '💰',
    title: 'CryptoTrack Live',
    desc: 'Real-time crypto dashboard with live prices, portfolio tracker, price alerts, and sparkline charts using CoinGecko API.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Fetch API'],
    category: 'api',
    demo: '#', code: '#'
  },
  {
    emoji: '🌦️',
    title: 'Weather Dashboard',
    desc: 'A responsive weather app fetching live data. Shows temperature, humidity, wind speed, and a 5-day forecast.',
    tags: ['JavaScript', 'OpenWeather API', 'CSS Grid'],
    category: 'api',
    demo: '#', code: '#'
  },
  {
    emoji: '📝',
    title: 'Task Manager App',
    desc: 'A fully functional to-do list with drag-and-drop, priority levels, due dates, and localStorage persistence.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    category: 'javascript',
    demo: '#', code: '#'
  },
  {
    emoji: '🎨',
    title: 'CSS Art Gallery',
    desc: 'A collection of pure CSS animations and artwork — no images, no JS. Hover effects, keyframes, and transitions.',
    tags: ['HTML', 'CSS', 'Animations'],
    category: 'html-css',
    demo: '#', code: '#'
  },
  {
    emoji: '🛒',
    title: 'E-Commerce Landing Page',
    desc: 'Responsive product landing page with cart functionality, product filtering, and smooth scroll animations.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    category: 'javascript',
    demo: '#', code: '#'
  },
  {
    emoji: '📊',
    title: 'Data Visualizer',
    desc: 'Interactive charts built with Canvas API. Bar, line, and pie charts rendered from JSON data with tooltips.',
    tags: ['JavaScript', 'Canvas API', 'CSS'],
    category: 'javascript',
    demo: '#', code: '#'
  },
  {
    emoji: '🌐',
    title: 'Portfolio Website',
    desc: 'A clean, responsive personal portfolio with smooth transitions, dark mode, and contact form validation.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    category: 'html-css',
    demo: '#', code: '#'
  },
  {
    emoji: '🎬',
    title: 'Movie Search App',
    desc: 'Search and browse movies using OMDB API. Displays posters, ratings, plot summaries with dynamic loading.',
    tags: ['JavaScript', 'OMDB API', 'Fetch API'],
    category: 'api',
    demo: '#', code: '#'
  },
];

let currentProjectFilter = 'all';

function loadProjects(filter = 'all') {
  const gallery = document.getElementById('projectsGallery');
  const filtered = filter === 'all'
    ? projectsData
    : projectsData.filter(p => p.category === filter);

  // Simulate dynamic loading with a small delay
  gallery.innerHTML = '<div class="spinner" style="margin:3rem auto;display:block;width:32px;height:32px;border-width:3px;"></div>';

  setTimeout(() => {
    if (!filtered.length) {
      gallery.innerHTML = '<div class="empty-state">No projects in this category.</div>';
      return;
    }
    gallery.innerHTML = filtered.map((p, i) => `
      <div class="project-card" style="animation-delay:${i * 0.08}s">
        <div class="project-thumb">${p.emoji}</div>
        <div class="project-body">
          <div class="project-title">${p.title}</div>
          <div class="project-desc">${p.desc}</div>
          <div class="project-tags">
            ${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
          </div>
          <div class="project-links">
            <a href="${p.demo}" class="proj-btn primary">🚀 Live Demo</a>
            <a href="${p.code}" class="proj-btn">💻 Source Code</a>
          </div>
        </div>
      </div>
    `).join('');
  }, 500);
}

function filterProjects(cat, btn) {
  currentProjectFilter = cat;
  document.querySelectorAll('.projects-controls .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  loadProjects(cat);
}

// =============================================
//  NAMED GLOBAL FUNCTIONS — matching solution PDF
// =============================================

// toggleMenu() — hamburger nav toggle (solution PDF requirement)
function toggleMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
}

// toggleTheme() — dark/light mode toggle (solution PDF requirement)
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('ctl_theme', next);
  showToast(next === 'light' ? '☀️ Light mode activated!' : '🌙 Dark mode activated!');
}

// showProject() — dynamic project display (solution PDF requirement)
function showProject() {
  const display = document.getElementById('projectInfo');
  if (!display) return;
  display.style.display = 'block';
  display.innerHTML = `
    <strong>Featured Project: CryptoTrack Live</strong><br/>
    A real-time cryptocurrency dashboard built with HTML, CSS & JavaScript.
    Uses CoinGecko API for live prices, Canvas for charts, and localStorage for persistence.
  `;
}

// validateForm() — form validation with alert (solution PDF requirement)
function validateForm() {
  const name  = document.getElementById('contactName')?.value.trim();
  const email = document.getElementById('contactEmail')?.value.trim();
  if (!name || !email) {
    alert('All fields are required!');
    return false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert('Please enter a valid email address!');
    return false;
  }
  alert('Form Submitted Successfully!');
  return true;
}

// =============================================
//  WELCOME MESSAGE — alert() on page load
// =============================================
window.onload = function() {
  alert("Welcome to CryptoTrack Live! Your Real-Time Crypto Dashboard 🚀");
};

// =============================================
//  THEME TOGGLE (Dark / Light)
// =============================================
function initTheme() {
  const saved = localStorage.getItem('ctl_theme') || 'dark';
  applyTheme(saved);

  document.getElementById('themeToggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('ctl_theme', next);
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.getElementById('themeToggle').textContent = theme === 'dark' ? '🌙' : '☀️';
}

// =============================================
//  MOBILE NAV TOGGLE
// =============================================
function initNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

// =============================================
//  SECTION NAVIGATION
// =============================================
function showSection(id, linkEl) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

  const section = document.getElementById(id);
  if (section) section.classList.add('active');
  if (linkEl) linkEl.classList.add('active');

  // Dynamically load projects when Projects section is opened
  if (id === 'projects') loadProjects(currentProjectFilter);
}

// =============================================
//  FETCH MARKET DATA (CoinGecko)
// =============================================
async function fetchMarketData() {
  try {
    const res = await fetch(
      `${API_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=24h`
    );

    if (!res.ok) throw new Error('API limit');
    const data = await res.json();
    allCoins = data;

    renderTable(data);
    renderTicker(data);
    updateHeroCard(data);
    fetchGlobalStats();
    updatePortfolioValues();
    checkAlerts();
    populateSelects();

  } catch (err) {
    console.warn('CoinGecko API error:', err.message);
    // Use fallback demo data if API fails
    loadFallbackData();
  }
}

// =============================================
//  FALLBACK DEMO DATA (when API is unavailable)
// =============================================
function loadFallbackData() {
  const demo = [
    { id:'bitcoin',   name:'Bitcoin',  symbol:'BTC', image:'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',   current_price:67420,  price_change_percentage_24h:2.45,  market_cap:1320000000000, sparkline_in_7d:{price:[60000,61000,63000,62000,65000,66000,67420]} },
    { id:'ethereum',  name:'Ethereum', symbol:'ETH', image:'https://assets.coingecko.com/coins/images/279/small/ethereum.png', current_price:3540,   price_change_percentage_24h:-1.12, market_cap:426000000000,  sparkline_in_7d:{price:[3200,3300,3400,3350,3500,3520,3540]} },
    { id:'binancecoin',name:'BNB',     symbol:'BNB', image:'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png', current_price:580, price_change_percentage_24h:0.87,  market_cap:88000000000,   sparkline_in_7d:{price:[550,560,570,565,575,578,580]} },
    { id:'solana',    name:'Solana',   symbol:'SOL', image:'https://assets.coingecko.com/coins/images/4128/small/solana.png',  current_price:172,    price_change_percentage_24h:5.32,  market_cap:79000000000,   sparkline_in_7d:{price:[140,150,155,160,165,170,172]} },
    { id:'ripple',    name:'XRP',      symbol:'XRP', image:'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png', current_price:0.62, price_change_percentage_24h:-0.55, market_cap:34000000000, sparkline_in_7d:{price:[0.58,0.60,0.61,0.59,0.62,0.61,0.62]} },
    { id:'cardano',   name:'Cardano',  symbol:'ADA', image:'https://assets.coingecko.com/coins/images/975/small/cardano.png', current_price:0.48,   price_change_percentage_24h:1.20,  market_cap:17000000000,   sparkline_in_7d:{price:[0.42,0.44,0.45,0.46,0.47,0.48,0.48]} },
    { id:'dogecoin',  name:'Dogecoin', symbol:'DOGE',image:'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',  current_price:0.155,  price_change_percentage_24h:3.10,  market_cap:22000000000,   sparkline_in_7d:{price:[0.13,0.14,0.145,0.15,0.152,0.154,0.155]} },
    { id:'polkadot',  name:'Polkadot', symbol:'DOT', image:'https://assets.coingecko.com/coins/images/12171/small/polkadot.png',current_price:7.20, price_change_percentage_24h:-2.30, market_cap:9500000000,    sparkline_in_7d:{price:[7.8,7.5,7.3,7.1,7.0,7.15,7.20]} },
  ];
  allCoins = demo;
  renderTable(demo);
  renderTicker(demo);
  updateHeroCard(demo);
  updatePortfolioValues();
  checkAlerts();
  populateSelects();
}

// =============================================
//  GLOBAL STATS
// =============================================
async function fetchGlobalStats() {
  try {
    const res  = await fetch(`${API_BASE}/global`);
    const json = await res.json();
    const d    = json.data;
    document.getElementById('statMcap').textContent = '$' + formatLarge(d.total_market_cap.usd);
    document.getElementById('statVol').textContent  = '$' + formatLarge(d.total_volume.usd);
    document.getElementById('statDom').textContent  = d.market_cap_percentage.btc.toFixed(1) + '%';
  } catch (_) {}
}

// =============================================
//  TICKER BAR
// =============================================
function renderTicker(coins) {
  const track = document.getElementById('tickerTrack');
  const items = coins.slice(0, 15).map(c => {
    const up  = c.price_change_percentage_24h >= 0;
    const cls = up ? 'ticker-up' : 'ticker-down';
    const sign = up ? '+' : '';
    return `<span class="ticker-item">
      <span class="ticker-name">${c.symbol.toUpperCase()}</span>
      <span class="ticker-price">$${formatPrice(c.current_price)}</span>
      <span class="${cls}">${sign}${c.price_change_percentage_24h?.toFixed(2)}%</span>
    </span>`;
  }).join('<span style="color:var(--border)">|</span>');
  // Duplicate for seamless loop
  track.innerHTML = items + items;
  track.style.animation = 'none';
  track.offsetHeight; // reflow
  track.style.animation = 'tickerScroll 60s linear infinite';
}

// =============================================
//  HERO CARD
// =============================================
function updateHeroCard(coins) {
  const btc = coins.find(c => c.id === 'bitcoin') || coins[0];
  if (!btc) return;

  document.getElementById('heroBtcPrice').textContent = '$' + formatPrice(btc.current_price);

  const change = btc.price_change_percentage_24h;
  const el = document.getElementById('heroBtcChange');
  el.textContent = (change >= 0 ? '▲ +' : '▼ ') + change?.toFixed(2) + '% (24h)';
  el.style.color = change >= 0 ? 'var(--green)' : 'var(--red)';

  // Mini hero chart
  if (btc.sparkline_in_7d?.price) {
    drawMiniChart('heroChart', btc.sparkline_in_7d.price, change >= 0 ? '#00d97e' : '#f4436c', 260, 80);
  }
}

// =============================================
//  MARKET TABLE
// =============================================
function renderTable(coins) {
  const tbody = document.getElementById('cryptoTableBody');
  if (!coins.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="loading-row">No coins found.</td></tr>';
    return;
  }

  tbody.innerHTML = coins.map((c, i) => {
    const up   = c.price_change_percentage_24h >= 0;
    const sign = up ? '+' : '';
    const sparkData = c.sparkline_in_7d?.price || [];

    return `<tr style="animation-delay:${i * 0.04}s">
      <td style="color:var(--text2);font-family:var(--font-mono);font-size:0.8rem">${i + 1}</td>
      <td>
        <div class="coin-cell">
          <img class="coin-img" src="${c.image}" alt="${c.name}" onerror="this.style.display='none'"/>
          <div>
            <div class="coin-name">${c.name}</div>
            <div class="coin-symbol">${c.symbol.toUpperCase()}</div>
          </div>
        </div>
      </td>
      <td class="price-cell">$${formatPrice(c.current_price)}</td>
      <td><span class="change-cell ${up ? 'change-up' : 'change-down'}">${sign}${c.price_change_percentage_24h?.toFixed(2)}%</span></td>
      <td class="mcap-cell">$${formatLarge(c.market_cap)}</td>
      <td>
        <canvas class="mini-chart" id="chart-${c.id}" width="100" height="36"></canvas>
      </td>
      <td>
        <button class="add-btn" onclick="quickAddToPortfolio('${c.id}','${c.name}','${c.symbol.toUpperCase()}','${c.image}',${c.current_price})">+ Add</button>
      </td>
    </tr>`;
  }).join('');

  // Draw mini sparklines
  coins.forEach(c => {
    const canvas = document.getElementById(`chart-${c.id}`);
    if (canvas && c.sparkline_in_7d?.price?.length) {
      const up = c.price_change_percentage_24h >= 0;
      drawMiniChart(`chart-${c.id}`, c.sparkline_in_7d.price, up ? '#00d97e' : '#f4436c', 100, 36);
    }
  });
}

// =============================================
//  MINI SPARKLINE CHART (Canvas)
// =============================================
function drawMiniChart(canvasId, prices, color, w, h) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const pts = prices.slice(-30); // last 30 points

  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const range = max - min || 1;

  ctx.clearRect(0, 0, w, h);

  // Gradient fill
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, color + '55');
  grad.addColorStop(1, color + '00');

  ctx.beginPath();
  pts.forEach((p, i) => {
    const x = (i / (pts.length - 1)) * w;
    const y = h - ((p - min) / range) * h * 0.85 - h * 0.05;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });

  // Fill area
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  pts.forEach((p, i) => {
    const x = (i / (pts.length - 1)) * w;
    const y = h - ((p - min) / range) * h * 0.85 - h * 0.05;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.stroke();
}

// =============================================
//  FILTER COINS
// =============================================
function filterCoins() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  let filtered = allCoins.filter(c =>
    c.name.toLowerCase().includes(query) || c.symbol.toLowerCase().includes(query)
  );
  filtered = applyCategory(filtered);
  renderTable(filtered);
}

function filterByCategory(cat, btn) {
  currentFilter = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  filterCoins();
}

function applyCategory(coins) {
  if (currentFilter === 'gainers') return coins.filter(c => c.price_change_percentage_24h >= 0);
  if (currentFilter === 'losers')  return coins.filter(c => c.price_change_percentage_24h < 0);
  return coins;
}

// =============================================
//  PORTFOLIO
// =============================================
function initForms() {
  // Portfolio form
  document.getElementById('portfolioForm').addEventListener('submit', e => {
    e.preventDefault();
    const coinId = document.getElementById('coinSelect').value;
    const qty    = parseFloat(document.getElementById('coinQty').value);
    const price  = parseFloat(document.getElementById('buyPrice').value);

    let valid = true;
    clearErrors(['coinError', 'qtyError', 'priceError']);

    if (!coinId) { showError('coinError', 'Please select a coin'); valid = false; }
    if (!qty || qty <= 0) { showError('qtyError', 'Enter a valid quantity > 0'); valid = false; }
    if (!price || price <= 0) { showError('priceError', 'Enter a valid price > 0'); valid = false; }
    if (!valid) return;

    const coin = allCoins.find(c => c.id === coinId);
    if (!coin) return;

    portfolio.push({
      id: coinId,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      image: coin.image,
      qty,
      buyPrice: price
    });

    savePortfolio();
    renderPortfolio();
    e.target.reset();
    showToast(`✅ Added ${qty} ${coin.symbol.toUpperCase()} to portfolio!`);
  });

  // Alert form
  document.getElementById('alertForm').addEventListener('submit', e => {
    e.preventDefault();
    const coinId    = document.getElementById('alertCoin').value;
    const condition = document.getElementById('alertCondition').value;
    const price     = parseFloat(document.getElementById('alertPrice').value);

    let valid = true;
    clearErrors(['alertCoinError', 'alertPriceError']);

    if (!coinId) { showError('alertCoinError', 'Please select a coin'); valid = false; }
    if (!price || price <= 0) { showError('alertPriceError', 'Enter a valid price > 0'); valid = false; }
    if (!valid) return;

    const coin = allCoins.find(c => c.id === coinId);
    alerts.push({
      id: Date.now(),
      coinId,
      name: coin?.name || coinId,
      symbol: coin?.symbol?.toUpperCase() || coinId,
      condition,
      targetPrice: price,
      triggered: false
    });

    saveAlerts();
    renderAlerts();
    e.target.reset();
    showToast(`🔔 Alert set for ${coin?.name}!`);
  });

  // Contact form — validateForm() style matching solution PDF
  document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const name    = document.getElementById('contactName').value.trim();
    const email   = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const msg     = document.getElementById('contactMsg').value.trim();

    // Required fields check
    if (name === '' || email === '' || subject === '' || msg === '') {
      alert('All fields are required! Please fill in every field.');
      return false;
    }

    // Email format validation
    if (!validateEmail(email)) {
      alert('Please enter a valid email address! (e.g. name@email.com)');
      return false;
    }

    // Name length check
    if (name.length < 2) {
      alert('Name must be at least 2 characters long!');
      return false;
    }

    // Message length check
    if (msg.length < 10) {
      alert('Message must be at least 10 characters long!');
      return false;
    }

    alert('Form Submitted Successfully! We will get back to you soon.');
    const successEl = document.getElementById('contactSuccess');
    successEl.style.display = 'block';
    e.target.reset();
    showToast('📧 Message sent successfully!');
    setTimeout(() => { successEl.style.display = 'none'; }, 5000);
  });
}

function quickAddToPortfolio(id, name, symbol, image, price) {
  portfolio.push({ id, name, symbol, image, qty: 1, buyPrice: price });
  savePortfolio();
  renderPortfolio();
  showToast(`✅ 1 ${symbol} added to portfolio at $${formatPrice(price)}`);
}

function renderPortfolio() {
  const list = document.getElementById('portfolioList');

  if (!portfolio.length) {
    list.innerHTML = '<div class="empty-state">No holdings yet. Add your first coin! 🪙</div>';
    document.getElementById('totalValue').textContent    = '$0.00';
    document.getElementById('totalInvested').textContent = '$0.00';
    document.getElementById('totalPnl').textContent      = '$0.00';
    return;
  }

  let totalVal = 0, totalInv = 0;

  list.innerHTML = portfolio.map((h, i) => {
    const coin     = allCoins.find(c => c.id === h.id);
    const curPrice = coin ? coin.current_price : h.buyPrice;
    const curVal   = curPrice * h.qty;
    const invested = h.buyPrice * h.qty;
    const pnl      = curVal - invested;
    const pnlPct   = ((pnl / invested) * 100).toFixed(2);

    totalVal += curVal;
    totalInv += invested;

    const pnlColor = pnl >= 0 ? 'var(--green)' : 'var(--red)';
    const pnlSign  = pnl >= 0 ? '+' : '';

    return `<div class="portfolio-item">
      <div class="pi-left">
        <img class="pi-img" src="${h.image}" alt="${h.symbol}" onerror="this.style.display='none'"/>
        <div>
          <div class="pi-name">${h.name}</div>
          <div class="pi-qty">${h.qty} ${h.symbol} @ $${formatPrice(h.buyPrice)}</div>
        </div>
      </div>
      <div style="text-align:right">
        <div class="pi-val">$${formatPrice(curVal)}</div>
        <div class="pi-pnl" style="color:${pnlColor}">${pnlSign}$${Math.abs(pnl).toFixed(2)} (${pnlSign}${pnlPct}%)</div>
      </div>
      <button class="pi-remove" onclick="removePortfolioItem(${i})" title="Remove">✕</button>
    </div>`;
  }).join('');

  const totalPnl = totalVal - totalInv;
  const pnlColor = totalPnl >= 0 ? 'var(--green)' : 'var(--red)';

  document.getElementById('totalValue').textContent    = '$' + formatPrice(totalVal);
  document.getElementById('totalInvested').textContent = '$' + formatPrice(totalInv);
  const pnlEl = document.getElementById('totalPnl');
  pnlEl.textContent  = (totalPnl >= 0 ? '+' : '') + '$' + formatPrice(Math.abs(totalPnl));
  pnlEl.style.color  = pnlColor;
}

function updatePortfolioValues() {
  if (portfolio.length) renderPortfolio();
}

function removePortfolioItem(index) {
  const removed = portfolio.splice(index, 1)[0];
  savePortfolio();
  renderPortfolio();
  showToast(`🗑️ Removed ${removed.symbol} from portfolio`);
}

function savePortfolio() { localStorage.setItem('ctl_portfolio', JSON.stringify(portfolio)); }

// =============================================
//  PRICE ALERTS
// =============================================
function renderAlerts() {
  const list = document.getElementById('alertsList');
  if (!alerts.length) {
    list.innerHTML = '<div class="empty-state">No alerts set. Create one! 🔔</div>';
    return;
  }

  list.innerHTML = alerts.map(a => {
    const cond = a.condition === 'above' ? '↑ Goes above' : '↓ Goes below';
    const status = a.triggered ? '✅ Triggered' : '⏳ Watching';
    return `<div class="alert-item ${a.triggered ? 'triggered' : ''}">
      <div class="ai-left">
        <span class="ai-coin">${a.name} (${a.symbol})</span>
        <span class="ai-condition">${cond}</span>
        <span class="ai-price">$${formatPrice(a.targetPrice)}</span>
      </div>
      <span class="ai-status">${status}</span>
      <button class="ai-remove" onclick="removeAlert(${a.id})" title="Remove">✕</button>
    </div>`;
  }).join('');
}

function checkAlerts() {
  let triggered = false;
  alerts.forEach(a => {
    if (a.triggered) return;
    const coin = allCoins.find(c => c.id === a.coinId);
    if (!coin) return;

    const price = coin.current_price;
    if ((a.condition === 'above' && price >= a.targetPrice) ||
        (a.condition === 'below' && price <= a.targetPrice)) {
      a.triggered = true;
      triggered   = true;
      showToast(`🚨 ALERT: ${a.name} is now $${formatPrice(price)}! (Target: $${formatPrice(a.targetPrice)})`);
    }
  });

  if (triggered) {
    saveAlerts();
    renderAlerts();
  }
}

function removeAlert(id) {
  alerts = alerts.filter(a => a.id !== id);
  saveAlerts();
  renderAlerts();
  showToast('🗑️ Alert removed');
}

function saveAlerts() { localStorage.setItem('ctl_alerts', JSON.stringify(alerts)); }

// =============================================
//  POPULATE SELECTS
// =============================================
function populateSelects() {
  const options = allCoins.map(c =>
    `<option value="${c.id}">${c.name} (${c.symbol.toUpperCase()})</option>`
  ).join('');

  ['coinSelect', 'alertCoin'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      const prev = el.value;
      el.innerHTML = `<option value="">-- Choose a coin --</option>` + options;
      el.value = prev;
    }
  });
}

// =============================================
//  FORM VALIDATION HELPERS
// =============================================
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = msg;
    el.previousElementSibling?.classList?.add('error');
  }
}

function clearErrors(ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = '';
      el.previousElementSibling?.classList?.remove('error');
    }
  });
}

// =============================================
//  TOAST NOTIFICATION
// =============================================
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// =============================================
//  FORMATTING HELPERS
// =============================================
function formatPrice(n) {
  if (!n && n !== 0) return '—';
  if (n >= 1000) return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (n >= 1)    return n.toFixed(4);
  return n.toFixed(6);
}

function formatLarge(n) {
  if (!n) return '—';
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9)  return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6)  return (n / 1e6).toFixed(2) + 'M';
  return n.toLocaleString();
}
