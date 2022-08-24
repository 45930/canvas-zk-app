import { Bool, CircuitValue, matrixProp, Poseidon } from 'snarkyjs';

export class CanvasData extends CircuitValue {
  @matrixProp(Bool, 32, 32) value: Bool[][];

  constructor(value: boolean[][]) {
    super();
    this.value = value.map((row) => {
      return row.map((b) => {
        return new Bool(b);
      });
    });
  }

  switch(i: number, j: number) {
    const newVal = !this.value[i][j];
    this.update(i, j, newVal);
  }

  update(i: number, j: number, newVal: boolean) {
    this.value[i][j] = new Bool(newVal);
  }

  hash() {
    return Poseidon.hash(this.value.flat().map((b) => b.toField()));
  }
}
