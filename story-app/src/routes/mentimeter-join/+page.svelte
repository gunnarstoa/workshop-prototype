<script lang="ts">
  const DEFAULT_CODE = 'aluu6kyk3scp';
  const DEFAULT_URL  = 'https://www.menti.com/aluu6kyk3scp';
  const DEFAULT_QR   = '/mentimeter_qr_code.png';
  const STORAGE_KEY  = 'mentimeter_join_code';

  let code    = $state(DEFAULT_CODE);
  let saved   = $state(DEFAULT_CODE);
  let editing = $state(false);

  $effect(() => {
    if (typeof localStorage === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) { saved = stored; code = stored; }
  });

  function save() {
    const trimmed = code.trim();
    if (!trimmed) return;
    saved = trimmed;
    editing = false;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, trimmed);
    }
  }

  function clear() {
    saved = DEFAULT_CODE;
    code  = DEFAULT_CODE;
    editing = false;
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function handleKey(e: KeyboardEvent) {
    e.stopPropagation();
    if (e.key === 'Enter') save();
    if (e.key === 'Escape') { editing = false; }
  }

  // Use local QR image for the default code, generated otherwise
  function qrSrc(raw: string): string {
    if (raw.replace(/\s/g, '') === DEFAULT_CODE) return DEFAULT_QR;
    const joinUrl = `https://www.menti.com/${raw.replace(/\s/g, '')}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=12&data=${encodeURIComponent(joinUrl)}`;
  }

  function joinUrl(raw: string): string {
    if (raw.replace(/\s/g, '') === DEFAULT_CODE) return DEFAULT_URL;
    return `https://www.menti.com/${raw.replace(/\s/g, '')}`;
  }
</script>

<div class="mj-stage">
  {#if editing}
    <div class="mj-setup">
      <div class="mj-setup-card">
        <div class="mj-setup-title">Mentimeter Join Code</div>
        <div class="mj-setup-sub">Enter the voting code shown in your Mentimeter presentation.</div>
        <input
          class="mj-input"
          type="text"
          placeholder="e.g. 1234 5678 or alst4z2uwy"
          bind:value={code}
          onkeydown={handleKey}
        />
        <div class="mj-setup-actions">
          <button class="mj-btn mj-btn-primary" onclick={save} disabled={!code.trim()}>Save</button>
          {#if saved}
            <button class="mj-btn mj-btn-secondary" onclick={() => editing = false}>Cancel</button>
          {/if}
        </div>
      </div>
    </div>

  {:else}
    <div class="mj-display">
      <div class="mj-qr-wrap">
        <img class="mj-qr" src={qrSrc(saved)} alt="Mentimeter QR Code" />
      </div>
      <div class="mj-info">
        <div class="mj-go-to">Go to</div>
        <div class="mj-url">menti.com</div>
        <div class="mj-or">or scan the QR code</div>
        <div class="mj-join-url">{joinUrl(saved)}</div>
        <div class="mj-code-label">Enter code</div>
        <div class="mj-code">{saved}</div>
      </div>
    </div>
    <div class="mj-toolbar">
      <button class="mj-tool-btn" onclick={() => { editing = true; }}>✎ Edit code</button>
      <button class="mj-tool-btn mj-tool-btn-clear" onclick={clear}>✕ Clear</button>
    </div>
  {/if}
</div>

<style>
  .mj-stage {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    background: #0a2f46;
  }

  /* ── Setup ── */
  .mj-setup {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
  }

  .mj-setup-card {
    background: white;
    border-radius: 10px;
    border-top: 4px solid #FF6100;
    padding: 32px 36px;
    max-width: 440px;
    width: 100%;
    box-shadow: 0 8px 40px rgba(0,0,0,0.3);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .mj-setup-title {
    font-size: 17px;
    font-weight: 700;
    color: #0a2f46;
  }

  .mj-setup-sub {
    font-size: 12px;
    color: #666;
    line-height: 1.5;
  }

  .mj-input {
    font-family: monospace;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 0.06em;
    border: 1.5px solid #d0cdc8;
    border-radius: 6px;
    padding: 10px 14px;
    outline: none;
    color: #0a2f46;
    text-align: center;
  }
  .mj-input:focus { border-color: #FF6100; box-shadow: 0 0 0 2px rgba(255,97,0,0.15); }

  .mj-setup-actions { display: flex; gap: 10px; }

  .mj-btn {
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    padding: 8px 22px;
    border-radius: 5px;
    cursor: pointer;
    border: none;
  }
  .mj-btn-primary { background: #FF6100; color: white; }
  .mj-btn-primary:hover:not(:disabled) { background: #e05500; }
  .mj-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
  .mj-btn-secondary { background: #f0ede8; color: #555; }
  .mj-btn-secondary:hover { background: #e8e4de; }

  /* ── Display ── */
  .mj-display {
    flex: 1;
    min-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 72px;
    padding: 40px;
  }

  .mj-qr-wrap {
    background: white;
    border-radius: 16px;
    padding: 12px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.4);
    flex-shrink: 0;
  }

  .mj-qr {
    display: block;
    width: 260px;
    height: 260px;
    border-radius: 4px;
  }

  .mj-info {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .mj-go-to {
    font-size: 22px;
    font-weight: 500;
    color: rgba(255,255,255,0.55);
    letter-spacing: 0.02em;
  }

  .mj-url {
    font-size: 54px;
    font-weight: 800;
    color: white;
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .mj-or {
    font-size: 14px;
    color: rgba(255,255,255,0.4);
    margin-bottom: 4px;
  }

  .mj-join-url {
    font-size: 13px;
    color: rgba(255,255,255,0.5);
    font-family: monospace;
    margin-bottom: 16px;
    letter-spacing: 0.02em;
  }

  .mj-code-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.4);
  }

  .mj-code {
    font-size: 56px;
    font-weight: 800;
    color: #FF6100;
    letter-spacing: 0.06em;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  /* ── Toolbar ── */
  .mj-toolbar {
    flex-shrink: 0;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 6px 12px;
    background: rgba(0,0,0,0.3);
  }

  .mj-tool-btn {
    font-family: inherit;
    font-size: 10px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 3px;
    cursor: pointer;
    border: 1px solid rgba(255,255,255,0.2);
    background: rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.6);
    transition: background 0.12s;
  }
  .mj-tool-btn:hover { background: rgba(255,255,255,0.18); color: white; }
  .mj-tool-btn-clear:hover { background: rgba(153,27,27,0.5); border-color: #991B1B; }
</style>
