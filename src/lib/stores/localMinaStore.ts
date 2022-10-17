import { isReady, Mina, AccountUpdate, PrivateKey } from 'snarkyjs';
import { writable } from 'svelte/store';

import { Canvas, CanvasDataFactory } from 'zk-canvas-contracts';

class CanvasData extends CanvasDataFactory(3) { }

export const loadSnarky = async function () {
  await isReady;

  await Canvas.compile();

  let Local = Mina.LocalBlockchain();
  Mina.setActiveInstance(Local);
  const account = Local.testAccounts[0].privateKey;

  const zkAppPrivateKey = PrivateKey.random();
  const zkAppAddress = zkAppPrivateKey.toPublicKey();
  const zkAppInstance = new Canvas(zkAppAddress);
  const canvasData = CanvasData.blank()

  let tx = await Mina.transaction(account, () => {
    AccountUpdate.fundNewAccount(account);

    zkAppInstance.deploy({ zkappKey: zkAppPrivateKey });
    zkAppInstance.init();
  });
  await tx.prove();
  await tx.send();

  localMinaStore.set(true)
  deployedZkAppsStore.set(zkAppInstance)
  canvasStore.set(canvasData)
}

export const localMinaStore = writable(false);
export const deployedZkAppsStore = writable<Canvas>();
export const canvasStore = writable<CanvasData>();