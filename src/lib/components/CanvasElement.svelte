<script lang="ts">
  import { CanvasData } from "../snarky/helpers/CanvasData";
  import { updateCanvasStore } from "../stores/canvasDataStore";

  export let canvas: CanvasData;

  if (!canvas) {
    canvas = CanvasData.blank();
  }

  const switchPixel = async (i: number, j: number) => {
    await updateCanvasStore(i, j, canvas);
  };
</script>

<div class="grid">
  {#each canvas.value as row, i}
    <div class="flex">
      {#each row as item, j}
        {#if item}
          <div
            class="p-1 m-1 w-1 h-1 border border-solid border-gray-100 bg-purple-800"
            on:click={() => switchPixel(i, j)}
          />
        {:else}
          <div
            class="p-1 m-1 w-1 h-1 border border-solid border-gray-100 bg-orange-100"
            on:click={() => switchPixel(i, j)}
          />
        {/if}
      {/each}
    </div>
  {/each}
</div>
