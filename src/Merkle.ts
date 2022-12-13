import * as functions from "./functions";
import * as type from "./type";

// export interface Transaction {
//   id: number;
//   amount: number;
//   date: Date;
// }

export type MerkleProofNode = [number, MerkleNode];

// NODE
export class MerkleNode {
  private _hash: string;
  public get hash(): string {
    return this._hash;
  }

  constructor(hash: string) {
    this._hash = hash;
  }
}

// TREE
export class MerkleTree {
  private _root: MerkleNode;
  private height: number;

  public get root(): MerkleNode {
    return this._root;
  }

  constructor(transactions: Array<type.Transaction>) {
    this._root = functions.getMerkleRoot(
      transactions.map((tr) => new MerkleNode(functions.hashTransaction(tr)))
    );
    this.height = Math.ceil(Math.log2(transactions.length)) + 1;
  }

  createProof(
    trs: Array<type.Transaction>,
    tr: type.Transaction
  ): Array<MerkleProofNode> {
    const merkleProof = functions.getMerkleProof(
      trs.map((t) => new MerkleNode(functions.hashTransaction(t))),
      new MerkleNode(functions.hashTransaction(tr))
    );
    return merkleProof;
  }

  verifyProof(trs: Array<type.Transaction>, tr: type.Transaction): boolean {
    const verifiedProof = functions.getVerifyProof(
      this.createProof(trs, tr),
      new MerkleNode(functions.hashTransaction(tr))
    );
    return verifiedProof.hash === this.root.hash;
  }

  addLeaf(trs: Array<type.Transaction>, tr: type.Transaction): void {
    this.constructor([...trs, tr]);
  }
}
