<script lang="ts">
  import { CanvasData } from "../snarky/helpers/CanvasData";
  export let canvas: CanvasData;

  if (!canvas) {
    canvas = CanvasData.blank();
  }
</script>

<div class="grid">
  {#each canvas.value as row}
    <div class="flex">
      {#each row as item}
        {#if item}
          <div
            class="p-1 m-1 w-1 h-1 border border-solid border-red-100 bg-red-800"
          />
        {:else}
          <div
            class="p-1 m-1 w-1 h-1 border border-solid border-red-100 bg-white"
          />
        {/if}
      {/each}
    </div>
  {/each}
</div>
