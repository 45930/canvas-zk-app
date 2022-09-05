import {
  Field,
  SmartContract,
  state,
  State,
  method,
  Permissions,
  fetchAccount
} from 'snarkyjs';

import type { DeployArgs } from 'snarkyjs';

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

  init(canvasData: CanvasData) {
    this.canvasHash.set(canvasData.hash());
  }

  async assertValidCanvas(canvasData: CanvasData) {
    await fetchAccount({ publicKey: this.address });
    const assertedHash = canvasData.hash();
    const actualHash = await this.canvasHash.get();
    this.canvasHash.assertEquals(this.canvasHash.get());
    actualHash.assertEquals(assertedHash);
  }

  // For now we don't care what the old state was.  Everyone can update every pixel with no permissions as far as we care
  update(canvasData: CanvasData) {
    this.canvasHash.set(canvasData.hash());
  }
}

let descriptor;

Reflect.metadata('design:paramtypes', [CanvasData])(Canvas.prototype, 'init');
descriptor = Object.getOwnPropertyDescriptor(Canvas.prototype, 'init')!;
method(Canvas.prototype, 'init', descriptor)

Reflect.metadata('design:paramtypes', [CanvasData])(Canvas.prototype, 'assertValidCanvas');
descriptor = Object.getOwnPropertyDescriptor(Canvas.prototype, 'assertValidCanvas')!;
method(Canvas.prototype, 'assertValidCanvas', descriptor)

Reflect.metadata('design:paramtypes', [CanvasData])(Canvas.prototype, 'update');
descriptor = Object.getOwnPropertyDescriptor(Canvas.prototype, 'update')!;
method(Canvas.prototype, 'update', descriptor)