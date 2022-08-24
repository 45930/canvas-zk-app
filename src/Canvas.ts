import {
  Field,
  SmartContract,
  state,
  State,
  method,
  DeployArgs,
  Permissions,
} from 'snarkyjs';

import { CanvasData } from './helpers/CanvasData.js';

export class Canvas extends SmartContract {
  @state(Field) canvasHash = State<Field>();

  deploy(args: DeployArgs) {
    super.deploy(args);
    this.setPermissions({
      ...Permissions.default(),
      editState: Permissions.none(),
    });
  }

  @method init(canvasData: CanvasData) {
    this.canvasHash.set(canvasData.hash());
  }

  @method assertValidCanvas(canvasData: CanvasData) {
    const assertedHash = canvasData.hash();
    const actualHash = this.canvasHash.get();
    this.canvasHash.assertEquals(this.canvasHash.get());
    actualHash.assertEquals(assertedHash);
  }

  // For now we don't care what the old state was.  Everyone can update every pixel with no permissions as far as we care
  @method update(canvasData: CanvasData) {
    this.canvasHash.set(canvasData.hash());
  }
}
