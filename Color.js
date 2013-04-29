/* Color.js */

var Color = function(args, g, b, a) {
    if (g !== undefined && b !== undefined) {
        this.r = args;
        this.g = g;
        this.b = b;
        this.a = a;
    } else {
        var A = args || {};
        
        this.r = A.r || 0;
        this.g = A.g || 0;
        this.b = A.b || 0;
        this.a = A.a || 0;
    }
}


Color.prototype.rgbString = function() {
    return this.r + ',' + this.g + ',' + this.b;
}

