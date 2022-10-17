import { Field, CircuitValue, matrixProp } from 'snarkyjs';

export type Claim = {
  i: number;
  j: number;
} | null;

type ClaimListType = Claim[];

/*
  A ClaimList is a wrapper for a circuit array of claims.
  A claim is an (i, j) representing the coordinate of a cell in a CanvasData.
*/
export class BaseClaimList extends CircuitValue {
  static size: Number;
  claims: Field[][];

  constructor(claims: ClaimListType) {
    super();
    this.claims = claims.map((claim) => {
      if (claim) {
        return [Field(claim.i), Field(claim.j)];
      } else {
        return [Field(0), Field(0)]; // crude dummy value which actually interferes with the canvas #TODO
      }
    });
  }
}

export function ClaimListFactory(size: number): typeof BaseClaimList {
  class ClaimList_ extends BaseClaimList {
    static size = size;

    constructor(claims: ClaimListType) {
      super(claims);
      if (claims.length !== ClaimList_.size) {
        throw Error(
          `ClaimsList of size ${ClaimList_.size} cannot be initialized with claims of length ${claims.length}`
        );
      }
    }
  }
  matrixProp(Field, size, 2)(ClaimList_.prototype, 'claims');
  return ClaimList_;
}
