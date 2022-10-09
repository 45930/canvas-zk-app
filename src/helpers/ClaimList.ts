import { Field, CircuitValue, matrixProp } from 'snarkyjs';

export type Claim = {
  i: number;
  j: number;
} | null;

type ClaimList16Type = Claim[];

/*
  A ClaimList is a wrapper for a circuit array of claims.
  A claim is an (i, j) representing the coordinate of a cell in a CanvasData.
*/
export class ClaimList16 extends CircuitValue {
  @matrixProp(Field, 16, 2) claims: Field[][];

  constructor(claims: ClaimList16Type) {
    super();
    if (claims.length !== 16) {
      throw Error('ClaimsList16 must have exctly 16 elements');
    }
    this.claims = claims.map((claim) => {
      if (claim) {
        return [Field(claim.i), Field(claim.j)];
      } else {
        return [Field(999), Field(999)];
      }
    });
  }
}
