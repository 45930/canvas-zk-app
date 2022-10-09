import { Canvas } from '../Canvas.js';

import { CanvasData } from '../helpers/CanvasData.js';

import { privateKey, feePayerPrivateKey } from './env.js';

import { Mina, isReady, PrivateKey, shutdown, fetchAccount } from 'snarkyjs';

await isReady;

let Berkeley = Mina.BerkeleyQANet(
  'https://proxy.berkeley.minaexplorer.com/graphql'
);
Mina.setActiveInstance(Berkeley);

const account = PrivateKey.fromBase58(privateKey);

const zkAppPrivateKey = account;
const zkAppAddress = zkAppPrivateKey.toPublicKey();
const canvasData = CanvasData.blank();

// console.log('Compiling smart contract...');
// let { verificationKey } = await Canvas.compile(zkAppAddress);

const zkAppInstance = new Canvas(zkAppAddress);
let canvasHash = await zkAppInstance.canvasHash.fetch();
let isDeployed = canvasHash?.equals(0).not().toBoolean() ?? false;

let feePayerKey = PrivateKey.fromBase58(feePayerPrivateKey);
console.log(`Fee Payer ${zkAppAddress.toBase58()}`);

let response = await fetchAccount({ publicKey: zkAppAddress });
console.log(response);
if (response.error) throw Error(response.error.statusText);
let { nonce, balance } = response.account;
console.log(`Using fee payer account with nonce ${nonce}, balance ${balance}`);

const transactionFee = 100_000_000;

if (!isDeployed) {
  console.log(`Deploying zkapp for public key ${zkAppAddress.toBase58()}.`);
  // the `transaction()` interface is the same as when testing with a local blockchain
  let transaction = await Mina.transaction(
    { feePayerKey, fee: transactionFee },
    () => {
      // AccountUpdate.fundNewAccount(feePayerKey);
      // zkAppInstance.deploy({ verificationKey });
      zkAppInstance.init(canvasData);
    }
  );
  // if you want to inspect the transaction, you can print it out:
  console.log(transaction.toGraphqlQuery());

  // send the transaction to the graphql endpoint
  console.log('Sending the transaction...');
  await transaction.send();
  console.log('Deployed!');
}

zkAppInstance.assertValidCanvas(canvasData);

await shutdown();
