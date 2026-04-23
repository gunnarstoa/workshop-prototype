<script lang="ts">
  import { academy, iltWorkshops, specialistEngagements } from '$lib/data';

  // IFP Delivery journey — featured workshops shown first, in progression order
  const ifpDeliveryWorkshopsFirst = [
    'anaplan-way-apps',        // The Anaplan Way for Applications
    'drw-ifp',                 // Delivery Readiness Workshop - IFP
    'discovery-workshop',      // Discovery & Scoping Workshop
    'data-integration-workshop', // Data Integration & Cloudworks Workshop
    'ux-design-workshop',      // UX & Page Design Workshop
    'model-building-l2',       // Level 2 Model Building Workshop
  ];
  const sortedWorkshops = [
    ...ifpDeliveryWorkshopsFirst.map(id => iltWorkshops.find(w => w.id === id)!).filter(Boolean),
    ...iltWorkshops.filter(w => !ifpDeliveryWorkshopsFirst.includes(w.id)),
  ];

  // IFP Delivery journey — featured courses shown first, in progression order
  const ifpDeliveryFirst = [
    'E-KVO2P1',  // Connected Planning
    'E-E1L9LV',  // Implementation Methodology
    'E-P0WEZ0',  // Essentials of Model Building
    'E-GVPJXV',  // Anaplan Applications 101 for Partners
    'E-O06E50',  // Integrated Financial Planning (IFP) App v2 101 for Partners
    'E-J0E2X1',  // Transform IFP and Consolidation with Anaplan
    'E-Q07GEV',  // Anaplan IFRS Accelerator for Consolidation for Partners
  ];
  const sortedCourses = [
    ...ifpDeliveryFirst.map(id => academy.courses.find(c => c.uuid === id)!).filter(Boolean),
    ...academy.courses.filter(c => !ifpDeliveryFirst.includes(c.uuid)),
  ];

  const MAX_STEP = 14;
  let buildStep = $state(9);

  // Step map:
  //  0: blank
  //  1: Layer 1 appears
  //  2: Self-Paced card (empty)         3: populates
  //  4: ILT card (empty)                5: populates
  //  6: Specialist card (empty)         7: populates
  //  8: Layer 2 appears (empty)
  //  9: IFP Delivery featured card — drag assets to stages
  // 10: Clear connectors, shrink to mini card
  // 11: Fill Layer 2 with many journey cards
  // 12: Highlight the 3 IFP role variants
  // 13: Layer 3 ("Achievements") appears — fill with all achievement cards

  const miniJourneys = [
    { id: 'ifp-delivery', product: 'Finance · Integrated Financial Planning', persona: 'Delivery Resource', accent: 'fin', isIFP: true },
    { id: 'ifp-sales', product: 'Finance · Integrated Financial Planning', persona: 'Sales Resource', accent: 'fin', isIFP: true },
    { id: 'ifp-presales', product: 'Finance · Integrated Financial Planning', persona: 'Pre-Sales Resource', accent: 'fin', isIFP: true },
    { id: 'fcc-delivery', product: 'Finance · Financial Close', persona: 'Delivery Resource', accent: 'fin', isIFP: false },
    { id: 'pa-delivery', product: 'Finance · Profitability Analysis', persona: 'Delivery Resource', accent: 'fin', isIFP: false },
    { id: 'srp-sales', product: 'Finance · Subscription Revenue', persona: 'Sales Resource', accent: 'fin', isIFP: false },
    { id: 'cmp-delivery', product: 'Finance · Consensus Margin', persona: 'Delivery Resource', accent: 'fin', isIFP: false },
    { id: 'ap-delivery', product: 'RSC · Assortment Planning', persona: 'Delivery Resource', accent: 'sc', isIFP: false },
    { id: 'dp-delivery', product: 'RSC · Demand Planning', persona: 'Delivery Resource', accent: 'sc', isIFP: false },
    { id: 'dp-sales', product: 'RSC · Demand Planning', persona: 'Sales Resource', accent: 'sc', isIFP: false },
    { id: 'dp-presales', product: 'RSC · Demand Planning', persona: 'Pre-Sales Resource', accent: 'sc', isIFP: false },
    { id: 'ip-delivery', product: 'RSC · Inventory Planning', persona: 'Delivery Resource', accent: 'sc', isIFP: false },
    { id: 'mfp-delivery', product: 'RSC · Merchandise Financial Planning', persona: 'Delivery Resource', accent: 'sc', isIFP: false },
    { id: 'tpm-delivery', product: 'RSC · Trade Promotion', persona: 'Delivery Resource', accent: 'sc', isIFP: false },
    { id: 'ap-sales', product: 'RSC · Assortment Planning', persona: 'Sales Resource', accent: 'sc', isIFP: false },
    { id: 'owp-delivery', product: 'HR · Workforce Planning', persona: 'Delivery Resource', accent: 'hr', isIFP: false },
    { id: 'owp-sales', product: 'HR · Workforce Planning', persona: 'Sales Resource', accent: 'hr', isIFP: false },
    { id: 'ccp-delivery', product: 'HR · Contact Center Planning', persona: 'Delivery Resource', accent: 'hr', isIFP: false },
    { id: 'como-delivery', product: 'AI · CoModeler', persona: 'Delivery Resource', accent: 'ai', isIFP: false },
    { id: 'como-presales', product: 'AI · CoModeler', persona: 'Pre-Sales Resource', accent: 'ai', isIFP: false },
    { id: 'as-delivery', product: 'AI · Agent Studio', persona: 'Delivery Resource', accent: 'ai', isIFP: false },
    { id: 'sf-delivery', product: 'S&M · Sales Forecasting', persona: 'Delivery Resource', accent: 'sm', isIFP: false },
    { id: 'tq-sales', product: 'S&M · Territory & Quota', persona: 'Sales Resource', accent: 'sm', isIFP: false },
    { id: 'gtm-delivery', product: 'S&M · GTM Capacity', persona: 'Delivery Resource', accent: 'sm', isIFP: false },
    { id: 'polaris-delivery', product: 'Platform · Polaris', persona: 'Delivery Resource', accent: 'plat', isIFP: false },
    { id: 'ado-delivery', product: 'Platform · ADO', persona: 'Delivery Resource', accent: 'plat', isIFP: false },
  ];

  const achievements = [
    { id: 'agentic-cfo',        icon: '🏦', title: 'Agentic Office of the CFO',          sub: 'Finance + AI + Connected Planning',           featured: true  },
    { id: 'connected-financial', icon: '💡', title: 'Connected Financial Planning',        sub: 'Cross-domain finance expertise',              featured: true  },
    { id: 'connected-sc',        icon: '🔗', title: 'Connected Supply Chain Planning',     sub: 'End-to-end supply chain mastery',             featured: true  },
    { id: 'retail-expert',       icon: '🛍', title: 'Retail Expert',                       sub: 'Assortment + Demand + Inventory',             featured: false },
    { id: 'supply-chain-expert', icon: '📦', title: 'Supply Chain Expert',                 sub: 'TPM + Production + IBP',                     featured: false },
    { id: 'workforce-expert',    icon: '👥', title: 'Workforce Expert',                    sub: 'OWP + Contact Center + Resource Planning',   featured: false },
    { id: 'ai-expert',           icon: '🤖', title: 'AI Products Expert',                  sub: 'CoModeler + Agent Studio',                   featured: false },
    { id: 'connected-planning',  icon: '🏆', title: 'Connected Planning',                  sub: 'Expert across multiple domains',             featured: false },
  ];

  function handleMainClick() {
    if (buildStep <= 12) {
      if (buildStep === 9) { clearAllConnectors(); droppedItems = []; }
      buildStep += 1;
    } else if (buildStep === 13) {
      achievementDrops = [];
      clearAchievementConnectors();
      buildStep = 14;
    }
  }

  function handleLayer3Click(e: MouseEvent) {
    e.stopPropagation();
    if (buildStep === 12) buildStep = 13;
  }

  function handleBack(e: MouseEvent) {
    e.stopPropagation();
    if (buildStep > 0) buildStep -= 1;
  }

  function reset() {
    buildStep = 0;
    droppedItems = [];
    achievementDrops = [];
    clearAllConnectors();
    clearAchievementConnectors();
  }

  // ── Drag to journey stages (step 9) ────────────────────────────────────
  type DroppedItem = { name: string; sourceType: 'sp' | 'ilt' | 'se'; stageIdx: number };
  let droppedItems = $state<DroppedItem[]>([]);
  let dragData = $state<{ name: string; sourceType: string } | null>(null);
  let connectorSvg: SVGSVGElement | undefined = $state();
  const stageColors: Record<string, string> = { sp: '#1A8A4A', ilt: '#1A5276', se: '#B7540F' };

  function onDragStart(e: DragEvent, name: string, sourceType: string) {
    e.stopPropagation();
    dragData = { name, sourceType };
    if (e.dataTransfer) { e.dataTransfer.effectAllowed = 'copy'; e.dataTransfer.setData('text/plain', name); }
  }
  function onDragOver(e: DragEvent) { e.preventDefault(); if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'; }

  function onDropStage(e: DragEvent, stageIdx: number) {
    e.preventDefault(); e.stopPropagation();
    if (!dragData) return;
    const item: DroppedItem = { name: dragData.name, sourceType: dragData.sourceType as 'sp'|'ilt'|'se', stageIdx };
    droppedItems = [...droppedItems, item];
    dragData = null;
    requestAnimationFrame(() => requestAnimationFrame(() => drawStageConnector(item)));
  }

  function drawStageConnector(item: DroppedItem) {
    if (!connectorSvg) return;
    const sourceItems = document.querySelectorAll(`.build-drag-item[data-source="${item.sourceType}"]`);
    let sourceEl: Element | null = null;
    sourceItems.forEach((el) => { if (el.textContent?.trim() === item.name) sourceEl = el; });
    const targetEl = document.querySelectorAll('.build-drop-stage')[item.stageIdx];
    if (sourceEl && targetEl) drawLine(connectorSvg, sourceEl, targetEl, stageColors[item.sourceType] || '#0A2F46');
  }

  // ── Drag to achievements (step 13) ────────────────────────────────────
  type AchievementDrop = { name: string; target: string };
  let achievementDrops = $state<AchievementDrop[]>([]);
  let achConnectorSvg: SVGSVGElement | undefined = $state();

  function onDropAchievement(e: DragEvent, targetId: string) {
    e.preventDefault(); e.stopPropagation();
    if (!dragData) return;
    const item: AchievementDrop = { name: dragData.name, target: targetId };
    achievementDrops = [...achievementDrops, item];
    const name = dragData.name;
    dragData = null;
    requestAnimationFrame(() => requestAnimationFrame(() => drawAchievementConnector(name, targetId)));
  }

  function drawAchievementConnector(name: string, targetId: string) {
    if (!achConnectorSvg) return;
    let sourceEl: Element | null = null;
    document.querySelectorAll('.build-mini-card').forEach((el) => {
      const p = el.querySelector('.build-mini-product');
      const r = el.querySelector('.build-mini-persona');
      if (p && r && (p.textContent + ' — ' + r.textContent).includes(name)) sourceEl = el;
    });
    const targetEl = document.querySelector(`.build-ach-drop-zone[data-achid="${targetId}"]`);
    if (sourceEl && targetEl) drawLine(achConnectorSvg, sourceEl, targetEl, '#FF6100');
  }

  function clearAchievementConnectors() { if (achConnectorSvg) achConnectorSvg.innerHTML = ''; }

  // ── Shared drawing ─────────────────────────────────────────────────────
  function drawLine(svg: SVGSVGElement, fromEl: Element, toEl: Element, color: string) {
    const fR = fromEl.getBoundingClientRect(); const tR = toEl.getBoundingClientRect();
    const x1 = fR.left + fR.width * 0.5, y1 = fR.top + fR.height * 0.5;
    const x2 = tR.left + tR.width * 0.5, y2 = tR.top + tR.height * 0.5;
    const dy = Math.abs(y1 - y2); const dx = Math.abs(x1 - x2);
    const d = `M${x1},${y1} C${x1},${y1 - dy * 0.5} ${x2},${y2 + dy * 0.5} ${x2},${y2}`;
    const trail = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    trail.setAttribute('d', d); trail.setAttribute('fill', 'none');
    trail.setAttribute('stroke', color); trail.setAttribute('stroke-width', '1.5');
    trail.setAttribute('stroke-opacity', '0.15'); svg.appendChild(trail);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.setAttribute('d', d); line.setAttribute('fill', 'none');
    line.setAttribute('stroke', color); line.setAttribute('stroke-width', '2');
    line.setAttribute('stroke-opacity', '0.75'); line.setAttribute('stroke-dasharray', '7 5');
    line.style.animation = 'flowUp 3.5s linear 0s infinite'; svg.appendChild(line);
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('r', '4'); dot.setAttribute('fill', color); dot.setAttribute('fill-opacity', '0.9');
    const am = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
    am.setAttribute('dur', '3.5s'); am.setAttribute('begin', '0s');
    am.setAttribute('repeatCount', '1'); am.setAttribute('fill', 'freeze');
    am.setAttribute('path', d); am.setAttribute('calcMode', 'linear');
    dot.appendChild(am); svg.appendChild(dot);
  }

  function clearAllConnectors() { if (connectorSvg) connectorSvg.innerHTML = ''; }

  $effect(() => {
    function onResize() {
      if (buildStep === 9 && droppedItems.length > 0) {
        clearAllConnectors();
        for (const item of droppedItems) drawStageConnector(item);
      }
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  });

  const usedItemNames = $derived(new Set(droppedItems.map((i) => i.name)));
  const stageDrops = $derived(() => {
    const map: Record<number, DroppedItem[]> = {};
    for (const item of droppedItems) { if (!map[item.stageIdx]) map[item.stageIdx] = []; map[item.stageIdx].push(item); }
    return map;
  });

  const isDragMode = $derived(buildStep === 9 || buildStep === 13 || buildStep === 14);
  const featuredAchievements = achievements.filter(a => a.featured);
  const allAchievements = achievements;

  // ── RACI overlay ──────────────────────────────────────────────────────────
  let showRaci = $state(false);

  const raciColors: Record<string, { color: string; bg: string }> = {
    R: { color: '#1A7A47', bg: 'rgba(26,122,71,0.10)' },
    A: { color: '#C06010', bg: 'rgba(192,96,16,0.10)' },
    C: { color: '#1A5276', bg: 'rgba(26,82,118,0.10)' },
    I: { color: '#777',    bg: 'rgba(0,0,0,0.04)'     },
  };

  const raciTracks = [
    {
      name: 'Sales', icon: '💼', color: '#1A5276', sub: 'GTM & Pipeline',
      stakeholders: [
        { id: 'academy', label: 'Academy' },
        { id: 'psm',     label: 'PSM'     },
        { id: 'partner', label: 'Partner Mgr' },
        { id: 'learner', label: 'Seller'  },
      ],
      activities: [
        { name: 'Define GTM objectives',   academy: 'C', psm: 'R', partner: 'A', learner: 'I' },
        { name: 'Develop sales content',   academy: 'R', psm: 'C', partner: 'I', learner: 'I' },
        { name: 'Assign to sellers',       academy: 'I', psm: 'A', partner: 'R', learner: 'I' },
        { name: 'Complete coursework',     academy: 'I', psm: 'I', partner: 'A', learner: 'R' },
        { name: 'Track readiness',         academy: 'I', psm: 'R', partner: 'A', learner: 'C' },
        { name: 'Validate certification',  academy: 'R', psm: 'A', partner: 'C', learner: 'I' },
      ],
    },
    {
      name: 'Pre-Sales', icon: '🔍', color: '#1A7A47', sub: 'Technical Discovery',
      stakeholders: [
        { id: 'academy', label: 'Academy' },
        { id: 'psm',     label: 'PSM'     },
        { id: 'partner', label: 'Partner Mgr' },
        { id: 'learner', label: 'Pre-Seller' },
      ],
      activities: [
        { name: 'Define tech objectives',  academy: 'C', psm: 'R', partner: 'A', learner: 'I' },
        { name: 'Develop demo content',    academy: 'R', psm: 'C', partner: 'I', learner: 'I' },
        { name: 'Assign to pre-sales',     academy: 'I', psm: 'A', partner: 'R', learner: 'I' },
        { name: 'Complete coursework',     academy: 'I', psm: 'I', partner: 'A', learner: 'R' },
        { name: 'Track demo readiness',    academy: 'I', psm: 'R', partner: 'A', learner: 'C' },
        { name: 'Validate certification',  academy: 'R', psm: 'A', partner: 'C', learner: 'I' },
      ],
    },
    {
      name: 'Delivery', icon: '🛠', color: '#C06010', sub: 'Implementation',
      stakeholders: [
        { id: 'academy', label: 'Academy' },
        { id: 'psm',     label: 'PSM'     },
        { id: 'partner', label: 'Partner Mgr' },
        { id: 'learner', label: 'Consultant' },
      ],
      activities: [
        { name: 'Define delivery objectives', academy: 'C', psm: 'R', partner: 'A', learner: 'I' },
        { name: 'Develop delivery content',   academy: 'R', psm: 'C', partner: 'I', learner: 'I' },
        { name: 'Assign to delivery team',    academy: 'I', psm: 'A', partner: 'R', learner: 'I' },
        { name: 'Complete coursework',        academy: 'I', psm: 'I', partner: 'A', learner: 'R' },
        { name: 'Track delivery readiness',   academy: 'I', psm: 'R', partner: 'A', learner: 'C' },
        { name: 'Validate certification',     academy: 'R', psm: 'A', partner: 'C', learner: 'I' },
      ],
    },
  ];
</script>

<div
  class="scrubber-stage build3"
  onclick={handleMainClick}
  role="presentation"
  style="cursor:{buildStep < 14 ? 'pointer' : 'default'};"
>

  <!-- Layer 3: Achievements -->
  <div
    class="layer layer-outcomes"
    class:build-hidden={buildStep < 12}
    class:build-clickable-hidden={buildStep === 12}
    onclick={handleLayer3Click}
    style={buildStep === 12 ? 'cursor:pointer;' : ''}
  >
    <div class="side-label" style="background:#b74a0c;">
      <div class="sl-num">Layer 3</div>
      <div class="sl-name">Achievements</div>
      <div class="sl-desc">Designations &amp; recognition</div>
    </div>
    <div class="layer-body">
      {#if buildStep === 13}
        <!-- Step 14: 3 featured achievements as drop targets -->
        <div class="build-mini-journeys">
          {#each featuredAchievements as ach (ach.id)}
            <div
              class="build-ach-featured build-ach-drop-zone"
              class:drop-active={dragData !== null}
              data-achid={ach.id}
              ondragover={onDragOver}
              ondrop={(e) => onDropAchievement(e, ach.id)}
            >
              <div class="build-ach-feat-icon">{ach.icon}</div>
              <div class="build-ach-feat-title">{ach.title}</div>
              <div class="build-ach-feat-sub">{ach.sub}</div>
              {#if achievementDrops.filter(d => d.target === ach.id).length > 0}
                <div class="build-ach-drops">
                  {#each achievementDrops.filter(d => d.target === ach.id) as drop}
                    <div class="build-ach-drop-chip">{drop.name}</div>
                  {/each}
                </div>
              {:else}
                <div class="build-ach-drop-hint">Drag journeys here</div>
              {/if}
            </div>
          {/each}
        </div>
      {:else if buildStep >= 14}
        <!-- Step 15: all achievements -->
        <div class="build-mini-journeys">
          {#each allAchievements as ach (ach.id)}
            <div
              class="build-ach-card-v2 build-ach-drop-zone"
              class:drop-active={dragData !== null}
              data-achid={ach.id}
              ondragover={onDragOver}
              ondrop={(e) => onDropAchievement(e, ach.id)}
            >
              <div class="build-ach-v2-icon">{ach.icon}</div>
              <div class="build-ach-v2-title">{ach.title}</div>
              <div class="build-ach-v2-sub">{ach.sub}</div>
              {#if achievementDrops.filter(d => d.target === ach.id).length > 0}
                <div class="build-ach-drops">
                  {#each achievementDrops.filter(d => d.target === ach.id) as drop}
                    <div class="build-ach-drop-chip">{drop.name}</div>
                  {/each}
                </div>
              {/if}
            </div>
          {/each}
          <div class="build-ach-card-v2 ach-more">
            <div class="build-ach-v2-icon">+</div>
            <div class="build-ach-v2-title">More</div>
            <div class="build-ach-v2-sub">Additional achievements coming soon</div>
          </div>
        </div>
      {:else}
        <div class="empty-row-text">Designations earned through completed journeys and enablement</div>
      {/if}
    </div>
  </div>

  <!-- Layer 1: Enablement Assets -->
  <div class="layer layer-assets" class:build-hidden={buildStep < 1}>
    <div class="side-label">
      <div class="sl-num">Layer 1</div>
      <div class="sl-name">Enablement Assets</div>
      <div class="sl-desc">Courses, workshops &amp; engagements</div>
    </div>
    <div class="layer-body">
      <div class="assets-row">
        <div class="asset-col sp" class:build-hidden={buildStep < 2}>
          <h4>Digital Learning</h4>
          <button class="raci-trigger" onclick={(e) => { e.stopPropagation(); showRaci = true; }}>
            <span class="raci-trigger-icon">⊞</span>
            <span>RACI Matrix</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="scrubber-strip" style="pointer-events:none;">
    <div class="scrubber-strip-head"><div class="scrubber-current-label">&nbsp;</div></div>
    <div style="height:56px;"></div>
  </div>

  {#if buildStep < 9}
    <div class="build-hint">
      {#if buildStep > 0}<button class="build-back" onclick={handleBack}>← Back</button>{/if}
      Click anywhere to continue · Step {buildStep + 1} of 15
    </div>
  {:else if buildStep === 9}
    <div class="build-hint">
      <button class="build-back" onclick={handleBack}>← Back</button>
      Click anywhere to continue · Step {buildStep + 1} of 15
    </div>
  {:else if buildStep >= 10 && buildStep <= 11}
    <div class="build-hint">
      <button class="build-back" onclick={handleBack}>← Back</button>
      Click anywhere to continue · Step {buildStep + 1} of 15
    </div>
  {:else if buildStep === 12}
    <div class="build-hint">
      <button class="build-back" onclick={handleBack}>← Back</button>
      Same application — three distinct journeys by role · Click above to continue · Step {buildStep + 1} of 15
    </div>
  {:else if buildStep === 13}
    <div class="build-hint build-hint-done" style="animation:none;">
      <button class="build-back" onclick={handleBack}>← Back</button>
      Drag journeys to achievement cards · Click to reveal all achievements · Step {buildStep + 1} of 15
      <button class="build-reset" onclick={(e) => { e.stopPropagation(); reset(); }}>↺ Replay</button>
    </div>
  {:else}
    <div class="build-hint build-hint-done">
      <button class="build-back" onclick={handleBack}>← Back</button>
      Framework complete · Press → to advance · Step {buildStep + 1} of 15
      <button class="build-reset" onclick={(e) => { e.stopPropagation(); reset(); }}>↺ Replay</button>
    </div>
  {/if}

  <!-- RACI overlay -->
  {#if showRaci}
    <div class="raci-overlay" onclick={(e) => { e.stopPropagation(); showRaci = false; }} role="dialog">
      <div class="raci-panel" onclick={(e) => e.stopPropagation()}>
        <div class="raci-panel-head">
          <div class="raci-panel-title">Digital Learning — RACI Matrix</div>
          <button class="raci-close" onclick={(e) => { e.stopPropagation(); showRaci = false; }}>✕ Close</button>
        </div>
        <div class="raci-cards">
          {#each raciTracks as track}
            <div class="raci-card">
              <div class="raci-card-head" style="background:{track.color};">
                <span class="raci-card-icon">{track.icon}</span>
                <div>
                  <div class="raci-card-name">{track.name}</div>
                  <div class="raci-card-sub">{track.sub}</div>
                </div>
              </div>
              <div class="raci-card-body">
                <table class="raci-table">
                  <thead>
                    <tr>
                      <th class="raci-th-act">Activity</th>
                      {#each track.stakeholders as s}<th class="raci-th-role">{s.label}</th>{/each}
                    </tr>
                  </thead>
                  <tbody>
                    {#each track.activities as act}
                      <tr>
                        <td class="raci-td-act">{act.name}</td>
                        {#each track.stakeholders as s}
                          {@const v = (act as Record<string,string>)[s.id] ?? ''}
                          <td class="raci-td-val" style="color:{raciColors[v]?.color};background:{raciColors[v]?.bg};">{v}</td>
                        {/each}
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}

</div>

<svg bind:this={connectorSvg} class="connectors-overlay" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"></svg>
<svg bind:this={achConnectorSvg} class="connectors-overlay" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"></svg>

<style>
  /* Keep Layer 1 at the same proportional height as when all 3 layers are present.
     Original flex totals: 1.1 + 1.15 + 1.4 = 3.65 → Layer 1 = 38.4% of height.
     Without Layer 2 (total 2.5) Layer 1 would expand to 56%. Pin it to ~38%
     by setting flex to 0.685 so it stays proportional with Layer 3's 1.1. */
  :global(.build3 .layer-assets) {
    flex: 0.685;
  }

  /* Pin Digital Learning column to the same 1/3 width it has alongside the other
     two columns on slide 30 — prevents it expanding to fill the row. */
  :global(.build3 .asset-col.sp) {
    flex: none;
    width: calc((100% - 20px) / 3);
  }

  /* RACI trigger button inside the Digital Learning card */
  :global(.build3 .raci-trigger) {
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 7px;
    background: #f0f4f8;
    border: 1.5px dashed #1A5276;
    border-radius: 6px;
    padding: 8px 12px;
    cursor: pointer;
    font-family: inherit;
    font-size: 11px;
    font-weight: 700;
    color: #1A5276;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    width: 100%;
    pointer-events: auto;
    transition: background 0.15s, border-color 0.15s;
  }
  :global(.build3 .raci-trigger:hover) {
    background: #dce8f0;
    border-color: #0a2f46;
    color: #0a2f46;
  }
  :global(.build3 .raci-trigger-icon) {
    font-size: 16px;
    line-height: 1;
  }

  /* RACI overlay */
  :global(.build3 .raci-overlay) {
    position: absolute;
    inset: 0;
    z-index: 30;
    background: rgba(10, 47, 70, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    pointer-events: auto;
  }
  :global(.build3 .raci-panel) {
    background: #f5f4f0;
    border-radius: 10px;
    overflow: hidden;
    width: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 40px rgba(0,0,0,0.3);
  }
  :global(.build3 .raci-panel-head) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    background: #0a2f46;
    flex-shrink: 0;
  }
  :global(.build3 .raci-panel-title) {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: white;
  }
  :global(.build3 .raci-close) {
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    color: white;
    padding: 4px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 11px;
    font-family: inherit;
    font-weight: 600;
    pointer-events: auto;
  }
  :global(.build3 .raci-close:hover) { background: rgba(255,255,255,0.22); }

  :global(.build3 .raci-cards) {
    display: flex;
    gap: 12px;
    padding: 14px;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }
  :global(.build3 .raci-card) {
    flex: 1;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
  :global(.build3 .raci-card-head) {
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }
  :global(.build3 .raci-card-icon) { font-size: 22px; }
  :global(.build3 .raci-card-name) {
    font-size: 18px;
    font-weight: 800;
    color: white;
    line-height: 1.1;
  }
  :global(.build3 .raci-card-sub) {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(255,255,255,0.6);
    margin-top: 2px;
  }
  :global(.build3 .raci-card-body) {
    flex: 1;
    overflow-y: auto;
    padding: 10px 12px;
  }
  :global(.build3 .raci-table) {
    width: 100%;
    border-collapse: collapse;
  }
  :global(.build3 .raci-th-act) {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #aaa;
    padding: 4px 6px 6px;
    border-bottom: 2px solid #eee;
    text-align: left;
  }
  :global(.build3 .raci-th-role) {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #aaa;
    padding: 4px 6px 6px;
    border-bottom: 2px solid #eee;
    text-align: center;
    white-space: nowrap;
  }
  :global(.build3 .raci-td-act) {
    font-size: 12px;
    color: #0a2f46;
    padding: 7px 6px;
    border-bottom: 1px solid #f0eeea;
    line-height: 1.3;
  }
  :global(.build3 .raci-td-val) {
    text-align: center;
    padding: 7px 6px;
    border-bottom: 1px solid #f0eeea;
    font-weight: 800;
    font-size: 12px;
    border-radius: 3px;
  }
</style>
