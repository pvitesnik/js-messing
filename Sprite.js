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


var spriteTest = function(test) {
    var div = $('#test-div');

    div.css({
        'width':'100px',
        'height': '100px',
        'border':'solid 1px red',
    })
    
    var sprite = new Sprite('img/icon/icons.png');
    
    sprite.setBookmark('coin', 0, 0, 2, 2);
    sprite.setBookmark('frank', 1, 0, 2, 2);
    sprite.setBookmark('big', 1, 1, 2, 2);
    sprite.setBookmark('small', 0, 1, 2, 2);
    
    div.css({
        'background-image':'url('+sprite.img.src+')', 
        'background-size':100*sprite.bookmarks[test].zoomX+'% ' + 100*sprite.bookmarks[test].zoomY+'%',
        'background-position':100*sprite.bookmarks[test].xOffset+'% ' + 100*sprite.bookmarks[test].yOffset+'%',
    });
    
    
    
    
}


