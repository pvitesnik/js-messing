/* GameSprites.js */


var gGameSprites = undefined;


function genGameSprites() {
    
    if (gGameSprites) return;
    
    var imgSizeX = 128;
    var imgSizeY = 128;
    
    var sizeX = 512;
    var sizeY = 512;
    
    var bmGen = function(xOffset, yOffset, useImgSizeX, useImgSizeY, useSizeX, useSizeY) {
        useImgSizeX = useImgSizeX || imgSizeX;
        useImgSizeY = useImgSizeY || imgSizeY;
        useSizeX = useSizeX || sizeX;
        useSizeY = useSizeY || sizeY;
        return {xOffset: xOffset, yOffset: yOffset, zoomX: sizeX/useImgSizeX, zoomY: sizeY/useImgSizeY,}
    }
    
    
    gGameSprites = {
        icons : new Sprite('img/icon/icons.png',
            {
                'interface.cross.black' : bmGen(0,0),
                'interface.cross.red' : bmGen(0,1),
                
                'misc.coin' : bmGen(0,2),
                
                'misc.potion.basic' : bmGen(0,3),
                
                'misc.fish.small' : bmGen(1,0),
                'misc.fish.big' : bmGen(1,1),
                'misc.fish.frank' : bmGen(1,2),
                
                'weapon.fists' : bmGen(1,3),
                'weapon.sword.basic' : bmGen(2,0),
                
                'armour.pants.basic' : bmGen(2,1),
                
                'env.chest.basic' : bmGen(2,2),
                
                'misc.none' : bmGen(3,3),
            }
        )
    }
};
 