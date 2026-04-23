<script lang="ts">
  import RaciTable from './RaciTable.svelte';
  import type { RaciRow } from './RaciTable.svelte';

  const achievements: RaciRow[] = [
    { activity: 'Define achievement criteria & standards',  r: 'PSM',     a: 'PSM',     c: 'Acad',    i: 'P.Lead'  },
    { activity: 'Map achievements to journey milestones',   r: 'PSM',     a: 'PSM',     c: 'Acad',    i: 'P.Res'   },
    { activity: 'Validate & review earning submissions',    r: 'ProfSvc', a: 'PSM',     c: 'Acad',    i: 'P.Res'   },
    { activity: 'Award designations & digital badges',      r: 'PSM',     a: 'PSM',     c: 'Acad',    i: 'P.Lead'  },
    { activity: 'Track & report attainment data',           r: 'PSM',     a: 'PSM',     c: 'P.Lead',  i: 'Acad'    },
    { activity: 'Promote achievement value to partners',    r: 'PSM',     a: 'PSM',     c: 'P.Lead',  i: 'P.Res'   },
  ];

  const journeys: RaciRow[] = [
    { activity: 'Define role journey structure & stages',   r: 'PSM',     a: 'Mariel',  c: 'Acad',    i: 'P.Lead'          },
    { activity: 'Define stage gates & progression criteria',r: 'PSM',     a: 'Mariel',  c: 'ProfSvc', i: 'P.Lead'          },
    { activity: 'Governance & sign-off on journeys',        r: 'P.Lead',  a: 'Mariel',  c: 'PSM',     i: 'Field Leadership'},
    { activity: 'Assign partners to journey paths',         r: 'PSM',     a: 'Mariel',  c: 'P.Lead',  i: 'P.Res'           },
    { activity: 'Complete journey tasks & submit evidence', r: 'P.Res',   a: 'Mariel',  c: 'ProfSvc', i: 'P.Lead'          },
    { activity: 'Approve stage progression',                r: 'ProfSvc', a: 'Mariel',  c: 'P.Lead',  i: 'P.Res'           },
    { activity: 'Monitor journey health & completion rates',r: 'PSM',     a: 'Mariel',  c: 'Acad',    i: 'P.Lead'          },
    { activity: 'Enroll learners & manage access',          r: 'PSM',     a: 'Mariel',  c: 'P.Lead',  i: 'P.Res'           },
    { activity: 'Define key performance metrics and objectives', r: 'PSM', a: 'Mariel',  c: 'P.Lead',  i: 'Field Leadership'},
    { activity: 'Track module completion & progress',           r: 'PSM', a: 'PSM',     c: 'Acad',    i: 'P.Lead'          },
  ];

  const selfPaced: RaciRow[] = [
    { activity: 'Identify content gaps & priorities',       r: 'PSM',  a: 'Acad',  c: 'Prod',    i: 'P.Lead' },
    { activity: 'Commission & author course content',       r: 'Acad', a: 'Acad',  c: 'ProfSvc', i: 'PSM'    },
  ];

  const capstone: RaciRow[] = [
    { activity: 'Design capstone scenario & rubric',        r: 'ProfSvc', a: 'PSM',     c: 'Acad',    i: 'P.Lead' },
    { activity: 'Build hands-on lab environments',          r: 'ProfSvc', a: 'ProfSvc', c: 'Acad',    i: 'PSM'    },
    { activity: 'Facilitate & deliver workshops',           r: 'PSM',     a: 'PSM',     c: 'ProfSvc', i: 'P.Res'  },
    { activity: 'Schedule sessions & enroll partners',      r: 'PSM',     a: 'PSM',     c: 'P.Lead',  i: 'P.Res'  },
    { activity: 'Assess submissions & grade capstone work', r: 'ProfSvc', a: 'PSM',     c: 'Acad',    i: 'P.Res'  },
    { activity: 'Certify completion & award credit',        r: 'ProfSvc', a: 'PSM',     c: 'Acad',    i: 'P.Res'  },
    { activity: 'Collect & act on participant feedback',    r: 'PSM',     a: 'PSM',     c: 'ProfSvc', i: 'P.Lead' },
  ];

  const masterclass: RaciRow[] = [
    { activity: 'Define masterclass types & eligibility',   r: 'ProfSvc', a: 'PSM',     c: 'Acad',    i: 'P.Lead' },
    { activity: 'Identify & qualify participants',          r: 'PSM',     a: 'PSM',     c: 'P.Lead',  i: 'P.Res'  },
    { activity: 'Source & prepare SME facilitators',        r: 'ProfSvc', a: 'ProfSvc', c: 'PSM',     i: 'Acad'   },
    { activity: 'Schedule & confirm engagements',           r: 'PSM',     a: 'PSM',     c: 'P.Lead',  i: 'P.Res'  },
    { activity: 'Deliver expert-led masterclass sessions',  r: 'ProfSvc', a: 'ProfSvc', c: 'PSM',     i: 'P.Res'  },
    { activity: 'Capture outcomes & follow-up actions',     r: 'PSM',     a: 'PSM',     c: 'ProfSvc', i: 'P.Lead' },
    { activity: 'Measure engagement effectiveness & NPS',   r: 'PSM',     a: 'PSM',     c: 'ProfSvc', i: 'Acad'   },
  ];
</script>

<div class="scrubber-stage">

  <!-- Legend -->
  <div class="fr-legend">
    <span class="fr-legend-r">R = Responsible</span>
    <span class="fr-legend-a">A = Accountable</span>
    <span class="fr-legend-c">C = Consulted</span>
    <span class="fr-legend-i">I = Informed</span>
    <span class="fr-legend-roles">Roles: Acad = Academy · PSM = Partner Success · ProfSvc = Professional Services · P.Lead = Partner Leadership · P.Res = Partner Resource · Prod = Product</span>
  </div>

  <!-- Layer 3: Achievements -->
  <div class="layer layer-outcomes">
    <div class="side-label">
      <div class="sl-num">Layer 3</div>
      <div class="sl-name">Achievements</div>
      <div class="sl-desc">Designations &amp; recognition</div>
    </div>
    <div class="fr-layer-body">
      <div class="fr-raci-wrap">
        <RaciTable title="Achievements" rows={achievements} />
      </div>
    </div>
  </div>

  <!-- Layer 2: Journeys -->
  <div class="layer layer-journeys">
    <div class="side-label">
      <div class="sl-num">Layer 2</div>
      <div class="sl-name">Journeys</div>
      <div class="sl-desc">Role &amp; product paths</div>
    </div>
    <div class="fr-layer-body">
      <div class="fr-raci-wrap fr-raci-wrap-scroll">
        <RaciTable title="Journeys" rows={journeys} />
      </div>
    </div>
  </div>

  <!-- Layer 1: Enablement Assets (3 RACIs) -->
  <div class="layer layer-assets">
    <div class="side-label">
      <div class="sl-num">Layer 1</div>
      <div class="sl-name">Enablement Assets</div>
      <div class="sl-desc">Courses, workshops &amp; engagements</div>
    </div>
    <div class="fr-layer-body fr-layer-body-assets">
      <div class="fr-raci-wrap">
        <RaciTable title="Digital Learning" rows={selfPaced} />
      </div>
      <div class="fr-raci-wrap">
        <RaciTable title="Capstone Projects / Hands-On Workshops" rows={capstone} />
      </div>
      <div class="fr-raci-wrap">
        <RaciTable title="Masterclass & Continuous Learning" rows={masterclass} />
      </div>
    </div>
  </div>

</div>

<style>
  .fr-legend {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 5px 16px;
    background: white;
    border-bottom: 1px solid var(--color-rule);
    flex-shrink: 0;
    flex-wrap: wrap;
  }

  .fr-legend-r  { font-size: 9px; font-weight: 700; color: #1a5276; }
  .fr-legend-a  { font-size: 9px; font-weight: 700; color: #b74a0c; }
  .fr-legend-c  { font-size: 9px; font-weight: 700; color: #1a7a47; }
  .fr-legend-i  { font-size: 9px; font-weight: 700; color: #888; }
  .fr-legend-roles { font-size: 9px; color: var(--color-muted); margin-left: auto; }

  .fr-layer-body {
    flex: 1;
    display: flex;
    align-items: stretch;
    padding: 8px 14px;
    min-width: 0;
    overflow: hidden;
  }

  .fr-layer-body-assets {
    gap: 10px;
  }

  .fr-raci-wrap {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: stretch;
  }

  .fr-raci-wrap-scroll {
    overflow-y: auto;
    align-items: flex-start;
    /* Parent must not clip the scrollbar */
    overflow-x: hidden;
  }

  .layer-journeys .fr-layer-body {
    overflow: visible;
  }
</style>
