<script lang="ts">
  import { risk } from '$lib/data';
</script>

<div class="risk-stage">
  <div class="risk-hdr">
    <div class="risk-title">⚠ {risk.title}</div>
    <div class="risk-sub">{risk.subtitle}</div>
  </div>

  <div class="risk-body">
    <!-- Left column: what we have -->
    <div class="risk-have">
      <div class="risk-panel">
        <div class="risk-panel-title">Current Academy</div>
        <div class="risk-stat">
          <div class="risk-num">{risk.academy.totalCourses}</div>
          <div class="risk-unit">courses<br />available</div>
        </div>
        <div class="risk-breakdown">
          {#each risk.academy.breakdown as row}
            <div class="risk-row">
              <span class="risk-row-name">{row.name}</span>
              <span class="risk-row-val">{row.count}</span>
            </div>
          {/each}
        </div>
      </div>
      <div class="risk-panel">
        <div class="risk-panel-title">What full coverage needs</div>
        <div class="risk-stat">
          <div class="risk-num risk-num-red">{risk.required.slots}+</div>
          <div class="risk-unit">course-journey<br />slots required</div>
        </div>
        <div class="risk-formula">
          {risk.required.formula}<br />
          Current coverage: <strong class="risk-num-red">{risk.required.currentCoverage}</strong>
        </div>
      </div>
    </div>

    <!-- Right column: gap bars -->
    <div class="risk-gaps">
      {#each risk.gaps as gap}
        <div class="risk-gap-row">
          <div class="risk-gap-header">
            <div class="risk-gap-name">{gap.name}</div>
            <div class="risk-gap-ratio">{gap.available} available · <strong>{gap.needed} needed</strong></div>
          </div>
          <div class="risk-gap-bar-bg">
            <div
              class="risk-gap-bar-fill {gap.severity}"
              style="width: {gap.coveragePct}%"
            ></div>
          </div>
          <div class="risk-gap-detail">
            <span><strong>Coverage: ~{gap.coveragePct}%</strong></span>
            <span>{gap.detail}</span>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <div class="risk-flags">
    {#each risk.flags as flag}
      <div class="risk-flag">
        <div class="risk-flag-title">{flag.title}</div>
        <div class="risk-flag-body">{flag.body}</div>
      </div>
    {/each}
  </div>
</div>
