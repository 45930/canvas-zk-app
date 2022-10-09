import { Bool, CircuitValue, Poseidon, PublicKey } from 'snarkyjs';

type Cell = {
  value: boolean;
  owner: PublicKey;
};

export class CanvasData extends CircuitValue {
  value: Cell[][];

  constructor(value: Cell[][]) {
    super();
    this.value = value;
  }

  switchCellValue(i: number, j: number) {
    const oldCell = this.value[i][j];
    const newCell = {
      owner: oldCell.owner,
      value: !oldCell.value,
    };
    this.update(i, j, newCell);
  }

  updateCellOwner(i: number, j: number, owner: PublicKey) {
    const oldCell = this.value[i][j];
    const newCell = {
      owner: owner,
      value: oldCell.value,
    };
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
          return {
            value: false,
            owner: PublicKey.empty(),
          };
        });
      })
    );
  }
}
