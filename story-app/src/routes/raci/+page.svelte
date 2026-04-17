<script lang="ts">
  import { raci } from '$lib/data';

  const colorMap: Record<string, { color: string; cls: string }> = {
    R: { color: '#991B1B', cls: 'raci-r' },
    A: { color: '#C06010', cls: 'raci-a' },
    C: { color: '#1A5276', cls: 'raci-c' },
    I: { color: '#888888', cls: 'raci-i' },
    'R/A': { color: '#B74A0C', cls: 'raci-ra' }
  };
</script>

<div class="raci-stage">
  <div class="raci-header">
    <div>
      <div class="raci-title">{raci.title}</div>
      <div class="raci-sub">{raci.subtitle}</div>
    </div>
    <div class="raci-badge">Draft</div>
  </div>

  <div class="raci-table-wrap">
    <table class="raci-table">
      <thead>
        <tr>
          <th class="raci-act-col">Activity</th>
          {#each raci.roles as role}
            <th>{role}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each raci.activities as activity}
          <tr>
            <td class="raci-act-name">{activity.name}</td>
            {#each activity.assignments as assignment}
              {@const style = colorMap[assignment] ?? colorMap['I']}
              <td>
                <span class={style.cls}>{assignment}</span>
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <div class="raci-legend">
    <span><strong class="raci-r">R</strong> = Responsible (does the work)</span>
    <span><strong class="raci-a">A</strong> = Accountable (owns the outcome)</span>
    <span><strong class="raci-c">C</strong> = Consulted (input required)</span>
    <span class="raci-i-legend"><strong class="raci-i">I</strong> = Informed (kept in the loop)</span>
  </div>
</div>
