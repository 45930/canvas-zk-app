import { isReady, Mina, Party, PrivateKey, PublicKey } from 'snarkyjs';
import { writable } from 'svelte/store';

import { Canvas } from '../snarky/Canvas';
import { CanvasData } from '../snarky/helpers/CanvasData';

const BERKELEY_ZKAPP_ADDRESS = 'B62qptauSR6gcyu4Wi1XJ87jfksTGtMThs1tLBDZiKNFqes3LG1WnKt'

export const loadSnarky = async function () {
  await isReady;

  let Berkeley = Mina.BerkeleyQANet(
    'https://proxy.berkeley.minaexplorer.com/graphql'
  );
  Mina.setActiveInstance(Berkeley);

  const canvasData = CanvasData.blank();
  const zkAppInstance = new Canvas(PublicKey.fromBase58(BERKELEY_ZKAPP_ADDRESS));

  berkeleyMinaStore.set(true)
  deployedZkAppsStore.set(zkAppInstance)
  canvasStore.set(canvasData)
}

export const berkeleyMinaStore = writable(false);
export const deployedZkAppsStore = writable<Canvas>();
export const canvasStore = writable<CanvasData>();