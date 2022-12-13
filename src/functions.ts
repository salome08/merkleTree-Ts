import { sha256 } from "js-sha256";
import * as Merkle from "./Merkle";
import * as type from "./type";

// Generate new array by slicing every 2 elements
const toPairs = (arr: Array<Merkle.MerkleNode>): Array<Merkle.MerkleNode[]> =>
  Array.from(Array(Math.ceil(arr.length / 2)), (_, idx) =>
    arr.slice(idx * 2, idx * 2 + 2)
  );

// Hash pairs together
const hashPair = ([a, b = a]: Array<Merkle.MerkleNode>): Merkle.MerkleNode => {
  // // If not second input we reuse a
  // // Join the 2 hashes together and reverse to store in little-endian format
  // // Satochi decide to double shot sha256 (birthday, replay attack)
  return new Merkle.MerkleNode(
    sha256(sha256.array(`${b.hash}${a.hash}`).reverse())
  );
};

export const hashTransaction = (t: type.Transaction): string =>
  sha256(JSON.stringify(t));

export const getMerkleRoot = (
  trs: Array<Merkle.MerkleNode>
): Merkle.MerkleNode =>
  /* Case trs.length === 1, return it cause it is our rootNode*/
  trs.length === 1
    ? trs[0]
    : getMerkleRoot(
        toPairs(trs).reduce((tree, pair) => [...tree, hashPair(pair)], [])
      );

export const getMerkleProof = (
  trs: Array<Merkle.MerkleNode>,
  tr: Merkle.MerkleNode,
  proof: Array<Merkle.MerkleProofNode> = []
): Array<Merkle.MerkleProofNode> => {
  // Completed proof
  if (trs.length === 1) return proof;
  const tree = [] as Array<Merkle.MerkleNode>;

  toPairs(trs).forEach((pair) => {
    const hash = hashPair(pair);
    // Keep a proof tree of member we know and their position to find back or verification
    if (pair.find((e) => e.hash === tr.hash)) {
      const hProofIdx = pair[0].hash === tr.hash ? 1 : 0;
      proof.push([hProofIdx, pair[hProofIdx]]);
      tr = hash;
    }
    tree.push(hash);
  });

  return getMerkleProof(tree, tr, proof);
};

export const getVerifyProof = (
  proof: Array<Merkle.MerkleProofNode>,
  tr: Merkle.MerkleNode
): Merkle.MerkleNode => {
  return proof.reduce((acc, [hProofIdx, hProof]) => {
    return hProofIdx ? hashPair([acc, hProof]) : hashPair([hProof, acc]);
  }, tr);
};
