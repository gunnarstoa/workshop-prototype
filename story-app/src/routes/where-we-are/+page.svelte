<div class="wwa-stage">
  <div class="wwa-card">
    <div class="wwa-heading">Here's where we are — and why we're here.</div>
    <ul class="wwa-list">
      <li>
        <div class="wwa-dot"></div>
        <div class="wwa-text">
          <span class="wwa-label">Proliferation of new products</span>
        </div>
      </li>
      <li>
        <div class="wwa-dot"></div>
        <div class="wwa-text">
          <span class="wwa-label">Lack of technical enablement</span>
        </div>
      </li>
      <li>
        <div class="wwa-dot"></div>
        <div class="wwa-text">
          <span class="wwa-label">Incorrect methodology</span>
        </div>
      </li>
      <li>
        <div class="wwa-dot"></div>
        <div class="wwa-text">
          <span class="wwa-label">On-the-job learning</span>
        </div>
      </li>
    </ul>
  </div>
</div>

<style>
  .wwa-stage {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    background: #f5f4f0;
  }

  .wwa-card {
    background: white;
    border-radius: 12px;
    border-top: 5px solid #FF6100;
    box-shadow: 0 4px 32px rgba(10, 47, 70, 0.10);
    padding: 48px 56px;
    max-width: 680px;
    width: 100%;
  }

  .wwa-heading {
    font-size: 24px;
    font-weight: 700;
    color: #0a2f46;
    margin-bottom: 36px;
    line-height: 1.25;
  }

  .wwa-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .wwa-list li {
    display: flex;
    align-items: center;
    gap: 18px;
  }

  .wwa-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #FF6100;
    flex-shrink: 0;
  }

  .wwa-label {
    font-size: 18px;
    font-weight: 600;
    color: #0a2f46;
  }
</style>
