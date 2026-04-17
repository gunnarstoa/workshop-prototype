<script lang="ts">
  import { wizardPersonas, type WizardPersona } from '$lib/data';

  let selectedPersona = $state<WizardPersona | null>(null);
  let currentQuestion = $state(0);
  let answers = $state<Record<string, string>>({});
  let showResult = $state(false);

  // Step 0: staged persona reveal — only first 3 cards visible until first click anywhere
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

  const totalSteps = $derived(
    selectedPersona ? selectedPersona.questions.length + 2 : 1
  );
  const currentStep = $derived(
    !selectedPersona
      ? 0
      : showResult
        ? selectedPersona.questions.length + 1
        : currentQuestion + 1
  );

  function selectPersona(p: WizardPersona) {
    // During the staged reveal, the first click on any card only reveals
    // the remaining personas rather than advancing the wizard.
    if (!revealed) {
      revealed = true;
      return;
    }
    selectedPersona = p;
    currentQuestion = 0;
    answers = {};
    showResult = false;
  }

  function answerQuestion(questionId: string, optionId: string) {
    answers = { ...answers, [questionId]: optionId };
    if (selectedPersona && currentQuestion < selectedPersona.questions.length - 1) {
      currentQuestion += 1;
    } else {
      showResult = true;
    }
  }

  function back() {
    if (showResult) {
      showResult = false;
    } else if (currentQuestion > 0) {
      currentQuestion -= 1;
    } else {
      selectedPersona = null;
      answers = {};
    }
  }

  function restart() {
    selectedPersona = null;
    currentQuestion = 0;
    answers = {};
    showResult = false;
  }

  const activeQuestion = $derived(
    selectedPersona && !showResult ? selectedPersona.questions[currentQuestion] : null
  );
</script>

<div class="wiz-stage">
  <!-- Progress bar -->
  <div class="wiz-progress">
    <div class="wiz-progress-fill" style="width: {(currentStep / (totalSteps - 1)) * 100}%"></div>
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

  <!-- Steps 1–N: Questions -->
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

  <!-- Final step: Recommended journey -->
  {:else if showResult && selectedPersona}
    <div class="wiz-step">
      <div class="wiz-step-header">
        <div class="wiz-eyebrow">
          <span class="wiz-eyebrow-persona">{selectedPersona.icon} {selectedPersona.name}</span>
          &nbsp;·&nbsp; Step {currentStep + 1} of {totalSteps}
        </div>
        <div class="wiz-question">{selectedPersona.journeyIntro}</div>
        <div class="wiz-hint">
          Based on your answers, here's your recommended enablement path. Every item is opt-in.
        </div>
      </div>

      <div class="wiz-result-card">
        <div class="wiz-result-persona">
          <span class="wiz-result-icon">{selectedPersona.icon}</span>
          <span class="wiz-result-name">{selectedPersona.name}</span>
        </div>
        <div class="wiz-result-answers">
          {#each selectedPersona.questions as q (q.id)}
            {@const chosenId = answers[q.id]}
            {@const chosen = q.options.find((o) => o.id === chosenId)}
            {#if chosen}
              <div class="wiz-result-answer">
                <span class="wiz-answer-q">{q.prompt}</span>
                <span class="wiz-answer-a">{chosen.label}</span>
              </div>
            {/if}
          {/each}
        </div>
        <div class="wiz-result-journey">
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
      </div>

      <div class="wiz-nav">
        <button class="wiz-back" onclick={back}>← Back</button>
        <button class="wiz-restart" onclick={restart}>↺ Start over</button>
        <button class="wiz-start-journey">▶ Start my journey</button>
      </div>
    </div>
  {/if}
</div>
