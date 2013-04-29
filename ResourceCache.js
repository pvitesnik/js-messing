/* ResourceCache.js */


var gCachedImages = {};

var CachedImage = function(src) {
    var img;
    img = gCachedImages[src];
    if (!img) {
        img = new Image();
        img.src = src;
        gCachedImages[src] = img;
    }
    
    return img;
}

