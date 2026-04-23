<script lang="ts">
  import { framework, timeline, academy, iltWorkshops, specialistEngagements } from '$lib/data';

  const totalMonths = timeline.months.length;
  const lastMonth = totalMonths - 1;

  let currentMonth = $state(0);
  let dragging = $state(false);

  // Marker strip geometry
  const stripW = 1200;
  const stripH = 56;
  const padLeft = 56;
  const padRight = 32;
  const axisY = 30;
  const labelY = 50;
  const innerW = stripW - padLeft - padRight;
  const stepX = innerW / lastMonth;

  let svgEl: SVGSVGElement | undefined = $state();

  function setMonthFromClientX(clientX: number) {
    if (!svgEl) return;
    const rect = svgEl.getBoundingClientRect();
    // With preserveAspectRatio="xMidYMid meet", the viewBox is scaled and centered
    // inside the element box, so we have to account for the scale and the offset.
    const scale = Math.min(rect.width / stripW, rect.height / stripH);
    const offsetX = (rect.width - stripW * scale) / 2;
    const xInViewBox = (clientX - rect.left - offsetX) / scale;
    const monthFloat = (xInViewBox - padLeft) / stepX;
    currentMonth = Math.max(0, Math.min(lastMonth, Math.round(monthFloat)));
  }

  function onPointerDown(e: PointerEvent) {
    dragging = true;
    const target = e.currentTarget as Element;
    target.setPointerCapture(e.pointerId);
    setMonthFromClientX(e.clientX);
  }

  function onPointerMove(e: PointerEvent) {
    if (!dragging) return;
    setMonthFromClientX(e.clientX);
  }

  function onPointerUp(e: PointerEvent) {
    dragging = false;
    const target = e.currentTarget as Element;
    if (target.hasPointerCapture(e.pointerId)) target.releasePointerCapture(e.pointerId);
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    if (e.key === 'Home') {
      currentMonth = 0;
      e.preventDefault();
    } else if (e.key === 'End') {
      currentMonth = lastMonth;
      e.preventDefault();
    }
  }

  // Reactive filtering
  const visibleOutcomes = $derived(
    framework.outcomes.filter((o) => o.appearsAtMonth <= currentMonth)
  );
  const visibleJourneys = $derived(
    framework.journeys.filter((j) => j.appearsAtMonth <= currentMonth)
  );

  // ── Asset reveal schedule across 12 months ───────────────────────────────
  // M0 starts blank. M1 jumps Academy to "most of the catalog" + 4 delivery
  // readiness workshops. Masterclass engagements don't appear until M2.
  // Academy grows to the full catalog by M4; ILT and Specialist keep growing
  // through M12 until each reaches the full library.
  const assetCountSchedule: Record<'academy' | 'ilt' | 'specialist', number[]> = {
    //          M0  M1  M2  M3  M4  M5  M6  M7  M8  M9  M10 M11 M12
    academy:  [  0, 48, 50, 52, 54, 54, 54, 54, 54, 54, 54, 54, 54 ],
    ilt:      [  0,  4,  7,  9, 11, 13, 14, 15, 16, 17, 18, 19, 20 ],
    specialist:[ 0,  0,  2,  4,  6,  8, 10, 12, 14, 16, 18, 20, 22 ]
  };

  // Curated reveal order so the right workshops/engagements appear first.
  const iltOrder = [
    'drw-ifp', 'drw-scm', 'drw-rpm', 'drw-wfp',              // M1: 4 DRWs
    'anaplan-way-apps', 'presales-workshop', 'drw-fcr',       // M2: +3
    'drw-polaris', 'model-building-l2',                        // M3: +2
    'gtm-finance', 'data-integration-workshop',                // M4: +2 (Finance)
    'forecaster-workshop', 'ux-design-workshop',               // M5: +2
    'discovery-workshop',                                      // M6: +1
    'comodeler-best-practices',                                // M7: +1
    'lifecycle-management',                                    // M8: +1
    'agent-studio-workshop',                                   // M9: +1
    'gtm-supply-chain',                                        // M10: +1
    'gtm-workforce',                                           // M11: +1
    'connected-planning-exec'                                  // M12: +1
  ];
  const specialistOrder = [
    'pre-project-content-review', 'project-kickoff',                                    // M2: 2
    'data-validation-reviews', 'mid-project-checkpoint',                                 // M3: +2
    'solution-design-review', 'performance-tuning-session',                              // M4: +2 (Finance)
    'go-live-readiness-review', 'post-go-live-health-check',                             // M5: +2
    'supervised-delivery-pairing', 'delivery-scorecard-review',                          // M6: +2
    'model-optimization-audit', 'extension-assessments',                                 // M7: +2
    'ux-design-review', 'integration-architecture-review',                               // M8: +2
    'polaris-model-review', 'beta-tester',                                               // M9: +2
    'app-led-workshop', 'cross-app-connected-planning',                                  // M10: +2
    'customer-discovery-coaching', 'competitive-response-clinic',                        // M11: +2
    'executive-briefing-prep', 'product-advisory-board'                                  // M12: +2
  ];

  const academyItems = $derived(
    academy.courses.slice(0, assetCountSchedule.academy[currentMonth] ?? 0)
  );
  const iltItems = $derived(
    iltOrder
      .slice(0, assetCountSchedule.ilt[currentMonth] ?? 0)
      .map((id) => iltWorkshops.find((w) => w.id === id))
      .filter((w): w is (typeof iltWorkshops)[number] => Boolean(w))
  );
  const specialistItems = $derived(
    specialistOrder
      .slice(0, assetCountSchedule.specialist[currentMonth] ?? 0)
      .map((id) => specialistEngagements.find((e) => e.id === id))
      .filter((e): e is (typeof specialistEngagements)[number] => Boolean(e))
  );

  const totalAssets = $derived(academyItems.length + iltItems.length + specialistItems.length);
  const totalAchievements = $derived(
    visibleOutcomes.length + (currentMonth >= lastMonth ? 1 : 0)
  );

  const currentMonthData = $derived(timeline.months[currentMonth]);
  const markerX = $derived(padLeft + currentMonth * stepX);
</script>

<svelte:window onkeydown={onKeyDown} />

<div class="scrubber-stage">
  <!-- Layer 3: Outcomes -->
  <div class="layer layer-outcomes">
    <div class="side-label">
      <div class="sl-num">Layer 3</div>
      <div class="sl-name">Achievements</div>
      <div class="sl-desc">Designations &amp; recognition</div>
      <div class="sl-total"><span class="sl-total-num">{totalAchievements}</span> <span class="sl-total-lbl">total</span></div>
    </div>
    <div class="layer-body">
      {#if visibleOutcomes.length === 0}
        <div class="empty-row-text">— No outcomes earned yet —</div>
      {:else}
        <div class="build-mini-journeys">
          {#each visibleOutcomes as o (o.id)}
            <div class="build-ach-card-v2">
              <div class="build-ach-v2-icon">{o.icon}</div>
              <div class="build-ach-v2-title">{o.title}</div>
              <div class="build-ach-v2-sub">{o.sub}</div>
            </div>
          {/each}
          {#if currentMonth >= lastMonth}
            <div class="build-ach-card-v2 ach-more">
              <div class="build-ach-v2-icon">+</div>
              <div class="build-ach-v2-title">More</div>
              <div class="build-ach-v2-sub">Additional achievements coming soon</div>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <!-- Layer 2: Journeys -->
  <div class="layer layer-journeys">
    <div class="side-label">
      <div class="sl-num">Layer 2</div>
      <div class="sl-name">Journeys</div>
      <div class="sl-desc">Role &amp; product paths</div>
      <div class="sl-total"><span class="sl-total-num">{visibleJourneys.length}</span> <span class="sl-total-lbl">total</span></div>
    </div>
    <div class="layer-body">
      {#if visibleJourneys.length === 0}
        <div class="empty-row-text">— No journeys started yet —</div>
      {:else}
        <div class="build-mini-journeys">
          {#each visibleJourneys as j (j.id)}
            <div class="build-mini-card {j.accent}">
              <div class="build-mini-product">{j.product}</div>
              <div class="build-mini-persona">{j.persona}</div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <!-- Layer 1: Enablement Assets -->
  <div class="layer layer-assets">
    <div class="side-label">
      <div class="sl-num">Layer 1</div>
      <div class="sl-name">Enablement Assets</div>
      <div class="sl-desc">Courses, workshops &amp; engagements</div>
      <div class="sl-total"><span class="sl-total-num">{totalAssets}</span> <span class="sl-total-lbl">total</span></div>
    </div>
    <div class="layer-body">
      <div class="assets-row">
        <div class="asset-col sp">
          <h4>
            <span>Digital Learning</span>
            <span class="asset-count">{academyItems.length}</span>
          </h4>
          <div class="asset-list">
            {#each academyItems as item (item.uuid)}
              <div class="asset-item">{item.name}</div>
            {:else}
              <div class="asset-empty">— Nothing yet —</div>
            {/each}
          </div>
        </div>
        <div class="asset-col ilt">
          <h4>
            <span>Capstone Projects/Hands-On Workshops</span>
            <span class="asset-count">{iltItems.length}</span>
          </h4>
          <div class="asset-list">
            {#each iltItems as item (item.id)}
              <div class="asset-item">{item.name}</div>
            {:else}
              <div class="asset-empty">— Nothing yet —</div>
            {/each}
          </div>
        </div>
        <div class="asset-col se">
          <h4>
            <span>Masterclass & Continuous Learning</span>
            <span class="asset-count">{specialistItems.length}</span>
          </h4>
          <div class="asset-list">
            {#each specialistItems as item (item.id)}
              <div class="asset-item">{item.name}</div>
            {:else}
              <div class="asset-empty">— Nothing yet —</div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Bottom marker strip -->
  <div class="scrubber-strip">
    <div class="scrubber-strip-head">
      <div class="scrubber-current-label">{currentMonthData?.label} &nbsp;·&nbsp; Month {currentMonth} of {lastMonth}</div>
      <div class="scrubber-current-meta">Drag the marker or click anywhere on the axis</div>
    </div>
    <svg
      bind:this={svgEl}
      class="scrubber-svg"
      viewBox="0 0 {stripW} {stripH}"
      preserveAspectRatio="xMidYMid meet"
    >
      <!-- The x-axis line, drawn thick -->
      <line
        x1={padLeft}
        x2={stripW - padRight}
        y1={axisY}
        y2={axisY}
        stroke="#0a2f46"
        stroke-width="3"
      />

      <!-- Tick marks for every month -->
      {#each Array(totalMonths) as _, i}
        <line
          x1={padLeft + i * stepX}
          x2={padLeft + i * stepX}
          y1={axisY - 5}
          y2={axisY + 5}
          stroke="#0a2f46"
          stroke-width={i % 3 === 0 ? 1.5 : 0.8}
          opacity={i % 3 === 0 ? 0.9 : 0.5}
        />
      {/each}

      <!-- Month labels every 2 months -->
      {#each [0, 2, 4, 6, 8, 10, 12] as m}
        <text
          x={padLeft + m * stepX}
          y={labelY}
          text-anchor="middle"
          font-size="10"
          fill="#888"
          font-family="Arial"
        >
          M{m}
        </text>
      {/each}

      <!-- Hit area for clicks/drags -->
      <rect
        x={padLeft - 12}
        y={axisY - 22}
        width={innerW + 24}
        height={44}
        fill="transparent"
        style="cursor: {dragging ? 'grabbing' : 'grab'};"
        onpointerdown={onPointerDown}
        onpointermove={onPointerMove}
        onpointerup={onPointerUp}
        onpointercancel={onPointerUp}
        role="slider"
        aria-valuenow={currentMonth}
        aria-valuemin={0}
        aria-valuemax={lastMonth}
        aria-label="Timeline marker"
        tabindex="0"
      />

      <!-- The draggable marker -->
      <g transform="translate({markerX}, {axisY})" style="pointer-events: none;">
        <ellipse cx="0" cy="14" rx="11" ry="2.5" fill="rgba(0,0,0,0.2)" />
        <path d="M 0,-14 L 9,-2 L -9,-2 Z" fill="#FF6100" />
        <circle cx="0" cy="0" r="13" fill="#FF6100" stroke="white" stroke-width="3" />
        <text
          x="0"
          y="4"
          text-anchor="middle"
          font-size="11"
          font-weight="bold"
          fill="white"
          font-family="Arial"
        >
          {currentMonth}
        </text>
      </g>
    </svg>
  </div>
</div>

