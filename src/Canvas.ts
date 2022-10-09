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
} from 'snarkyjs';

import { CanvasData } from './helpers/CanvasData';
import { ClaimList16 } from './helpers/ClaimList';

export class Canvas extends SmartContract {
  @state(Field) canvasHash = State<Field>();

  deploy(args: DeployArgs) {
    super.deploy(args);
    this.setPermissions({
      ...Permissions.default(),
      editState: Permissions.none(),
    });
  }

  @method
  init(canvasData: CanvasData) {
    this.canvasHash.set(canvasData.hash());
  }

  @method
  assertValidCanvas(canvasData: CanvasData) {
    const assertedHash = canvasData.hash();
    const actualHash = this.canvasHash.get();
    this.canvasHash.assertEquals(this.canvasHash.get());
    actualHash.assertEquals(assertedHash);
  }

  @method
  claimCells(canvasData: CanvasData, claimList: ClaimList16, pkey: PrivateKey) {
    this.assertValidCanvas(canvasData);
    // assert user has fewer than x claims already #TODO
    claimList.claims.forEach((claim) => {
      Circuit.if(
        claim[0].lt(Field(999)),
        this.claimCell(canvasData, claim[0], claim[1], pkey),
        this.no_op()
      );
    });
  }

  // For now we don't care what the old state was.  Everyone can update every pixel with no permissions as far as we care
  @method
  update(canvasData: CanvasData) {
    this.canvasHash.set(canvasData.hash());
  }

  @method
  claimCell(canvasData: CanvasData, i: Field, j: Field, pkey: PrivateKey) {
    const newOwner = PublicKey.fromPrivateKey(pkey);
    canvasData.updateCellOwner(
      Number(i.toString()),
      Number(j.toString()),
      newOwner
    );
  }

  @method
  no_op() {}
}
