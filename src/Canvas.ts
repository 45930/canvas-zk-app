import {
  Field,
  SmartContract,
  state,
  State,
  method,
  DeployArgs,
  Permissions,
  Circuit,
  PublicKey,
  PrivateKey,
  Bool,
} from 'snarkyjs';

import { CanvasDataFactory } from './helpers/CanvasData.js';
import { ClaimList1 } from './helpers/ClaimList.js';

class CanvasData extends CanvasDataFactory(3) {}

export class Canvas extends SmartContract {
  @state(Field) canvasHash = State<Field>();

  deploy(args: DeployArgs) {
    super.deploy(args);
    this.canvasHash.set(CanvasData.blank().hash());
    this.setPermissions({
      ...Permissions.default(),
      editState: Permissions.proof(),
    });
  }

  @method
  assertValidCanvas(canvasData: CanvasData) {
    const assertedHash = canvasData.hash();
    const actualHash = this.canvasHash.get();
    this.canvasHash.assertEquals(this.canvasHash.get());
    actualHash.assertEquals(assertedHash);
  }

  @method
  claimCells(canvasData: CanvasData, claimList: ClaimList1, pkey: PrivateKey) {
    this.assertValidCanvas(canvasData);
    const mutatedCanvas = canvasData.copy();
    const pubKey = PublicKey.fromPrivateKey(pkey);
    // assert user has fewer than x claims already #TODO
    for (let i = 0; i < CanvasData.size; i++) {
      for (let j = 0; j < CanvasData.size; j++) {
        console.log(i, j);
        claimList.claims.forEach((claim) => {
          const cell = mutatedCanvas.value[i][j];
          const newOwner = Circuit.if(
            Bool.and(Field(i).equals(claim[0]), Field(j).equals(claim[1])),
            pubKey,
            cell.owner
          );
          mutatedCanvas.updateCellOwner(i, j, newOwner);
        });
      }
    }
    this.canvasHash.set(mutatedCanvas.hash());
  }

  // For now we don't care what the old state was.  Everyone can update every pixel with no permissions as far as we care
  @method
  update(canvasData: CanvasData) {
    this.canvasHash.set(canvasData.hash());
  }
}
