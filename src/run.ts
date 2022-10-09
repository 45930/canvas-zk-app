import { Canvas } from './Canvas.js';

import { CanvasData } from './helpers/CanvasData.js';

import { Mina, isReady, PrivateKey, shutdown, AccountUpdate } from 'snarkyjs';

await isReady;

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

  zkAppInstance.init(canvasData);
});
await tx.send();

console.log('Deployed!');

zkAppInstance.assertValidCanvas(canvasData);

canvasData.switchCellValue(10, 10);
canvasData.switchCellValue(10, 11);
canvasData.switchCellValue(11, 10);

tx = await Mina.transaction(account, () => {
  zkAppInstance.update(canvasData);
});
await tx.send();

console.log('Updated!');

zkAppInstance.assertValidCanvas(canvasData);

await shutdown();
