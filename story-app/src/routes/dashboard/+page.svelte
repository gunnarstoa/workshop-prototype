<script lang="ts">
  const labs = [
    { group: 'Territory & Quota', labs: ['Functional Overview', 'Configuration', 'Data Integration', 'Extensions'] },
    { group: 'Account Segmentation', labs: ['Functional Overview', 'Configuration', 'Scoring Rules', 'Validation'] },
    { group: 'Capacity Planning', labs: ['Functional Overview', 'Configuration', 'Scenario Modeling', 'Reporting'] },
    { group: 'Sales Forecasting', labs: ['Functional Overview', 'Configuration', 'Pipeline Integration', 'Forecast Review'] },
  ];

  type Status = 'green' | 'yellow' | 'red';

  const participants: { name: string; partner: string; statuses: Status[][] }[] = [
    { name: 'Sarah Chen', partner: 'Accenture', statuses: [['green','green','green','green'],['green','green','green','green'],['green','green','green','yellow'],['green','green','yellow','yellow']] },
    { name: 'James Rodriguez', partner: 'Deloitte', statuses: [['green','green','green','green'],['green','green','green','green'],['green','green','green','green'],['green','green','green','green']] },
    { name: 'Priya Patel', partner: 'Wipro', statuses: [['green','green','green','green'],['green','green','green','green'],['green','green','green','green'],['green','green','green','yellow']] },
    { name: 'Michael Torres', partner: 'PwC', statuses: [['green','green','green','green'],['green','green','green','green'],['green','green','yellow','yellow'],['green','yellow','yellow','yellow']] },
    { name: 'Emily Watson', partner: 'Cognizant', statuses: [['green','green','green','green'],['green','green','green','green'],['green','green','green','green'],['green','green','green','green']] },
    { name: 'Raj Krishnamurthy', partner: 'Infosys', statuses: [['green','green','green','green'],['green','green','green','green'],['green','green','green','green'],['green','green','green','green']] },
    { name: 'Lisa Nakamura', partner: 'Accenture', statuses: [['green','green','green','green'],['green','green','green','green'],['green','green','green','green'],['green','green','yellow','yellow']] },
    { name: 'David Kim', partner: 'KPMG', statuses: [['green','green','green','green'],['green','green','green','green'],['green','green','green','green'],['green','green','green','green']] },
    { name: 'Ana Sokolov', partner: 'Capgemini', statuses: [['green','green','green','yellow'],['green','green','yellow','yellow'],['green','yellow','yellow','yellow'],['yellow','yellow','yellow','yellow']] },
    { name: 'Chris Anderson', partner: 'Deloitte', statuses: [['green','green','green','green'],['green','green','green','green'],['green','green','green','green'],['green','green','green','green']] },
    { name: 'Maria Gonzalez', partner: 'PwC', statuses: [['green','green','green','green'],['green','green','green','green'],['green','green','green','green'],['green','green','green','green']] },
    { name: 'Tom Bennett', partner: 'Wipro', statuses: [['green','green','green','green'],['green','green','green','green'],['green','green','green','yellow'],['green','green','yellow','yellow']] },
    { name: 'Yuki Tanaka', partner: 'Cognizant', statuses: [['green','green','green','green'],['green','green','green','green'],['green','green','green','green'],['green','green','green','green']] },
    { name: 'Robert Hayes', partner: 'Infosys', statuses: [['green','green','green','green'],['green','green','green','green'],['green','green','green','green'],['green','green','green','green']] },
    { name: 'Nina Petrova', partner: 'KPMG', statuses: [['green','green','green','green'],['green','green','green','green'],['green','green','green','green'],['green','green','green','yellow']] },
    { name: 'Alex Dumont', partner: 'Capgemini', statuses: [['green','green','green','green'],['green','green','green','green'],['green','green','yellow','yellow'],['green','yellow','yellow','yellow']] },
    { name: 'Rachel Morrison', partner: 'Accenture', statuses: [['green','green','green','green'],['green','green','green','green'],['green','green','green','green'],['green','green','green','green']] },
    { name: 'Kevin Okafor', partner: 'Deloitte', statuses: [['green','green','yellow','yellow'],['green','yellow','yellow','yellow'],['yellow','yellow','yellow','yellow'],['yellow','yellow','yellow','yellow']] },
    { name: 'Jordan Blake', partner: 'PwC', statuses: [['red','red','red','red'],['red','red','red','red'],['red','red','red','red'],['red','red','red','red']] },
  ];

  const totalLabs = labs.reduce((n, g) => n + g.labs.length, 0);

  function countByStatus(status: Status) {
    let count = 0;
    for (const p of participants) {
      for (const group of p.statuses) {
        for (const s of group) {
          if (s === status) count++;
        }
      }
    }
    return count;
  }

  const totalCells = participants.length * totalLabs;
  const greenCount = countByStatus('green');
  const yellowCount = countByStatus('yellow');
  const redCount = countByStatus('red');
  const completionPct = Math.round((greenCount / totalCells) * 100);
</script>

<div class="db-stage">
  <div class="db-header">
    <div class="db-header-left">
      <div class="db-eyebrow">Facilitator Dashboard</div>
      <div class="db-title">RPM Apps Tech Enablement Workshop</div>
      <div class="db-sub">{participants.length} participants · {labs.length} application modules · {totalLabs} labs</div>
    </div>
    <div class="db-stats">
      <div class="db-stat">
        <div class="db-stat-num">{completionPct}%</div>
        <div class="db-stat-label">Overall Completion</div>
      </div>
      <div class="db-stat">
        <div class="db-stat-dot green"></div>
        <div class="db-stat-val">{greenCount}</div>
      </div>
      <div class="db-stat">
        <div class="db-stat-dot yellow"></div>
        <div class="db-stat-val">{yellowCount}</div>
      </div>
      <div class="db-stat">
        <div class="db-stat-dot red"></div>
        <div class="db-stat-val">{redCount}</div>
      </div>
    </div>
  </div>

  <div class="db-table-wrap">
    <table class="db-table">
      <thead>
        <tr>
          <th class="db-th-name" rowspan="2">Participant</th>
          <th class="db-th-partner" rowspan="2">Partner</th>
          {#each labs as group}
            <th class="db-th-group" colspan={group.labs.length}>{group.group}</th>
          {/each}
        </tr>
        <tr>
          {#each labs as group}
            {#each group.labs as lab}
              <th class="db-th-lab">{lab}</th>
            {/each}
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each participants as p, pi}
          <tr class:db-row-alert={p.statuses.flat().every(s => s === 'red')}>
            <td class="db-td-name">{p.name}</td>
            <td class="db-td-partner">{p.partner}</td>
            {#each p.statuses as groupStatuses}
              {#each groupStatuses as status}
                <td class="db-td-status">
                  <div class="db-dot {status}"></div>
                </td>
              {/each}
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
