<script lang="ts">
  const weeks = [
    { date: '5/1',  label: 'Defining Journey Lifecycle', count: 0  },
    { date: '5/8',  label: 'Set Operating Committee',    count: 0  },
    { date: '5/15', label: 'Platform Foundations',       count: 1  },
    { date: '5/22', label: 'Platform Foundations',       count: 3  },
    { date: '5/29', label: 'IFP',                        count: 6  },
    { date: '6/5',  label: 'AI Foundations',             count: 9  },
    { date: '6/12', label: 'Demand and Stat Planning',   count: 12 },
    { date: '6/19', label: 'Inventory Planning',         count: 15 },
    { date: '6/26', label: 'Demand Planning',            count: 18 },
    { date: '7/3',  label: 'MFP',                        count: 21 },
    { date: '7/10', label: 'OWP',                        count: 24 },
    { date: '7/17', label: 'T&Q',                        count: 27 },
    { date: '7/24', label: 'FCR',                        count: 30 },
    { date: '7/31', label: 'Final Testing',              count: 30 },
  ];

  const W = 860, H = 400;
  const ml = 52, mr = 16, mt = 100, mb = 44;
  const cw = W - ml - mr;
  const ch = H - mt - mb;
  const maxC = 33;
  const slotW = cw / weeks.length;
  const bw = slotW * 0.65;

  function bx(i: number) { return ml + i * slotW + (slotW - bw) / 2; }
  function by(c: number) { return mt + ch - (c / maxC) * ch; }
  function bh(c: number) { return (c / maxC) * ch; }
</script>

<div class="wb-stage">

  <div class="wb-left">
    <div class="wb-eyebrow">Planning</div>
    <div class="wb-title">Workback<br />Plan</div>
    <div class="wb-rule"></div>
  </div>

  <div class="wb-right">
    <svg viewBox="0 0 {W} {H}" class="wb-svg">

      <!-- Y-axis title -->
      <text
        x={14}
        y={mt + ch / 2}
        text-anchor="middle"
        dominant-baseline="middle"
        fill="rgba(10,47,70,0.4)"
        font-size="10"
        font-family="system-ui, sans-serif"
        font-weight="600"
        transform={`rotate(-90, 14, ${mt + ch / 2})`}
      >Journeys</text>

      <!-- Horizontal grid lines + Y-axis tick labels -->
      {#each [0, 11, 22, 33] as gc}
        {@const gy = by(gc)}
        <line
          x1={ml} y1={gy}
          x2={W - mr} y2={gy}
          stroke={gc === 0 ? 'rgba(10,47,70,0.35)' : 'rgba(10,47,70,0.1)'}
          stroke-width={gc === 0 ? 1.5 : 1}
          stroke-dasharray={gc === 0 ? '' : '4 4'}
        />
        <text
          x={ml - 8}
          y={gy}
          text-anchor="end"
          dominant-baseline="middle"
          fill="rgba(10,47,70,0.5)"
          font-size="11"
          font-family="system-ui, sans-serif"
        >{gc}</text>
      {/each}

      <!-- Bars and labels -->
      {#each weeks as d, i}
        {@const cx = bx(i) + bw / 2}
        {@const barTop = by(d.count)}
        {@const barHt = bh(d.count)}
        {@const labelY = d.count > 0 ? barTop - 7 : by(0) - 7}

        {#if d.count > 0}
          <rect
            x={bx(i)}
            y={barTop}
            width={bw}
            height={barHt}
            fill="#FF6100"
            rx="3"
          />
        {/if}
        {#if d.label}
          <text
            x={cx}
            y={labelY}
            text-anchor="start"
            dominant-baseline="auto"
            fill="rgba(10,47,70,0.72)"
            font-size="9.5"
            font-weight="600"
            font-family="system-ui, sans-serif"
            transform={`rotate(-45, ${cx}, ${labelY})`}
          >{d.label}</text>
        {/if}

        <!-- X-axis date label -->
        <text
          x={cx}
          y={mt + ch + 18}
          text-anchor="middle"
          fill={d.count === 0 ? 'rgba(10,47,70,0.28)' : 'rgba(10,47,70,0.6)'}
          font-size="10"
          font-family="system-ui, sans-serif"
        >{d.date}</text>
      {/each}

    </svg>
    <div class="wb-x-axis-label">Week of</div>
  </div>

</div>

<style>
  .wb-stage {
    flex: 1;
    display: flex;
    align-items: stretch;
    overflow: hidden;
  }

  .wb-left {
    width: 32%;
    flex-shrink: 0;
    background: #0a2f46;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 52px 56px;
    gap: 16px;
  }

  .wb-eyebrow {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.4);
  }

  .wb-title {
    font-size: 52px;
    font-weight: 800;
    color: white;
    line-height: 1.0;
    letter-spacing: -0.02em;
  }

  .wb-rule {
    width: 56px;
    height: 4px;
    background: #FF6100;
    border-radius: 2px;
    margin-top: 4px;
  }

  .wb-right {
    flex: 1;
    background: #f5f4f0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    padding: 40px 52px 32px;
  }

  .wb-svg {
    width: 100%;
    height: auto;
    display: block;
  }

  .wb-x-axis-label {
    text-align: center;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(10, 47, 70, 0.35);
    margin-top: 2px;
  }
</style>
