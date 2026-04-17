<script lang="ts">
  import { individualPaths } from '$lib/data';

  let selectedPathId = $state(individualPaths[0]?.id ?? '');
  let selectedStageId = $state<string | null>(null);

  const selectedPath = $derived(
    individualPaths.find((p) => p.id === selectedPathId) ?? individualPaths[0]
  );
  const selectedStage = $derived(
    selectedStageId ? selectedPath?.stages.find((s) => s.id === selectedStageId) : null
  );

  function selectPath(id: string) {
    selectedPathId = id;
    selectedStageId = null;
  }

  function selectStage(id: string) {
    selectedStageId = selectedStageId === id ? null : id;
  }
</script>

<div class="adm-stage">
  <!-- Top bar: role tabs + action buttons -->
  <div class="adm-topbar">
    <div class="adm-path-tabs">
      {#each individualPaths as path (path.id)}
        <button
          class="adm-path-tab"
          class:active={selectedPathId === path.id}
          onclick={() => selectPath(path.id)}
        >
          <span class="adm-path-tab-emoji">{path.icon}</span>
          {path.name}
          <span class="adm-path-tab-badge">{path.stages.length} stages</span>
        </button>
      {/each}
    </div>
    <div class="adm-actions">
      <button class="adm-btn-secondary">+ New Role</button>
      <button class="adm-btn-primary">Save Changes</button>
    </div>
  </div>

  {#if selectedPath}
    <!-- Role header -->
    <div class="adm-path-header">
      <div class="adm-path-info">
        <div class="adm-path-name">
          <span class="adm-path-name-emoji">{selectedPath.icon}</span>
          {selectedPath.name}
        </div>
        <div class="adm-path-desc">{selectedPath.description}</div>
      </div>
      <div class="adm-path-meta">
        <div class="adm-meta-item">
          <span class="adm-meta-val">{selectedPath.stages.length}</span>
          <span class="adm-meta-lbl">Stages</span>
        </div>
        <div class="adm-meta-item">
          <span class="adm-meta-val">{selectedPath.stages.reduce((n, s) => n + s.tasks.length, 0)}</span>
          <span class="adm-meta-lbl">Tasks</span>
        </div>
        <div class="adm-meta-item">
          <span class="adm-meta-val">{selectedPath.stages.filter((s) => s.gateTo).length}</span>
          <span class="adm-meta-lbl">Gates</span>
        </div>
      </div>
    </div>

    <!-- Stage progression strip -->
    <div class="adm-strip">
      {#each selectedPath.stages as stage, i (stage.id)}
        <button
          class="adm-strip-stage"
          class:active={selectedStageId === stage.id}
          style="background: {stage.color};"
          onclick={() => selectStage(stage.id)}
        >
          <span class="adm-strip-num">Stage {stage.number}</span>
          <span class="adm-strip-name">{stage.name}</span>
        </button>
        {#if i < selectedPath.stages.length - 1}
          <div class="adm-strip-arrow">›</div>
        {/if}
      {/each}
    </div>

    {#if selectedStage}
      <div class="adm-detail">
        <div class="adm-detail-header">
          <div>
            <div class="adm-detail-eyebrow">Stage {selectedStage.number}</div>
            <div class="adm-detail-name" style="color: {selectedStage.color};">{selectedStage.name}</div>
          </div>
          <button class="adm-detail-close" onclick={() => (selectedStageId = null)}>← Back to overview</button>
        </div>

        <div class="adm-detail-cols">
          <div class="adm-detail-col">
            <div class="adm-detail-col-head">
              <span>Tasks</span>
              <button class="adm-btn-ghost">+ Add Task</button>
            </div>
            <div class="adm-detail-col-body">
              {#each selectedStage.tasks as task}
                <div class="adm-task-card">
                  <span class="adm-task-drag">⋮⋮</span>
                  <span class="adm-task-name">{task}</span>
                  <span class="adm-task-edit">✏️</span>
                </div>
              {/each}
            </div>
          </div>

          <div class="adm-detail-col">
            <div class="adm-detail-col-head">
              <span>Gate Criteria {selectedStage.gateTo ? selectedStage.gateTo.label : ''}</span>
              {#if selectedStage.gateTo}
                <button class="adm-btn-ghost">+ Add Requirement</button>
              {/if}
            </div>
            <div class="adm-detail-col-body">
              {#if selectedStage.gateTo}
                {#each selectedStage.gateTo.requirements as req}
                  <div class="adm-gate-card">
                    <span class="adm-gate-metric">{req.metric}</span>
                    <span class="adm-gate-comp">{req.comparison}</span>
                    <span class="adm-gate-edit">✏️</span>
                  </div>
                {/each}
              {:else}
                <div class="adm-empty">Final stage — no exit gate</div>
              {/if}
            </div>
          </div>
        </div>
      </div>

    {:else}
      <div class="adm-overview">
        <div class="adm-overview-hint">Click any stage above to see tasks &amp; gate criteria, or browse the overview below.</div>
        <div class="adm-overview-grid">
          {#each selectedPath.stages as stage (stage.id)}
            <button class="adm-overview-card" onclick={() => selectStage(stage.id)}>
              <div class="adm-ov-head" style="background: {stage.color};">
                <span class="adm-ov-num">Stage {stage.number}</span>
                <span class="adm-ov-name">{stage.name}</span>
              </div>
              <div class="adm-ov-body">
                <div class="adm-ov-section">
                  <div class="adm-ov-label">{stage.tasks.length} Tasks</div>
                  {#each stage.tasks.slice(0, 3) as task}
                    <div class="adm-ov-item">{task}</div>
                  {/each}
                  {#if stage.tasks.length > 3}
                    <div class="adm-ov-more">+ {stage.tasks.length - 3} more</div>
                  {/if}
                </div>
                {#if stage.gateTo}
                  <div class="adm-ov-section adm-ov-gate">
                    <div class="adm-ov-label">{stage.gateTo.requirements.length} Gate Requirements</div>
                    {#each stage.gateTo.requirements.slice(0, 2) as req}
                      <div class="adm-ov-item">✓ {req.metric} {req.comparison}</div>
                    {/each}
                    {#if stage.gateTo.requirements.length > 2}
                      <div class="adm-ov-more">+ {stage.gateTo.requirements.length - 2} more</div>
                    {/if}
                  </div>
                {/if}
              </div>
            </button>
          {/each}
        </div>
      </div>
    {/if}
  {/if}
</div>
