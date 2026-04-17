<script lang="ts">
  import { products } from '$lib/data';
</script>

<div class="center-stage">
  <div style="width:100%;max-width:1200px;display:flex;flex-direction:column;gap:14px;">
    <div style="text-align:center;margin-bottom:4px;">
      <div style="font-size:18px;font-weight:bold;color:var(--color-ink);">Our Products</div>
      <div style="font-size:11px;color:var(--color-muted);margin-top:3px;">
        Read live from <code>src/lib/data/products.json</code> — edit the file and the UI updates on save
      </div>
    </div>

    <div class="group-grid">
      {#each products.groups as group (group.id)}
        <div class="group-card">
          <h3>{group.name}</h3>
          {#each group.products as product (product.id)}
            <div class="product">
              <strong>{product.name}</strong>
              {#if product.description}
                <span class="desc">{product.description}</span>
              {/if}
            </div>
          {/each}
        </div>
      {/each}
    </div>
  </div>
</div>
