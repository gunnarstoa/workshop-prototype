<script lang="ts">
  import { wizardPersonas, individualPaths, type WizardPersona } from '$lib/data';

  let selectedPersona = $state<WizardPersona | null>(null);
  let answers = $state<Record<string, string>>({});
  let showJourneyView = $state(false);

  // Staged reveal — only first 3 personas visible until first click
  const INITIAL_VISIBLE_COUNT = 3;
  let revealed = $state(false);

  $effect(() => {
    if (revealed || selectedPersona) return;
    function onDocClick() {
      revealed = true;
    }
    document.addEventListener('click', onDocClick, { once: true });
    return () => document.removeEventListener('click', onDocClick);
  });

  // Step tracking: persona(0) → question(1) → journey(2)
  const totalSteps = $derived(selectedPersona ? 3 : 1);
  const currentStep = $derived(!selectedPersona ? 0 : showJourneyView ? 2 : 1);

  // Only the first question per persona (focus area / scope / industry)
  const activeQuestion = $derived(
    selectedPersona && !showJourneyView ? selectedPersona.questions[0] : null
  );

  // Match wizard persona to individual-paths data for stage detail
  const matchedPath = $derived(
    selectedPersona ? individualPaths.find((p) => p.id === selectedPersona.id) : null
  );
  let pinnedStageIdx = $state<number | null>(null);

  function selectPersona(p: WizardPersona) {
    if (!revealed) {
      revealed = true;
      return;
    }
    selectedPersona = p;
    answers = {};
    showJourneyView = false;
  }

  function answerQuestion(questionId: string, optionId: string) {
    answers = { ...answers, [questionId]: optionId };
    showJourneyView = true;
  }

  function back() {
    if (showJourneyView) {
      showJourneyView = false;
    } else {
      selectedPersona = null;
      answers = {};
    }
  }

  function restart() {
    selectedPersona = null;
    answers = {};
    showJourneyView = false;
  }
</script>

<div class="wiz-stage">
  <!-- Progress bar -->
  <div class="wiz-progress">
    <div
      class="wiz-progress-fill"
      style="width: {(currentStep / Math.max(totalSteps - 1, 1)) * 100}%"
    ></div>
  </div>

  <!-- Step 0: Pick a persona -->
  {#if !selectedPersona}
    <div class="wiz-step">
      <div class="wiz-step-header wiz-step-header-intro">
        <div class="wiz-intro-eyebrow">The Story Begins</div>
        <div class="wiz-intro-question">
          {#if revealed}
            Eight personas. Eight distinct journeys.
          {:else}
            Three personas. Three distinct journeys.
          {/if}
        </div>
        <div class="wiz-intro-sub">
          Every persona has a different enablement journey, and every journey is entirely
          <strong>opt-in</strong>. We show the recommended path — you choose what's relevant to you.
        </div>
      </div>

      <div class="wiz-persona-grid">
        {#each wizardPersonas as p, i (p.id)}
          {@const isHidden = !revealed && i >= INITIAL_VISIBLE_COUNT}
          <button
            class="wiz-persona-card"
            class:hidden-persona={isHidden}
            style="--reveal-delay: {(i - INITIAL_VISIBLE_COUNT) * 0.1}s"
            onclick={() => selectPersona(p)}
          >
            <div class="wiz-persona-icon">{p.icon}</div>
            <div class="wiz-persona-name">{p.name}</div>
            <div class="wiz-persona-tag">{p.tagline}</div>
          </button>
        {/each}
      </div>
      {#if !revealed}
        <div class="wiz-reveal-hint">Click anywhere to see the full set of roles →</div>
      {/if}
    </div>

  <!-- Step 1: Focus-area question (first question only) -->
  {:else if activeQuestion}
    <div class="wiz-step">
      <div class="wiz-step-header">
        <div class="wiz-eyebrow">
          <span class="wiz-eyebrow-persona">{selectedPersona.icon} {selectedPersona.name}</span>
          &nbsp;·&nbsp; Step {currentStep + 1} of {totalSteps}
        </div>
        <div class="wiz-question">{activeQuestion.prompt}</div>
        <div class="wiz-hint">Pick the best fit. You can go back to change your answer.</div>
      </div>

      <div class="wiz-option-grid">
        {#each activeQuestion.options as opt (opt.id)}
          {@const isSelected = answers[activeQuestion.id] === opt.id}
          <button
            class="wiz-option-card"
            class:selected={isSelected}
            onclick={() => answerQuestion(activeQuestion.id, opt.id)}
          >
            {#if opt.icon}
              <div class="wiz-option-card-icon">{opt.icon}</div>
            {/if}
            <div class="wiz-option-card-label">{opt.label}</div>
          </button>
        {/each}
      </div>

      <div class="wiz-nav">
        <button class="wiz-back" onclick={back}>← Back</button>
      </div>
    </div>

  <!-- Step 2: Journey stage view -->
  {:else if showJourneyView && selectedPersona}
    <div class="wiz-step wiz-step-journey">
      <div class="wiz-step-header">
        <div class="wiz-eyebrow">
          <span class="wiz-eyebrow-persona">{selectedPersona.icon} {selectedPersona.name}</span>
          &nbsp;·&nbsp; Step {currentStep + 1} of {totalSteps}
        </div>
        <div class="wiz-question">Your Enablement Journey</div>
        <div class="wiz-hint">
          Stage 1 is where you start. Complete its tasks and pass the gate criteria to unlock the
          next stage.
        </div>
      </div>

      {#if matchedPath}
        <div class="wiz-journey-cards">
          {#each matchedPath.stages as stage, i (stage.id)}
            {@const isActive = i === 0}
            {@const isPinned = pinnedStageIdx === i}
            <div
              class="wiz-jcard"
              class:active={isActive}
              class:locked={!isActive}
              class:pinned={isPinned}
              onclick={() => { if (isActive) pinnedStageIdx = isPinned ? null : i; }}
              role={isActive ? 'button' : undefined}
            >
              <div class="wiz-jcard-color" style="background: {stage.color};"></div>
              <div class="wiz-jcard-header">
                {#if isActive}
                  <span class="wiz-jcard-badge">Current</span>
                {:else}
                  <span class="wiz-jcard-lock">🔒</span>
                {/if}
                <span class="wiz-jcard-num">Stage {stage.number}</span>
                <span class="wiz-jcard-name">{stage.name}</span>
              </div>
              <div class="wiz-jcard-expand">
                <div class="wiz-jcard-expand-inner">
                  {#if isActive}
                    <div class="wiz-jcard-tasks">
                      <div class="wiz-jcard-label">{stage.tasks.length} Tasks</div>
                      {#each stage.tasks as task}
                        <div class="wiz-jcard-task-item">{task}</div>
                      {/each}
                    </div>
                    {#if stage.gateTo}
                      <div class="wiz-jcard-gate-section">
                        <div class="wiz-jcard-label">Gate {stage.gateTo.label}</div>
                        {#each stage.gateTo.requirements as req}
                          <div class="wiz-jcard-gate-item">
                            <span class="wiz-jcard-gate-check">✓</span>
                            <span>{req.metric}</span>
                            <span class="wiz-jcard-gate-comp">{req.comparison}</span>
                          </div>
                        {/each}
                      </div>
                    {/if}
                  {:else}
                    <div class="wiz-jcard-locked-msg">
                      Complete Stage {stage.number - 1} to unlock
                    </div>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <!-- Fallback for personas without path data -->
        <div class="wiz-result-journey" style="width:100%;max-width:680px;">
          <div class="wiz-result-journey-label">Recommended enablement items</div>
          <div class="wiz-result-items">
            {#each selectedPersona.journeyItems as item, i}
              <div class="wiz-result-item">
                <span class="wiz-result-item-num">{i + 1}</span>
                <span class="wiz-result-item-name">{item}</span>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <div class="wiz-nav">
        <button class="wiz-back" onclick={back}>← Back</button>
        <button class="wiz-restart" onclick={restart}>↺ Start over</button>
        <button class="wiz-start-journey">▶ Start my journey</button>
      </div>
    </div>
  {/if}
</div>
