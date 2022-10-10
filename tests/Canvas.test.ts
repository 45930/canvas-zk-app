import { Canvas } from '../src/Canvas';
import { CanvasData } from '../src/helpers/CanvasData';
import {
  isReady,
  shutdown,
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
} from 'snarkyjs';

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

  describe('Deploy', () => {
    beforeEach(async () => {
      // Deploy a fresh canvas
      let tx = await Mina.transaction(account, () => {
        AccountUpdate.fundNewAccount(account);
        zkAppInstance.deploy({ zkappKey: zkAppPrivateKey });
        // zkAppInstance.init(CanvasData.blank());
      });
      await tx.send();
    });

    it('validates that a blank canvas is deployed', async () => {
      const canvasData = CanvasData.blank();
      await zkAppInstance.assertValidCanvas(canvasData);
    });

    it('rejects that a non-blank canvas is deployed', async () => {
      const canvasData = CanvasData.blank();
      canvasData.switchCellValue(0, 0);
      await expect(() => {
        zkAppInstance.assertValidCanvas(canvasData);
      }).toThrow();
    });
  });
});
