/* Pos.js */

var Pos = function(args, y) {
    var A = {};
    if (y !== undefined) {
        A.x = args;
        A.y = y;
    } else {
        A = args || {};
    }
    
    this.x = A.x || 0;
    this.y = A.y || 0;
}

Pos.prototype.equals = function(p) {
    return (p.x == this.x && p.y == this.y);
}

