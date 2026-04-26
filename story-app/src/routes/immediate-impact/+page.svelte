<script lang="ts">
  const cols = ['From (in-person)', 'To (virtual)', 'Impact'];

  let rows = $state(['IFP', 'SCM', 'RPM', 'AI', 'Forecaster', 'Platform/Polaris']);

  let from = $state([
    { people: '6',   cost: '$10k', sessions: '1' },
    { people: '5',   cost: '$13k', sessions: '1' },
    { people: '5',   cost: '$13k', sessions: '1' },
    { people: '0',   cost: '$0',   sessions: undefined },
    { people: '0',   cost: '$10k', sessions: undefined },
    { people: '0',   cost: '$10k', sessions: undefined },
  ]);

  let to = $state([
    { people: '45',  cost: '$0', sessions: '3' },
    { people: '28',  cost: '$0', sessions: '2' },
    { people: '20',  cost: '$0', sessions: '1' },
    { people: '166', cost: '$0', sessions: undefined },
    { people: '14',  cost: '$0', sessions: undefined },
    { people: '12',  cost: '$0', sessions: undefined },
  ]);

  let impact = $state([
    'Cost savings of $30k, increase reach',
    'Moved from planned in-person session to entirely virtual',
    'Moved from in-person to entirely virtual',
    'Increased reach, no cost',
    'Increased reach, no cost',
    'Increased reach, no cost',
  ]);

  function stop(e: Event) { e.stopPropagation(); }
</script>

<div class="ii-stage">

  <div class="ii-left">
    <div class="ii-eyebrow">Strategy</div>
    <div class="ii-title">Immediate<br />Impact</div>
    <div class="ii-rule"></div>
  </div>

  <div class="ii-right">
    <table class="ii-table">
      <thead>
        <tr>
          <th class="ii-th ii-th-empty"></th>
          {#each cols as col, ci}
            <th class="ii-th ii-th-col" class:ii-th-impact={ci === 2}>{col}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each rows as _, ri}
          <tr>
            <td
              class="ii-td ii-td-row"
              contenteditable="true"
              onkeydown={stop}
              onclick={stop}
              bind:textContent={rows[ri]}
            ></td>

            <!-- From -->
            <td class="ii-td ii-td-cell">
              <div class="ii-metric">
                <span class="ii-metric-label">People</span>
                <span class="ii-metric-val" contenteditable="true" onkeydown={stop} onclick={stop} bind:textContent={from[ri].people}></span>
              </div>
              <div class="ii-metric">
                <span class="ii-metric-label">Cost</span>
                <span class="ii-metric-val" contenteditable="true" onkeydown={stop} onclick={stop} bind:textContent={from[ri].cost}></span>
              </div>
              {#if from[ri].sessions !== undefined}
                <div class="ii-metric">
                  <span class="ii-metric-label">Sessions</span>
                  <span class="ii-metric-val" contenteditable="true" onkeydown={stop} onclick={stop} bind:textContent={from[ri].sessions}></span>
                </div>
              {/if}
            </td>

            <!-- To -->
            <td class="ii-td ii-td-cell">
              <div class="ii-metric">
                <span class="ii-metric-label">People</span>
                <span class="ii-metric-val" contenteditable="true" onkeydown={stop} onclick={stop} bind:textContent={to[ri].people}></span>
              </div>
              <div class="ii-metric">
                <span class="ii-metric-label">Cost</span>
                <span class="ii-metric-val" contenteditable="true" onkeydown={stop} onclick={stop} bind:textContent={to[ri].cost}></span>
              </div>
              {#if to[ri].sessions !== undefined}
                <div class="ii-metric">
                  <span class="ii-metric-label">Sessions</span>
                  <span class="ii-metric-val" contenteditable="true" onkeydown={stop} onclick={stop} bind:textContent={to[ri].sessions}></span>
                </div>
              {/if}
            </td>

            <!-- Impact -->
            <td
              class="ii-td ii-td-cell ii-td-impact"
              contenteditable="true"
              onkeydown={stop}
              onclick={stop}
              bind:textContent={impact[ri]}
            ></td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

</div>

<style>
  .ii-stage {
    flex: 1;
    display: flex;
    align-items: stretch;
    overflow: hidden;
  }

  .ii-left {
    width: 32%;
    flex-shrink: 0;
    background: #0a2f46;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 40px 48px;
    gap: 14px;
  }

  .ii-eyebrow {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.4);
  }

  .ii-title {
    font-size: 52px;
    font-weight: 800;
    color: white;
    line-height: 1.0;
    letter-spacing: -0.02em;
  }

  .ii-rule {
    width: 56px;
    height: 4px;
    background: #FF6100;
    border-radius: 2px;
    margin-top: 4px;
  }

  .ii-participation {
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ii-participation-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.35);
  }

  .ii-participation-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .ii-participation-list li {
    font-size: 12px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.7);
    padding-left: 10px;
    position: relative;
  }

  .ii-participation-list li::before {
    content: '·';
    position: absolute;
    left: 0;
    color: #FF6100;
    font-weight: 800;
  }

  .ii-right {
    flex: 1;
    background: #f5f4f0;
    display: flex;
    align-items: center;
    padding: 40px 52px;
  }

  .ii-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  .ii-th {
    padding: 10px 16px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: white;
    background: #0a2f46;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .ii-th-empty  { width: 24%; }
  .ii-th-col    { width: 18%; }
  .ii-th-impact { width: 40%; text-align: left; padding-left: 20px; }

  .ii-td {
    border: 1px solid #e0dbd4;
    vertical-align: middle;
  }

  .ii-td-row {
    font-size: 14px;
    font-weight: 800;
    color: #0a2f46;
    background: rgba(10, 47, 70, 0.05);
    padding: 0 16px;
    text-align: left;
    border-right: 2px solid #e0dbd4;
    outline: none;
    cursor: text;
    height: 86px;
    white-space: nowrap;
  }

  .ii-td-cell {
    height: 86px;
    padding: 10px 16px;
    background: white;
    vertical-align: middle;
    transition: background 0.12s;
  }

  .ii-td-cell:hover  { background: rgba(255, 97, 0, 0.04); }

  .ii-td-impact {
    font-size: 13px;
    font-weight: 600;
    color: #FF6100;
    text-align: left;
    outline: none;
    cursor: text;
  }

  .ii-td-impact:focus { background: rgba(255, 97, 0, 0.08); box-shadow: inset 0 0 0 2px rgba(255, 97, 0, 0.3); position: relative; z-index: 1; }
  .ii-td-row:focus    { background: rgba(10, 47, 70, 0.09); }

  tr:last-child .ii-td { border-bottom: 2px solid #0a2f46; }

  /* ── Metric sub-rows ──────────────────────────────────────────────────── */
  .ii-metric {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  .ii-metric + .ii-metric {
    margin-top: 6px;
    padding-top: 6px;
    border-top: 1px solid #f0ece6;
  }

  .ii-metric-label {
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(10, 47, 70, 0.38);
    min-width: 60px;
    flex-shrink: 0;
  }

  .ii-metric-val {
    font-size: 14px;
    font-weight: 700;
    color: #0a2f46;
    outline: none;
    border-radius: 2px;
    padding: 0 3px;
    min-width: 16px;
    cursor: text;
    transition: background 0.12s;
  }

  .ii-metric-val:hover,
  .ii-metric-val:focus { background: rgba(255, 97, 0, 0.07); }
</style>
