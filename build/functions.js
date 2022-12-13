"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMerkleRoot = exports.hashPair = exports.simpleHash = exports.toPairs = void 0;
var Merkle_1 = __importDefault(require("./Merkle"));
var js_sha256_1 = require("js-sha256");
// export const getHash = (data: string): string => {
//   return createHash("sha256").update(data.toString()).digest("hex");
// };
// Takes hex string, splitted up into subsequent, and each one of them, is passes as a int in base 10 and provide an array we can use in our sha-256 algo
// const toBytes = (hex: string) : Array<n =>
//   hex.match(/../g).reduce((acc, hex) => [...acc, parseInt(hex, 16)], []);
// const toHex = (bytes) =>
//   //pad the start if it is not characters with leading 0
//   bytes.reduce((acc, bytes) => acc + bytes.toString(16).padStart(2, "0"), "");
// Generate new array by slicing every 2 elements
var toPairs = function (arr) {
    return Array.from(Array(Math.ceil(arr.length / 2)), function (_, idx) {
        return arr.slice(idx * 2, idx * 2 + 2);
    });
};
exports.toPairs = toPairs;
var simpleHash = function () {
    console.log("testHash", (0, js_sha256_1.sha256)("Holla"));
};
exports.simpleHash = simpleHash;
// Hash pairs together, if it's odd we hash itself the last one.
var hashPair = function () {
    var pair = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        pair[_i] = arguments[_i];
    }
    var _a = __spreadArray([], pair, true), a = _a[0], _b = _a[1], b = _b === void 0 ? a : _b; // If not second input we reuse a
    // need to provide byte array for the sha256 library, need to convert this hashes to byte arrays
    // Join the 2 hashes together and reverse to store in little-endian format
    var bytes = toBytes("".concat(b.hash).concat(a.hash)).reverse();
    // Satochi decide to double shot sha256 (birthday, replay attack)
    var hashed = js_sha256_1.sha256.array(js_sha256_1.sha256.array(bytes));
    // To understand easier the return of the function
    return new Merkle_1.default(toHex(hashed.reverse()));
};
exports.hashPair = hashPair;
var getMerkleRoot = function (trs) {
    // case trs.length === 1, just return it cause it is our rootNode
    return trs.length === 1
        ? trs[0]
        : merkleRoot((0, exports.toPairs)(trs).reduce(function (tree, pair) { return __spreadArray(__spreadArray([], tree, true), [exports.hashPair.apply(void 0, pair)], false); }, []));
};
exports.getMerkleRoot = getMerkleRoot;
