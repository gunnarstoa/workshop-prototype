<script lang="ts">
  const rows = ['Identify', 'Create', 'Certify', 'Distribute'];
  const cols = ['Sales', 'Pre-Sales', 'Delivery'];

  let cells = $state(rows.map(() => cols.map(() => '')));

  function stop(e: Event) { e.stopPropagation(); }
</script>

<div class="am-stage">

  <div class="am-left">
    <div class="am-eyebrow">Activity × Role</div>
    <div class="am-title">Who<br />Does<br />What</div>
    <div class="am-rule"></div>
    <div class="am-hint">Click any cell to edit</div>
  </div>

  <div class="am-right">
    <table class="am-table">
      <thead>
        <tr>
          <th class="am-th am-th-empty"></th>
          {#each cols as col}
            <th class="am-th am-th-col">{col}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each rows as row, ri}
          <tr>
            <td class="am-td am-td-row">{row}</td>
            {#each cols as _, ci}
              <td
                class="am-td am-td-cell"
                contenteditable="true"
                onkeydown={stop}
                onclick={stop}
                bind:textContent={cells[ri][ci]}
              ></td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

</div>

<style>
  .am-stage {
    display: flex;
    height: 100%;
    gap: 0;
  }

  /* ── Left title panel ─────────────────────────────────────────────────── */
  .am-left {
    width: 220px;
    flex-shrink: 0;
    background: var(--color-navy);
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 40px 32px;
    gap: 12px;
  }

  .am-eyebrow {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.55);
  }

  .am-title {
    font-size: 40px;
    font-weight: 800;
    line-height: 1.05;
    color: #fff;
  }

  .am-rule {
    width: 40px;
    height: 3px;
    background: var(--color-orange);
    border-radius: 2px;
    margin: 4px 0;
  }

  .am-hint {
    font-size: 11px;
    color: rgba(255,255,255,0.35);
    margin-top: 8px;
  }

  /* ── Right matrix ─────────────────────────────────────────────────────── */
  .am-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 40px;
    background: var(--color-cream);
  }

  .am-table {
    width: 100%;
    max-width: 900px;
    border-collapse: collapse;
    table-layout: fixed;
  }

  /* Header row */
  .am-th {
    padding: 12px 16px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #fff;
    background: var(--color-navy);
    text-align: center;
    border: 1px solid rgba(255,255,255,0.12);
  }

  .am-th-empty {
    width: 20%;
    background: var(--color-navy);
  }

  .am-th-col {
    width: 26.6%;
  }

  /* Row label */
  .am-td-row {
    font-size: 15px;
    font-weight: 700;
    color: var(--color-navy);
    background: rgba(10,47,70,0.06);
    border: 1px solid var(--color-rule);
    padding: 0 20px;
    text-align: left;
    vertical-align: middle;
    letter-spacing: 0.02em;
  }

  /* Data cells */
  .am-td {
    border: 1px solid var(--color-rule);
    vertical-align: top;
  }

  .am-td-cell {
    height: 120px;
    padding: 14px 18px;
    font-size: 14px;
    color: var(--color-ink);
    background: #fff;
    outline: none;
    cursor: text;
    line-height: 1.5;
    transition: background 0.12s, box-shadow 0.12s;
    word-break: break-word;
  }

  .am-td-cell:hover {
    background: rgba(255,97,0,0.04);
  }

  .am-td-cell:focus {
    background: rgba(255,97,0,0.07);
    box-shadow: inset 0 0 0 2px rgba(255,97,0,0.35);
    z-index: 1;
    position: relative;
  }

  tr:last-child .am-td { border-bottom: 2px solid var(--color-navy); }
</style>
