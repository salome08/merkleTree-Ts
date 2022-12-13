"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerkleTree = void 0;
var functions_1 = require("./functions");
// NODE
var MerkleNode = /** @class */ (function () {
    // leftNode: MerkleNode | null;
    // rightNode: MerkleNode | null;
    function MerkleNode(hash
    // leftNode: MerkleNode | null = null,
    // rightNode: MerkleNode | null = null
    ) {
        this.hash = hash;
        // this.leftNode = leftNode;
        // this.rightNode = rightNode;
    }
    return MerkleNode;
}());
// TREE
var MerkleTree = /** @class */ (function () {
    function MerkleTree(root, height) {
        this.root = root;
        this.height = height;
    }
    MerkleTree.createTree = function (transactions) {
        var height = Math.ceil(Math.log2(transactions.length)) + 1;
        var merkleRoot = (0, functions_1.getMerkleRoot)(transactions.map(function (tr) { return new MerkleNode((0, functions_1.getHash)(tr)); }));
        return new MerkleTree(merkleRoot, height);
    };
    return MerkleTree;
}());
exports.MerkleTree = MerkleTree;
exports.default = MerkleNode;
