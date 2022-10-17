import { fetchAccount, isReady, Mina, PrivateKey, PublicKey } from 'snarkyjs';
import { writable } from 'svelte/store';

import { Canvas, CanvasDataFactory } from 'zk-canvas-contracts';

class CanvasData extends CanvasDataFactory(3) { }

const BERKELEY_ZKAPP_ADDRESS = 'B62qmu88hV2r7N15qAn2kjAb9Q1oS7RzhyPRuiEZTJ4CryjDQBN7mvD';

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

export const updateCanvasHash = async (canvasData: CanvasData) => {
  //   await isReady;

  //   let Berkeley = Mina.BerkeleyQANet(
  //     'https://proxy.berkeley.minaexplorer.com/graphql'
  //   );
  //   Mina.setActiveInstance(Berkeley);

  //   const account = PrivateKey.fromBase58(import.meta.env.VITE_MINA_PRIVATE_KEY)
  //   const zkAppPrivateKey = account;
  //   const zkAppAddress = zkAppPrivateKey.toPublicKey();
  //   const zkAppInstance = new Canvas(zkAppAddress);

  //   let feePayerKey = PrivateKey.fromBase58(import.meta.env.VITE_MINA_PRIVATE_KEY);

  //   let response = await fetchAccount({ publicKey: zkAppAddress });
  //   console.log(response)
  //   if (response.error) throw Error(response.error.statusText);
  //   let { nonce, balance } = response.account;
  //   console.log(`Using fee payer account with nonce ${nonce}, balance ${balance}`);

  //   const transactionFee = 100_000_000;

  //   let transaction = await Mina.transaction(
  //     { feePayerKey, fee: transactionFee },
  //     () => {
  //       zkAppInstance.update(canvasData);
  //     }
  //   );
  //   // if you want to inspect the transaction, you can print it out:
  //   console.log(transaction.toGraphqlQuery());

  //   // send the transaction to the graphql endpoint
  //   console.log('Sending the transaction...');
  //   await transaction.send().wait();
  //   console.log('Sent!');
}

export const berkeleyMinaStore = writable(false);
export const deployedZkAppsStore = writable<Canvas>();
export const canvasStore = writable<CanvasData>();