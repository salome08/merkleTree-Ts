import * as functions from "./src/functions";
import * as Merkle from "./src/Merkle";
import * as mockData from "./tests/mockData";

(function () {
  console.log("-------- Merkle Tree Init ------------");
  const hashedMocktrs1 = mockData.mockTrs.map((tr) =>
    functions.hashTransaction(tr)
  );
  const hashedMocktrs2 = mockData.mockTrs2.map((tr) =>
    functions.hashTransaction(tr)
  );
  const hashedNewLeaf = functions.hashTransaction(mockData.newLeaf);

  console.log("---- Creating Tree with Raw data --------");
  const tree = new Merkle.MerkleTree(hashedMocktrs1);
  console.log("=>      |Tree 1|", tree);

  console.log("---- Create and Verify proof on our Merkletree --------");
  const isValidProof1 = tree.verifyProof(hashedMocktrs1, hashedMocktrs1[0]);
  console.log("=>      Is Valid Proof ?", isValidProof1);

  console.log("---- Creating New Tree with Raw data --------");
  const tree2 = new Merkle.MerkleTree(hashedMocktrs2);
  console.log("=>      |Tree 2|", tree2);

  console.log(
    "---- Add a leaf on our 1st Merkletree and check the Tree id and Tree root --------"
  );
  tree.addLeaf(hashedMocktrs1, hashedNewLeaf);
  console.log("=>      |Tree 1|", tree);

  console.log(
    "---- Now let compare both Blockchain MerkleTree and ours --------"
  );
  functions.testBlockchainData();
})();
