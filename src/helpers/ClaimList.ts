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
export class ClaimList16 extends CircuitValue {
  @matrixProp(Field, 16, 2) claims: Field[][];

  constructor(claims: ClaimListType) {
    super();
    if (claims.length !== 16) {
      throw Error('ClaimsList16 must have exctly 16 elements');
    }
    this.claims = claims.map((claim) => {
      if (claim) {
        return [Field(claim.i), Field(claim.j)];
      } else {
        return [Field(31), Field(31)];
      }
    });
  }
}

export class ClaimList1 extends CircuitValue {
  @matrixProp(Field, 1, 2) claims: Field[][];

  constructor(claims: ClaimListType) {
    super();
    if (claims.length !== 1) {
      throw Error('ClaimsList1 must have exctly 1 elements');
    }
    this.claims = claims.map((claim) => {
      if (claim) {
        return [Field(claim.i), Field(claim.j)];
      } else {
        return [Field(0), Field(0)];
      }
    });
  }
}
