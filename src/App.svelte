<script lang="ts">
  import {
    loadSnarky,
    localMinaStore as minaStore,
    deployedZkAppsStore,
  } from "./lib/stores/localMinaStore";

  import { canvasStore, initCanvasStore } from "./lib/stores/canvasDataStore";

  // import {
  //   loadSnarky,
  //   berkeleyMinaStore as minaStore,
  //   deployedZkAppsStore,
  //   updateCanvasHash,
  // } from "./lib/stores/berkeleyMinaStore";

  import { onMount } from "svelte";
  import CanvasElement from "./lib/components/CanvasElement.svelte";
  import { isReady } from "snarkyjs";

  import { CanvasDataFactory } from "zk-canvas-contracts";

  class CanvasData extends CanvasDataFactory(3) {}

  onMount(async () => {
    initCanvasStore();
    const isSnarkyLoaded = $minaStore;
    if (isSnarkyLoaded) {
      assertValidity();
    } else {
      await loadSnarky();
      assertValidity();
    }
  });

  // #TODO - .blank() requires isReady, need a new way to init the frontend
  const blankCanvas = CanvasData.blank();

  let dataValidity = "Unknown";

  const assertValidity = async function () {
    await isReady;

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
