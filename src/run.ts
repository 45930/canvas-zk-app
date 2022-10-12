import { Canvas } from './Canvas.js';

import { CanvasDataFactory } from './helpers/CanvasData.js';

import { Mina, isReady, PrivateKey, shutdown, AccountUpdate } from 'snarkyjs';
import { ClaimList1 } from './helpers/ClaimList.js';

await isReady;

class CanvasData extends CanvasDataFactory(3) {}

let Local = Mina.LocalBlockchain();
Mina.setActiveInstance(Local);
const account = Local.testAccounts[0].privateKey;

const zkAppPrivateKey = PrivateKey.random();
const zkAppAddress = zkAppPrivateKey.toPublicKey();
const zkAppInstance = new Canvas(zkAppAddress);
const canvasData = CanvasData.blank();

let tx = await Mina.transaction(account, () => {
  AccountUpdate.fundNewAccount(account);

  zkAppInstance.deploy({ zkappKey: zkAppPrivateKey });
});
await tx.send();

console.log('Deployed!');

zkAppInstance.assertValidCanvas(canvasData);

const cells = Array<{ i: 2; j: 1 }>(1);
const claims = new ClaimList1(cells);
const pkey = PrivateKey.random();
// const pubkey = PublicKey.fromPrivateKey(pkey);
let tx2 = await Mina.transaction(account, () => {
  zkAppInstance.claimCells(canvasData, claims, pkey);
});
await Canvas.compile();
await tx2.prove();
await tx2.send();

console.log('Updated!');

zkAppInstance.assertValidCanvas(canvasData);

await shutdown();
