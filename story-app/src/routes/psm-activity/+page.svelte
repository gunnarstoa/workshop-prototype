<script lang="ts">
  type Cat = 'low-admin' | 'low-ops' | 'mid' | 'high' | 'high-exec';
  type Activity = {
    id: string;
    lbl: string;
    cat: Cat;
    dx: number;
    dy: number;
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

  // ── Custom groups ──────────────────────────────────────────────────────────
  type GroupDot = { id: string; label: string; cat: Cat; details: string };
  type Group = { id: string; name: string; color: string; dots: GroupDot[]; positions: Record<string, { x: number; y: number }> };

  const GROUP_COLORS = ['#7C3AED', '#0891B2', '#C2410C', '#047857', '#9D174D'];
  const CAT_LABELS: Record<Cat, string> = {
    'low-admin': 'Admin / Ops (low value)',
    'low-ops':   'Reactive / Compliance (low value)',
    'mid':       'Enablement & Comms (mid value)',
    'high':      'Strategic Delivery (high value)',
    'high-exec': 'Executive & GTM (high value)',
  };
  const STORAGE_KEY_GROUPS = 'psm_activity_groups_v1';

  let groups = $state<Group[]>([]);

  // ── Form state ─────────────────────────────────────────────────────────────
  let formOpen   = $state(false);
  let formName   = $state('');
  type FormRow   = { label: string; cat: Cat; details: string };
  let formRows   = $state<FormRow[]>([{ label: '', cat: 'mid', details: '' }]);

  function openForm() {
    formName = '';
    formRows = [{ label: '', cat: 'mid', details: '' }];
    formOpen = true;
  }
  function closeForm() { formOpen = false; }

  function addFormRow() {
    formRows = [...formRows, { label: '', cat: 'mid', details: '' }];
  }
  function removeFormRow(i: number) {
    formRows = formRows.filter((_, idx) => idx !== i);
  }

  function submitGroup() {
    const validRows = formRows.filter(r => r.label.trim());
    if (!formName.trim() || validRows.length === 0) return;
    const id = Date.now().toString(36);
    const color = GROUP_COLORS[groups.length % GROUP_COLORS.length];
    const dots: GroupDot[] = validRows.map((r, i) => ({
      id: `${id}_${i}`,
      label: r.label.trim(),
      cat: r.cat,
      details: r.details.trim(),
    }));
    // Spread default positions around centre so dots don't all stack
    const spread = 30;
    const positions: Record<string, { x: number; y: number }> = {};
    dots.forEach((d, i) => {
      const angle = (i / dots.length) * 2 * Math.PI;
      positions[d.id] = {
        x: Math.min(95, Math.max(5, 50 + spread * Math.cos(angle))),
        y: Math.min(95, Math.max(5, 50 + spread * Math.sin(angle))),
      };
    });
    const newGroup: Group = { id, name: formName.trim(), color, dots, positions };
    groups = [...groups, newGroup];
    saveGroups();
    closeForm();
  }

  function removeGroup(gid: string) {
    groups = groups.filter(g => g.id !== gid);
    saveGroups();
  }

  function saveGroups() {
    if (typeof localStorage === 'undefined') return;
    try { localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(groups)); } catch {}
  }

  // ── Primary PSM positions ──────────────────────────────────────────────────
  const STORAGE_KEY = 'psm_activity_map_v1';
  type Position = { x: number; y: number };
  let positions  = $state<Record<string, Position>>({});
  let chartEl: HTMLDivElement | undefined = $state();
  let tipVisible  = $state(false);
  let tipLabel    = $state('');
  let tipDetails  = $state<string[]>([]);
  let tipGroup    = $state('');
  let tipX = $state(0);
  let tipY = $state(0);
  let tipEl: HTMLDivElement | undefined = $state();
  let draggingId  = $state<string | null>(null);

  $effect(() => {
    if (typeof localStorage === 'undefined') return;
    try { positions = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}'); } catch {}
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY_GROUPS) ?? '[]') as Group[];
      groups = saved;
    } catch {}
  });

  function dotStyle(act: Activity): string {
    const p = positions[act.id];
    const left = p ? p.x : act.dx;
    const top  = p ? p.y : 100 - act.dy;
    return `left:${left}%;top:${top}%;`;
  }

  function groupDotStyle(g: Group, d: GroupDot): string {
    const p = g.positions[d.id];
    return p ? `left:${p.x}%;top:${p.y}%;` : 'left:50%;top:50%;';
  }

  function startDrag(e: PointerEvent, actId: string) {
    if (!chartEl) return;
    hideTip();
    draggingId = actId;
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
    const rect = chartEl.getBoundingClientRect();
    function move(ev: PointerEvent) {
      const x = Math.max(2, Math.min(98, ((ev.clientX - rect.left) / rect.width)  * 100));
      const y = Math.max(2, Math.min(98, ((ev.clientY - rect.top)  / rect.height) * 100));
      positions = { ...positions, [actId]: { x, y } };
    }
    function up(ev: PointerEvent) {
      draggingId = null;
      target.releasePointerCapture(ev.pointerId);
      if (typeof localStorage !== 'undefined') {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(positions)); } catch {}
      }
      target.removeEventListener('pointermove', move);
      target.removeEventListener('pointerup', up);
      target.removeEventListener('pointercancel', up);
    }
    target.addEventListener('pointermove', move);
    target.addEventListener('pointerup', up);
    target.addEventListener('pointercancel', up);
  }

  function startDragGroup(e: PointerEvent, gid: string, dotId: string) {
    if (!chartEl) return;
    hideTip();
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
    const rect = chartEl.getBoundingClientRect();
    function move(ev: PointerEvent) {
      const x = Math.max(2, Math.min(98, ((ev.clientX - rect.left) / rect.width)  * 100));
      const y = Math.max(2, Math.min(98, ((ev.clientY - rect.top)  / rect.height) * 100));
      groups = groups.map(g => g.id !== gid ? g : {
        ...g,
        positions: { ...g.positions, [dotId]: { x, y } }
      });
    }
    function up(ev: PointerEvent) {
      target.releasePointerCapture(ev.pointerId);
      saveGroups();
      target.removeEventListener('pointermove', move);
      target.removeEventListener('pointerup', up);
      target.removeEventListener('pointercancel', up);
    }
    target.addEventListener('pointermove', move);
    target.addEventListener('pointerup', up);
    target.addEventListener('pointercancel', up);
  }

  function showTip(e: PointerEvent, label: string, details: string[], groupName: string) {
    tipLabel   = label;
    tipDetails = details;
    tipGroup   = groupName;
    tipVisible = true;
    positionTip(e.clientX, e.clientY);
  }
  function moveTip(e: PointerEvent) { if (tipVisible) positionTip(e.clientX, e.clientY); }
  function hideTip() { tipVisible = false; }
  function positionTip(x: number, y: number) {
    const tw = tipEl?.offsetWidth ?? 220;
    tipX = x + tw + 20 > window.innerWidth ? x - tw - 12 : x + 14;
    tipY = y - 10;
  }

  function reset() {
    positions = {};
    if (typeof localStorage !== 'undefined') {
      try { localStorage.setItem(STORAGE_KEY, '{}'); } catch {}
    }
  }

  // line-wrap label text into ≤2 lines for dot display
  function dotLines(label: string): string[] {
    const words = label.split(' ');
    if (words.length <= 1 || label.length <= 8) return [label];
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
  }
</script>

<!-- ── Form modal ─────────────────────────────────────────────────────────── -->
{#if formOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div class="fm-backdrop" onclick={closeForm}>
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div class="fm-panel" onclick={(e) => e.stopPropagation()}>
      <div class="fm-head">
        <span>New PSM Group</span>
        <button class="fm-close" onclick={closeForm}>✕</button>
      </div>

      <div class="fm-body">
        <label class="fm-label" for="fm-name">Group name</label>
        <input
          id="fm-name"
          class="fm-input"
          type="text"
          placeholder="e.g. Target State · PSM East · PSM 2"
          bind:value={formName}
          onkeydown={(e) => e.stopPropagation()}
        />

        <div class="fm-section-head">
          <span>Activities</span>
          <span class="fm-hint">each becomes a dot on the map</span>
        </div>

        <div class="fm-rows">
          {#each formRows as row, i}
            <div class="fm-row">
              <input
                class="fm-input fm-row-label"
                type="text"
                placeholder="Label (e.g. Partner QBRs)"
                bind:value={row.label}
                onkeydown={(e) => e.stopPropagation()}
              />
              <select
                class="fm-select"
                bind:value={row.cat}
                onkeydown={(e) => e.stopPropagation()}
              >
                {#each Object.entries(CAT_LABELS) as [val, lbl]}
                  <option value={val}>{lbl}</option>
                {/each}
              </select>
              <input
                class="fm-input fm-row-details"
                type="text"
                placeholder="Details / sub-tasks (optional)"
                bind:value={row.details}
                onkeydown={(e) => e.stopPropagation()}
              />
              {#if formRows.length > 1}
                <button class="fm-rm" onclick={() => removeFormRow(i)} title="Remove">✕</button>
              {:else}
                <span class="fm-rm-ph"></span>
              {/if}
            </div>
          {/each}
        </div>

        <button class="fm-add-row" onclick={addFormRow}>+ Add activity</button>
      </div>

      <div class="fm-foot">
        <button class="fm-btn fm-btn-cancel" onclick={closeForm}>Cancel</button>
        <button
          class="fm-btn fm-btn-submit"
          onclick={submitGroup}
          disabled={!formName.trim() || formRows.every(r => !r.label.trim())}
        >Add to Map</button>
      </div>
    </div>
  </div>
{/if}

<!-- ── Main slide ─────────────────────────────────────────────────────────── -->
<div class="psm-stage">
  <header class="psm-header">
    <div class="psm-title-block">
      <h1>PSM Activity Map <span>— Current State</span></h1>
      <p>Drag activities to reflect actual time allocation &nbsp;·&nbsp; Positions auto-saved</p>
    </div>
    <div class="psm-header-actions">
      <button class="psm-action" onclick={reset}>Reset</button>
      <button class="psm-action psm-action-add" onclick={openForm}>+ Add PSM Group</button>
    </div>
  </header>

  <!-- Group chips -->
  {#if groups.length > 0}
    <div class="psm-group-bar">
      {#each groups as g}
        <div class="psm-group-chip" style="--gc: {g.color}">
          <span class="psm-chip-dot"></span>
          {g.name}
          <button class="psm-chip-rm" onclick={() => removeGroup(g.id)} title="Remove group">✕</button>
        </div>
      {/each}
    </div>
  {/if}

  <div class="psm-body">

    <!-- Left: scatter chart -->
    <div class="psm-chart-panel">
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
              onpointerenter={(e) => showTip(e, act.name, act.bullets, 'PSM 1')}
              onpointermove={moveTip}
              onpointerleave={hideTip}
            >
              {#each act.lbl.split('\n') as line}
                <span>{line}</span>
              {/each}
            </div>
          {/each}

          {#each groups as g}
            {#each g.dots as d}
              <div
                class="psm-dot psm-dot-group"
                data-cat={d.cat}
                style="{groupDotStyle(g, d)} --gc: {g.color};"
                role="button"
                tabindex="0"
                aria-label="{g.name} — {d.label}"
                onpointerdown={(e) => startDragGroup(e, g.id, d.id)}
                onpointerenter={(e) => showTip(e, d.label, d.details ? [d.details] : [], g.name)}
                onpointermove={moveTip}
                onpointerleave={hideTip}
              >
                {#each dotLines(d.label) as line}
                  <span>{line}</span>
                {/each}
              </div>
            {/each}
          {/each}
        </div>
        <div class="psm-x-label">VALUE TO PARTNER ECOSYSTEM</div>
        <div class="psm-x-ends"><span>Low Value</span><span>High Value</span></div>
      </div>
    </div>

    <!-- Right: activity list by group -->
    <div class="psm-list-panel">
      {#each Object.entries(CAT_LABELS) as [cat, label]}
        {@const catActs = ACTS.filter(a => a.cat === cat)}
        <div class="psm-gl-col">
          <div class="psm-gl-header">
            <div class="psm-gl-swatch" data-cat={cat}></div>
            {label}
          </div>
          {#each catActs as act}
            <div class="psm-gl-act">
              <div class="psm-gl-act-name">{act.name}</div>
              <ul class="psm-gl-bullets">
                {#each act.bullets as b}
                  <li>{b}</li>
                {/each}
              </ul>
            </div>
          {/each}
        </div>
      {/each}
    </div>

  </div>

  <!-- Tooltip -->
  <div
    class="psm-tip"
    class:visible={tipVisible}
    bind:this={tipEl}
    style="left:{tipX}px;top:{tipY}px;"
    aria-hidden="true"
  >
    <div class="psm-tip-title">
      {tipLabel}
      {#if tipGroup}
        <span class="psm-tip-group">{tipGroup}</span>
      {/if}
    </div>
    {#each tipDetails as b}
      <div class="psm-tip-bullet">{b}</div>
    {/each}
  </div>
</div>

<style>
  /* ── Form modal ──────────────────────────────────────────────────────────── */
  .fm-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(10, 47, 70, 0.45);
    z-index: 500;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .fm-panel {
    background: white;
    border-radius: 8px;
    width: min(680px, 96vw);
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 40px rgba(0,0,0,0.28);
    overflow: hidden;
  }
  .fm-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 18px;
    border-bottom: 1px solid #e8e6e0;
    font-size: 14px;
    font-weight: 700;
    color: #0a2f46;
    flex-shrink: 0;
  }
  .fm-close {
    background: none;
    border: none;
    font-size: 14px;
    color: #999;
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 3px;
  }
  .fm-close:hover { background: #f0ede8; color: #333; }

  .fm-body {
    padding: 16px 18px;
    overflow-y: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .fm-label {
    font-size: 11px;
    font-weight: 700;
    color: #0a2f46;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    display: block;
  }
  .fm-input {
    font-family: inherit;
    font-size: 12px;
    border: 1px solid #d0cdc8;
    border-radius: 4px;
    padding: 6px 9px;
    color: #0a2f46;
    background: white;
    outline: none;
    width: 100%;
    box-sizing: border-box;
  }
  .fm-input:focus { border-color: #7C3AED; box-shadow: 0 0 0 2px rgba(124,58,237,0.12); }

  .fm-select {
    font-family: inherit;
    font-size: 11px;
    border: 1px solid #d0cdc8;
    border-radius: 4px;
    padding: 6px 7px;
    color: #0a2f46;
    background: white;
    outline: none;
    flex-shrink: 0;
    width: 200px;
  }
  .fm-select:focus { border-color: #7C3AED; }

  .fm-section-head {
    display: flex;
    align-items: baseline;
    gap: 8px;
    font-size: 11px;
    font-weight: 700;
    color: #0a2f46;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-top: 4px;
  }
  .fm-hint { font-size: 10px; color: #999; font-weight: 400; text-transform: none; letter-spacing: 0; }

  .fm-rows { display: flex; flex-direction: column; gap: 6px; }
  .fm-row {
    display: flex;
    gap: 6px;
    align-items: center;
  }
  .fm-row-label  { flex: 1.2; min-width: 0; }
  .fm-row-details { flex: 1.8; min-width: 0; }

  .fm-rm {
    background: none;
    border: none;
    color: #bbb;
    cursor: pointer;
    font-size: 12px;
    padding: 4px 6px;
    border-radius: 3px;
    flex-shrink: 0;
  }
  .fm-rm:hover { color: #991B1B; background: #FEE2E2; }
  .fm-rm-ph { width: 28px; flex-shrink: 0; }

  .fm-add-row {
    align-self: flex-start;
    background: none;
    border: 1px dashed #d0cdc8;
    border-radius: 4px;
    padding: 5px 12px;
    font-size: 11px;
    color: #7C3AED;
    cursor: pointer;
    font-family: inherit;
    margin-top: 2px;
  }
  .fm-add-row:hover { background: #F5F3FF; border-color: #7C3AED; }

  .fm-foot {
    padding: 12px 18px;
    border-top: 1px solid #e8e6e0;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    flex-shrink: 0;
  }
  .fm-btn {
    font-family: inherit;
    font-size: 12px;
    padding: 7px 18px;
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid #d0cdc8;
  }
  .fm-btn-cancel { background: white; color: #555; }
  .fm-btn-cancel:hover { background: #f0ede8; }
  .fm-btn-submit {
    background: #7C3AED;
    color: white;
    border-color: #7C3AED;
    font-weight: 600;
  }
  .fm-btn-submit:hover:not(:disabled) { background: #6D28D9; }
  .fm-btn-submit:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ── Slide ───────────────────────────────────────────────────────────────── */
  .psm-stage {
    --psm-navy: #0A2F46;
    --psm-orange: #FF6100;
    --psm-teal: #0D9488;
    --psm-green: #1A7A47;
    --psm-amber: #B45309;
    --psm-red: #991B1B;
    --psm-mid: #888;
    color: var(--psm-navy);
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding: 10px 16px 10px;
    gap: 0;
  }

  .psm-body {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .psm-chart-panel {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
  }

  .psm-list-panel {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
    align-content: start;
    overflow-y: auto;
    padding-bottom: 4px;
  }

  .psm-header {
    width: 100%;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 12px;
    flex-shrink: 0;
  }
  .psm-title-block h1 {
    font-size: 21px;
    font-weight: 700;
    color: var(--psm-navy);
    margin: 0;
  }
  .psm-title-block h1 span { color: var(--psm-orange); }
  .psm-title-block p { font-size: 11px; color: var(--psm-mid); margin-top: 3px; }

  .psm-header-actions { display: flex; gap: 8px; align-items: center; flex-shrink: 0; }

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
    white-space: nowrap;
  }
  .psm-action:hover { background: #eeecea; }
  .psm-action-add {
    border-color: #7C3AED;
    color: #7C3AED;
    font-weight: 600;
  }
  .psm-action-add:hover { background: #F5F3FF; }

  /* Group chips */
  .psm-group-bar {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 8px;
    flex-shrink: 0;
  }
  .psm-group-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 3px 8px 3px 6px;
    border-radius: 20px;
    border: 1.5px solid var(--gc);
    font-size: 11px;
    font-weight: 600;
    color: var(--gc);
    background: white;
  }
  .psm-chip-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--gc);
    flex-shrink: 0;
  }
  .psm-chip-rm {
    background: none;
    border: none;
    font-size: 10px;
    color: #ccc;
    cursor: pointer;
    padding: 0 2px;
    line-height: 1;
    margin-left: 2px;
  }
  .psm-chip-rm:hover { color: #991B1B; }

  .psm-outer {
    display: grid;
    grid-template-columns: 26px 1fr;
    grid-template-rows: 220px 22px 16px;
    width: 100%;
  }
  .psm-y-label {
    grid-column: 1; grid-row: 1;
    display: flex; align-items: center; justify-content: center;
  }
  .psm-y-label span {
    font-size: 9px; font-weight: 700; color: var(--psm-mid);
    letter-spacing: 0.08em; text-transform: uppercase;
    white-space: nowrap; transform: rotate(-90deg); display: block;
  }

  .psm-chart {
    grid-column: 2; grid-row: 1;
    width: 100%;
    height: 220px;
    position: relative;
    border: 1px solid #c8c6c0;
    background: white;
    overflow: hidden;
  }

  .psm-quad { position: absolute; width: 50%; height: 50%; pointer-events: none; }
  .psm-quad-tl { top: 0; left: 0; background: #FFFBEB; opacity: 0.7; }
  .psm-quad-tr { top: 0; right: 0; background: #F0FDF4; opacity: 0.8; }
  .psm-quad-bl { bottom: 0; left: 0; background: #F5F5F5; opacity: 0.8; }
  .psm-quad-br { bottom: 0; right: 0; background: #EFF6FF; opacity: 0.7; }

  .psm-div-v { position: absolute; left: 50%; top: 0; width: 1px; height: 100%; background: #d0cdc8; pointer-events: none; }
  .psm-div-h { position: absolute; top: 50%; left: 0; width: 100%; height: 1px; background: #d0cdc8; pointer-events: none; }

  .psm-qlabel {
    position: absolute; font-size: 9px; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase;
    padding: 3px 8px; border-radius: 3px; pointer-events: none;
  }
  .psm-ql-tl { top: 8px; left: 10px; background: #FEF3C7; color: #92400E; }
  .psm-ql-tr { top: 8px; right: 10px; background: #D1FAE5; color: #065F46; }
  .psm-ql-bl { bottom: 8px; left: 10px; background: #F3F4F6; color: #6B7280; }
  .psm-ql-br { bottom: 8px; right: 10px; background: #DBEAFE; color: #1D4ED8; }

  .psm-dot {
    position: absolute;
    width: 42px; height: 42px;
    border-radius: 50%;
    cursor: grab;
    transform: translate(-50%, -50%);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    font-size: 9px; font-weight: 700; color: white;
    user-select: none;
    border: 2px solid rgba(255,255,255,0.45);
    box-shadow: 0 2px 6px rgba(0,0,0,0.22);
    transition: box-shadow 0.15s;
    z-index: 10;
    text-align: center; line-height: 1.1; padding: 2px;
    touch-action: none;
  }
  .psm-dot span { display: block; }
  .psm-dot:hover { box-shadow: 0 4px 14px rgba(0,0,0,0.32); z-index: 20; }
  .psm-dot.psm-dragging { cursor: grabbing; z-index: 100; box-shadow: 0 8px 24px rgba(0,0,0,0.38); }

  .psm-dot[data-cat='low-admin'] { background: var(--psm-amber); }
  .psm-dot[data-cat='low-ops']   { background: var(--psm-red); }
  .psm-dot[data-cat='mid']       { background: var(--psm-teal); }
  .psm-dot[data-cat='high']      { background: var(--psm-green); }
  .psm-dot[data-cat='high-exec'] { background: var(--psm-navy); }

  /* Custom group dots override color with group color */
  .psm-dot-group {
    background: var(--gc) !important;
    border: 2.5px dashed rgba(255,255,255,0.65);
    z-index: 15;
  }

  .psm-x-label {
    grid-column: 2; grid-row: 2;
    text-align: center; font-size: 9px; font-weight: 700;
    color: var(--psm-mid); letter-spacing: 0.08em; text-transform: uppercase; padding-top: 5px;
  }
  .psm-x-ends {
    grid-column: 2; grid-row: 3;
    display: flex; justify-content: space-between;
    font-size: 9px; color: #bbb; padding: 0 4px;
  }

  .psm-save-note {
    font-size: 10px; color: #bbb; margin-top: 6px;
    flex-shrink: 0;
  }

  /* ── Activity list panel ─────────────────────────────────────────────────── */
  .psm-gl-col {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .psm-gl-header {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 8.5px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #555;
    padding-bottom: 4px;
    border-bottom: 2px solid #e0ddd8;
  }

  .psm-gl-swatch {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .psm-gl-swatch[data-cat='low-admin'] { background: var(--psm-amber); }
  .psm-gl-swatch[data-cat='low-ops']   { background: var(--psm-red); }
  .psm-gl-swatch[data-cat='mid']       { background: var(--psm-teal); }
  .psm-gl-swatch[data-cat='high']      { background: var(--psm-green); }
  .psm-gl-swatch[data-cat='high-exec'] { background: var(--psm-navy); }

  .psm-gl-act {
    background: #fafaf9;
    border: 1px solid #e8e6e0;
    border-radius: 4px;
    padding: 5px 7px;
  }

  .psm-gl-act-name {
    font-size: 9.5px;
    font-weight: 700;
    color: #0a2f46;
    margin-bottom: 2px;
  }

  .psm-gl-bullets {
    margin: 0;
    padding: 0 0 0 10px;
    list-style: disc;
  }
  .psm-gl-bullets li {
    font-size: 8.5px;
    color: #666;
    line-height: 1.45;
  }

  .psm-tip {
    position: fixed; background: var(--psm-navy); color: white;
    font-size: 11px; padding: 8px 12px; border-radius: 4px;
    pointer-events: none; opacity: 0; transition: opacity 0.15s;
    z-index: 300; max-width: 260px; line-height: 1.6;
  }
  .psm-tip.visible { opacity: 1; }
  .psm-tip-title {
    font-weight: 700; font-size: 12px; margin-bottom: 4px; color: #FF9955;
    display: flex; align-items: center; gap: 8px;
  }
  .psm-tip-group {
    font-size: 9px; font-weight: 700; background: rgba(255,255,255,0.15);
    color: white; padding: 1px 5px; border-radius: 3px; letter-spacing: 0.04em;
  }
  .psm-tip-bullet { color: rgba(255,255,255,0.8); font-size: 10.5px; }
  .psm-tip-bullet::before { content: '· '; }
</style>
