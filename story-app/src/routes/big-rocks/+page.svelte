<div class="br-stage">
  <div class="br-header">
    <div class="br-eyebrow">Current State Friction</div>
    <div class="br-title">The Big Rocks</div>
  </div>

  <div class="br-grid">
    {#each items as item}
      <div class="br-item">{item}</div>
    {/each}
  </div>
</div>

<script lang="ts">
  const items = [
    'Blueprints/journeys are not flexible',
    'Content maturity/availability',
    'Good on delivery, not so good on presales',
    'Metrics',
    'Scale',
    'Ownership',
    'RACI on enablement',
    'Not self-serve',
    'Access control',
    'PSM = low value, high touch',
    'No reuse',
    'Everyone does everything',
    'People / change management',
  ];
</script>

<style>
  .br-stage {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 32px;
    padding: 36px;
  }

  .br-header {
    text-align: center;
  }

  .br-eyebrow {
    font-size: 10px;
    font-weight: bold;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--color-orange);
    margin-bottom: 10px;
  }

  .br-title {
    font-size: 28px;
    font-weight: bold;
    color: var(--color-ink);
    letter-spacing: -0.01em;
  }

  .br-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    width: 100%;
    max-width: 1000px;
  }

  .br-item {
    background: white;
    border: 1px solid var(--color-rule);
    border-top: 3px solid var(--color-ink);
    border-radius: 0 0 8px 8px;
    padding: 14px 16px;
    font-size: 13px;
    font-weight: 600;
    color: var(--color-ink);
    line-height: 1.4;
  }
</style>
