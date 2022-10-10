import {
  Bool,
  Circuit,
  CircuitValue,
  matrixProp,
  Poseidon,
  prop,
  PublicKey,
} from 'snarkyjs';

class Cell extends CircuitValue {
  @prop owner: PublicKey;
  @prop value: Bool;

  constructor(owner: PublicKey, value: Bool) {
    super();
    this.value = value;
    this.owner = owner;
  }
}

export class CanvasData extends CircuitValue {
  @matrixProp(Cell, 32, 32) value: Cell[][];

  constructor(value: Cell[][]) {
    super();
    this.value = value;
  }

  switchCellValue(i: number, j: number) {
    const oldCell = this.value[i][j];
    const newCell = new Cell(
      oldCell.owner,
      new Bool(Circuit.if(oldCell.value, new Bool(false), new Bool(true)))
    );
    this.update(i, j, newCell);
  }

  updateCellOwner(i: number, j: number, owner: PublicKey) {
    const oldCell = this.value[i][j];
    const newCell = new Cell(owner, new Bool(oldCell.value));
    this.update(i, j, newCell);
  }

  update(i: number, j: number, newVal: Cell) {
    this.value[i][j] = newVal;
  }

  hash() {
    const flatMap = this.value.flat().map((cell) => {
      const g = cell.owner.toGroup();
      return Poseidon.hash([new Bool(cell.value).toField(), g.x, g.y]);
    });

    const hash = Poseidon.hash(flatMap);
    return hash;
  }

  static blank() {
    return new CanvasData(
      [...Array(32).keys()].map(() => {
        return [...Array(32).keys()].map(() => {
          return new Cell(PublicKey.empty(), new Bool(false));
        });
      })
    );
  }
}
