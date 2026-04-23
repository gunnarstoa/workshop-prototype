<script lang="ts">
  const STORAGE_KEY  = 'mentimeter_embed_url';
  const DEFAULT_URL  = 'https://www.mentimeter.com/app/presentation/al9c1d4v1a56vkxkox5twgittws77dhu/embed';

  let embedInput = $state('');
  let savedUrl   = $state(DEFAULT_URL);
  let editing    = $state(false);

  $effect(() => {
    if (typeof localStorage === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) { savedUrl = stored; }
    editing = false;
  });

  // Accept a full iframe embed code or a bare URL
  function extractUrl(raw: string): string {
    const srcMatch = raw.match(/src=["']([^"']+)["']/);
    if (srcMatch) return srcMatch[1];
    return raw.trim();
  }

  // Mentimeter embeds update live via WebSocket natively.
  // As a fallback, force-reload the iframe every 30s via src-reset
  // (contentWindow.location.reload is blocked cross-origin).
  const REFRESH_INTERVAL = 30_000;
  let frameEl = $state<HTMLIFrameElement | undefined>();

  $effect(() => {
    if (editing) return;
    const id = setInterval(() => {
      if (!frameEl) return;
      const src = frameEl.src;
      frameEl.src = '';
      frameEl.src = src;
    }, REFRESH_INTERVAL);
    return () => clearInterval(id);
  });

  function save() {
    const url = extractUrl(embedInput);
    if (!url) return;
    savedUrl = url;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, url);
    }
    editing = false;
  }

  function clear() {
    savedUrl   = '';
    embedInput = '';
    editing    = true;
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function startEdit() {
    embedInput = savedUrl;
    editing = true;
  }

  function handleKey(e: KeyboardEvent) {
    e.stopPropagation();
    if (e.key === 'Enter') save();
    if (e.key === 'Escape') { editing = false; }
  }
</script>

<div class="mm-stage">
  {#if editing}
    <!-- Input panel -->
    <div class="mm-setup">
      <div class="mm-setup-card">
        <div class="mm-setup-title">Mentimeter Survey Results</div>
        <div class="mm-setup-sub">
          Paste your Mentimeter embed URL or the full <code>&lt;iframe&gt;</code> embed code below.
        </div>
        <textarea
          class="mm-input"
          placeholder="https://www.mentimeter.com/embed/… or paste the full <iframe> code"
          bind:value={embedInput}
          onkeydown={handleKey}
          rows="4"
        ></textarea>
        <div class="mm-setup-actions">
          <button class="mm-btn mm-btn-primary" onclick={save} disabled={!embedInput.trim()}>
            Embed Results
          </button>
          {#if savedUrl}
            <button class="mm-btn mm-btn-secondary" onclick={() => editing = false}>Cancel</button>
          {/if}
        </div>
      </div>
    </div>

  {:else}
    <!-- Embedded results — content reloads every 10 s without remounting -->
    <div class="mm-frame-wrap">
      <iframe
        bind:this={frameEl}
        class="mm-frame"
        src={savedUrl}
        title="Mentimeter Survey Results"
        sandbox="allow-popups allow-scripts allow-same-origin allow-presentation"
        allowfullscreen="true"
        allowtransparency="true"
        frameborder="0"
      ></iframe>
    </div>
    <div class="mm-toolbar">
      <button class="mm-tool-btn" onclick={startEdit}>✎ Change URL</button>
      <button class="mm-tool-btn mm-tool-btn-clear" onclick={clear}>✕ Clear</button>
    </div>
  {/if}
</div>

<style>
  .mm-stage {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    background: #0a2f46;
  }

  /* ── Setup screen ── */
  .mm-setup {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
  }

  .mm-setup-card {
    background: white;
    border-radius: 10px;
    border-top: 4px solid #FF6100;
    padding: 36px 40px;
    max-width: 560px;
    width: 100%;
    box-shadow: 0 8px 40px rgba(0,0,0,0.3);
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .mm-setup-title {
    font-size: 18px;
    font-weight: 700;
    color: #0a2f46;
  }

  .mm-setup-sub {
    font-size: 12px;
    color: #666;
    line-height: 1.5;
  }

  .mm-setup-sub code {
    background: #f0ede8;
    padding: 1px 4px;
    border-radius: 3px;
    font-size: 11px;
  }

  .mm-input {
    font-family: monospace;
    font-size: 11px;
    border: 1px solid #d0cdc8;
    border-radius: 5px;
    padding: 10px 12px;
    resize: vertical;
    outline: none;
    color: #0a2f46;
    line-height: 1.5;
  }

  .mm-input:focus { border-color: #FF6100; box-shadow: 0 0 0 2px rgba(255,97,0,0.15); }

  .mm-setup-actions {
    display: flex;
    gap: 10px;
  }

  .mm-btn {
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    padding: 9px 22px;
    border-radius: 5px;
    cursor: pointer;
    border: none;
    transition: background 0.15s;
  }

  .mm-btn-primary {
    background: #FF6100;
    color: white;
  }
  .mm-btn-primary:hover:not(:disabled) { background: #e05500; }
  .mm-btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

  .mm-btn-secondary {
    background: #f0ede8;
    color: #555;
  }
  .mm-btn-secondary:hover { background: #e8e4de; }

  /* ── Embedded frame ── */
  .mm-frame-wrap {
    flex: 1;
    min-height: 0;
    position: relative;
  }

  .mm-frame {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
    display: block;
  }

  .mm-toolbar {
    flex-shrink: 0;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 6px 12px;
    background: rgba(0,0,0,0.3);
  }

  .mm-tool-btn {
    font-family: inherit;
    font-size: 10px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 3px;
    cursor: pointer;
    border: 1px solid rgba(255,255,255,0.25);
    background: rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.7);
    transition: background 0.12s;
  }

  .mm-tool-btn:hover { background: rgba(255,255,255,0.2); color: white; }
  .mm-tool-btn-clear:hover { background: rgba(153,27,27,0.5); border-color: #991B1B; }
</style>
