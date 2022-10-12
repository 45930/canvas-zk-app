import { Canvas } from '../src/Canvas';
import { CanvasDataFactory } from '../src/helpers/CanvasData';
import {
  isReady,
  shutdown,
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
} from 'snarkyjs';
import { ClaimList1 } from '../src/helpers/ClaimList';

class CanvasData extends CanvasDataFactory(3) {}

describe('Canvas', () => {
  let zkAppInstance: Canvas,
    zkAppPrivateKey: PrivateKey,
    zkAppAddress: PublicKey,
    account: PrivateKey;

  beforeEach(async () => {
    await isReady;

    let Local = Mina.LocalBlockchain();
    Mina.setActiveInstance(Local);
    account = Local.testAccounts[0].privateKey;

    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkAppInstance = new Canvas(zkAppAddress);
  });

  afterAll(async () => {
    setTimeout(shutdown, 0);
  });

  describe('assertValidCanvas', () => {
    beforeEach(async () => {
      // Deploy a fresh canvas
      let tx = await Mina.transaction(account, () => {
        AccountUpdate.fundNewAccount(account);
        zkAppInstance.deploy({ zkappKey: zkAppPrivateKey });
      });
      await tx.send();
    });

    it('validates that a blank canvas is deployed', async () => {
      const canvasData = CanvasData.blank();
      await expect(() => {
        zkAppInstance.assertValidCanvas(canvasData);
      }).not.toThrow();
    });

    it('rejects that a non-blank canvas is deployed', async () => {
      const canvasData = CanvasData.blank();
      canvasData.switchCellValue(0, 0);
      await expect(() => {
        zkAppInstance.assertValidCanvas(canvasData);
      }).toThrow();
    });
  });

  describe('claimCells', () => {
    beforeEach(async () => {
      // Deploy a fresh canvas
      let tx = await Mina.transaction(account, () => {
        AccountUpdate.fundNewAccount(account);
        zkAppInstance.deploy({ zkappKey: zkAppPrivateKey });
      });
      await tx.send();
    });

    it('claims a cell', async () => {
      const canvasData = CanvasData.blank();
      const cells = Array<{ i: 2; j: 1 }>(1);
      const claims = new ClaimList1(cells);
      const pkey = PrivateKey.random();
      const pubkey = PublicKey.fromPrivateKey(pkey);
      let tx = await Mina.transaction(account, () => {
        zkAppInstance.claimCells(canvasData, claims, pkey);
      });
      console.log('compiling...');
      await Canvas.compile();
      console.log('proving...');
      await tx.prove();
      await tx.send();

      canvasData.updateCellOwner(2, 1, pubkey); // mutate the oringinal data
      await expect(() => {
        // assert that our mutated data has been stored as state
        zkAppInstance.assertValidCanvas(canvasData);
      }).not.toThrow();
    });
  });
});
