<script lang="ts">
  const data = {
    title: 'Content Coverage Gap — 9 Product Journeys',
    subtitle: 'Coverage across IFP · FCR · Inventory · Demand · MFP · OWP · RPM · AI Foundations · Platform Foundations',
    academy: {
      totalCourses: 68,
      breakdown: [
        { name: 'IFP / Finance Planning',       count: 21 },
        { name: 'AI Foundations',               count: 12 },
        { name: 'Supply Chain (Inv / Demand)',  count: 10 },
        { name: 'FCR / Financial Close',        count: 8  },
        { name: 'Platform Foundations',         count: 6  },
        { name: 'OWP / Workforce',              count: 4  },
        { name: 'RPM / Revenue',                count: 4  },
        { name: 'MFP / Retail',                 count: 3  }
      ]
    },
    required: {
      slots: 216,
      formula: '9 journeys × 3 roles × 8 courses = 216 dedicated slots',
      currentCoverage: '~31%'
    },
    gaps: [
      { name: 'IFP',                  available: 21, needed: 24, coveragePct: 88, severity: 'ok',     detail: 'Best-covered journey — delivery content strong, Sales/Pre-Sales variants emerging' },
      { name: 'AI Foundations',       available: 12, needed: 24, coveragePct: 50, severity: 'warn',   detail: 'Growing fast — delivery content exists, Sales and Pre-Sales coverage thin' },
      { name: 'FCR',                  available: 8,  needed: 24, coveragePct: 33, severity: 'warn',   detail: 'Close & reporting content exists but role-specific depth is limited' },
      { name: 'Platform Foundations', available: 6,  needed: 24, coveragePct: 25, severity: 'warn',   detail: 'ADO and Polaris content available; Sales/Pre-Sales journeys largely absent' },
      { name: 'Inventory Planning',   available: 5,  needed: 24, coveragePct: 21, severity: 'danger', detail: 'Supply chain content spread thin; no dedicated role-specific tracks' },
      { name: 'Demand Planning',      available: 5,  needed: 24, coveragePct: 21, severity: 'danger', detail: 'Overlaps with Inventory content — distinct journey depth missing' },
      { name: 'OWP',                  available: 4,  needed: 24, coveragePct: 17, severity: 'danger', detail: 'Limited workforce planning content; all roles underserved' },
      { name: 'RPM',                  available: 3,  needed: 24, coveragePct: 13, severity: 'danger', detail: 'Revenue planning content minimal — Sales journey most impacted' },
      { name: 'MFP',                  available: 3,  needed: 24, coveragePct: 13, severity: 'danger', detail: 'Retail merchandise planning has the least dedicated content of all 9 journeys' }
    ],
    flags: [
      { title: 'IFP is the Exception',       body: 'IFP has the deepest content library. The other 8 journeys average fewer than 6 courses each — far below what a 3-role, 5-stage journey requires.' },
      { title: 'Sales & Pre-Sales Blind Spot', body: 'Across all 9 journeys, Sales and Pre-Sales role-specific content is nearly absent. Most existing courses assume a Delivery audience.' },
      { title: 'Supply Chain & Retail Gap',  body: 'Inventory, Demand, MFP, and RPM combined have fewer than 16 relevant courses — insufficient for even a single well-supported journey.' }
    ]
  };
</script>

<div class="risk-stage">
  <div class="risk-hdr">
    <div class="risk-title">⚠ {data.title}</div>
    <div class="risk-sub">{data.subtitle}</div>
  </div>

  <div class="risk-body">
    <!-- Left column: what we have -->
    <div class="risk-have">
      <div class="risk-panel">
        <div class="risk-panel-title">Current Academy</div>
        <div class="risk-stat">
          <div class="risk-num">{data.academy.totalCourses}</div>
          <div class="risk-unit">courses<br />available</div>
        </div>
        <div class="risk-breakdown">
          {#each data.academy.breakdown as row}
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
          <div class="risk-num risk-num-red">{data.required.slots}+</div>
          <div class="risk-unit">course-journey<br />slots required</div>
        </div>
        <div class="risk-formula">
          {data.required.formula}<br />
          Current coverage: <strong class="risk-num-red">{data.required.currentCoverage}</strong>
        </div>
      </div>
    </div>

    <!-- Right column: gap bars -->
    <div class="risk-gaps">
      {#each data.gaps as gap}
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
    {#each data.flags as flag}
      <div class="risk-flag">
        <div class="risk-flag-title">{flag.title}</div>
        <div class="risk-flag-body">{flag.body}</div>
      </div>
    {/each}
  </div>
</div>
