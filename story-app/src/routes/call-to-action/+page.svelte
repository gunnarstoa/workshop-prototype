<div class="cta-stage">

  <div class="cta-left">
    <div class="cta-eyebrow">Where we go from here</div>
    <div class="cta-title">What<br />Happens<br />Next</div>
    <div class="cta-rule"></div>
  </div>

  <div class="cta-right">
    <div class="cta-items">

      <div class="cta-item">
        <div class="cta-num">01</div>
        <div class="cta-body">
          <div class="cta-item-title" contenteditable="true" onkeydown={(e) => e.stopPropagation()}>Confirm Journey Ownership</div>
          <div class="cta-item-desc" contenteditable="true" onkeydown={(e) => e.stopPropagation()}>Each team leaves today with a clear owner assigned to every journey in scope — no ambiguity on who drives what.</div>
        </div>
      </div>

      <div class="cta-item">
        <div class="cta-num">02</div>
        <div class="cta-body">
          <div class="cta-item-title" contenteditable="true" onkeydown={(e) => e.stopPropagation()}>Agree on the RACI</div>
          <div class="cta-item-desc" contenteditable="true" onkeydown={(e) => e.stopPropagation()}>Cross-functional sign-off on the digital learning RACI — who creates, who approves, who maintains.</div>
        </div>
      </div>

      <div class="cta-item">
        <div class="cta-num">03</div>
        <div class="cta-body">
          <div class="cta-item-title" contenteditable="true" onkeydown={(e) => e.stopPropagation()}>Prioritise the First Wave</div>
          <div class="cta-item-desc" contenteditable="true" onkeydown={(e) => e.stopPropagation()}>Identify the top journeys to digitize first — quick wins that prove the model and build momentum.</div>
        </div>
      </div>

      <div class="cta-item">
        <div class="cta-num">04</div>
        <div class="cta-body">
          <div class="cta-item-title" contenteditable="true" onkeydown={(e) => e.stopPropagation()}>Schedule the Follow-Up</div>
          <div class="cta-item-desc" contenteditable="true" onkeydown={(e) => e.stopPropagation()}>Set the next Operating Committee date before you leave the room — keep the momentum from today alive.</div>
        </div>
      </div>

    </div>
  </div>

</div>

<style>
  .cta-stage {
    flex: 1;
    display: flex;
    align-items: stretch;
    overflow: hidden;
  }

  /* Left title panel */
  .cta-left {
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

  .cta-eyebrow {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.4);
  }

  .cta-title {
    font-size: 52px;
    font-weight: 800;
    color: white;
    line-height: 1.0;
    letter-spacing: -0.02em;
  }

  .cta-rule {
    width: 56px;
    height: 4px;
    background: #FF6100;
    border-radius: 2px;
    margin-top: 4px;
  }

  /* Right actions panel */
  .cta-right {
    flex: 1;
    background: #f5f4f0;
    display: flex;
    align-items: center;
    padding: 40px 52px;
  }

  .cta-items {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
  }

  .cta-item {
    display: flex;
    align-items: flex-start;
    gap: 24px;
  }

  .cta-num {
    font-size: 32px;
    font-weight: 800;
    color: #FF6100;
    line-height: 1;
    flex-shrink: 0;
    width: 44px;
    opacity: 0.85;
  }

  .cta-body {
    display: flex;
    flex-direction: column;
    gap: 4px;
    border-left: 2px solid #e0dbd4;
    padding-left: 20px;
    flex: 1;
  }

  .cta-item-title {
    font-size: 16px;
    font-weight: 800;
    color: #0a2f46;
    line-height: 1.2;
    outline: none;
    border-radius: 3px;
    padding: 1px 4px;
    cursor: text;
    transition: background 0.12s;
  }

  .cta-item-title:hover,
  .cta-item-title:focus { background: rgba(255,97,0,0.07); }

  .cta-item-desc {
    font-size: 13px;
    font-weight: 400;
    color: #555;
    line-height: 1.5;
    outline: none;
    border-radius: 3px;
    padding: 1px 4px;
    cursor: text;
    transition: background 0.12s;
  }

  .cta-item-desc:hover,
  .cta-item-desc:focus { background: rgba(255,97,0,0.07); }
</style>
