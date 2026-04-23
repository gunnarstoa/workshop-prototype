<div class="wwn-stage">

  <div class="wwn-panel wwn-panel-left">
    <div class="wwn-eyebrow">Your contribution</div>
    <div class="wwn-heading">What do we need<br />from you?</div>
    <div class="wwn-rule"></div>
    <ul class="wwn-list">
      <li class="wwn-item"><span class="wwn-dot wwn-dot-left"></span><span class="wwn-text" contenteditable="true" onkeydown={(e) => e.stopPropagation()}>Active participation in defining journey ownership and RACI accountability</span></li>
      <li class="wwn-item"><span class="wwn-dot wwn-dot-left"></span><span class="wwn-text" contenteditable="true" onkeydown={(e) => e.stopPropagation()}>Cross-functional commitment to content reviews, sign-off, and quality standards</span></li>
      <li class="wwn-item"><span class="wwn-dot wwn-dot-left"></span><span class="wwn-text" contenteditable="true" onkeydown={(e) => e.stopPropagation()}>Alignment on priorities before we scale enablement delivery</span></li>
    </ul>
  </div>

  <div class="wwn-divider"></div>

  <div class="wwn-panel wwn-panel-right">
    <div class="wwn-eyebrow">Your return</div>
    <div class="wwn-heading">What's in this<br />for us?</div>
    <div class="wwn-rule wwn-rule-right"></div>
    <ul class="wwn-list">
      <li class="wwn-item"><span class="wwn-dot wwn-dot-right"></span><span class="wwn-text" contenteditable="true" onkeydown={(e) => e.stopPropagation()}>A digital and scalable enablement model that reduces reliance on human bandwidth and ad-hoc delivery</span></li>
      <li class="wwn-item"><span class="wwn-dot wwn-dot-right"></span><span class="wwn-text" contenteditable="true" onkeydown={(e) => e.stopPropagation()}>Consistent partner capability across all roles, products, and regions</span></li>
      <li class="wwn-item"><span class="wwn-dot wwn-dot-right"></span><span class="wwn-text" contenteditable="true" onkeydown={(e) => e.stopPropagation()}>Measurable outcomes tied to pipeline generation, win rate, and delivery quality</span></li>
    </ul>
  </div>

</div>

<style>
  .wwn-stage {
    flex: 1;
    display: flex;
    align-items: stretch;
    overflow: hidden;
  }

  .wwn-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 52px 56px;
    gap: 16px;
  }

  .wwn-panel-left  { background: #0a2f46; }
  .wwn-panel-right { background: #f5f4f0; }

  .wwn-eyebrow {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
  .wwn-panel-left  .wwn-eyebrow { color: rgba(255,255,255,0.45); }
  .wwn-panel-right .wwn-eyebrow { color: #FF6100; }

  .wwn-heading {
    font-size: 36px;
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.01em;
  }
  .wwn-panel-left  .wwn-heading { color: white; }
  .wwn-panel-right .wwn-heading { color: #0a2f46; }

  .wwn-rule {
    width: 48px;
    height: 4px;
    border-radius: 2px;
    background: #FF6100;
    margin-bottom: 4px;
  }

  .wwn-divider {
    width: 1px;
    background: rgba(255,255,255,0.12);
    flex-shrink: 0;
  }

  .wwn-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .wwn-item {
    display: flex;
    align-items: flex-start;
    gap: 14px;
  }

  .wwn-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 5px;
  }
  .wwn-dot-left  { background: #FF6100; }
  .wwn-dot-right { background: #0a2f46; }

  .wwn-text {
    font-size: 15px;
    font-weight: 500;
    line-height: 1.45;
    outline: none;
    cursor: text;
    border-radius: 3px;
    padding: 1px 4px;
    transition: background 0.12s;
  }
  .wwn-panel-left  .wwn-text { color: rgba(255,255,255,0.85); }
  .wwn-panel-right .wwn-text { color: #0a2f46; }

  .wwn-panel-left  .wwn-text:hover,
  .wwn-panel-left  .wwn-text:focus { background: rgba(255,255,255,0.08); }
  .wwn-panel-right .wwn-text:hover,
  .wwn-panel-right .wwn-text:focus { background: rgba(255,97,0,0.07); }
</style>
