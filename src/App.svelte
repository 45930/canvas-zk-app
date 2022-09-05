<script lang="ts">
  // import {
  //   loadSnarky,
  //   localMinaStore as minaStore,
  //   deployedZkAppsStore,
  //   canvasStore,
  // } from "./lib/stores/localMinaStore";

  import {
    loadSnarky,
    berkeleyMinaStore as minaStore,
    deployedZkAppsStore,
    canvasStore,
  } from "./lib/stores/berkeleyMinaStore";

  import { onMount } from "svelte";
  import CanvasElement from "./lib/components/CanvasElement.svelte";
  import { CanvasData } from "./lib/snarky/helpers/CanvasData";
  import { fetchAccount } from "snarkyjs";

  onMount(async () => {
    const isSnarkyLoaded = $minaStore;
    if (!isSnarkyLoaded) {
      await loadSnarky();
    }
  });

  const blankCanvas = CanvasData.blank();

  const assertValidity = async function () {
    try {
      await $deployedZkAppsStore.assertValidCanvas($canvasStore);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };
</script>

<div class="contianer">
  <h1>Welcome</h1>
  <p>Is snarkyjs loaded: {$minaStore}</p>
  {#if $minaStore}
    <p>Canvas Address: {$deployedZkAppsStore.address.toBase58()}</p>
    <p>
      Proof is Verified: {#await assertValidity()}
        Unknown
      {:then resp}
        {resp}
      {/await}
    </p>
    <CanvasElement canvas={$canvasStore} />
  {:else}
    <CanvasElement canvas={blankCanvas} />
  {/if}
</div>
