<script lang="ts">
  import { individualPaths } from '$lib/data';

  const paths = individualPaths.filter(p => !['solution-architect', 'delivery-lead'].includes(p.id));

  let selectedPathId  = $state(paths[0]?.id ?? '');
  let selectedStageId = $state<string | null>(null);

  const selectedPath  = $derived(paths.find(p => p.id === selectedPathId) ?? paths[0]);
  const selectedStage = $derived(selectedStageId ? selectedPath?.stages.find(s => s.id === selectedStageId) : null);

  let hideTimer: ReturnType<typeof setTimeout> | null = null;

  function selectPath(id: string) { selectedPathId = id; selectedStageId = null; }

  function onStageEnter(id: string) {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    selectedStageId = id;
  }

  function onStageLeave() {
    hideTimer = setTimeout(() => { selectedStageId = null; }, 120);
  }

  function onDetailEnter() {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
  }

  function onDetailLeave() {
    hideTimer = setTimeout(() => { selectedStageId = null; }, 120);
  }
</script>

<div class="jd-page">

  <!-- Heading -->
  <div class="jd-header">
    <div class="db-eyebrow">Structured and Intentional Progression</div>
    <div class="db-title">Journey</div>
    <div class="db-sub">A structured path from onboarding through expertise, where participants progress by both learning and doing. Journeys are unique to the different partner roles and desired competencies.</div>
  </div>

  <!-- Role tabs -->
  <div class="jd-tabs">
    {#each paths as path (path.id)}
      <button class="jd-tab" class:active={selectedPathId === path.id} onclick={() => selectPath(path.id)}>
        {path.icon} {path.name}
      </button>
    {/each}
  </div>

  <!-- Stage strip -->
  <div class="jd-strip-wrap">
    <div class="jd-strip">

      <div class="jd-group">
        <div class="jd-group-label jd-learning">📚 Learning</div>
        <div class="jd-group-stages">
          {#each selectedPath?.stages.slice(0, 3) ?? [] as stage, i (stage.id)}
            <button
              class="jd-stage-btn"
              class:active={selectedStageId === stage.id}
              style="background:{stage.color};"
              onmouseenter={() => onStageEnter(stage.id)}
              onmouseleave={onStageLeave}
            >
              <span class="jd-stage-num">Stage {stage.number}</span>
              <span class="jd-stage-name">{stage.name}</span>
            </button>
            {#if i < 2}<span class="jd-arrow">›</span>{/if}
          {/each}
        </div>
      </div>

      <span class="jd-arrow jd-divider">›</span>

      <div class="jd-group">
        <div class="jd-group-label jd-doing">🏗 Doing</div>
        <div class="jd-group-stages">
          {#each selectedPath?.stages.slice(3) ?? [] as stage, i (stage.id)}
            <button
              class="jd-stage-btn"
              class:active={selectedStageId === stage.id}
              style="background:{stage.color};"
              onmouseenter={() => onStageEnter(stage.id)}
              onmouseleave={onStageLeave}
            >
              <span class="jd-stage-num">Stage {stage.number}</span>
              <span class="jd-stage-name">{stage.name}</span>
            </button>
            {#if i < (selectedPath?.stages.slice(3).length ?? 0) - 1}<span class="jd-arrow">›</span>{/if}
          {/each}
        </div>
      </div>

    </div>
  </div>

  <!-- Stage detail — shown only when a stage is selected -->
  {#if selectedStage}
    <div class="jd-detail" onmouseenter={onDetailEnter} onmouseleave={onDetailLeave}>
      <!-- Dark stage header -->
      <div class="jd-detail-header" style="background:{selectedStage.color};">
        <div class="jd-detail-eyebrow">Stage {selectedStage.number}</div>
        <div class="jd-detail-title">{selectedStage.name}</div>
      </div>

      <!-- Body -->
      <div class="jd-detail-body">
        <!-- Tasks -->
        <div class="jd-section-label">{selectedStage.tasks.length} Tasks</div>
        {#each selectedStage.tasks as task}
          <div class="jd-row">{task}</div>
        {/each}

        <!-- Gates -->
        {#if selectedStage.gateTo}
          <div class="jd-section-divider"></div>
          <div class="jd-section-label">{selectedStage.gateTo.requirements.length} Gate Requirements</div>
          {#each selectedStage.gateTo.requirements as req}
            <div class="jd-row">
              <span class="jd-check">✓</span>
              {req.metric}
              <span class="jd-comp">{req.comparison}</span>
            </div>
          {/each}
        {:else}
          <div class="jd-section-divider"></div>
          <div class="jd-no-gate">Final stage — no exit gate</div>
        {/if}
      </div>
    </div>
  {/if}

</div>

<style>
  .jd-page {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 28px 40px 24px;
    gap: 0;
    background: #f5f4f0;
    overflow: hidden;
  }

  /* Heading */
  .jd-header {
    text-align: center;
    margin-bottom: 20px;
    flex-shrink: 0;
  }

  /* Role tabs */
  .jd-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 28px;
    flex-shrink: 0;
  }

  .jd-tab {
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    color: #666;
    background: white;
    border: 1.5px solid #ddd;
    border-radius: 6px;
    padding: 7px 20px;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s, background 0.15s;
  }

  .jd-tab:hover { border-color: #0a2f46; color: #0a2f46; }
  .jd-tab.active { background: #0a2f46; color: white; border-color: #0a2f46; }

  /* Strip wrapper — centres the strip */
  .jd-strip-wrap {
    flex-shrink: 0;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .jd-strip {
    display: flex;
    align-items: flex-end;
    gap: 4px;
  }

  .jd-group {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .jd-group-label {
    font-size: 13px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-align: center;
    padding: 5px 16px;
    border-radius: 6px 6px 0 0;
  }

  .jd-learning { background: #EBF5FB; color: #1A5276; border-top: 2px solid #1A5276; }
  .jd-doing    { background: #FEF5EC; color: #C06010; border-top: 2px solid #C06010; }

  .jd-group-stages {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .jd-stage-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    padding: 22px 44px;
    border-radius: 10px;
    border: 3px solid transparent;
    color: white;
    cursor: pointer;
    font-family: inherit;
    transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
  }

  .jd-stage-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.18); }
  .jd-stage-btn.active { border-color: white; box-shadow: 0 6px 20px rgba(0,0,0,0.25); transform: translateY(-3px); }

  .jd-stage-num {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    opacity: 0.65;
  }

  .jd-stage-name {
    font-size: 22px;
    font-weight: 800;
    white-space: nowrap;
  }

  .jd-arrow {
    font-size: 28px;
    color: #bbb;
    padding: 0 6px;
    align-self: center;
    margin-bottom: 8px;
    flex-shrink: 0;
  }

  .jd-divider {
    font-size: 34px;
    color: #ccc;
    margin: 0 4px 12px;
  }

  /* Detail card */
  .jd-detail {
    margin-top: 32px;
    width: 100%;
    max-width: 480px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 16px rgba(10,47,70,0.1);
    overflow: hidden;
    flex-shrink: 0;
  }

  .jd-detail-header {
    padding: 14px 20px;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .jd-detail-eyebrow {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255,255,255,0.65);
  }

  .jd-detail-title {
    font-size: 22px;
    font-weight: 800;
    color: white;
    line-height: 1.1;
  }

  .jd-detail-body {
    padding: 16px 20px 18px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .jd-section-label {
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #999;
    margin-bottom: 2px;
  }

  .jd-row {
    font-size: 14px;
    color: #0a2f46;
    line-height: 1.4;
    display: flex;
    align-items: baseline;
    gap: 6px;
  }

  .jd-check {
    color: #1A7A47;
    font-weight: 700;
    flex-shrink: 0;
  }

  .jd-comp {
    margin-left: auto;
    font-size: 11px;
    font-weight: 700;
    color: #1A7A47;
    white-space: nowrap;
  }

  .jd-section-divider {
    height: 1px;
    background: #eeecea;
    margin: 8px 0;
  }

  .jd-no-gate {
    font-size: 13px;
    color: #aaa;
    font-style: italic;
  }
</style>
