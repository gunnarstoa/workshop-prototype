<script lang="ts">
  const roles = [
    { name: 'Charlie',           icon: '🧑‍💼', pos: 'tl' },
    { name: 'Partner',           icon: '🤝',   pos: 'tr' },
    { name: 'Sales Leadership',  icon: '🎯',   pos: 'bl' },
    { name: 'Delivery Leads',    icon: '🛠️',   pos: 'br' },
  ];
</script>

<div class="q-stage">
  <div class="q-orbit">

    {#each roles as role}
      <div class="q-role q-pos-{role.pos}">
        <span class="q-icon">{role.icon}</span>
        <span class="q-name">{role.name}</span>
      </div>
    {/each}

    <div class="q-center">
      <div class="q-eyebrow">Facilitation Prompt</div>
      <div class="q-title">Open for<br>Questions</div>
      <div class="q-hint">Hear from each voice<br>before moving on.</div>
    </div>

  </div>
</div>

<style>
  .q-stage {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 40px;
  }

  .q-orbit {
    display: grid;
    grid-template-columns: 1fr 280px 1fr;
    grid-template-rows: 1fr auto 1fr;
    gap: 28px;
    align-items: center;
    justify-items: center;
    width: 100%;
    max-width: 760px;
  }

  /* Center card */
  .q-center {
    grid-column: 2;
    grid-row: 2;
    background: white;
    border: 1px solid var(--color-rule);
    border-left: 5px solid var(--color-orange);
    border-radius: 0 12px 12px 0;
    padding: 28px 32px;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }

  .q-eyebrow {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--color-orange);
  }

  .q-title {
    font-size: 30px;
    font-weight: 700;
    color: var(--color-ink);
    letter-spacing: -0.01em;
    line-height: 1.2;
  }

  .q-hint {
    font-size: 12px;
    color: var(--color-muted);
    font-style: italic;
    line-height: 1.5;
  }

  /* Role cards */
  .q-role {
    background: white;
    border: 1px dashed var(--color-rule);
    border-radius: 14px;
    padding: 16px 22px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    min-width: 130px;
  }

  .q-icon {
    font-size: 28px;
    line-height: 1;
  }

  .q-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-muted);
    letter-spacing: 0.02em;
    text-align: center;
  }

  /* Corner positions */
  .q-pos-tl { grid-column: 1; grid-row: 1; }
  .q-pos-tr { grid-column: 3; grid-row: 1; }
  .q-pos-bl { grid-column: 1; grid-row: 3; }
  .q-pos-br { grid-column: 3; grid-row: 3; }
</style>
