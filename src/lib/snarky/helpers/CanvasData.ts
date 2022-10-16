import { Bool, CircuitValue, isReady, matrixProp, Poseidon } from 'snarkyjs';

export class CanvasData extends CircuitValue {
  value: boolean[][];

  constructor(value: boolean[][]) {
    super();
    this.value = value;
  }

  switch(i: number, j: number) {
    const newVal = !this.value[i][j];
    this.update(i, j, newVal);
  }

  update(i: number, j: number, newVal: boolean) {
    this.value[i][j] = newVal;
  }

  hash() {
    return Poseidon.hash(this.value.flat().map((b) => new Bool(b).toField()));
  }

  static blank() {
    return new CanvasData(
      [...Array(32).keys()].map((i) => {
        return [...Array(32).keys()].map(() => false);
      })
    );
  }
}
