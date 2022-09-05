import { isReady, Mina, Party, PrivateKey } from 'snarkyjs';
import { writable } from 'svelte/store';

import { Canvas } from '../snarky/Canvas';
import { CanvasData } from '../snarky/helpers/CanvasData';

export const loadSnarky = async function () {
  await isReady;

  let Local = Mina.LocalBlockchain();
  Mina.setActiveInstance(Local);
  const account = Local.testAccounts[0].privateKey;

  const zkAppPrivateKey = PrivateKey.random();
  const zkAppAddress = zkAppPrivateKey.toPublicKey();
  const zkAppInstance = new Canvas(zkAppAddress);
  const canvasData = CanvasData.blank();

  canvasData.switch(0, 0)
  canvasData.switch(1, 1)
  canvasData.switch(2, 2)
  canvasData.switch(3, 3)
  canvasData.switch(4, 4)

  let tx = await Mina.transaction(account, () => {
    Party.fundNewAccount(account);

    zkAppInstance.deploy({ zkappKey: zkAppPrivateKey });

    zkAppInstance.init(canvasData);
  });
  await tx.send().wait();

  localMinaStore.set(true)
  deployedZkAppsStore.set(zkAppInstance)
  canvasStore.set(canvasData)
}

export const localMinaStore = writable(false);
export const deployedZkAppsStore = writable<Canvas>();
export const canvasStore = writable<CanvasData>();