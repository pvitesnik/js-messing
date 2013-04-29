function luminance(r, g, b) {
    var a = [r,g,b].map(function(v) {
        v /= 255;
        return (v <= 0.03928) ?
            v / 12.92 :
            Math.pow( ((v+0.055)/1.055), 2.4 );
        });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}


function getContrast(ar, ag, ab, br, bg, bb) {
    var la = luminance(ar, ag, ab) + 0.05;
    var lb = luminance(br, bg, bb) + 0.05;
    
    if (la > lb) return la/lb;
    else return lb/la;
}

