import { Canvas } from './Canvas.js';

import { CanvasDataFactory } from './helpers/CanvasData.js';

import {
  Mina,
  isReady,
  PrivateKey,
  shutdown,
  AccountUpdate,
  PublicKey,
} from 'snarkyjs';
import { ClaimListFactory } from './helpers/ClaimList.js';

await isReady;

class CanvasData extends CanvasDataFactory(3) {}
class ClaimList1 extends ClaimListFactory(1) {}

let Local = Mina.LocalBlockchain();
Mina.setActiveInstance(Local);
const account = Local.testAccounts[0].privateKey;

const zkAppPrivateKey = PrivateKey.random();
const zkAppAddress = zkAppPrivateKey.toPublicKey();
const zkAppInstance = new Canvas(zkAppAddress);
const canvasData = CanvasData.blank();

await Canvas.compile();
let tx = await Mina.transaction(account, () => {
  AccountUpdate.fundNewAccount(account);
  zkAppInstance.deploy({ zkappKey: zkAppPrivateKey });
  zkAppInstance.canvasHash.set(canvasData.hash());
});
await tx.prove();
await tx.send().wait();

console.log('Deployed!');

console.log(
  `Account: ${PublicKey.fromPrivateKey(account).toBase58()}\n\n`,
  `ZKAPP:  ${zkAppAddress.toBase58()}`
);
const a = Mina.getAccount(zkAppAddress);
console.log(JSON.stringify(a.appState));

zkAppInstance.assertValidCanvas(canvasData);

const cells = [{ i: 2, j: 1 }];
const claims = new ClaimList1(cells);
const pkey = PrivateKey.random();
const pubkey = PublicKey.fromPrivateKey(pkey);
let tx2 = await Mina.transaction(account, () => {
  zkAppInstance.claimCells(canvasData, claims, pkey);
});
await tx2.prove();
console.log(tx2.toGraphqlQuery());
await tx2.send();

console.log('Updated!');

canvasData.updateCellOwner(2, 1, pubkey);
zkAppInstance.assertValidCanvas(canvasData);

await shutdown();
