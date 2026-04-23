<div class="obj-stage">
  <div class="obj-header">
    <div class="obj-eyebrow">Workshop Objectives</div>
    <div class="obj-title">What we're here to accomplish</div>
  </div>

  <ol class="obj-list">
    <li class="obj-item">
      <span class="obj-num">1</span>
      <div class="obj-body">
        <div class="obj-text">Define from/to changes → future state</div>
        <div class="obj-sub">Sales · Presales · Delivery</div>
      </div>
    </li>
    <li class="obj-item">
      <span class="obj-num">2</span>
      <div class="obj-body">
        <div class="obj-text">Validate and prioritize initial journey maps and gaps</div>
      </div>
    </li>
    <li class="obj-item">
      <span class="obj-num">3</span>
      <div class="obj-body">
        <div class="obj-text">Prioritize cross-functional work for Day 2</div>
      </div>
    </li>
    <li class="obj-item">
      <span class="obj-num">4</span>
      <div class="obj-body">
        <div class="obj-text">Execute future state → steering and ops committee</div>
      </div>
    </li>
  </ol>
</div>

<style>
  .obj-stage {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 36px;
    padding: 40px 36px;
  }

  .obj-header {
    text-align: center;
  }

  .obj-eyebrow {
    font-size: 10px;
    font-weight: bold;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--color-orange);
    margin-bottom: 10px;
  }

  .obj-title {
    font-size: 28px;
    font-weight: bold;
    color: var(--color-ink);
    letter-spacing: -0.01em;
  }

  .obj-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    max-width: 680px;
  }

  .obj-item {
    display: flex;
    align-items: center;
    gap: 20px;
    background: white;
    border: 1px solid var(--color-rule);
    border-left: 4px solid var(--color-orange);
    border-radius: 0 10px 10px 0;
    padding: 18px 24px;
  }

  .obj-num {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--color-ink);
    color: white;
    font-size: 14px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .obj-body {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .obj-text {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-ink);
  }

  .obj-sub {
    font-size: 12px;
    color: var(--color-muted);
    letter-spacing: 0.04em;
  }
</style>
