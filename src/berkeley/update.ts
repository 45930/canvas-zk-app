import { Canvas } from '../Canvas.js';

import { CanvasDataFactory } from '../helpers/CanvasData.js';

import { privateKey } from './env.js';

import { Mina, isReady, PrivateKey, shutdown } from 'snarkyjs';

await isReady;

class CanvasData extends CanvasDataFactory(3) {}

let Berkeley = Mina.BerkeleyQANet(
  'https://proxy.berkeley.minaexplorer.com/graphql'
);
Mina.setActiveInstance(Berkeley);

const account = PrivateKey.fromBase58(privateKey);

const zkAppPrivateKey = account;
const zkAppAddress = zkAppPrivateKey.toPublicKey();
const zkAppInstance = new Canvas(zkAppAddress);
const canvasData = CanvasData.blank();

canvasData.switchCellValue(10, 10);
canvasData.switchCellValue(10, 11);
canvasData.switchCellValue(11, 10);

let tx = await Mina.transaction(account, () => {
  zkAppInstance.update(canvasData);
});
await tx.send();

console.log('Updated!');

zkAppInstance.assertValidCanvas(canvasData);

await shutdown();
