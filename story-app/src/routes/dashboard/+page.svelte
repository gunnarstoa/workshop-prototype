<script lang="ts">
  const labs = [
    { group: 'Territory & Quota', labs: ['Functional Overview', 'Configuration', 'Data Integration', 'Extensions'] },
    { group: 'Account Segmentation', labs: ['Functional Overview', 'Configuration', 'Scoring Rules', 'Validation'] },
    { group: 'Capacity Planning', labs: ['Functional Overview', 'Configuration', 'Scenario Modeling', 'Reporting'] },
    { group: 'Sales Forecasting', labs: ['Functional Overview', 'Configuration', 'Pipeline Integration', 'Forecast Review'] },
  ];


  // Statuses per group: [Func Overview, Configuration, Scenario Modeling/Scoring/etc, Extensions/Validation/etc]
  // Capacity Planning cols: [Func Overview, Configuration, Scenario Modeling, Reporting]
  // "grey" = not started. Scenario Modeling (col 3 in each group) and everything right = grey for all except Jordan (all red)
  // Capacity Planning Configuration (group 3, col 2) = flashing yellow for all except Jordan

  type Status = 'green' | 'yellow' | 'red' | 'grey';

  // Helper: standard participant row — green for completed labs, yellow-flash for CP config, grey for not-yet-reached
  function stdRow(cpConfig: Status = 'green'): Status[][] {
    return [
      ['green','green','green','green'],          // T&Q: all done
      ['green','green','green','green'],          // Segmentation: all done
      ['green', cpConfig, 'grey','grey'],         // Capacity: overview done, config in progress, rest not started
      ['grey','grey','grey','grey'],              // Sales Forecasting: not started
    ];
  }

  const participants: { name: string; partner: string; statuses: Status[][] }[] = [
    { name: 'Sarah Chen', partner: 'Accenture', statuses: stdRow() },
    { name: 'James Rodriguez', partner: 'Deloitte', statuses: stdRow() },
    { name: 'Priya Patel', partner: 'Tru', statuses: stdRow() },
    { name: 'Michael Torres', partner: 'Spaulding Ridge', statuses: stdRow('yellow') },
    { name: 'Emily Watson', partner: 'Slalom', statuses: stdRow() },
    { name: 'Raj Krishnamurthy', partner: 'Argano', statuses: stdRow() },
    { name: 'Lisa Nakamura', partner: 'Accenture', statuses: stdRow() },
    { name: 'David Kim', partner: 'Deloitte', statuses: stdRow('yellow') },
    { name: 'Ana Sokolov', partner: 'Tru', statuses: stdRow('yellow') },
    { name: 'Chris Anderson', partner: 'Spaulding Ridge', statuses: stdRow() },
    { name: 'Maria Gonzalez', partner: 'Slalom', statuses: stdRow() },
    { name: 'Tom Bennett', partner: 'Argano', statuses: stdRow() },
    { name: 'Yuki Tanaka', partner: 'Accenture', statuses: stdRow() },
    { name: 'Robert Hayes', partner: 'Deloitte', statuses: stdRow() },
    { name: 'Nina Petrova', partner: 'Tru', statuses: stdRow('yellow') },
    { name: 'Alex Dumont', partner: 'Spaulding Ridge', statuses: stdRow() },
    { name: 'Rachel Morrison', partner: 'Slalom', statuses: stdRow() },
    { name: 'Kevin Okafor', partner: 'Argano', statuses: stdRow('yellow') },
    { name: 'Jordan Blake', partner: 'Deloitte', statuses: [['green','green','yellow','yellow'],['red','red','red','red'],['red','red','grey','grey'],['grey','grey','grey','grey']] },
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
                  <div class="db-dot {status}" class:flash={status === 'yellow'}></div>
                </td>
              {/each}
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
