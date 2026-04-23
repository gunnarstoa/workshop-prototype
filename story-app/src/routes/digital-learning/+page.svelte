<script lang="ts">
  import RaciTable from '../framework-raci/RaciTable.svelte';
  import type { RaciRow } from '../framework-raci/RaciTable.svelte';
  import RoleRaciTable from './RoleRaciTable.svelte';
  import type { RoleRow } from './RoleRaciTable.svelte';

  // Top card — activity labels only, columns and values blanked
  const digital: RaciRow[] = [
    { activity: 'Identify content gaps & priorities',  r: '', a: '', c: '', i: '' },
    { activity: 'Commission & author course content',  r: '', a: '', c: '', i: '' },
  ];

  const blank = (): RoleRow[] => [
    { activity: 'Identify',   academy: '', psm: '', sales: '', presales: '', ps: '', gtm: '', product: '', solmktg: '' },
    { activity: 'Create',     academy: '', psm: '', sales: '', presales: '', ps: '', gtm: '', product: '', solmktg: '' },
    { activity: 'Certify',    academy: 'R', psm: 'C', sales: 'C', presales: 'I', ps: 'C', gtm: 'C', product: 'I', solmktg: 'I' },
    { activity: 'Distribute', academy: 'R', psm: 'I', sales: '', presales: '', ps: '', gtm: '', product: '', solmktg: '' },
  ];

  const salesRows    = blank();
  salesRows[0] = { activity: 'Identify',   academy: 'I', psm: 'I',  sales: 'I', presales: '',  ps: '',  gtm: 'R', product: '',  solmktg: '' };
  salesRows[1] = { activity: 'Create',     academy: 'I', psm: 'C',  sales: 'I', presales: 'I', ps: 'I', gtm: 'A', product: 'I', solmktg: 'R' };

  const presalesRows = blank();
  presalesRows[0] = { activity: 'Identify', academy: 'I', psm: 'I', sales: '',  presales: 'R', ps: '', gtm: 'C', product: '', solmktg: '' };
  presalesRows[1] = { activity: 'Create',   academy: 'I', psm: 'C', sales: 'I', presales: 'R', ps: '', gtm: 'C', product: '', solmktg: '' };
  const deliveryRows = blank();
  deliveryRows[0] = { activity: 'Identify', academy: 'I', psm: 'C', sales: '',  presales: 'C', ps: 'R', gtm: 'C', product: 'I', solmktg: '' };
  deliveryRows[1] = { activity: 'Create',   academy: 'A', psm: 'C', sales: '',  presales: '',  ps: 'C', gtm: 'I', product: 'R', solmktg: '' };
</script>

<div class="dl-stage">

  <!-- Legend -->
  <div class="dl-legend">
    <span class="dl-leg-r">R = Responsible</span>
    <span class="dl-leg-a">A = Accountable</span>
    <span class="dl-leg-c">C = Consulted</span>
    <span class="dl-leg-i">I = Informed</span>
    <span class="dl-leg-roles">Roles: Acad = Academy · PSM = Partner Success · ProfSvc = Professional Services · P.Lead = Partner Leadership · Prod = Product · Sol.Mktg = Solution Marketing · Sol.Consult = Solution Consulting</span>
  </div>

  <!-- Top: Digital Learning summary card -->
  <div class="dl-top">
    <RaciTable title="Digital Learning" rows={digital} columns={['', '', '', '']} />
  </div>

  <!-- Arrow connector -->
  <div class="dl-connector">
    <div class="dl-arrow-line"></div>
    <div class="dl-arrow-branches">
      <div class="dl-branch"></div>
      <div class="dl-branch"></div>
      <div class="dl-branch"></div>
    </div>
  </div>

  <!-- Bottom: three role-specific cards -->
  <div class="dl-bottom">
    <div class="dl-role-card dl-role-sales">
      <RoleRaciTable title="Sales" rows={salesRows} />
    </div>
    <div class="dl-role-card dl-role-presales">
      <RoleRaciTable title="Pre-Sales" rows={presalesRows} />
    </div>
    <div class="dl-role-card dl-role-delivery">
      <RoleRaciTable title="Delivery" rows={deliveryRows} />
    </div>
  </div>

</div>

<style>
  .dl-stage {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding: 8px 20px 10px;
    gap: 0;
    overflow: hidden;
  }

  /* Legend */
  .dl-legend {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 4px 0 8px;
    flex-shrink: 0;
    flex-wrap: wrap;
    border-bottom: 1px solid var(--color-rule);
    margin-bottom: 10px;
  }
  .dl-leg-r  { font-size: 9px; font-weight: 700; color: #1a5276; }
  .dl-leg-a  { font-size: 9px; font-weight: 700; color: #b74a0c; }
  .dl-leg-c  { font-size: 9px; font-weight: 700; color: #1a7a47; }
  .dl-leg-i  { font-size: 9px; font-weight: 700; color: #888; }
  .dl-leg-roles { font-size: 9px; color: var(--color-muted); margin-left: auto; }

  /* Top card */
  .dl-top {
    flex-shrink: 0;
    width: 30%;
    align-self: center;
  }

  /* Connector */
  .dl-connector {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 32px;
    position: relative;
  }
  .dl-arrow-line {
    width: 2px;
    height: 14px;
    background: var(--color-orange, #FF6100);
    flex-shrink: 0;
  }
  .dl-arrow-branches {
    width: 66%;
    display: flex;
    justify-content: space-between;
    border-top: 2px solid var(--color-orange, #FF6100);
    margin-top: 0;
  }
  .dl-branch {
    width: 2px;
    height: 14px;
    background: var(--color-orange, #FF6100);
  }

  /* Bottom three cards */
  .dl-bottom {
    flex: 1;
    min-height: 0;
    display: flex;
    gap: 14px;
    align-items: stretch;
  }

  .dl-role-card {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    border-top: 4px solid transparent;
    border-radius: 0 0 8px 8px;
  }

  .dl-role-sales    { border-top-color: #1a5276; }
  .dl-role-presales { border-top-color: #7B3FA0; }
  .dl-role-delivery { border-top-color: #1a7a47; }
</style>
