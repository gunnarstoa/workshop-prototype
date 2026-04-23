<script lang="ts">
  import { individualPaths } from '$lib/data';

  const stageColors = ['#4B5563', '#1A5276', '#1A7A47', '#C06010', '#922B21'];
  const stageNames = ['Registered', 'Trained', 'Accredited', 'Delivering', 'Expert'];

  const roles = [
    { id: 'sales',    name: 'Sales',     icon: '💼', desc: 'Build pipeline and close Anaplan opportunities' },
    { id: 'presales', name: 'Pre-Sales', icon: '🔍', desc: 'Lead discovery, demos, and technical solutioning' },
    { id: 'delivery', name: 'Delivery',  icon: '🛠', desc: 'Build and configure Anaplan models for clients' }
  ];

  const areas = [
    { id: 'finance',        name: 'Finance',           icon: '💰', color: '#1A5276',  disabled: false },
    { id: 'supply-chain',   name: 'Supply Chain',      icon: '📦', color: '#1A7A47',  disabled: false },
    { id: 'retail',         name: 'Retail',            icon: '🛍', color: '#7B3FA0',  disabled: false },
    { id: 'workforce',      name: 'Workforce',         icon: '👥', color: '#1A6B6B',  disabled: false },
    { id: 'sales-marketing',name: 'Sales & Marketing', icon: '📊', color: '#C06010',  disabled: false },
    { id: 'ai-specialist',  name: 'AI Specialist',     icon: '🤖', color: '#555555',  disabled: true  }
  ];

  type Journey = {
    id: string; name: string; fullName: string;
    role: string; area: string;
    desc: string; duration: string;
  };

  const journeys: Journey[] = [
    { id: 'ifp-sales',    name: 'IFP',        fullName: 'Integrated Financial Planning',  role: 'sales',    area: 'finance',         desc: 'Sell FP&A transformation to the CFO office',             duration: '~3–5 mo' },
    { id: 'fcr-sales',    name: 'FCR',        fullName: 'Financial Close & Reporting',     role: 'sales',    area: 'finance',         desc: 'Sell financial close automation to controllers',          duration: '~3–5 mo' },
    { id: 'ifp-presales', name: 'IFP',        fullName: 'Integrated Financial Planning',  role: 'presales', area: 'finance',         desc: 'Demo and solution IFP for finance teams',                duration: '~4–6 mo' },
    { id: 'fcr-presales', name: 'FCR',        fullName: 'Financial Close & Reporting',     role: 'presales', area: 'finance',         desc: 'Demo and solution FCR for close teams',                  duration: '~4–6 mo' },
    { id: 'ifp-delivery', name: 'IFP',        fullName: 'Integrated Financial Planning',  role: 'delivery', area: 'finance',         desc: 'Build and configure IFP models for clients',             duration: '~4–7 mo' },
    { id: 'fcr-delivery', name: 'FCR',        fullName: 'Financial Close & Reporting',     role: 'delivery', area: 'finance',         desc: 'Build and configure FCR models for clients',             duration: '~4–7 mo' },

    { id: 'inv-sales',    name: 'Inventory',  fullName: 'Inventory Planning',              role: 'sales',    area: 'supply-chain',    desc: 'Sell inventory optimization solutions',                  duration: '~3–5 mo' },
    { id: 'dem-sales',    name: 'Demand',     fullName: 'Demand Planning',                 role: 'sales',    area: 'supply-chain',    desc: 'Sell demand sensing and forecast accuracy',              duration: '~3–5 mo' },
    { id: 'inv-presales', name: 'Inventory',  fullName: 'Inventory Planning',              role: 'presales', area: 'supply-chain',    desc: 'Demo and solution Inventory Planning',                   duration: '~4–6 mo' },
    { id: 'dem-presales', name: 'Demand',     fullName: 'Demand Planning',                 role: 'presales', area: 'supply-chain',    desc: 'Demo and solution Demand Planning for S&OP teams',       duration: '~4–6 mo' },
    { id: 'inv-delivery', name: 'Inventory',  fullName: 'Inventory Planning',              role: 'delivery', area: 'supply-chain',    desc: 'Build and configure Inventory Planning models',          duration: '~4–7 mo' },
    { id: 'dem-delivery', name: 'Demand',     fullName: 'Demand Planning',                 role: 'delivery', area: 'supply-chain',    desc: 'Build and configure Demand Planning models',             duration: '~4–7 mo' },

    { id: 'mfp-sales',    name: 'MFP',        fullName: 'Merchandise Financial Planning',  role: 'sales',    area: 'retail',          desc: 'Sell MFP to retail merchandise teams',                   duration: '~3–5 mo' },
    { id: 'mfp-presales', name: 'MFP',        fullName: 'Merchandise Financial Planning',  role: 'presales', area: 'retail',          desc: 'Demo and solution MFP for retail buyers',                duration: '~4–6 mo' },
    { id: 'mfp-delivery', name: 'MFP',        fullName: 'Merchandise Financial Planning',  role: 'delivery', area: 'retail',          desc: 'Build and configure MFP models for retailers',           duration: '~4–7 mo' },

    { id: 'owp-sales',    name: 'OWP',        fullName: 'Operational Workforce Planning',  role: 'sales',    area: 'workforce',       desc: 'Sell workforce planning to HR and finance leaders',       duration: '~3–5 mo' },
    { id: 'owp-presales', name: 'OWP',        fullName: 'Operational Workforce Planning',  role: 'presales', area: 'workforce',       desc: 'Demo and solution OWP for HR planning teams',            duration: '~4–6 mo' },
    { id: 'owp-delivery', name: 'OWP',        fullName: 'Operational Workforce Planning',  role: 'delivery', area: 'workforce',       desc: 'Build and configure OWP models for clients',             duration: '~4–7 mo' },

    { id: 'rpm-sales',    name: 'RPM',        fullName: 'Revenue & Profit Management',     role: 'sales',    area: 'sales-marketing', desc: 'Sell revenue planning to commercial teams',              duration: '~3–5 mo' },
    { id: 'rpm-presales', name: 'RPM',        fullName: 'Revenue & Profit Management',     role: 'presales', area: 'sales-marketing', desc: 'Demo and solution RPM for revenue leaders',              duration: '~4–6 mo' },
    { id: 'rpm-delivery', name: 'RPM',        fullName: 'Revenue & Profit Management',     role: 'delivery', area: 'sales-marketing', desc: 'Build and configure RPM models for clients',             duration: '~4–7 mo' }
  ];

  let selectedRole      = $state<string | null>(null);
  let selectedArea      = $state<string | null>(null);
  let selectedJourneyId = $state<string | null>(null);
  let selectedStageId   = $state<string | null>(null);
  let addedIds          = $state(new Set<string>());

  const step          = $derived(!selectedRole ? 0 : !selectedArea ? 1 : !selectedJourneyId ? 2 : 3);
  const currentRole   = $derived(roles.find(r => r.id === selectedRole));
  const currentArea   = $derived(areas.find(a => a.id === selectedArea));
  const currentJourney= $derived(journeys.find(j => j.id === selectedJourneyId));
  const currentPath   = $derived(individualPaths.find(p => p.id === selectedRole));
  const currentStage  = $derived(selectedStageId ? currentPath?.stages.find(s => s.id === selectedStageId) : null);
  const visibleJourneys = $derived(
    journeys.filter(j => j.role === selectedRole && j.area === selectedArea)
  );

  function openJourney(id: string) {
    selectedJourneyId = id;
    selectedStageId   = null;
  }

  function closeJourney() {
    selectedJourneyId = null;
    selectedStageId   = null;
  }

  function selectStage(id: string) {
    selectedStageId = selectedStageId === id ? null : id;
  }

  function toggleAdd(e: MouseEvent, id: string) {
    e.stopPropagation();
    const next = new Set(addedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    addedIds = next;
  }

  function back() {
    if (selectedJourneyId !== null) { closeJourney(); }
    else if (selectedArea !== null) { selectedArea = null; }
    else { selectedRole = null; }
  }

  function reset() {
    selectedRole      = null;
    selectedArea      = null;
    selectedJourneyId = null;
    selectedStageId   = null;
    addedIds          = new Set();
  }
</script>

<div class="jb-stage">

  <!-- Page heading -->
  <div class="jb-page-header">
    <div class="db-eyebrow">The Partner Experience</div>
    <div class="db-title">Self-selecting journeys based on role and focus area</div>
  </div>

  <!-- Breadcrumb -->
  <div class="jb-crumb">
    {#if selectedRole}
      <span class="jb-crumb-sep">›</span>
      <span class="jb-crumb-item" class:done={step > 1} onclick={() => { if (step > 1) { selectedArea = null; selectedJourneyId = null; selectedStageId = null; } }} role="button" tabindex="0">
        {currentRole?.icon} {currentRole?.name}
      </span>
    {/if}
    {#if selectedArea}
      <span class="jb-crumb-sep">›</span>
      <span class="jb-crumb-item" class:done={step > 2} onclick={() => { if (step > 2) closeJourney(); }} role="button" tabindex="0">
        {currentArea?.icon} {currentArea?.name}
      </span>
    {/if}
    {#if selectedJourneyId}
      <span class="jb-crumb-sep">›</span>
      <span class="jb-crumb-item active">{currentJourney?.name} — {currentJourney?.fullName}</span>
    {/if}
    {#if addedIds.size > 0}
      <span class="jb-crumb-added">{addedIds.size} added</span>
    {/if}
  </div>

  <!-- Step 0: Role -->
  {#if step === 0}
    <div class="jb-step">
      <div class="jb-role-grid">
        {#each roles as r}
          <button class="jb-role-card" onclick={() => selectedRole = r.id}>
            <div class="jb-role-icon">{r.icon}</div>
            <div class="jb-role-name">{r.name}</div>
            <div class="jb-role-desc">{r.desc}</div>
            <div class="jb-role-cta">Select →</div>
          </button>
        {/each}
      </div>
    </div>

  <!-- Step 1: Product Area -->
  {:else if step === 1}
    <div class="jb-step">
      <div class="jb-step-header">
        <div class="jb-step-title">Which product area?</div>
        <div class="jb-step-sub">Journeys for <strong>{currentRole?.icon} {currentRole?.name}</strong> — select a product area.</div>
      </div>
      <div class="jb-area-grid">
        {#each areas as a}
          <button
            class="jb-area-card"
            class:jb-area-card-disabled={a.disabled}
            style="--area-color: {a.color}"
            disabled={a.disabled}
            onclick={() => { if (!a.disabled) selectedArea = a.id; }}
          >
            <div class="jb-area-icon">{a.icon}</div>
            <div class="jb-area-name">{a.name}</div>
            {#if a.disabled}
              <div class="jb-area-coming-soon">Coming soon</div>
            {/if}
          </button>
        {/each}
      </div>
      <div class="jb-nav">
        <button class="jb-back" onclick={back}>← Back</button>
      </div>
    </div>

  <!-- Step 2: Journey cards -->
  {:else if step === 2}
    <div class="jb-step jb-step-results">
      <div class="jb-step-header">
        <div class="jb-step-title">
          {currentRole?.icon} {currentRole?.name} · {currentArea?.icon} {currentArea?.name}
        </div>
        <div class="jb-step-sub">{visibleJourneys.length} journey{visibleJourneys.length !== 1 ? 's' : ''} available — click a journey to explore its path</div>
      </div>

      <div class="jb-journey-grid">
        {#each visibleJourneys as j}
          {@const added = addedIds.has(j.id)}
          <div class="jb-jcard" class:jb-jcard-added={added} onclick={() => openJourney(j.id)} role="button" tabindex="0">
            <div class="jb-jcard-body">
              <div class="jb-jcard-name">{j.name}</div>
              <div class="jb-jcard-fullname">{j.fullName}</div>
              <div class="jb-jcard-desc">{j.desc}</div>
              <div class="jb-stages">
                {#each stageNames as s, i}
                  <div class="jb-stage-dot" style="background:{stageColors[i]}" title={s}></div>
                  {#if i < stageNames.length - 1}
                    <div class="jb-stage-line"></div>
                  {/if}
                {/each}
              </div>
              <div class="jb-stage-labels">
                {#each stageNames as s}
                  <div class="jb-stage-label">{s}</div>
                {/each}
              </div>
            </div>
            <div class="jb-jcard-footer">
              <span class="jb-duration">⏱ {j.duration} to Delivering</span>
              <button class="jb-add-btn" class:jb-add-btn-added={added} onclick={(e) => toggleAdd(e, j.id)}>
                {added ? '✓ Added' : '+ Add'}
              </button>
            </div>
          </div>
        {/each}
      </div>

      <div class="jb-nav">
        <button class="jb-back" onclick={back}>← Back</button>
        <button class="jb-reset" onclick={reset}>↺ Start over</button>
      </div>
    </div>

  <!-- Step 3: Journey detail (role path) -->
  {:else if step === 3 && currentPath}
    <div class="jb-step jb-detail-step">

      <!-- Journey context header -->
      <div class="jb-detail-header">
        <div class="jb-detail-journey-info">
          <div class="jb-detail-journey-name">{currentJourney?.name} — {currentJourney?.fullName}</div>
          <div class="jb-detail-journey-desc">{currentJourney?.desc}</div>
        </div>
        <div class="jb-detail-path-meta">
          <div class="jb-meta-item">
            <span class="jb-meta-val">{currentPath.stages.length}</span>
            <span class="jb-meta-lbl">Stages</span>
          </div>
          <div class="jb-meta-item">
            <span class="jb-meta-val">{currentPath.stages.reduce((n, s) => n + s.tasks.length, 0)}</span>
            <span class="jb-meta-lbl">Tasks</span>
          </div>
          <div class="jb-meta-item">
            <span class="jb-meta-val">{currentPath.stages.filter(s => s.gateTo).length}</span>
            <span class="jb-meta-lbl">Gates</span>
          </div>
          <button class="jb-detail-add-btn" class:jb-detail-add-btn-added={addedIds.has(selectedJourneyId ?? '')}
            onclick={(e) => toggleAdd(e, selectedJourneyId!)}>
            {addedIds.has(selectedJourneyId ?? '') ? '✓ Added to plan' : '+ Add to plan'}
          </button>
        </div>
      </div>

      <!-- Stage strip -->
      <div class="jb-strip">
        <div class="jb-stage-group">
          <div class="jb-group-label jb-group-learning">📚 Learning</div>
          <div class="jb-group-stages">
            {#each currentPath.stages.slice(0, 3) as stage, i (stage.id)}
              <button
                class="jb-strip-stage"
                class:active={selectedStageId === stage.id}
                style="background: {stage.color};"
                onclick={() => selectStage(stage.id)}
              >
                <span class="jb-strip-num">Stage {stage.number}</span>
                <span class="jb-strip-name">{stage.name}</span>
              </button>
              {#if i < 2}
                <div class="jb-strip-arrow">›</div>
              {/if}
            {/each}
          </div>
        </div>

        <div class="jb-strip-arrow jb-group-divider">›</div>

        <div class="jb-stage-group">
          <div class="jb-group-label jb-group-doing">🏗 Doing</div>
          <div class="jb-group-stages">
            {#each currentPath.stages.slice(3) as stage, i (stage.id)}
              <button
                class="jb-strip-stage"
                class:active={selectedStageId === stage.id}
                style="background: {stage.color};"
                onclick={() => selectStage(stage.id)}
              >
                <span class="jb-strip-num">Stage {stage.number}</span>
                <span class="jb-strip-name">{stage.name}</span>
              </button>
              {#if i < currentPath.stages.slice(3).length - 1}
                <div class="jb-strip-arrow">›</div>
              {/if}
            {/each}
          </div>
        </div>
      </div>

      <!-- Stage detail or overview -->
      {#if currentStage}
        <div class="jb-adm-detail">
          <div class="jb-adm-detail-header">
            <div>
              <div class="jb-adm-detail-eyebrow">Stage {currentStage.number}</div>
              <div class="jb-adm-detail-name" style="color: {currentStage.color};">{currentStage.name}</div>
            </div>
            <button class="jb-adm-detail-close" onclick={() => selectedStageId = null}>← Back to overview</button>
          </div>
          <div class="jb-adm-detail-cols">
            <div class="jb-adm-detail-col">
              <div class="jb-adm-col-head"><span>Tasks</span></div>
              <div class="jb-adm-col-body">
                {#each currentStage.tasks as task}
                  <div class="jb-task-card">
                    <span class="jb-task-dot"></span>
                    <span class="jb-task-name">{task}</span>
                  </div>
                {/each}
              </div>
            </div>
            <div class="jb-adm-detail-col">
              <div class="jb-adm-col-head">
                <span>Gate Criteria {currentStage.gateTo ? currentStage.gateTo.label : ''}</span>
              </div>
              <div class="jb-adm-col-body">
                {#if currentStage.gateTo}
                  {#each currentStage.gateTo.requirements as req}
                    <div class="jb-gate-card">
                      <span class="jb-gate-metric">{req.metric}</span>
                      <span class="jb-gate-comp">{req.comparison}</span>
                    </div>
                  {/each}
                {:else}
                  <div class="jb-empty">Final stage — no exit gate</div>
                {/if}
              </div>
            </div>
          </div>
        </div>

      {:else}
        <div class="jb-overview">
          <div class="jb-overview-hint">Click any stage above to see tasks &amp; gate criteria.</div>
          <div class="jb-ov-group-row">
            <div class="jb-ov-group-label jb-group-learning">📚 Learning</div>
            <div class="jb-overview-grid jb-overview-grid-3">
              {#each currentPath.stages.slice(0, 3) as stage (stage.id)}
                <button class="jb-ov-card" onclick={() => selectStage(stage.id)}>
                  <div class="jb-ov-head" style="background: {stage.color};">
                    <span class="jb-ov-num">Stage {stage.number}</span>
                    <span class="jb-ov-name">{stage.name}</span>
                  </div>
                  <div class="jb-ov-body">
                    <div class="jb-ov-section">
                      <div class="jb-ov-label">{stage.tasks.length} Tasks</div>
                      {#each stage.tasks.slice(0, 3) as task}
                        <div class="jb-ov-item">{task}</div>
                      {/each}
                      {#if stage.tasks.length > 3}
                        <div class="jb-ov-more">+ {stage.tasks.length - 3} more</div>
                      {/if}
                    </div>
                    {#if stage.gateTo}
                      <div class="jb-ov-section jb-ov-gate">
                        <div class="jb-ov-label">{stage.gateTo.requirements.length} Gate Requirements</div>
                        {#each stage.gateTo.requirements.slice(0, 2) as req}
                          <div class="jb-ov-item">✓ {req.metric} {req.comparison}</div>
                        {/each}
                        {#if stage.gateTo.requirements.length > 2}
                          <div class="jb-ov-more">+ {stage.gateTo.requirements.length - 2} more</div>
                        {/if}
                      </div>
                    {/if}
                  </div>
                </button>
              {/each}
            </div>
          </div>
          <div class="jb-ov-group-row">
            <div class="jb-ov-group-label jb-group-doing">🏗 Doing</div>
            <div class="jb-overview-grid jb-overview-grid-2">
              {#each currentPath.stages.slice(3) as stage (stage.id)}
                <button class="jb-ov-card" onclick={() => selectStage(stage.id)}>
                  <div class="jb-ov-head" style="background: {stage.color};">
                    <span class="jb-ov-num">Stage {stage.number}</span>
                    <span class="jb-ov-name">{stage.name}</span>
                  </div>
                  <div class="jb-ov-body">
                    <div class="jb-ov-section">
                      <div class="jb-ov-label">{stage.tasks.length} Tasks</div>
                      {#each stage.tasks.slice(0, 3) as task}
                        <div class="jb-ov-item">{task}</div>
                      {/each}
                      {#if stage.tasks.length > 3}
                        <div class="jb-ov-more">+ {stage.tasks.length - 3} more</div>
                      {/if}
                    </div>
                    {#if stage.gateTo}
                      <div class="jb-ov-section jb-ov-gate">
                        <div class="jb-ov-label">{stage.gateTo.requirements.length} Gate Requirements</div>
                        {#each stage.gateTo.requirements.slice(0, 2) as req}
                          <div class="jb-ov-item">✓ {req.metric} {req.comparison}</div>
                        {/each}
                        {#if stage.gateTo.requirements.length > 2}
                          <div class="jb-ov-more">+ {stage.gateTo.requirements.length - 2} more</div>
                        {/if}
                      </div>
                    {/if}
                  </div>
                </button>
              {/each}
            </div>
          </div>
        </div>
      {/if}

      <div class="jb-nav">
        <button class="jb-back" onclick={back}>← Back to journeys</button>
        <button class="jb-reset" onclick={reset}>↺ Start over</button>
      </div>
    </div>
  {/if}
</div>

<style>
  .jb-stage {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    padding: 20px 40px 16px;
    overflow: hidden;
  }

  /* Page header */
  .jb-page-header {
    text-align: center;
    margin-bottom: 12px;
    flex-shrink: 0;
  }

  /* Breadcrumb */
  .jb-crumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #888;
    margin-bottom: 16px;
    flex-shrink: 0;
  }
  .jb-crumb-item { color: #aaa; cursor: default; padding: 2px 6px; border-radius: 4px; }
  .jb-crumb-item.done { color: #FF6100; cursor: pointer; text-decoration: underline; text-underline-offset: 2px; }
  .jb-crumb-item.active { color: #0a2f46; font-weight: 600; }
  .jb-crumb-sep { color: #ccc; font-size: 14px; }
  .jb-crumb-added { margin-left: auto; background: #1A7A47; color: white; font-size: 11px; font-weight: 700; padding: 2px 10px; border-radius: 20px; }

  /* Step container */
  .jb-step { flex: 1; display: flex; flex-direction: column; min-height: 0; gap: 16px; }
  .jb-step-header { flex-shrink: 0; }
  .jb-step-title { font-size: 22px; font-weight: 700; color: #0a2f46; line-height: 1.2; margin-bottom: 4px; }
  .jb-step-sub { font-size: 13px; color: #666; }

  /* Role grid */
  .jb-role-grid { display: flex; gap: 20px; justify-content: center; flex: 1; align-items: center; }
  .jb-role-card {
    flex: 1; max-width: 280px; background: white; border: 2px solid #e8edf2; border-radius: 14px;
    padding: 32px 24px; cursor: pointer; text-align: center;
    transition: border-color 0.15s, box-shadow 0.15s, transform 0.12s;
    display: flex; flex-direction: column; align-items: center; gap: 10px;
  }
  .jb-role-card:hover { border-color: #FF6100; box-shadow: 0 4px 20px rgba(255,97,0,0.12); transform: translateY(-2px); }
  .jb-role-icon { font-size: 44px; line-height: 1; }
  .jb-role-name { font-size: 20px; font-weight: 700; color: #0a2f46; }
  .jb-role-desc { font-size: 12px; color: #888; line-height: 1.4; }
  .jb-role-cta { font-size: 12px; font-weight: 700; color: #FF6100; margin-top: 4px; }

  /* Area grid */
  .jb-area-grid { display: flex; gap: 16px; justify-content: center; flex: 1; align-items: center; }
  .jb-area-card {
    flex: 1; max-width: 200px; background: white; border: 2px solid #e8edf2; border-radius: 12px;
    padding: 28px 16px; cursor: pointer; text-align: center;
    transition: border-color 0.15s, box-shadow 0.15s, transform 0.12s;
    display: flex; flex-direction: column; align-items: center; gap: 10px;
  }
  .jb-area-card:hover:not(:disabled) { border-color: var(--area-color); box-shadow: 0 4px 18px color-mix(in srgb, var(--area-color) 20%, transparent); transform: translateY(-2px); }
  .jb-area-card-disabled { opacity: 0.38; cursor: not-allowed; border-style: dashed; }
  .jb-area-icon { font-size: 36px; line-height: 1; }
  .jb-area-name { font-size: 14px; font-weight: 700; color: #0a2f46; }
  .jb-area-coming-soon { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #aaa; margin-top: 2px; }

  /* Journey cards (step 2) */
  .jb-step-results { overflow: hidden; }
  .jb-journey-grid { display: flex; flex-wrap: wrap; gap: 14px; flex: 1; min-height: 0; overflow-y: auto; padding-bottom: 4px; align-content: flex-start; }
  .jb-jcard {
    background: white; border: 2px solid #e8edf2; border-radius: 12px; padding: 18px;
    flex: 1 1 220px; max-width: 300px; display: flex; flex-direction: column; gap: 12px;
    transition: border-color 0.15s, box-shadow 0.15s; cursor: pointer;
  }
  .jb-jcard:hover { border-color: #FF6100; box-shadow: 0 4px 16px rgba(255,97,0,0.1); }
  .jb-jcard-added { border-color: #1A7A47; background: #f4fbf6; }
  .jb-jcard-body { flex: 1; display: flex; flex-direction: column; gap: 4px; }
  .jb-jcard-name { font-size: 18px; font-weight: 800; color: #0a2f46; line-height: 1; }
  .jb-jcard-fullname { font-size: 11px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.04em; }
  .jb-jcard-desc { font-size: 12px; color: #555; line-height: 1.4; margin-top: 4px; margin-bottom: 10px; }
  .jb-stages { display: flex; align-items: center; gap: 0; margin-bottom: 2px; }
  .jb-stage-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .jb-stage-line { flex: 1; height: 2px; background: #e0e0e0; min-width: 8px; }
  .jb-stage-labels { display: flex; justify-content: space-between; }
  .jb-stage-label { font-size: 8px; color: #aaa; font-weight: 600; text-align: center; width: 10px; white-space: nowrap; transform: translateX(-50%); }
  .jb-stage-label:first-child { transform: none; }
  .jb-stage-label:last-child  { transform: translateX(-100%); }
  .jb-jcard-footer { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-shrink: 0; }
  .jb-duration { font-size: 10px; color: #999; font-weight: 600; }
  .jb-add-btn { background: #0a2f46; color: white; border: none; border-radius: 6px; padding: 6px 14px; font-size: 12px; font-weight: 700; cursor: pointer; transition: background 0.15s, transform 0.1s; white-space: nowrap; }
  .jb-add-btn:hover { background: #FF6100; transform: scale(1.03); }
  .jb-add-btn-added { background: #1A7A47; }
  .jb-add-btn-added:hover { background: #155f38; }

  /* Detail view (step 3) */
  .jb-detail-step { gap: 12px; }

  .jb-detail-header {
    flex-shrink: 0; display: flex; align-items: center; justify-content: space-between;
    background: #0a2f46; border-radius: 10px; padding: 14px 20px; gap: 20px;
  }
  .jb-detail-journey-info { flex: 1; }
  .jb-detail-journey-name { font-size: 16px; font-weight: 800; color: white; line-height: 1.2; }
  .jb-detail-journey-desc { font-size: 12px; color: rgba(255,255,255,0.55); margin-top: 3px; }
  .jb-detail-path-meta { display: flex; align-items: center; gap: 20px; flex-shrink: 0; }
  .jb-meta-item { display: flex; flex-direction: column; align-items: center; }
  .jb-meta-val { font-size: 20px; font-weight: 800; color: white; line-height: 1; }
  .jb-meta-lbl { font-size: 9px; font-weight: 600; color: rgba(255,255,255,0.45); text-transform: uppercase; letter-spacing: 0.06em; }
  .jb-detail-add-btn { background: #FF6100; color: white; border: none; border-radius: 6px; padding: 8px 18px; font-size: 12px; font-weight: 700; cursor: pointer; white-space: nowrap; transition: background 0.15s; }
  .jb-detail-add-btn:hover { background: #e05500; }
  .jb-detail-add-btn-added { background: #1A7A47; }
  .jb-detail-add-btn-added:hover { background: #155f38; }

  /* Stage strip */
  .jb-strip {
    flex-shrink: 0; display: flex; align-items: center; gap: 8px;
    background: white; border-radius: 10px; padding: 12px 16px;
    border: 1px solid #e8edf2;
  }
  .jb-stage-group { display: flex; flex-direction: column; gap: 6px; }
  .jb-group-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 0 4px; }
  .jb-group-learning { color: #1A5276; }
  .jb-group-doing    { color: #C06010; }
  .jb-group-stages { display: flex; align-items: center; gap: 4px; }
  .jb-strip-stage {
    border: none; border-radius: 6px; padding: 6px 14px; cursor: pointer;
    display: flex; flex-direction: column; align-items: center; gap: 2px;
    opacity: 0.75; transition: opacity 0.15s, transform 0.12s; color: white;
  }
  .jb-strip-stage:hover { opacity: 1; transform: translateY(-1px); }
  .jb-strip-stage.active { opacity: 1; box-shadow: 0 0 0 2px white, 0 0 0 4px currentColor; }
  .jb-strip-num { font-size: 9px; font-weight: 600; opacity: 0.75; }
  .jb-strip-name { font-size: 12px; font-weight: 700; }
  .jb-strip-arrow { font-size: 16px; color: #ccc; flex-shrink: 0; }
  .jb-group-divider { margin: 0 4px; font-size: 20px; color: #ddd; align-self: center; }

  /* Stage detail */
  .jb-adm-detail { flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 10px; overflow: hidden; }
  .jb-adm-detail-header { display: flex; align-items: flex-start; justify-content: space-between; flex-shrink: 0; }
  .jb-adm-detail-eyebrow { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #999; }
  .jb-adm-detail-name { font-size: 22px; font-weight: 800; line-height: 1.1; }
  .jb-adm-detail-close { background: none; border: 1.5px solid #ccc; border-radius: 6px; padding: 5px 14px; font-size: 12px; font-weight: 600; color: #666; cursor: pointer; transition: border-color 0.12s, color 0.12s; }
  .jb-adm-detail-close:hover { border-color: #0a2f46; color: #0a2f46; }
  .jb-adm-detail-cols { flex: 1; min-height: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; overflow: hidden; }
  .jb-adm-detail-col { display: flex; flex-direction: column; gap: 8px; min-height: 0; }
  .jb-adm-col-head { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #0a2f46; padding-bottom: 6px; border-bottom: 2px solid #e8edf2; flex-shrink: 0; }
  .jb-adm-col-body { flex: 1; min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; }
  .jb-task-card { display: flex; align-items: center; gap: 10px; background: #f8f9fb; border-radius: 6px; padding: 8px 12px; }
  .jb-task-dot { width: 6px; height: 6px; border-radius: 50%; background: #FF6100; flex-shrink: 0; }
  .jb-task-name { font-size: 13px; color: #0a2f46; font-weight: 500; }
  .jb-gate-card { display: flex; align-items: center; justify-content: space-between; background: #f0f7f3; border-left: 3px solid #1A7A47; border-radius: 6px; padding: 8px 12px; }
  .jb-gate-metric { font-size: 13px; color: #0a2f46; font-weight: 500; }
  .jb-gate-comp { font-size: 11px; font-weight: 700; color: #1A7A47; }
  .jb-empty { font-size: 12px; color: #aaa; font-style: italic; padding: 12px; }

  /* Overview */
  .jb-overview { flex: 1; min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
  .jb-overview-hint { font-size: 12px; color: #999; font-style: italic; flex-shrink: 0; }
  .jb-ov-group-row { display: flex; align-items: flex-start; gap: 12px; flex-shrink: 0; }
  .jb-ov-group-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; writing-mode: vertical-rl; transform: rotate(180deg); padding: 8px 0; white-space: nowrap; }
  .jb-overview-grid { display: grid; gap: 10px; flex: 1; }
  .jb-overview-grid-3 { grid-template-columns: repeat(3, 1fr); }
  .jb-overview-grid-2 { grid-template-columns: repeat(2, 1fr); }
  .jb-ov-card { background: white; border: 1.5px solid #e8edf2; border-radius: 8px; overflow: hidden; cursor: pointer; text-align: left; transition: border-color 0.15s, box-shadow 0.15s; }
  .jb-ov-card:hover { border-color: #b0c4d8; box-shadow: 0 2px 10px rgba(0,0,0,0.07); }
  .jb-ov-head { display: flex; flex-direction: column; padding: 8px 12px; gap: 1px; }
  .jb-ov-num { font-size: 9px; font-weight: 700; color: rgba(255,255,255,0.65); text-transform: uppercase; letter-spacing: 0.06em; }
  .jb-ov-name { font-size: 13px; font-weight: 800; color: white; }
  .jb-ov-body { padding: 8px 12px; display: flex; flex-direction: column; gap: 6px; }
  .jb-ov-section { display: flex; flex-direction: column; gap: 2px; }
  .jb-ov-gate { border-top: 1px solid #eee; padding-top: 6px; }
  .jb-ov-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #999; margin-bottom: 2px; }
  .jb-ov-item { font-size: 10px; color: #555; line-height: 1.3; }
  .jb-ov-more { font-size: 10px; color: #aaa; font-style: italic; }

  /* Nav */
  .jb-nav { display: flex; gap: 12px; flex-shrink: 0; padding-top: 4px; }
  .jb-back, .jb-reset { background: none; border: 1.5px solid #ccc; border-radius: 6px; padding: 6px 16px; font-size: 12px; font-weight: 600; color: #666; cursor: pointer; transition: border-color 0.12s, color 0.12s; }
  .jb-back:hover, .jb-reset:hover { border-color: #0a2f46; color: #0a2f46; }
</style>
