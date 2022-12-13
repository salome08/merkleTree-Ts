import { MerkleTree } from "../src/Merkle";
import { mockTrs, mockTrs2, newLeaf } from "./mockData";
import * as functions from "../src/functions";

const hashedMocktrs1 = mockTrs.map((tr) => functions.hashTransaction(tr));
const hashedMocktrs2 = mockTrs2.map((tr) => functions.hashTransaction(tr));
const hashedNewLeaf = functions.hashTransaction(newLeaf);

describe("Create tree and add a leaf", () => {
  const tree = new MerkleTree(hashedMocktrs1);
  test("Create tree, should return root: 7a0640f8c2576c022741f46a303c6a69393d948792e97dbb9c5ac51734014321", () => {
    expect(tree.root.hash).toBe(
      "7a0640f8c2576c022741f46a303c6a69393d948792e97dbb9c5ac51734014321"
    );
  });
  const treeId1 = tree.blockId;
  test("Add leaf, should return changed root: 748aacce53978a3f5d2a0cedbf366b422d52145ba832ba7101a5fde601049e80", () => {
    tree.addLeaf([...hashedMocktrs1, hashedNewLeaf], hashedNewLeaf);
    expect(tree.root.hash).toBe(
      "748aacce53978a3f5d2a0cedbf366b422d52145ba832ba7101a5fde601049e80"
    );
  });
  const treeId2 = tree.blockId;
  test("Block ID should not change after leaf added", () => {
    expect(treeId1).toBe(treeId2);
  });
  const tree2 = new MerkleTree(hashedMocktrs2);
  test("Create second tree, should return root: 99a6be445d002354e693b806cd66d58359cb2ee38a46998263f983f0826eb19f", () => {
    expect(tree2.root.hash).toBe(
      "99a6be445d002354e693b806cd66d58359cb2ee38a46998263f983f0826eb19f"
    );
  });
  test("Block ID should be different from first tree", () => {
    expect(tree.blockId).not.toBe(tree2.blockId);
  });
  test("Tree root should not be anything else, wait for false with random string as test root", () => {
    expect(tree.root.hash).not.toBe("this is a test");
  });
});

describe("Verify proof", () => {
  const tree = new MerkleTree(hashedMocktrs1);
  test("Verify 1st transaction is in the tree should return true", () => {
    expect(tree.verifyProof(hashedMocktrs1, hashedMocktrs1[0])).toBe(true);
  });
  test("Verify 4th transaction is in the tree should return true", () => {
    expect(tree.verifyProof(hashedMocktrs1, hashedMocktrs1[3])).toBe(true);
  });
  test("Verify 6th transaction is in the tree should return true", () => {
    expect(tree.verifyProof(hashedMocktrs1, hashedMocktrs1[5])).toBe(true);
  });
  test("Verify non added leaf is in the tree should return false", () => {
    expect(tree.verifyProof(hashedMocktrs1, hashedNewLeaf)).toBe(false);
  });
});
