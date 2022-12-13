import axios from "axios";
import { sha256 } from "js-sha256";
import * as Merkle from "./Merkle";
import * as type from "./type";

const blockchainUrl = "https://blockchain.info";

// Takes hex string, splitted up into subsequent, and each one of them, is passes as a int in base 10 and provide an array we can use in our sha-256 algo
const toBytes = (hex: string): Array<number> =>
  hex
    .match(/../g)
    ?.reduce((acc: number[], hex) => [...acc, parseInt(hex, 16)], []) || [];

const toHex = (bytes: Array<number>): string =>
  //pad the start if it is not characters with leading 0s
  bytes.reduce((acc, bytes) => acc + bytes.toString(16).padStart(2, "0"), "");

// Generate new array by slicing every 2 elements
const toPairs = (arr: Array<Merkle.MerkleNode>): Array<Merkle.MerkleNode[]> =>
  Array.from(Array(Math.ceil(arr.length / 2)), (_, idx) =>
    arr.slice(idx * 2, idx * 2 + 2)
  );

// Hash pairs together
const hashPair = ([a, b = a]: Array<Merkle.MerkleNode>): Merkle.MerkleNode => {
  // // If not second input we reuse a
  // // Join the 2 hashes together and reverse to store in little-endian format
  const bytes = toBytes(`${b.hash}${a.hash}`).reverse();
  // // Satochi decide to double shot sha256 (birthday, replay attack)
  const hashed = sha256.array(sha256.array(bytes));

  return new Merkle.MerkleNode(toHex(hashed.reverse()));
};

export const hashTransaction = (t: type.Transaction): string =>
  sha256(JSON.stringify(t));

export const getMerkleRoot = (
  trs: Array<Merkle.MerkleNode>
): Merkle.MerkleNode =>
  /* Case trs.length === 1, return it cause it is our rootNode*/
  // Else, recursive by making pair and hash them until only one lasts
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

const fetchLatestBlock = () =>
  axios.get(`${blockchainUrl}/q/latesthash?cors=true`).then((r) => r.data);

const fetchMerkleRootAndTransactions = (block: string) =>
  axios
    .get(`${blockchainUrl}/rawblock/${block}?cors=true`)
    .then((r) => [r.data.mrkl_root, r.data.tx.map((t: any) => t.hash)]);

export const testBlockchainData = async () => {
  console.log(". Fetch Blockchain last block MerkleRoot and transactions...");
  fetchLatestBlock()
    .then(fetchMerkleRootAndTransactions)
    .then(([root, txs]) => {
      console.log(".  Last Block MerkleRoot:", root);
      console.log(".   Creating our own tree with Blockchain Transactions...");
      const myroot = getMerkleRoot(
        txs.map((t: string) => new Merkle.MerkleNode(t))
      );
      console.log(".    Our MerkleRoot", myroot.hash);
      const isValid = myroot.hash === root;
      console.log(
        ".     Is matching our Merkle node and Blockchain Merkle node ?",
        isValid
      );
      return isValid;
    });
};
