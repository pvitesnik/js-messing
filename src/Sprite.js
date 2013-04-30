/* Sprite.js */

var Sprite = function(url, bookmarks) {
    this.img = CachedImage(url);
    
    this.bookmarks = bookmarks || {};
}



Sprite.prototype.setBookmark = function(name, xOffset, yOffset, zoomX, zoomY) {
    this.bookmarks[name] = {
        xOffset: xOffset,
        yOffset: yOffset,
        zoomX: zoomX,
        zoomY: zoomY,
    };
}

