<script lang="ts">
  const rows = [
    {
      pillar: 'Content & Delivery',
      fromWord: 'Bespoke & Slow',
      fromDesc: 'Delivery is manual, custom-built, and high-touch. Enablement simply isn\'t happening fast enough — the reach is too limited, too slow, and dependent on too few people.',
      toWord: 'Digital-First & Scalable',
      toDesc: 'A library of reusable, just-in-time digital assets (self-paced, hands-on labs) that scale reach without scaling headcount — ILT reserved for high-value strategic engagements.'
    },
    {
      pillar: 'Enablement Model & Experience',
      fromWord: 'Fragmented',
      fromDesc: 'Disjointed systems (Academy, Seismic), ad-hoc activities, and static PowerPoint Blueprints — not scalable, tied linearly to headcount.',
      toWord: 'Connected',
      toDesc: 'A single partner portal with persona-based journeys for Sellers, Pre-sellers, and Delivery — configurable, measurable, and charting a clear path from registration to expertise.'
    },
    {
      pillar: 'Learning Approach',
      fromWord: 'Siloed',
      fromDesc: 'Content created in isolation for specific teams — significant duplication and inconsistent messaging across internal and partner-facing materials.',
      toWord: 'Unified',
      toDesc: 'A single set of cross-functionally owned journeys leveraged for all roles — internal and external — ensuring consistent standards and maximising efficiency.'
    },
    {
      pillar: 'Integration with Partner Program',
      fromWord: 'Disconnected',
      fromDesc: 'Enablement exists outside of the formal partner program. Training completion is ad-hoc and does not systematically affect a partner\'s tier, benefits, or recognition.',
      toWord: 'Integrated',
      toDesc: 'Enablement is a core, integrated component of the partner program. Completion of learning journeys and certifications directly impacts how partners are recognized and rewarded, influencing their tier progression and benefits.'
    },
    {
      pillar: 'Measurement & Impact',
      fromWord: 'Activity-Based',
      fromDesc: 'Success measured by attendance metrics not tied to outcomes. Progress hard to track, data siloed, partner capability unclear.',
      toWord: 'Outcome-Driven',
      toDesc: 'Measured against Pipeline Generation, Win Rate, and Delivery Quality — with clear tracking of individual progress and capabilities.'
    },
    {
      pillar: 'Enablement Team Focus',
      fromWord: 'Bottleneck',
      fromDesc: 'Enablement teams spend significant time on low-value admin tasks — scheduling, ops, content admin — acting as a bottleneck rather than a multiplier.',
      toWord: 'Strategic',
      toDesc: 'Enablement teams elevated to high-value advisory roles. Admin automated — focus shifts to partner solutions, pre-sales support, and implementation quality.'
    },
    {
      pillar: 'Governance & Operations',
      fromWord: 'Ad Hoc',
      fromDesc: 'Fragmented ownership, unclear RACI. New products launched without enablement. Provisioning and cert tracking are manual and cumbersome.',
      toWord: 'Governed',
      toDesc: 'Formal Operating Committee established. Enablement is a required component of every product launch. Operational tasks are automated.'
    }
  ];
</script>

<div class="cf-stage">
  <div class="cf-table-wrap">
    <table class="cf-table">
      <thead>
        <tr>
          <th class="cf-th cf-th-pillar">Pillar</th>
          <th class="cf-th cf-th-from">Current State</th>
          <th class="cf-th cf-th-arrow"></th>
          <th class="cf-th cf-th-to">Future State</th>
        </tr>
      </thead>
      <tbody>
        {#each rows as row}
          <tr class="cf-row">
            <td class="cf-td cf-td-pillar">{row.pillar}</td>
            <td class="cf-td cf-td-from">
              <span class="cf-keyword cf-keyword-from">{row.fromWord}</span>
              <span class="cf-desc">{row.fromDesc}</span>
            </td>
            <td class="cf-td cf-td-arrow">→</td>
            <td class="cf-td cf-td-to">
              <span class="cf-keyword cf-keyword-to">{row.toWord}</span>
              <span class="cf-desc">{row.toDesc}</span>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  .cf-stage {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding: 0;
    background: #f5f4f0;
    overflow: hidden;
  }

  .cf-table-wrap {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    background: white;
  }

  .cf-table {
    width: 100%;
    height: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  .cf-th {
    position: sticky;
    top: 0;
    padding: 10px 18px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    border-bottom: 3px solid #dedad4;
    background: #f5f4f0;
    z-index: 1;
  }

  .cf-th-pillar { width: 14%; text-align: left; color: #0a2f46; }
  .cf-th-from   { width: 39%; text-align: left; color: #991B1B; }
  .cf-th-arrow  { width: 4%;  text-align: center; }
  .cf-th-to     { width: 43%; text-align: left; color: #1a7a47; }

  .cf-row:not(:last-child) .cf-td {
    border-bottom: 1px solid #eeecea;
  }

  .cf-td {
    padding: 14px 18px;
    font-size: 14px;
    line-height: 1.55;
    vertical-align: top;
  }

  .cf-td-pillar {
    font-weight: 700;
    color: #0a2f46;
    font-size: 13px;
    border-right: 1px solid #eeecea;
  }

  .cf-td-from {
    color: #5a1e1e;
    background: #fff8f8;
  }

  .cf-keyword {
    display: block;
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.01em;
    line-height: 1.1;
    margin-bottom: 5px;
  }

  .cf-keyword-from { color: #991B1B; }
  .cf-keyword-to   { color: #1a7a47; }

  .cf-desc {
    display: block;
    font-size: 12px;
    font-style: italic;
    font-weight: 400;
    line-height: 1.5;
    opacity: 0.85;
  }

  .cf-td-arrow {
    text-align: center;
    font-size: 22px;
    color: #FF6100;
    font-weight: 700;
    vertical-align: middle;
  }

  .cf-td-to {
    color: #1a3d26;
    background: #f4fbf6;
  }

  .cf-td-from .cf-desc { color: #5a1e1e; }
  .cf-td-to   .cf-desc { color: #1a3d26; }
</style>
