import * as functions from "./functions";

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

// MERKLE TREE
export class MerkleTree {
  private _root: MerkleNode;
  private _height: number;
  private _blockId: number;

  private static lastId = 0;

  // Setters
  public set root(value: MerkleNode) {
    this._root = value;
  }
  public set height(value: number) {
    this._height = value;
  }

  // Getters
  public get root(): MerkleNode {
    return this._root;
  }
  public get height(): number {
    return this._height;
  }
  public get blockId(): number {
    return this._blockId;
  }

  constructor(transactions: Array<string>) {
    this._root = functions.getMerkleRoot(
      transactions.map((tr) => new MerkleNode(tr))
    );
    this._height = Math.ceil(Math.log2(transactions.length)) + 1;
    this._blockId = ++MerkleTree.lastId;
  }

  createProof(trs: Array<string>, tr: string): Array<MerkleProofNode> {
    const merkleProof = functions.getMerkleProof(
      trs.map((t) => new MerkleNode(t)),
      new MerkleNode(tr)
    );
    return merkleProof;
  }

  verifyProof(trs: Array<string>, tr: string): boolean {
    const verifiedProof = functions.getVerifyProof(
      this.createProof(trs, tr),
      new MerkleNode(tr)
    );
    return verifiedProof.hash === this.root.hash;
  }

  addLeaf(trs: Array<string>, tr: string): void {
    this.root = functions.getMerkleRoot(
      [...trs, tr].map((t) => new MerkleNode(t))
    );
    this.height = Math.ceil(Math.log2([...trs, tr].length)) + 1;
  }
}
