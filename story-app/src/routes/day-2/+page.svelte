<div class="d2-stage">

  <div class="d2-inner">
    <div class="d2-eyebrow">Workshop</div>
    <div class="d2-title">Day 2</div>
    <div class="d2-rule"></div>
    <div class="d2-sub" contenteditable="true" onkeydown={(e) => e.stopPropagation()}>Connected Enablement · Planning & Execution</div>
  </div>

  <div class="d2-corner">
    <div class="d2-date" contenteditable="true" onkeydown={(e) => e.stopPropagation()}>May 2025</div>
  </div>

</div>

<style>
  .d2-stage {
    flex: 1;
    background: #0a2f46;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .d2-stage::before {
    content: '';
    position: absolute;
    right: -80px;
    top: -80px;
    width: 480px;
    height: 480px;
    border-radius: 50%;
    border: 60px solid rgba(255, 97, 0, 0.07);
  }

  .d2-stage::after {
    content: '';
    position: absolute;
    right: 60px;
    bottom: -120px;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    border: 40px solid rgba(255, 97, 0, 0.05);
  }

  .d2-inner {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    z-index: 1;
  }

  .d2-eyebrow {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.4);
  }

  .d2-title {
    font-size: 120px;
    font-weight: 800;
    color: white;
    line-height: 0.9;
    letter-spacing: -0.04em;
  }

  .d2-rule {
    width: 72px;
    height: 5px;
    background: #FF6100;
    border-radius: 3px;
    margin-top: 4px;
  }

  .d2-sub {
    font-size: 18px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.6);
    letter-spacing: 0.01em;
    outline: none;
    border-radius: 3px;
    padding: 2px 4px;
    cursor: text;
    transition: background 0.12s;
  }

  .d2-sub:hover,
  .d2-sub:focus { background: rgba(255, 97, 0, 0.12); }

  .d2-corner {
    position: absolute;
    bottom: 36px;
    right: 48px;
  }

  .d2-date {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.25);
    outline: none;
    cursor: text;
  }

  .d2-date:hover,
  .d2-date:focus { color: rgba(255, 255, 255, 0.5); }
</style>
