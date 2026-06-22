/* app.js — all JavaScript logic for the portfolio (no JS inside the HTML files) */

// new: wait until the HTML is parsed before touching the DOM
document.addEventListener('DOMContentLoaded', () => {
  init();
});

// new: async function so we can use await with fetch
async function init() {
  // new: using fetch to load a JSON file, then .json() to parse it
  try {
    const response = await fetch('data.json');
    if (!response.ok) throw new Error('Could not load data.json (status ' + response.status + ')');
    const data = await response.json();
    buildPage(data);
  } catch (err) {
    // new: if the fetch fails (e.g. opened without a local server) show a clear message
    console.error(err);
    showLoadError();
  }

  // these run regardless of the data load
  setupNavToggle();
  setupScrollReveal();
  startParticles(); // only does something if the hero canvas exists
}

// Builds whichever parts of the page exist, so one file serves both pages.
function buildPage(data) {
  // new: read a data attribute set in the <body> tag to know the current page
  const page = document.body.dataset.page;

  if (page === 'home') {
    setText('heroName', data.name);
    setText('heroTitle', data.title);
    setText('heroTagline', data.tagline);
    setText('aboutText', data.about);
  }

  if (page === 'cv') {
    buildSkills(data.skills);
    buildCards('educationList', data.education);
    buildCards('experienceList', data.experience);
    buildInterests(data.interests);
    setupSkillsHighlight(); // listener added only when the button is on the page
  }

  // contact footer appears on both pages
  buildContact(data.contact);
}

// Small helper: set text only if the element is on this page.
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function buildSkills(skills) {
  const list = document.getElementById('skillsList');
  if (!list || !skills) return;
  // new: build list items from data instead of writing them in the HTML
  skills.forEach(skill => {
    const li = document.createElement('li');
    li.textContent = skill;
    list.appendChild(li);
  });
}

function buildCards(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container || !items) return;
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'project';
    // new: template literal builds the card markup from the data object
    card.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.place}</p>
      <p>${item.dates}</p>`;
    container.appendChild(card);
  });
}

function buildInterests(interests) {
  const container = document.getElementById('interestsList');
  if (!container || !interests) return;
  interests.forEach(line => {
    const p = document.createElement('p');
    p.textContent = line;
    container.appendChild(p);
  });
}

function buildContact(contact) {
  if (!contact) return;
  setText('contactLine', `Phone: ${contact.phone} | Email: ${contact.email}`);
  setText('contactAddress', `Address: ${contact.address}`);
}

function showLoadError() {
  const about = document.getElementById('aboutText');
  if (about) about.textContent = 'Content could not be loaded. Run the site from a local server (see README).';
}

// --- Mobile navigation toggle (moved out of the HTML into a real listener) ---
function setupNavToggle() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('myTopnav');
  if (!toggle || !nav) return;
  // new: addEventListener replaces the old inline onclick="myFunction(...)"
  toggle.addEventListener('click', () => {
    nav.classList.toggle('responsive');
  });
}

// --- Skills highlight button (was inline onclick in Assessment A) ---
function setupSkillsHighlight() {
  const btn = document.getElementById('highlightBtn');
  const skills = document.querySelector('.skills');
  if (!btn || !skills) return;
  btn.addEventListener('click', () => {
    skills.classList.toggle('highlight');
  });
}

// --- Scroll-triggered reveal of sections ---
function setupScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  // new: IntersectionObserver fires a callback when an element scrolls into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // reveal once, then stop watching
      }
    });
  }, { threshold: 0.15 });

  items.forEach(item => observer.observe(item));
}

// --- Neural-network particle field behind the hero text ---
// new: the entire canvas animation is new — drawing and animating with requestAnimationFrame
function startParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return; // only the homepage has the hero canvas

  const ctx = canvas.getContext('2d');
  let width, height;
  const particles = [];
  const COUNT = 60;        // number of nodes
  const LINK_DIST = 130;   // draw a line when two nodes are closer than this

  // new: size the canvas to match its box (and redo it if the window resizes)
  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }

  // new: each particle is a point with a position and a small velocity
  function makeParticles() {
    particles.length = 0;
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // move and draw each node
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      // bounce off the edges
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#3b82f6'; // accent blue from the palette
      ctx.fill();
    });

    // new: draw connecting lines between nodes that are close (the "network" look)
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          // fade the line out as the nodes get further apart
          ctx.strokeStyle = `rgba(59, 130, 246, ${1 - dist / LINK_DIST})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // new: requestAnimationFrame asks the browser to run draw() again next frame (~60fps)
    requestAnimationFrame(draw);
  }

  // respect users who prefer reduced motion: draw one static frame, no loop
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  resize();
  makeParticles();
  window.addEventListener('resize', () => { resize(); makeParticles(); });

  if (reduceMotion) {
    // draw a single frame without animating
    particles.forEach(p => { p.vx = 0; p.vy = 0; });
  }
  draw();
}
