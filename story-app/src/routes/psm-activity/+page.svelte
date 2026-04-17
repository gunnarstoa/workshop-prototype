<script lang="ts">
  type Cat = 'low-admin' | 'low-ops' | 'mid' | 'high' | 'high-exec';
  type Activity = {
    id: string;
    lbl: string;
    cat: Cat;
    dx: number; // default x%
    dy: number; // default y% FROM BOTTOM
    name: string;
    bullets: string[];
  };

  const ACTS: Activity[] = [
    { id: 'admin-ops', lbl: 'Admin\n& Ops', cat: 'low-admin', dx: 8, dy: 32,
      name: 'Admin & Ops',
      bullets: ['Password resets', 'Demo provisioning', 'Seismic & LMS uploads', 'LMS administration', 'Portal access requests', 'License management', 'Status reports', 'Bulk Partner Boost invitations'] },
    { id: 'health-status', lbl: 'Health\n& Status', cat: 'low-admin', dx: 8, dy: 49,
      name: 'Health & Status',
      bullets: ['Implementation health updates', 'Certification status updates'] },
    { id: 'scheduling', lbl: 'Scheduling', cat: 'low-admin', dx: 26, dy: 32,
      name: 'Scheduling',
      bullets: ['Workshop scheduling', 'Enablement calendar management'] },
    { id: 'content-admin', lbl: 'Content\nAdmin', cat: 'low-admin', dx: 26, dy: 49,
      name: 'Content Admin',
      bullets: ['Blueprint updates', 'SA submission reviews'] },
    { id: 'training-delivery', lbl: 'Training\nDelivery', cat: 'low-admin', dx: 16, dy: 17,
      name: 'Training Delivery',
      bullets: ['Deliver product training sessions'] },
    { id: 'compliance', lbl: 'Compliance', cat: 'low-ops', dx: 4, dy: 82,
      name: 'Compliance Tracking',
      bullets: ['Certification tracking', 'Model utilization'] },
    { id: 'reactive-support', lbl: 'Reactive\nSupport', cat: 'low-ops', dx: 24, dy: 82,
      name: 'Reactive Support',
      bullets: ['One-off custom demos', 'Low-tier ad-hoc requests'] },
    { id: 'content-enablement', lbl: 'Content\nEnablement', cat: 'mid', dx: 53, dy: 32,
      name: 'Content Enablement',
      bullets: ['Curate & share resources', 'Partner portal updates'] },
    { id: 'proactive-comms', lbl: 'Proactive\nComms', cat: 'mid', dx: 73, dy: 32,
      name: 'Proactive Comms',
      bullets: ['Release notes & partner updates', 'Training reminders'] },
    { id: 'exec-engagement', lbl: 'Executive\nEngage', cat: 'high-exec', dx: 55, dy: 97,
      name: 'Executive Engagement',
      bullets: ['Client project oversight', 'Co-selling & exec alignment'] },
    { id: 'delivery-readiness', lbl: 'Delivery\nReadiness', cat: 'high', dx: 73, dy: 97,
      name: 'Delivery Readiness',
      bullets: ['Pre-project team enablement', 'Solutioning reviews'] },
    { id: 'partner-journey', lbl: 'Partner\nJourney', cat: 'high-exec', dx: 55, dy: 73,
      name: 'Partner Journey',
      bullets: ['Tier progression & QBRs', 'Individual coaching'] },
    { id: 'early-release', lbl: 'Early\nRelease', cat: 'high', dx: 73, dy: 73,
      name: 'Early Release Programs',
      bullets: ['Beta access coordination', 'Partner feedback loops to product', 'Roadmap influence & advocacy'] },
    { id: 'partner-apps', lbl: 'Partner\nApps', cat: 'high-exec', dx: 55, dy: 50,
      name: 'Partner Applications',
      bullets: ['Strategic partner evaluation', 'Onboarding white-glove partners'] },
    { id: 'delivery-quality', lbl: 'Delivery\nQuality', cat: 'high', dx: 73, dy: 50,
      name: 'Delivery Prep & Quality',
      bullets: ['Pre-project team enablement', 'Solutioning & delivery reviews', 'Live project quality oversight'] }
  ];

  const STORAGE_KEY = 'psm_activity_map_v1';

  type Position = { x: number; y: number };
  let positions = $state<Record<string, Position>>({});

  let chartEl: HTMLDivElement | undefined = $state();
  let tipVisible = $state(false);
  let tipActivity = $state<Activity | null>(null);
  let tipX = $state(0);
  let tipY = $state(0);
  let tipEl: HTMLDivElement | undefined = $state();
  let draggingId = $state<string | null>(null);

  function loadPositions() {
    if (typeof localStorage === 'undefined') return {};
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Record<string, Position>;
    } catch {
      return {};
    }
  }
  function savePositions() {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
    } catch {}
  }

  $effect(() => {
    positions = loadPositions();
  });

  function dotStyle(act: Activity): string {
    const p = positions[act.id];
    const left = p ? p.x : act.dx;
    const top = p ? p.y : 100 - act.dy;
    return `left:${left}%;top:${top}%;`;
  }

  function startDrag(e: PointerEvent, actId: string) {
    if (!chartEl) return;
    hideTip();
    draggingId = actId;
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
    const rect = chartEl.getBoundingClientRect();

    function move(ev: PointerEvent) {
      const x = Math.max(2, Math.min(98, ((ev.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(2, Math.min(98, ((ev.clientY - rect.top) / rect.height) * 100));
      positions = { ...positions, [actId]: { x, y } };
    }
    function up(ev: PointerEvent) {
      draggingId = null;
      target.releasePointerCapture(ev.pointerId);
      savePositions();
      target.removeEventListener('pointermove', move);
      target.removeEventListener('pointerup', up);
      target.removeEventListener('pointercancel', up);
    }
    target.addEventListener('pointermove', move);
    target.addEventListener('pointerup', up);
    target.addEventListener('pointercancel', up);
  }

  function showTip(e: PointerEvent, act: Activity) {
    if (draggingId) return;
    tipActivity = act;
    tipVisible = true;
    positionTip(e.clientX, e.clientY);
  }
  function moveTip(e: PointerEvent) {
    if (!tipVisible) return;
    positionTip(e.clientX, e.clientY);
  }
  function hideTip() {
    tipVisible = false;
  }
  function positionTip(x: number, y: number) {
    const tw = tipEl?.offsetWidth ?? 220;
    const left = x + tw + 20 > window.innerWidth ? x - tw - 12 : x + 14;
    tipX = left;
    tipY = y - 10;
  }

  function reset() {
    positions = {};
    savePositions();
  }
</script>

<div class="psm-stage">
  <header class="psm-header">
    <div class="psm-title-block">
      <h1>PSM Activity Map <span>— Current State</span></h1>
      <p>Drag activities to reflect actual time allocation &nbsp;·&nbsp; Hover for detail &nbsp;·&nbsp; Positions auto-saved</p>
    </div>
    <button class="psm-action" onclick={reset}>Reset to defaults</button>
  </header>

  <div class="psm-outer">
    <div class="psm-y-label"><span>PERSONALIZED EFFORT</span></div>
    <div class="psm-chart" bind:this={chartEl}>
      <div class="psm-quad psm-quad-tl"></div>
      <div class="psm-quad psm-quad-tr"></div>
      <div class="psm-quad psm-quad-bl"></div>
      <div class="psm-quad psm-quad-br"></div>
      <div class="psm-div-v"></div>
      <div class="psm-div-h"></div>
      <div class="psm-qlabel psm-ql-tl">Automate or Eliminate</div>
      <div class="psm-qlabel psm-ql-tr">Protect &amp; Scale</div>
      <div class="psm-qlabel psm-ql-bl">Deprioritise</div>
      <div class="psm-qlabel psm-ql-br">Invest &amp; Grow</div>

      {#each ACTS as act (act.id)}
        <div
          class="psm-dot"
          class:psm-dragging={draggingId === act.id}
          data-cat={act.cat}
          style={dotStyle(act)}
          role="button"
          tabindex="0"
          aria-label={act.name}
          onpointerdown={(e) => startDrag(e, act.id)}
          onpointerenter={(e) => showTip(e, act)}
          onpointermove={moveTip}
          onpointerleave={hideTip}
        >
          {#each act.lbl.split('\n') as line}
            <span>{line}</span>
          {/each}
        </div>
      {/each}
    </div>
    <div class="psm-x-label">VALUE TO PARTNER ECOSYSTEM</div>
    <div class="psm-x-ends"><span>Low Value</span><span>High Value</span></div>
  </div>

  <div class="psm-legend">
    <div class="psm-li"><div class="psm-ld" data-cat="low-admin"></div>Admin &amp; Ops (low value)</div>
    <div class="psm-li"><div class="psm-ld" data-cat="low-ops"></div>Reactive / Compliance (low value)</div>
    <div class="psm-li"><div class="psm-ld" data-cat="mid"></div>Enablement &amp; Comms (mid value)</div>
    <div class="psm-li"><div class="psm-ld" data-cat="high"></div>Strategic Delivery (high value)</div>
    <div class="psm-li"><div class="psm-ld" data-cat="high-exec"></div>Executive &amp; GTM (high value)</div>
  </div>
  <div class="psm-save-note">Positions remembered in browser &nbsp;·&nbsp; Drag to reposition &nbsp;·&nbsp; Hover for sub-tasks</div>

  <div
    class="psm-tip"
    class:visible={tipVisible && tipActivity !== null}
    bind:this={tipEl}
    style="left:{tipX}px;top:{tipY}px;"
    aria-hidden="true"
  >
    {#if tipActivity}
      <div class="psm-tip-title">{tipActivity.name}</div>
      {#each tipActivity.bullets as b}
        <div class="psm-tip-bullet">{b}</div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .psm-stage {
    --psm-navy: #0A2F46;
    --psm-orange: #FF6100;
    --psm-teal: #0D9488;
    --psm-green: #1A7A47;
    --psm-amber: #B45309;
    --psm-red: #991B1B;
    --psm-mid: #888;
    color: var(--psm-navy);
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .psm-header {
    width: 100%;
    max-width: 980px;
    margin-bottom: 14px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 12px;
  }
  .psm-title-block h1 {
    font-size: 21px;
    font-weight: 700;
    color: var(--psm-navy);
    margin: 0;
  }
  .psm-title-block h1 span { color: var(--psm-orange); }
  .psm-title-block p {
    font-size: 11px;
    color: var(--psm-mid);
    margin-top: 3px;
  }
  .psm-action {
    font-size: 11px;
    padding: 6px 14px;
    border-radius: 3px;
    cursor: pointer;
    border: 1px solid #c8c6c0;
    background: white;
    color: var(--psm-navy);
    transition: background 0.15s;
    font-family: inherit;
  }
  .psm-action:hover { background: #eeecea; }

  .psm-outer {
    width: 100%;
    max-width: 980px;
    display: grid;
    grid-template-columns: 26px 1fr;
    grid-template-rows: 1fr 22px 16px;
  }
  .psm-y-label {
    grid-column: 1;
    grid-row: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .psm-y-label span {
    font-size: 9px;
    font-weight: 700;
    color: var(--psm-mid);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
    transform: rotate(-90deg);
    display: block;
  }

  .psm-chart {
    grid-column: 2;
    grid-row: 1;
    width: 100%;
    aspect-ratio: 1.6 / 1;
    position: relative;
    border: 1px solid #c8c6c0;
    background: white;
    overflow: hidden;
  }

  .psm-quad {
    position: absolute;
    width: 50%;
    height: 50%;
    pointer-events: none;
  }
  .psm-quad-tl { top: 0; left: 0; background: #FFFBEB; opacity: 0.7; }
  .psm-quad-tr { top: 0; right: 0; background: #F0FDF4; opacity: 0.8; }
  .psm-quad-bl { bottom: 0; left: 0; background: #F5F5F5; opacity: 0.8; }
  .psm-quad-br { bottom: 0; right: 0; background: #EFF6FF; opacity: 0.7; }

  .psm-div-v {
    position: absolute;
    left: 50%;
    top: 0;
    width: 1px;
    height: 100%;
    background: #d0cdc8;
    pointer-events: none;
  }
  .psm-div-h {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    background: #d0cdc8;
    pointer-events: none;
  }

  .psm-qlabel {
    position: absolute;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 3px;
    pointer-events: none;
  }
  .psm-ql-tl { top: 8px; left: 10px; background: #FEF3C7; color: #92400E; }
  .psm-ql-tr { top: 8px; right: 10px; background: #D1FAE5; color: #065F46; }
  .psm-ql-bl { bottom: 8px; left: 10px; background: #F3F4F6; color: #6B7280; }
  .psm-ql-br { bottom: 8px; right: 10px; background: #DBEAFE; color: #1D4ED8; }

  .psm-dot {
    position: absolute;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    cursor: grab;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    font-weight: 700;
    color: white;
    user-select: none;
    border: 2px solid rgba(255, 255, 255, 0.45);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.22);
    transition: box-shadow 0.15s;
    z-index: 10;
    text-align: center;
    line-height: 1.1;
    padding: 2px;
    touch-action: none;
  }
  .psm-dot span { display: block; }
  .psm-dot:hover {
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.32);
    z-index: 20;
  }
  .psm-dot.psm-dragging {
    cursor: grabbing;
    z-index: 100;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.38);
  }
  .psm-dot[data-cat='low-admin'] { background: var(--psm-amber); }
  .psm-dot[data-cat='low-ops']   { background: var(--psm-red); }
  .psm-dot[data-cat='mid']       { background: var(--psm-teal); }
  .psm-dot[data-cat='high']      { background: var(--psm-green); }
  .psm-dot[data-cat='high-exec'] { background: var(--psm-navy); }

  .psm-x-label {
    grid-column: 2;
    grid-row: 2;
    text-align: center;
    font-size: 9px;
    font-weight: 700;
    color: var(--psm-mid);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding-top: 5px;
  }
  .psm-x-ends {
    grid-column: 2;
    grid-row: 3;
    display: flex;
    justify-content: space-between;
    font-size: 9px;
    color: #bbb;
    padding: 0 4px;
  }

  .psm-legend {
    width: 100%;
    max-width: 980px;
    margin-top: 14px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    font-size: 11px;
    color: #555;
  }
  .psm-li {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .psm-ld {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .psm-ld[data-cat='low-admin'] { background: var(--psm-amber); }
  .psm-ld[data-cat='low-ops']   { background: var(--psm-red); }
  .psm-ld[data-cat='mid']       { background: var(--psm-teal); }
  .psm-ld[data-cat='high']      { background: var(--psm-green); }
  .psm-ld[data-cat='high-exec'] { background: var(--psm-navy); }

  .psm-save-note {
    font-size: 10px;
    color: #bbb;
    margin-top: 10px;
    text-align: center;
    width: 100%;
    max-width: 980px;
  }

  .psm-tip {
    position: fixed;
    background: var(--psm-navy);
    color: white;
    font-size: 11px;
    padding: 8px 12px;
    border-radius: 4px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s;
    z-index: 300;
    max-width: 260px;
    line-height: 1.6;
  }
  .psm-tip.visible { opacity: 1; }
  .psm-tip-title {
    font-weight: 700;
    font-size: 12px;
    margin-bottom: 4px;
    color: #FF9955;
  }
  .psm-tip-bullet {
    color: rgba(255, 255, 255, 0.8);
    font-size: 10.5px;
  }
  .psm-tip-bullet::before { content: '· '; }
</style>
