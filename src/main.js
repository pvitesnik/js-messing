/* main.js */


var gGame;

function initGame() {
    gGame = new Game();
    
    
    var p = gGame.players[0];
    var level = gGame.level;
    
    p.name = 'Phil';
    p.onUnequip = function(obj, count) {
        if (!this.equippedItems[ITEM_SLOT.TORSO] && this.equippedItems[ITEM_SLOT.LEGS]) {
            gMessage.send('You should probably put a shirt on.');
        }
        if (this.equippedItems[ITEM_SLOT.TORSO] && !this.equippedItems[ITEM_SLOT.LEGS]) {
            gMessage.send('You do realise that you\'re now running around without pants, right?.');
        }
        if (!this.equippedItems[ITEM_SLOT.TORSO] && !this.equippedItems[ITEM_SLOT.LEGS]) {
            gMessage.send('Oh my. You\'re naked!');
        }
    }
    
    p.onEquip = function(obj, count) {
        if (obj.type.isWeapon()) {
            if (this.equippedItems[ITEM_SLOT.WEAPON_R] && this.equippedItems[ITEM_SLOT.WEAPON_L] 
                && this.equippedItems[ITEM_SLOT.WEAPON_R].type.isWeapon()
                && this.equippedItems[ITEM_SLOT.WEAPON_L].type.isWeapon()) {
                gMessage.send('2 weapons!? What a badass!!.');
            }
        }
    };
    
    new GameItem({
        type: gGameItems.DullPotion, 
        pos: new Pos(30, 35),
        hide: false,
        owner: level,
    });
    
    new GameItem({
        type: gGameItems.ShinyPotion, 
        pos: new Pos(35, 35),
        hide: false,
        owner: level,
    });
    
    
    new GameItem({
        type: gGameItems.Sword, 
        pos: new Pos(25, 32),
        hide: false,
        owner: level,
    });
    
    new GameItem({
        type: gGameItems.Sword, 
        pos: new Pos(25, 37),
        hide: false,
        owner: level,
    });
    
    new GameItem({
        type: gGameItems.Sword, 
        pos: new Pos(27, 42),
        hide: false,
        owner: level,
    });
    
    new GameItem({
        type: gGameItems.Gold, 
        pos: new Pos(23, 40),
        count: 50,
        hide: false,
        owner: level,
    });
    
    gGame.renderInv();
    
    
    gGame.start();
    
    
    
    
}


$(document).ready(function() {
    initGame();
});



