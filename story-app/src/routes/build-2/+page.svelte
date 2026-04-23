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
  let buildStep = $state(0);

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
    { id: 'sc-agent-launch', product: 'AI · Supply Chain Agent', persona: 'Launch Partner', accent: 'ai', isIFP: false },
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
</script>

<div
  class="scrubber-stage"
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

  <!-- Layer 2: Journeys -->
  <div class="layer layer-journeys" class:build-hidden={buildStep < 8}>
    <div class="side-label">
      <div class="sl-num">Layer 2</div>
      <div class="sl-name">Journeys</div>
      <div class="sl-desc">Role &amp; product paths</div>
    </div>
    <div class="layer-body">
      {#if buildStep === 8}
        <div class="empty-row-text">Role-based paths that sequence assets into progression journeys</div>
      {:else if buildStep === 9}
        <div class="build-journey-wrap">
          <div class="build-journey-card">
            <div class="build-journey-header">
              <div class="build-journey-pip"></div>
              <div>
                <div class="build-journey-product">Finance · Integrated Financial Planning</div>
                <div class="build-journey-persona">Delivery Resource</div>
              </div>
            </div>
            <div class="build-journey-stages">
              {#each ['Registered', 'Trained', 'Experienced', 'Delivering', 'Expert'] as stage, i}
                <div class="build-jcs build-drop-stage" class:drop-active={dragData !== null}
                  ondragover={onDragOver} ondrop={(e) => onDropStage(e, i)}>{stage}
                  {#if stageDrops()[i]}<span class="build-drop-count">{stageDrops()[i].length}</span>{/if}
                </div>
              {/each}
            </div>
            {#if droppedItems.length > 0}
              <div class="build-dropped-grid">
                {#each [0,1,2,3,4] as i}
                  <div class="build-dropped-col">
                    {#each stageDrops()[i] || [] as item}
                      <div class="build-dropped-chip" style="border-left-color:{stageColors[item.sourceType]};">{item.name}</div>
                    {/each}
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </div>
      {:else if buildStep >= 10}
        <div class="build-mini-journeys">
          {#each miniJourneys as j (j.id)}
            {@const isOriginal = j.id === 'ifp-delivery'}
            {@const isVisible = (buildStep === 10 && isOriginal) || buildStep >= 11}
            <div
              class="build-mini-card {j.accent}"
              class:build-hidden={!isVisible}
              class:highlight={buildStep === 12 && j.isIFP}
              class:dimmed={buildStep === 12 && !j.isIFP}
              draggable={buildStep >= 13 ? 'true' : 'false'}
              class:draggable={buildStep >= 13}
              ondragstart={(e) => onDragStart(e, j.product + ' — ' + j.persona, 'journey-' + j.accent)}
            >
              <div class="build-mini-product">{j.product}</div>
              <div class="build-mini-persona">{j.persona}</div>
            </div>
          {/each}
        </div>
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
          {#if buildStep >= 3}
            <div class="build-courses">
              {#each sortedCourses as course (course.uuid)}
                <div class="build-course-item build-drag-item" data-source="sp"
                  draggable={isDragMode ? 'true' : 'false'}
                  ondragstart={(e) => onDragStart(e, course.name, 'sp')}
                  class:draggable={isDragMode}
                  class:used={usedItemNames.has(course.name)}
                >{course.name}</div>
              {/each}
            </div>
          {:else}<div class="asset-empty">Self-paced courses in the library</div>{/if}
        </div>
        <div class="asset-col ilt" class:build-hidden={buildStep < 4}>
          <h4>Capstone Projects/Hands-On Workshops</h4>
          {#if buildStep >= 5}
            <div class="build-courses">
              {#each sortedWorkshops as ws (ws.id)}
                <div class="build-course-item build-drag-item" data-source="ilt"
                  draggable={isDragMode ? 'true' : 'false'}
                  ondragstart={(e) => onDragStart(e, ws.name, 'ilt')}
                  style="border-left-color:#1a5276;background:rgba(26,82,118,0.07);"
                  class:draggable={isDragMode}
                  class:used={usedItemNames.has(ws.name)}
                >{ws.name}</div>
              {/each}
            </div>
          {:else}<div class="asset-empty">PSM-led workshops and ILT sessions</div>{/if}
        </div>
        <div class="asset-col se" class:build-hidden={buildStep < 6}>
          <h4>Masterclass & Continuous Learning</h4>
          {#if buildStep >= 7}
            <div class="build-courses">
              {#each specialistEngagements as eng (eng.id)}
                <div class="build-course-item build-drag-item" data-source="se"
                  draggable={isDragMode ? 'true' : 'false'}
                  ondragstart={(e) => onDragStart(e, eng.name, 'se')}
                  style="border-left-color:#b7540f;background:rgba(183,84,15,0.07);"
                  class:draggable={isDragMode}
                  class:used={usedItemNames.has(eng.name)}
                >{eng.name}</div>
              {/each}
            </div>
          {:else}<div class="asset-empty">Delivery blueprints, reviews and SA pairings</div>{/if}
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
    <div class="build-hint build-hint-done" style="animation:none;">
      <button class="build-back" onclick={handleBack}>← Back</button>
      Drag assets into journey stages · Click to continue · Step {buildStep + 1} of 15
      <button class="build-reset" onclick={(e) => { e.stopPropagation(); reset(); }}>↺ Replay</button>
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
</div>

<svg bind:this={connectorSvg} class="connectors-overlay" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"></svg>
<svg bind:this={achConnectorSvg} class="connectors-overlay" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"></svg>
