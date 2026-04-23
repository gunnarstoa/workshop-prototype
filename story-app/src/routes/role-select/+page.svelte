<script lang="ts">
  type Role = 'sales' | 'presales' | 'delivery';

  let selected = $state<Role | null>(null);

  const roles: { id: Role; icon: string; label: string; desc: string }[] = [
    {
      id: 'sales',
      icon: '📊',
      label: 'Sales',
      desc: 'Identify, qualify, and close Anaplan opportunities with confidence across every product and industry.',
    },
    {
      id: 'presales',
      icon: '🔍',
      label: 'Pre-Sales',
      desc: 'Support the sales cycle with technical credibility — demos, solutioning, and proof of concept across all Anaplan products.',
    },
    {
      id: 'delivery',
      icon: '⚙️',
      label: 'Delivery',
      desc: 'Build deep, certified delivery capability and consistently meet client expectations on every engagement.',
    },
  ];

  const flow: { id: string; label: string; duration: string }[] = [
    { id: 'registered', label: 'Registered',  duration: '~1 week'    },
    { id: 'trained',    label: 'Trained',     duration: '3–6 weeks'  },
    { id: 'certified',  label: 'Experienced',   duration: '2–4 weeks'  },
    { id: 'delivering', label: 'Delivering',  duration: '1–4 months' },
    { id: 'expert',     label: 'Expert',      duration: 'Ongoing'    },
  ];

  const questions = [
    { section: 'top',  text: 'Do we have the right roles?' },
    { section: 'flow', text: 'Do we have the right journeys?' },
    { section: 'flow', text: 'Do we have the right content?' },
    { section: 'flow', text: 'Do we have the right gates?' },
    { section: 'flow', text: 'Do we have the right partner experience?' },
    { section: 'flow', text: 'Do we have the right metrics?' },
  ];

  const content: Record<Role, Record<string, string[]>> = {
    sales: {
      registered: [
        'Join the partner portal',
        'Complete Connected Planning overview',
        'Attend Anaplan sales kickoff',
      ],
      trained: [
        'Anaplan Way — Sales Motion',
        'Application value proposition (focus area)',
        'Attend Discovery for Sellers workshop',
      ],
      certified: [
        'Pass Sales certification assessment',
        'Complete Business Case Development',
        'Complete Competitive Positioning',
      ],
      delivering: [
        'Deliver first qualified discovery meeting',
        'Close first partner-led opportunity',
        'Earn GTM Blueprint',
      ],
      expert: [
        'Consistent pipeline generation',
        'Coach junior sellers',
        'Drive strategic accounts',
      ],
    },
    presales: {
      registered: [
        'Join the partner portal',
        'Complete Anaplan Essentials',
        'Request demo environment access',
      ],
      trained: [
        'Level 1 Model Building',
        'Application Demo Mastery (focus area)',
        'SC / Finance Discovery Framework',
      ],
      certified: [
        'Pass Pre-Sales certification',
        'Gap-Fit Analysis Methodology',
        'Technical Objection Handling',
      ],
      delivering: [
        'Deliver 3 coached application demos',
        'Architect first client solution',
        'Complete POC Development & Delivery',
      ],
      expert: [
        'Lead complex multi-app solutions',
        'Mentor other pre-sales resources',
        'Architect enterprise-scale solutions',
      ],
    },
    delivery: {
      registered: [
        'Join the partner portal',
        'Complete resource profile',
        'Begin Anaplan Essentials',
      ],
      trained: [
        'Level 1 Model Building',
        'Application Overview (focus area)',
        'Attend Delivery Workshop',
      ],
      certified: [
        'Pass L1 Model Builder Certification',
        'Complete Application Configurator',
        'Complete Delivery Blueprint',
      ],
      delivering: [
        'Complete first supervised client project',
        'Earn Anaplan SA scorecard',
        'Pass peer review',
      ],
      expert: [
        'Lead independent client deliveries',
        'Mentor junior delivery resources',
        'Earn Connected Planning designation',
      ],
    },
  };
</script>

<div class="rs-stage">

  <!-- Left: main content -->
  <div class="rs-main">

    <!-- Role selector cards -->
    <div class="rs-roles">
      {#each roles as role (role.id)}
        <button
          class="rs-role-card"
          class:selected={selected === role.id}
          onclick={() => (selected = role.id)}
        >
          <div class="rs-role-icon">{role.icon}</div>
          <div class="rs-role-name">{role.label}</div>
          <div class="rs-role-desc">{role.desc}</div>
        </button>
      {/each}
    </div>

    <!-- Flow chart — only visible once a role is selected -->
    {#if selected}
      <div class="rs-flow">
        {#each flow as step, i (step.id)}
          {#if i > 0}
            <div class="rs-arrow">→</div>
          {/if}
          <div class="rs-step">
            <div class="rs-step-header">
              <span class="rs-step-num">{i + 1}</span>
              <span class="rs-step-label">{step.label}</span>
              <span class="rs-step-duration">{step.duration}</span>
            </div>
            <ul class="rs-step-tasks">
              {#each content[selected][step.id] as task}
                <li>{task}</li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    {/if}

  </div>

  <!-- Right: questions column -->
  <div class="rs-questions">
    {#each questions as q, i}
      <div class="rs-question" class:rs-question-top={i === 0}>
        <span class="rs-question-mark">?</span>
        <span class="rs-question-text">{q.text}</span>
      </div>
    {/each}
  </div>

</div>

<style>
  .rs-stage {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    height: 100%;
    gap: 20px;
    padding: 24px 24px 24px 28px;
    overflow-y: auto;
  }

  /* ── Left column ── */
  .rs-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-width: 0;
  }

  /* ── Role cards ── */
  .rs-roles {
    display: flex;
    gap: 16px;
  }

  .rs-role-card {
    flex: 1;
    background: white;
    border: 2px solid var(--color-rule);
    border-top: 4px solid var(--color-ink);
    border-radius: 0 0 10px 10px;
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 10px;
    cursor: pointer;
    font: inherit;
    transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
  }

  .rs-role-card:hover {
    border-top-color: var(--color-orange);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(10, 47, 70, 0.08);
  }

  .rs-role-card.selected {
    border-top-color: var(--color-orange);
    border-color: var(--color-orange);
    box-shadow: 0 0 0 3px rgba(255, 97, 0, 0.12);
  }

  .rs-role-icon  { font-size: 38px; line-height: 1; }
  .rs-role-name  { font-size: 16px; font-weight: bold; color: var(--color-ink); }
  .rs-role-desc  { font-size: 12px; color: var(--color-muted); line-height: 1.5; }

  /* ── Flow chart ── */
  .rs-flow {
    display: flex;
    align-items: flex-start;
    animation: fade-in 220ms ease;
  }

  @keyframes fade-in {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .rs-arrow {
    flex-shrink: 0;
    font-size: 18px;
    color: var(--color-orange);
    padding: 0 4px;
    margin-top: 16px;
  }

  .rs-step {
    flex: 1;
    background: white;
    border: 1px solid var(--color-rule);
    border-radius: 10px;
    overflow: hidden;
    min-width: 0;
  }

  .rs-step-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    background: var(--color-ink);
    color: white;
  }

  .rs-step-num {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--color-orange);
    font-size: 10px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .rs-step-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.03em;
    white-space: nowrap;
    flex: 1;
  }

  .rs-step-duration {
    font-size: 9px;
    font-weight: 600;
    color: var(--color-orange);
    white-space: nowrap;
    opacity: 0.9;
  }

  .rs-step-tasks {
    margin: 0;
    padding: 10px 12px 10px 26px;
    list-style: disc;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .rs-step-tasks li {
    font-size: 11px;
    color: var(--color-ink);
    line-height: 1.4;
  }

  /* ── Right questions column ── */
  .rs-questions {
    width: 200px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-top: 4px;
  }

  .rs-question {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 10px 12px;
    background: white;
    border: 1px dashed var(--color-rule);
    border-radius: 8px;
  }

  .rs-question-top {
    border-color: var(--color-orange);
    border-style: solid;
    border-left-width: 3px;
  }

  .rs-question-mark {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--color-ink);
    color: white;
    font-size: 11px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .rs-question-text {
    font-size: 12px;
    font-weight: 600;
    color: var(--color-ink);
    line-height: 1.4;
  }
</style>
