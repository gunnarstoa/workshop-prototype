<script lang="ts">
  export type RoleRow = {
    activity: string;
    academy: string;
    psm: string;
    sales: string;
    presales: string;
    ps: string;
    gtm: string;
    product: string;
    solmktg: string;
  };

  let { title, rows }: { title: string; rows: RoleRow[] } = $props();

  let data = $state(rows.map(r => ({ ...r })));

  function stopPropagation(e: Event) { e.stopPropagation(); }

  function raciClass(val: string): string {
    const v = val.trim().toUpperCase();
    if (v === 'R') return 'rr';
    if (v === 'A') return 'ra';
    if (v === 'C') return 'rc';
    if (v === 'I') return 'ri';
    return '';
  }
</script>

<div class="rt-card">
  <div class="rt-title">{title}</div>
  <table class="rt-table">
    <thead>
      <tr>
        <th class="rt-th rt-th-task">Activity</th>
        <th class="rt-th rt-th-role">Academy</th>
        <th class="rt-th rt-th-role">PSM</th>
        <th class="rt-th rt-th-role">Sales</th>
        <th class="rt-th rt-th-role">Pre-Sales</th>
        <th class="rt-th rt-th-role">PS</th>
        <th class="rt-th rt-th-role">GTM Enablement</th>
        <th class="rt-th rt-th-role">Product / CoE</th>
        <th class="rt-th rt-th-role">Sol. Mktg</th>
      </tr>
    </thead>
    <tbody>
      {#each data as row}
        <tr>
          <td class="rt-td rt-td-task rt-editable" contenteditable="true"
              onkeydown={stopPropagation} onclick={stopPropagation}
              bind:textContent={row.activity}></td>
          {#each (['academy','psm','sales','presales','ps','gtm','product','solmktg'] as const) as key}
            <td class="rt-td rt-td-role rt-editable {raciClass(row[key])}"
                contenteditable="true"
                onkeydown={stopPropagation} onclick={stopPropagation}
                bind:textContent={row[key]}></td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .rt-card {
    width: 100%;
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(2px);
    border: 1px solid rgba(255,255,255,0.6);
    border-top: 3px solid var(--color-orange);
    border-radius: 0 0 8px 8px;
    box-shadow: 0 2px 12px rgba(10,47,70,0.1);
  }

  .rt-title {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-ink);
    padding: 5px 8px 4px;
    border-bottom: 1px solid var(--color-rule);
    background: rgba(242,241,238,0.7);
  }

  .rt-table {
    width: 100%;
    border-collapse: collapse;
  }

  .rt-th {
    font-size: 7.5px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-muted);
    padding: 3px 4px;
    border-bottom: 1px solid var(--color-rule);
    background: rgba(242,241,238,0.5);
  }

  .rt-th-task { text-align: left; width: 22%; }
  .rt-th-role { text-align: center; width: 9.75%; white-space: normal; line-height: 1.2; }

  .rt-td {
    padding: 3px 4px;
    border-bottom: 1px solid rgba(216,214,208,0.4);
    font-size: 9px;
    line-height: 1.3;
    outline: none;
  }

  .rt-td-task {
    color: var(--color-ink);
    font-weight: 500;
    border-right: 1px solid var(--color-rule);
  }

  .rt-td-role {
    text-align: center;
    font-size: 8px;
    font-weight: 700;
  }

  /* RACI value colours */
  .rt-td.rr { color: #1a5276; }
  .rt-td.ra { color: #b74a0c; }
  .rt-td.rc { color: #1a7a47; }
  .rt-td.ri { color: #888; }

  .rt-editable:hover  { background: rgba(255,97,0,0.05); cursor: text; }
  .rt-editable:focus  { background: rgba(255,97,0,0.08); box-shadow: inset 0 0 0 1px rgba(255,97,0,0.3); }

  tr:last-child .rt-td { border-bottom: none; }
</style>
