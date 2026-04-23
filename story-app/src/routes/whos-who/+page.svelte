<div class="ww-stage">

  <div class="ww-left">
    <div class="ww-eyebrow">In the room today</div>
    <div class="ww-title">Who's<br />Who</div>
    <div class="ww-rule"></div>
  </div>

  <div class="ww-right">
    {#each [
      { name: 'Solutions Marketing',   icon: '📣' },
      { name: 'Solutions Consulting',  icon: '🔍' },
      { name: 'Release Management',    icon: '🚀' },
      { name: 'Alliances',             icon: '🤝' },
      { name: 'Professional Services', icon: '🛠' },
      { name: 'Academy',               icon: '🎓' },
      { name: 'CoE/Product',           icon: '⚙️' },
      { name: 'GTM Enablement',        icon: '🎯' },
    ] as team}
      <div class="ww-card">
        <span class="ww-icon">{team.icon}</span>
        <span class="ww-name">{team.name}</span>
      </div>
    {/each}
  </div>

</div>

<style>
  .ww-stage {
    flex: 1;
    display: flex;
    align-items: stretch;
    overflow: hidden;
  }

  /* Left: title panel */
  .ww-left {
    width: 36%;
    flex-shrink: 0;
    background: #0a2f46;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 52px 56px;
    gap: 16px;
  }

  .ww-eyebrow {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.4);
  }

  .ww-title {
    font-size: 52px;
    font-weight: 800;
    color: white;
    line-height: 1.05;
    letter-spacing: -0.02em;
  }

  .ww-rule {
    width: 56px;
    height: 4px;
    background: #FF6100;
    border-radius: 2px;
    margin-top: 4px;
  }

  /* Right: team grid */
  .ww-right {
    flex: 1;
    background: #f5f4f0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(4, 1fr);
    gap: 14px;
    padding: 28px 32px;
    align-content: stretch;
  }

  .ww-card {
    background: white;
    border-radius: 10px;
    border-left: 4px solid #FF6100;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 0 24px;
    box-shadow: 0 1px 6px rgba(10,47,70,0.07);
  }

  .ww-icon {
    font-size: 28px;
    flex-shrink: 0;
  }

  .ww-name {
    font-size: 18px;
    font-weight: 700;
    color: #0a2f46;
    line-height: 1.2;
  }
</style>
