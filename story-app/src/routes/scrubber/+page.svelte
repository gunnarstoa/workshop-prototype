<script lang="ts">
  import { framework, timeline } from '$lib/data';

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

  // ── Animated connector lines at month 5 ──────────────────────────────────
  // Draws curved SVG paths from the three asset columns up to the stages
  // of the visible journey card, with flowing dots — same pattern as the
  // original connected_enablement.html deck.
  let connectorsSvg: SVGSVGElement | undefined = $state();
  const CONNECTOR_TRIGGER_MONTH = 5;
  let connectorTimers: ReturnType<typeof setTimeout>[] = [];

  function clearConnectors() {
    if (!connectorsSvg) return;
    connectorsSvg.innerHTML = '';
    connectorTimers.forEach((t) => clearTimeout(t));
    connectorTimers = [];
  }

  function drawLine(
    svg: SVGSVGElement,
    fromEl: Element,
    toEl: Element,
    color: string,
    delay: string
  ) {
    const fR = fromEl.getBoundingClientRect();
    const tR = toEl.getBoundingClientRect();
    const x1 = fR.left + fR.width * 0.5;
    const y1 = fR.top + 2;
    const x2 = tR.left + tR.width * 0.5;
    const y2 = tR.bottom - 1;
    const dy = Math.abs(y1 - y2);
    const d = `M${x1},${y1} C${x1},${y1 - dy * 0.4} ${x2},${y2 + dy * 0.4} ${x2},${y2}`;

    // Low-opacity trail
    const trail = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    trail.setAttribute('d', d);
    trail.setAttribute('fill', 'none');
    trail.setAttribute('stroke', color);
    trail.setAttribute('stroke-width', '1.5');
    trail.setAttribute('stroke-opacity', '0.15');
    svg.appendChild(trail);

    // Animated dashed flow line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.setAttribute('d', d);
    line.setAttribute('fill', 'none');
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', '2');
    line.setAttribute('stroke-opacity', '0.75');
    line.setAttribute('stroke-dasharray', '7 5');
    line.style.animation = `flowUp 3.5s linear ${delay} infinite`;
    svg.appendChild(line);

    // Flowing dot
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('r', '4');
    dot.setAttribute('fill', color);
    dot.setAttribute('fill-opacity', '0.9');
    const am = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
    am.setAttribute('dur', '3.5s');
    am.setAttribute('begin', delay);
    am.setAttribute('repeatCount', 'indefinite');
    am.setAttribute('path', d);
    am.setAttribute('calcMode', 'linear');
    dot.appendChild(am);
    svg.appendChild(dot);
  }

  function drawConnectors() {
    if (!connectorsSvg) return;
    clearConnectors();

    const sp = document.querySelector('.asset-col.sp');
    const ilt = document.querySelector('.asset-col.ilt');
    const se = document.querySelector('.asset-col.se');
    const journey = document.querySelector('.journey-card-mini');
    if (!sp || !ilt || !se || !journey) return;

    const stages = journey.querySelectorAll('.jcs-mini');
    if (stages.length < 5) return;

    const svg = connectorsSvg;

    // Self-Paced (green) → Registered, Trained
    connectorTimers.push(
      setTimeout(() => {
        drawLine(svg, sp, stages[0], '#1A8A4A', '0s');
        drawLine(svg, sp, stages[1], '#1A8A4A', '0.8s');
      }, 400)
    );
    // Instructor-Led (blue) → Trained, Certified
    connectorTimers.push(
      setTimeout(() => {
        drawLine(svg, ilt, stages[1], '#1A5276', '0s');
        drawLine(svg, ilt, stages[2], '#1A5276', '0.8s');
      }, 2400)
    );
    // Specialist Engagements (amber) → Delivering, Expert
    connectorTimers.push(
      setTimeout(() => {
        drawLine(svg, se, stages[3], '#B7540F', '0s');
        drawLine(svg, se, stages[4], '#B7540F', '0.8s');
      }, 4400)
    );
  }

  // Trigger when currentMonth hits the connector month
  $effect(() => {
    if (currentMonth === CONNECTOR_TRIGGER_MONTH) {
      // Let Svelte render new asset items and journey card first
      const t = setTimeout(drawConnectors, 150);
      return () => {
        clearTimeout(t);
        clearConnectors();
      };
    } else {
      clearConnectors();
    }
  });

  // Redraw on resize so lines track the layout
  $effect(() => {
    function onResize() {
      if (currentMonth === CONNECTOR_TRIGGER_MONTH) drawConnectors();
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  });

  // Reactive filtering
  const visibleOutcomes = $derived(
    framework.outcomes.filter((o) => o.appearsAtMonth <= currentMonth)
  );
  const visibleJourneys = $derived(
    framework.journeys.filter((j) => j.appearsAtMonth <= currentMonth)
  );
  const visibleAssetItems = $derived((catId: string) => {
    const cat = framework.assets.find((a) => a.id === catId);
    if (!cat) return [];
    return cat.items.filter((i) => i.appearsAtMonth <= currentMonth);
  });

  const currentMonthData = $derived(timeline.months[currentMonth]);
  const markerX = $derived(padLeft + currentMonth * stepX);
</script>

<svelte:window onkeydown={onKeyDown} />

<div class="scrubber-stage">
  <!-- Layer 3: Outcomes -->
  <div class="layer layer-outcomes">
    <div class="side-label">
      <div class="sl-num">Layer 3</div>
      <div class="sl-name">Outcomes</div>
      <div class="sl-desc">Designations &amp; recognition</div>
    </div>
    <div class="layer-body">
      {#if visibleOutcomes.length === 0}
        <div class="empty-row-text">— No outcomes earned yet —</div>
      {:else}
        <div class="outcomes-row">
          {#each visibleOutcomes as o (o.id)}
            <div class="outcome-badge" class:champion={o.champion}>
              <div class="outcome-icon">{o.icon}</div>
              <div class="outcome-title">{o.title}</div>
              <div class="outcome-sub">{o.sub}</div>
            </div>
          {/each}
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
    </div>
    <div class="layer-body">
      {#if visibleJourneys.length === 0}
        <div class="empty-row-text">— No journeys started yet —</div>
      {:else}
        <div class="journeys-row">
          {#each visibleJourneys as j (j.id)}
            <div class="journey-card-mini {j.accent}">
              <div class="jc-product">{j.product}</div>
              <div class="jc-persona">{j.persona}</div>
              <div class="jc-stages-mini">
                {#each j.stages as stage}
                  <div class="jcs-mini">{stage}</div>
                {/each}
              </div>
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
    </div>
    <div class="layer-body">
      <div class="assets-row">
        {#each framework.assets as cat (cat.id)}
          {@const items = visibleAssetItems(cat.id)}
          <div class="asset-col {cat.accent}">
            <h4>{cat.name}</h4>
            <div class="asset-list">
              {#each items as item (item.name)}
                <div class="asset-item">{item.name}</div>
              {:else}
                <div class="asset-empty">— Nothing yet —</div>
              {/each}
            </div>
          </div>
        {/each}
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

      <!-- Month labels every 3 months -->
      {#each [0, 3, 6, 9, 12, 15, 18, 21, 24] as m}
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

<!-- Animated connector lines overlay — active only at month 5 -->
<svg
  bind:this={connectorsSvg}
  class="connectors-overlay"
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
></svg>
