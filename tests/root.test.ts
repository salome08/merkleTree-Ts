import { traceDeprecation } from "process";
import { MerkleTree } from "../src/Merkle";
import { mockTrs, newLeaf } from "./mockData";

test("Create tree, should return root: 26bcfdee0be5a543ede2b9d778f201daac5145479f857246394213983551efdd", () => {
  const tree = new MerkleTree(mockTrs);
  expect(tree.root.hash).toBe(
    "26bcfdee0be5a543ede2b9d778f201daac5145479f857246394213983551efdd"
  );
  // test("Add leaf, should return changed root: 693ee6583c970d0b0b6ce849bb549981b3c485698ef7161d950b39850059a530", () => {
  tree.addLeaf([...mockTrs, newLeaf], newLeaf);
  expect(tree.root.hash).toBe(
    "693ee6583c970d0b0b6ce849bb549981b3c485698ef7161d950b39850059a530"
  );
  // }),
});
