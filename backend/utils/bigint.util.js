// Solves the "Do not know how to serialize a BigInt" error
BigInt.prototype.toJSON = function() {
    return this.toString();
};