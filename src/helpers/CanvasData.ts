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

export class BaseCanvasData extends CircuitValue {
  static size: number;
  value: Cell[][];

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

  copy() {
    const copy = BaseCanvasData.blank();
    copy.value = this.value.map((row) => {
      return row.map((cell) => {
        return new Cell(cell.owner, cell.value);
      });
    });
    return copy;
  }

  static blank() {
    return new BaseCanvasData(
      [...Array(this.size).keys()].map(() => {
        return [...Array(this.size).keys()].map(() => {
          return new Cell(
            PublicKey.fromBase58(
              'B62qptauSR6gcyu4Wi1XJ87jfksTGtMThs1tLBDZiKNFqes3LG1WnKt'
            ),
            new Bool(false)
          );
        });
      })
    );
  }
}

export function CanvasDataFactory(size: number): typeof BaseCanvasData {
  class CanvasData_ extends BaseCanvasData {
    static size = size;
  }
  matrixProp(Cell, size, size)(CanvasData_.prototype, 'value');
  return CanvasData_;
}
