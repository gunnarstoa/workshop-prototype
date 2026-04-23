<script lang="ts">
  const rows = ['Identify', 'Create', 'Certify', 'Distribute'];
  const cols = ['GTM Enablement', 'Pre-Sales', 'Academy/PS/CoE'];

  let cells = $state([
    ['',  '',  ''  ],  // Identify
    ['★', '★', '★' ],  // Create
    ['',  '',  '★' ],  // Certify
    ['★', '★', ''  ],  // Distribute
  ]);

  function stop(e: Event) { e.stopPropagation(); }
</script>

<div class="am-stage">

  <div class="am-left">
    <div class="am-eyebrow">Activity × Role</div>
    <div class="am-title">Who<br />Does<br />What</div>
    <div class="am-rule"></div>
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
    flex: 1;
    display: flex;
    align-items: stretch;
    overflow: hidden;
  }

  /* ── Left title panel — matches .cta-left ─────────────────────────────── */
  .am-left {
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

  .am-eyebrow {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.4);
  }

  .am-title {
    font-size: 52px;
    font-weight: 800;
    color: white;
    line-height: 1.0;
    letter-spacing: -0.02em;
  }

  .am-rule {
    width: 56px;
    height: 4px;
    background: #FF6100;
    border-radius: 2px;
    margin-top: 4px;
  }

  /* ── Right panel — matches .cta-right ────────────────────────────────── */
  .am-right {
    flex: 1;
    background: #f5f4f0;
    display: flex;
    align-items: center;
    padding: 40px 52px;
  }

  /* ── Matrix table ─────────────────────────────────────────────────────── */
  .am-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  .am-th {
    padding: 12px 20px;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: white;
    background: #0a2f46;
    text-align: center;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .am-th-empty {
    width: 22%;
    background: #0a2f46;
  }

  .am-th-col {
    width: 26%;
  }

  .am-td {
    border: 1px solid #e0dbd4;
    vertical-align: middle;
  }

  .am-td-row {
    font-size: 16px;
    font-weight: 800;
    color: #0a2f46;
    background: rgba(10,47,70,0.05);
    padding: 0 24px;
    text-align: left;
    border-right: 2px solid #e0dbd4;
  }

  .am-td-cell {
    height: 110px;
    padding: 14px 20px;
    font-size: 36px;
    font-weight: 400;
    color: #FF6100;
    background: white;
    outline: none;
    cursor: text;
    line-height: 1;
    text-align: center;
    vertical-align: middle;
    transition: background 0.12s;
  }

  .am-td-cell:hover  { background: rgba(255,97,0,0.05); }
  .am-td-cell:focus  { background: rgba(255,97,0,0.08); box-shadow: inset 0 0 0 2px rgba(255,97,0,0.3); position: relative; z-index: 1; }

  tr:last-child .am-td { border-bottom: 2px solid #0a2f46; }
  thead tr th:first-child { border-top-left-radius: 0; }
</style>
