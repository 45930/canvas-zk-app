<script lang="ts">
  // import {
  //   loadSnarky,
  //   localMinaStore as minaStore,
  //   deployedZkAppsStore,
  //   canvasStore,
  // } from "./lib/stores/localMinaStore";

  import { canvasStore, initCanvasStore } from "./lib/stores/canvasDataStore";

  import {
    loadSnarky,
    berkeleyMinaStore as minaStore,
    deployedZkAppsStore,
    updateCanvasHash,
  } from "./lib/stores/berkeleyMinaStore";

  import { onMount } from "svelte";
  import CanvasElement from "./lib/components/CanvasElement.svelte";
  import { CanvasData } from "./lib/snarky/helpers/CanvasData";

  onMount(async () => {
    initCanvasStore();
    const isSnarkyLoaded = $minaStore;
    if (!isSnarkyLoaded) {
      await loadSnarky();
    }
    assertValidity();
  });

  const blankCanvas = CanvasData.blank();

  let dataValidity = "Unknown";

  const assertValidity = async function () {
    dataValidity = "Unknown";
    try {
      await $deployedZkAppsStore.assertValidCanvas($canvasStore);
      dataValidity = "true";
    } catch (err) {
      console.log(err);
      dataValidity = "false";
    }
  };

  const createTx = async () => {
    await updateCanvasHash($canvasStore);
  };
</script>

<div class="contianer">
  <h1>Welcome</h1>
  <p>Is snarkyjs loaded: {$minaStore}</p>
  {#if $minaStore}
    <p>Canvas Address: {$deployedZkAppsStore.address.toBase58()}</p>
    <p>
      Proof is Verified: {dataValidity}
    </p>
    <div>
      <button on:click={() => createTx()}>Create Transaction</button>
      <button on:click={() => assertValidity()}>Re-Assert Validity</button>
    </div>
    <CanvasElement canvas={$canvasStore} />
  {:else}
    <CanvasElement canvas={blankCanvas} />
  {/if}
</div>
