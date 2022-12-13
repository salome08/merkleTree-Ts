import * as Merkle from "./src/Merkle";
import * as type from "./src/type";
import { mockTrs, newLeaf } from "./tests/mockData";

// const mockTrs: Array<type.Transaction> = [
//   {
//     id: 1,
//     amount: 245,
//     date: new Date("2022-03-25"),
//   },
//   {
//     id: 2,
//     amount: 243855,
//     date: new Date("2022-10-21"),
//   },
//   {
//     id: 3,
//     amount: 9485,
//     date: new Date("2010-09-15"),
//   },
//   {
//     id: 4,
//     amount: 8297,
//     date: new Date("2000-11-12"),
//   },
//   {
//     id: 5,
//     amount: 92833,
//     date: new Date("2002-03-15"),
//   },
//   {
//     id: 6,
//     amount: 274888,
//     date: new Date("2021-11-11"),
//   },
//   {
//     id: 7,
//     amount: 23380,
//     date: new Date("1991-01-01"),
//   },
//   {
//     id: 8,
//     amount: 23380,
//     date: new Date("1991-01-01"),
//   },
// ];

// const newLeaf = { id: 9, amount: 23380, date: new Date("1991-01-01") };

(function () {
  console.log("Init Merkle Tree Project");
  const tree = new Merkle.MerkleTree(mockTrs);
  console.log("MerkleRoot 1", tree.root.hash);
  const isValidProof1 = tree.verifyProof(mockTrs, mockTrs[0]);
  console.log("isValidProof", isValidProof1);
  tree.addLeaf(mockTrs, newLeaf);
  console.log("treeProof 2", tree.root.hash);
  const isValidProof = tree.verifyProof([...mockTrs, newLeaf], newLeaf);
  console.log("isValidProof", isValidProof);
})();
