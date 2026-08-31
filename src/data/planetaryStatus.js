/**
 * Planetary Threat & DEFCON Status Ribbon for Swain Orbital Command.
 *
 * Real-time top ticker streaming live situational awareness telemetry,
 * DEFCON status levels, active contacts count, and global threat alerts.
 *
 * @module data/planetaryStatus
 */

export class PlanetaryStatusRibbon {
  constructor(options = {}) {
    this.dataManager = options.dataManager || null;
    this.container = null;
    this.defconLevel = 3; // DEFCON 3 (Round House - Elevated Readiness)
    this.tickerMessages = [
      'GLOBAL THREAT ADVISORY · DEFCON 3 (ELEVATED READINESS)',
      'ORBITAL TRACKING · 24,000+ SPACE OBJECTS IN LOW EARTH ORBIT',
      'AIRSPACE MONITOR · 6,500+ COMMERCIAL & MILITARY FLIGHTS STREAMING',
      'SEISMIC & ENVIRONMENTAL ARRAYS · 180+ USGS SENSORS SYNCHRONIZED',
      'SURVEILLANCE GRID · 500+ MUNICIPAL & HIGHWAY CCTV STREAMS ACTIVE',
      'TACTICAL RADAR · DOPPLER PRECIPITATION & VOLCANIC HOTSPOTS MAPPED',
    ];
    this.currentTickerIndex = 0;
    this.intervalId = null;
    this._initDom();
  }

  _initDom() {
    if (typeof document === 'undefined') return;

    this.container = document.createElement('div');
    this.container.id = 'planetary-status-ribbon';
    this.container.className = 'planetary-status-ribbon';
    this.container.innerHTML = `
      <div class="status-ribbon-left">
        <div class="defcon-badge defcon-3" id="defcon-badge">
          <span class="defcon-tag">DEFCON</span>
          <span class="defcon-num">3</span>
        </div>
        <div class="status-mode-tag">ORBITAL COMMAND ACTIVE</div>
      </div>
      <div class="status-ticker-center">
        <span class="ticker-pulse">●</span>
        <span class="ticker-text" id="status-ticker-text">${this.tickerMessages[0]}</span>
      </div>
      <div class="status-ribbon-right">
        <button class="tactical-hud-btn" id="btn-war-theaters" title="Toggle Global Conflict Theaters">⚔️ THEATERS</button>
        <button class="tactical-hud-btn" id="btn-disasters" title="Toggle Natural Disasters & Calamities">🌋 DISASTERS</button>
        <button class="tactical-hud-btn" id="btn-cctv-matrix" title="Open Global CCTV Live Wall">📹 CCTV MATRIX</button>
      </div>
    `;
    document.body.appendChild(this.container);

    this._startTicker();

    this.container.querySelector('#btn-war-theaters')?.addEventListener('click', () => {
      window.__gevWarFeed?.toggle();
    });

    this.container.querySelector('#btn-disasters')?.addEventListener('click', () => {
      window.__gevCalamities?.toggle();
    });

    this.container.querySelector('#btn-cctv-matrix')?.addEventListener('click', () => {
      window.__gevCctvMatrix?.toggle();
    });
  }

  _startTicker() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      this.currentTickerIndex = (this.currentTickerIndex + 1) % this.tickerMessages.length;
      const textEl = this.container?.querySelector('#status-ticker-text');
      if (textEl) {
        textEl.textContent = this.tickerMessages[this.currentTickerIndex];
      }
    }, 4500);
  }
}
