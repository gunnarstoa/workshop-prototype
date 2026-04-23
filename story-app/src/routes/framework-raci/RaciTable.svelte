<script lang="ts">
  export type RaciRow = { activity: string; r: string; a: string; c: string; i: string };
  let { title, rows, columns = ['R', 'A', 'C', 'I'] }: { title: string; rows: RaciRow[]; columns?: string[] } = $props();

  // Local mutable copy so edits don't propagate upstream
  let data = $state(rows.map(r => ({ ...r })));

  function stopPropagation(e: Event) {
    e.stopPropagation();
  }
</script>

<div class="rt-card">
  <div class="rt-title">{title}</div>
  <table class="rt-table">
    <thead>
      <tr>
        <th class="rt-th rt-th-task">Activity</th>
        <th class="rt-th rt-th-role">{columns[0]}</th>
        <th class="rt-th rt-th-role">{columns[1]}</th>
        <th class="rt-th rt-th-role">{columns[2]}</th>
        <th class="rt-th rt-th-role">{columns[3]}</th>
      </tr>
    </thead>
    <tbody>
      {#each data as row}
        <tr>
          <td
            class="rt-td rt-td-task rt-editable"
            contenteditable="true"
            onkeydown={stopPropagation}
            onclick={stopPropagation}
            bind:textContent={row.activity}
          ></td>
          <td
            class="rt-td rt-td-role r rt-editable"
            contenteditable="true"
            onkeydown={stopPropagation}
            onclick={stopPropagation}
            bind:textContent={row.r}
          ></td>
          <td
            class="rt-td rt-td-role a rt-editable"
            contenteditable="true"
            onkeydown={stopPropagation}
            onclick={stopPropagation}
            bind:textContent={row.a}
          ></td>
          <td
            class="rt-td rt-td-role c rt-editable"
            contenteditable="true"
            onkeydown={stopPropagation}
            onclick={stopPropagation}
            bind:textContent={row.c}
          ></td>
          <td
            class="rt-td rt-td-role i rt-editable"
            contenteditable="true"
            onkeydown={stopPropagation}
            onclick={stopPropagation}
            bind:textContent={row.i}
          ></td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .rt-card {
    width: 100%;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(2px);
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-top: 3px solid var(--color-orange);
    border-radius: 0 0 8px 8px;
    box-shadow: 0 2px 12px rgba(10, 47, 70, 0.1);
  }

  .rt-title {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-ink);
    padding: 5px 8px 4px;
    border-bottom: 1px solid var(--color-rule);
    background: rgba(242, 241, 238, 0.7);
  }

  .rt-table {
    width: 100%;
    border-collapse: collapse;
  }

  .rt-th {
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-muted);
    padding: 3px 5px;
    border-bottom: 1px solid var(--color-rule);
    background: rgba(242, 241, 238, 0.5);
  }

  .rt-th-task { text-align: left; width: 44%; }
  .rt-th-role { text-align: center; width: 14%; }

  .rt-td {
    padding: 3px 5px;
    border-bottom: 1px solid rgba(216, 214, 208, 0.4);
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
    font-weight: 600;
  }

  .rt-td.r { color: #1a5276; }
  .rt-td.a { color: #b74a0c; }
  .rt-td.c { color: #1a7a47; }
  .rt-td.i { color: #888; }

  .rt-editable:hover {
    background: rgba(255, 97, 0, 0.05);
    cursor: text;
  }

  .rt-editable:focus {
    background: rgba(255, 97, 0, 0.08);
    box-shadow: inset 0 0 0 1px rgba(255, 97, 0, 0.3);
  }

  tr:last-child .rt-td { border-bottom: none; }
</style>
