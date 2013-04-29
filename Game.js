/* Game.js */

var KEY_ATTACK = 32;    /* <space> */
var KEY_INTERACT = 69;  /* e */
var KEY_UP = 38;        /* <up arrow> */ 
var KEY_DOWN = 40;      /* <down arrow> */
var KEY_LEFT = 37;      /* <left arrow> */ 
var KEY_RIGHT = 39;     /* <right arrow> */

var INV_X_SIZE = 10;
var INV_Y_SIZE = 10;
var N_INV_SLOTS = INV_X_SIZE*INV_Y_SIZE;




var Game = function(args) {
    var A = args || {};
    
    genGameItems();
    
    this.level = A.level || new Level();
    
    this.players = A.players || [new Player({
        startPos: this.level.origin,
        owner: this.level,
    })];
    
    this.viewportWidth = A.viewportWidth || 1000;
    this.viewportHeight = A.viewportHeight || 800;
    this.invWidth = A.invWidth || 200;
    
    
    this.viewport = new Pos({x: this.level.origin.x, y: this.level.origin.y});
    
    this.keyHandler = new KeyHandler();
    
    this._lastInvSelected = 0;
    this._lastInvSectionSelected = 'inv'; /* 'inv' or 'equip' */ 
    
    this.init();
    
    console.log('Created game');
}

Game.prototype.init = function() {

    var p = this.players[0];

    var gameDiv = $('#game');
    
    gameDiv.css('height', this.viewportHeight);
    gameDiv.css('width', this.viewportWidth + this.invWidth);
    gameDiv.css('background-color', 'rgb(30,30,30)');
    
    var gameLevel = $('<div id="game-level"></div>');
    gameDiv.append(gameLevel);
    
    var gameCanvas = $('<canvas id="game-canvas">Requires Canvas Support</canvas>');
    gameDiv.append(gameCanvas);
    gameCanvas[0].height = this.viewportHeight;
    gameCanvas[0].width = this.viewportWidth;
    
    
    // Messaging system
    var msgDiv = $('<div id="message-div"></div>').addClass('message-div');
    
    $('body').append(msgDiv);
    
    
    
    // Inventory
    var invDiv = $('<div id="inv-div"></div>');
    invDiv.css('left', this.viewportWidth);
    invDiv.css('top', 0);
    invDiv.css('height', this.viewportHeight);
    invDiv.css('width', this.invWidth);
    invDiv.addClass('inventory');
    
    invDiv.append($('<div id="inv-title">Inventory</div>').addClass('title'));
    
    // Item slots
    var invSlotsDiv = $('<div id="inv-slots"></div>').addClass('inv-slots');
    invSlotsDiv.css('height', this.invWidth);
    
    var SLOT_WIDTH = 20;
    var SLOT_HEIGHT = 20;
    
    
    var addSlot = function(idReadable, typeReadable, slotId, cx, cy, addTo, player) {
    
        var slot = $('<div id="slot-'+slotId+'"></div>');
        
        slot.addClass('slot');
        slot.addClass(typeReadable);
        
        slot.css('left', cx-SLOT_WIDTH/2);
        slot.css('top', cy-SLOT_HEIGHT/2);
        
        slot.css('width', SLOT_WIDTH + 'px');
        slot.css('height', SLOT_HEIGHT + 'px');
            
        slot.attr('title', idReadable + ' ' + typeReadable);
        
        slot.data('slot', slotId);
        slot.data('id', idReadable);
        slot.data('type', typeReadable);
            
        
        slot.attr('data-cmUseContext', 'inv-item');
        slot.data('inv-index', slotId);
        slot.data('inv-type', 'equip');
        slot.data('player', player);
        
        
        slot.on('click', {player: player, index: slotId, game: this, invSection: 'equip'}, Game.Helper.invSelectionHandler);
            
            
            
        addTo.append(slot);
            
        return slot;
    }.bind(this);
    
    // - Armour
    addSlot('Head', 'Armour', ITEM_SLOT.HEAD, this.invWidth*1/2, 20, invSlotsDiv, p);
    addSlot('Face', 'Armour', ITEM_SLOT.FACE, this.invWidth*1/2, 45, invSlotsDiv, p);
    addSlot('Torso', 'Armour', ITEM_SLOT.TORSO, this.invWidth*1/2, 85, invSlotsDiv, p);
    addSlot('Shoulders', 'Armour', ITEM_SLOT.SHOULDERS, this.invWidth*2/7, 70, invSlotsDiv, p);
    addSlot('Arms', 'Armour', ITEM_SLOT.ARMS, this.invWidth*5/7, 85, invSlotsDiv, p);
    addSlot('Hands', 'Armour', ITEM_SLOT.HANDS, this.invWidth*2/7, 110, invSlotsDiv, p);
    addSlot('Belt', 'Armour', ITEM_SLOT.BELT, this.invWidth*1/2, 120, invSlotsDiv, p);
    addSlot('Legs', 'Armour', ITEM_SLOT.LEGS, this.invWidth*1/2, 150, invSlotsDiv, p);
    addSlot('Feet', 'Armour', ITEM_SLOT.FEET, this.invWidth*1/2, 180, invSlotsDiv, p);
    
    // - Jewelery
    addSlot('Wrists', 'Jewelery', ITEM_SLOT.WRISTS, this.invWidth*5/7, 115, invSlotsDiv, p);
    addSlot('Neck', 'Jewelery', ITEM_SLOT.NECK, this.invWidth*11/17, 50, invSlotsDiv, p);
    addSlot('Left Finger', 'Jewelery', ITEM_SLOT.FINGER_L, this.invWidth*2/13, 125, invSlotsDiv, p);
    addSlot('Right Finger', 'Jewelery', ITEM_SLOT.FINGER_R, this.invWidth*11/13, 125, invSlotsDiv, p);
    
    // - Weapons
    addSlot('Left Hand', 'Weapon', ITEM_SLOT.WEAPON_L, this.invWidth*2/7, 145, invSlotsDiv, p);
    addSlot('Right Hand', 'Weapon', ITEM_SLOT.WEAPON_R, this.invWidth*5/7, 145, invSlotsDiv, p);
    addSlot('Quiver', 'Weapon', ITEM_SLOT.QUIVER, this.invWidth*6/17, 40, invSlotsDiv, p);
    
    
    
    invDiv.append(invSlotsDiv);
    
    
    
    // add player stats
    
    var addStat = function(type, cx, cy, origin, addTo, player) {
    
        var stat = $('<div id="stat-'+type+'"></div>')
    
        stat.addClass('stat');
        stat.addClass('floater');
        
        if (origin == 'top-left') {
            stat.css('top', cy);
            stat.css('left', cx);
        } else if (origin == 'top-right') {
            stat.css('top', cy);
            stat.css('right', cx);
        } else if (origin == 'bottom-left') {
            stat.css('bottom', cy);
            stat.css('left', cx);
        } else if (origin == 'bottom-right') {
            stat.css('bottom', cy);
            stat.css('right', cx);
        }
        
        stat.data('player', player);
        stat.data('type', type);
        
        addTo.append(stat);
            
        return stat;
    }.bind(this);
    
    addStat('weight', 5, 5, 'top-left', invSlotsDiv, p);
    addStat('damage', 5, 5, 'bottom-left', invSlotsDiv, p);
    addStat('armour', 5, 5, 'bottom-right', invSlotsDiv, p);
    
    // Item List
    
    var n = 0;
    var itemListDiv = $('<div id="item-list-div"></div>').addClass('item-list');
    itemListDiv.css('height', this.invWidth);
    
    var p = this.players[0];
    
    for (var i = 0; i < INV_Y_SIZE; i++) {
        var r;
        r = $('<div id="div-row-'+i+'" class="row"></div>');
        for (var j = 0; j < INV_X_SIZE; j++) {
            var c = $('<div id="div-cell-'+n+'" class="cell"></div>');
            
            if (n == 0) {
                c.addClass('selected');
            }
            
            c.attr('data-cmUseContext', 'inv-item');
            c.data('inv-index', n);
            c.data('inv-type', 'inv');
            c.data('player', p);
            
            c.on('click', {player: p, index: n, game: this, invSection: 'inv'}, Game.Helper.invSelectionHandler);
            
            
            r.append(c);
            n++;
        }
        itemListDiv.append(r);
    }
    
    invDiv.append(itemListDiv);
    
    
    // Inventory Detail Box
    invDiv.append($('<div id="inv-detailbox"></div>').addClass('detail-box')
        .append($('<div></div>').addClass('main'))
        .append($('<div></div>').addClass('detail')));
    
    
    // -- attach inventory
    gameDiv.append(invDiv);
    
    
    
    // Inventory Context Menu (attached to body)
    var invItemCmenu = $('<div id="inv-item-cmenu"></div>').addClass('cont').addClass('cmenu').css('display', 'none')
        .append($('<ul></ul>').addClass('cmenu')
    );
    
    
    
    
    
    
    
    
    
    
    $('body').append(invItemCmenu);
    
    
    // initialise the context menu
    cmInitContext('inv-item', 'inv-item-cmenu', function(target, jdiv, hooks) {
        var jtarget = $(target);
        
        var cont = $('#inv-item-cmenu');
        var cmenu = cont.find('.cmenu');
        
        cmenu.html('');
        
        
        
        var p = jtarget.data('player');
        var index = jtarget.data('inv-index');
        var type = jtarget.data('inv-type');
        var inv = p.inventory;
        var invItem;
        
        var isInv = (type == 'inv');
        var isEquip = (type == 'equip');
        
        if (isInv) {
            invItem = inv[index];
        } else if (isEquip) {
            invItem = p.equippedItems[index];
        } else {
            throw "Bad inv-type: '" + type + "'";
        }
        
        // TODO: is this good or not?
        console.log(jtarget);
        jtarget.trigger('click');
        
        
            console.log('ran context menu callback ' + invItem);
        if (invItem) {
            var menuItems = [];
            
            // onclick will be provided 'player' and 'index' 'hooks' in 'e.data'
            
            var MenuItem = function(args) {
                var A = args || {};
                this.text = A.text;
                this.link = A.link || '#';
                this.onclick = A.onclick || undefined;
            }
            
            if (isInv && invItem.type.canEquip()) {
                menuItems.push( new MenuItem({
                    text: 'Equip \'' + invItem.name + '\'',
                    onclick: function(e) {
                        
                        e.data.player.equip(invItem);
                        
                        e.data.hooks.close();
                    },
                }));
            }
            
            if (isEquip) {
                menuItems.push( new MenuItem({
                    text: 'Unequip \'' + invItem.name + '\'',
                    onclick: function(e) {
                        
                        e.data.player.unequip(invItem);
                        
                        e.data.hooks.close();
                    },
                }));
            }
            
            if (invItem.type.canDrop) {
                if (invItem.type.isCommodity) {
                    
                    menuItems.push( new MenuItem({
                        text: 'Drop All \'' + invItem.name + '\' (' + invItem.count + ')',
                        onclick: function(e) {
                            
                            var droppedItem = invItem;
                            
                            e.data.player.dropItem(droppedItem, invItem.count);
                            e.data.hooks.close();
                        },
                    }));
                    
                    menuItems.push( new MenuItem({
                        text: 'Drop One \'' + invItem.name + '\'',
                        onclick: function(e) {
                            
                            var droppedItem = invItem;
                            
                            e.data.player.dropItem(droppedItem, 1);
                            e.data.hooks.close();
                        },
                    }));
                    
                } else {
                    menuItems.push( new MenuItem({
                        text: 'Drop \'' + invItem.name + '\'',
                        onclick: function(e) {
                            
                            var droppedItem = invItem;
                            
                            e.data.player.dropItem(droppedItem);
                            e.data.hooks.close();
                        },
                    }));
                }
            }
            
            
            
            if (!menuItems.length) {
                return false;
            }
            
            for (var i = 0; i < menuItems.length; i++) {
                var menuLi = $('<li></li>');
                
                console.log('menuItems[i].link: ' + menuItems[i].link);
                
                var menuLink = $('<a href="'+menuItems[i].link+'"></a>');
                
                menuLink.text(menuItems[i].text);
                
                if (menuItems[i].onclick) {
                    menuLink.on('click', {player: p, index: index, hooks: hooks}, menuItems[i].onclick);
                }
                
                menuLi.append(menuLink);
                cmenu.append(menuLi);
            }
            // render!
            return true;
        } else {
            // don't render (must be explicitely === false)
            return false;
        }
    });
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    // invDiv[0].height = this.viewportHeight;
    // invDiv[0].width = this.invWidth;
    
    
    // var invCanvas = $('<canvas id="inv-canvas">Requires Canvas Support</canvas>');
    // invCanvas.css('left', this.viewportWidth);
    // invCanvas.css('top', 0);
    
    // gameDiv.append(invCanvas);
    // invCanvas[0].height = this.viewportHeight;
    // invCanvas[0].width = this.invWidth;
    
    
    
    
    this.players[0].startPos = this.level.origin;
    
    this.players[0].onAddToInv = this.renderInv.bind(this);
    this.players[0].onRemFromInv = this.renderInv.bind(this);
    
    
    var playerMove = function(delX, delY) {
        var CAN_MOVE_THROUGH = [' ', '=', '|', '[', '_'];
    
    
        var xNext = this.players[0].pos.x + delX;
        var yNext = this.players[0].pos.y + delY;
        var tNext = this.level.terrain[xNext][yNext];
        
        this.keyHandler.restartRepeat(KEY_ATTACK);
        this.keyHandler.restartRepeat(KEY_INTERACT);
        
        if (KEY_ATTACK in this.keyHandler._k) {
            return; /* don't move if attacking */
        }
        if (KEY_INTERACT in this.keyHandler._k) {
            return; /* don't move if interacting */
        }
        
        // is an object in the way?
        for (var i = 0; i < this.level.objCount(); i++) {
            if (this.level.objAt(i).isAt(xNext, yNext) && this.level.objAt(i).blocking) {
                return; /* can't move through */
            }
        }
        
        // is terrain in the way?
        if (CAN_MOVE_THROUGH.indexOf(tNext) != -1) {
            this.players[0].pos.x = xNext;
            this.players[0].pos.y = yNext;
        }
    }
    
    var playerAttack = function(delX, delY) {
        var p = this.players[0];
        var xNext = p.pos.x + delX;
        var yNext = p.pos.y + delY;
        var tNext = this.level.terrain[xNext][yNext];
    
        this.keyHandler.cancelRepeat(KEY_ATTACK);
        this.keyHandler.cancelRepeat(KEY_INTERACT);
        this.keyHandler.cancelRepeat(KEY_UP);
        this.keyHandler.cancelRepeat(KEY_DOWN);
        this.keyHandler.cancelRepeat(KEY_LEFT);
        this.keyHandler.cancelRepeat(KEY_RIGHT);
    
        // attack!
        
        if (this.players[0].totalDamage()) {
            if (tNext == '#') {
                // destroy the wall -> rubble
                this.level.terrain[xNext][yNext] = '@';
                if (Math.random() < 0.05) {
                    p.addToInventory(new GameItem({type: gGameItems.Wood, owner: p}));
                }
            } else if (tNext == '@') {
                // destroy the rubble -> clear
                this.level.terrain[xNext][yNext] = ' ';
                if (Math.random() < 0.05) {
                    p.addToInventory(new GameItem({type: gGameItems.Wood, owner: p}));
                }
            } else if (tNext == ']' || tNext == '[') {
                // destroy the door (open or closed)
                this.level.terrain[xNext][yNext] = '@';
                var str = 'You destroy the door in a furious rage, turning it into a pile of rubble.';
                if (Math.random() < 0.3) {
                    str += ' The beast even gives up some of its wood. VICTORY!';
                    p.addToInventory(new GameItem({type: gGameItems.Wood, owner: p}));
                }
                gMessage.send(str);
            }
        }
    }
    
    var playerInteract = function(delX, delY) {
        var p = this.players[0];
        var xNext = p.pos.x + delX;
        var yNext = p.pos.y + delY;
        var tNext = this.level.terrain[xNext][yNext];
        // interact!
        
        // -- with game objects
        var objs = [];
        for (var i = 0; i < this.level.objCount(); i++) {
            if (this.level.objAt(i).isAt(xNext, yNext) && this.level.objAt(i).onInteract) {
                objs.push(this.level.objAt(i));
            }
        }
        for (var i = 0; i < objs.length; i++) {
            // TODO: maybe offer a choice of which to interact with if there are multiple?
            objs[i].onInteract(p);
        }
        
        // -- with terrain
        if (tNext == ']') {
            // open the door
            this.level.terrain[xNext][yNext] = '[';
            gMessage.send("You open the door.");
        } else if (tNext == '[') {
            // close the door
            this.level.terrain[xNext][yNext] = ']';
            gMessage.send("You close the door.");
        } else if (tNext == '~') {
            // go fishing
            gMessage.send("You go fishing.");
            if (Math.random() < 0.2) {
                // found a fish
                
                // get type of fish by order of rarity (roughly)
                var rand = Math.random();
                
                if (rand < 0.25) { /* 25% */
                    // Slippery Fish
                    p.addToInventory(new GameItem({type: gGameItems.SlipperyFish, owner: p}));
                } else if (rand < 0.5) { /* 25% */
                    // Giant Fish
                    p.addToInventory(new GameItem({type: gGameItems.GiantFish, owner: p}));
                } else if (rand < 0.75) { /* 25% */
                    // Slimy Fish
                    p.addToInventory(new GameItem({type: gGameItems.SlimyFish, owner: p}));
                } else if (rand < 0.85) { /* 10% */
                    // Frankenstein's Fish
                    p.addToInventory(new GameItem({type: gGameItems.FrankenFish, owner: p}));
                } else { /* 15% */
                    // Old Boot
                    p.addToInventory(new GameItem({type: gGameItems.OldBoots, owner: p}));
                }
            }
        }
        
        
        this.keyHandler.cancelRepeat(KEY_ATTACK);
        this.keyHandler.cancelRepeat(KEY_INTERACT);
        this.keyHandler.cancelRepeat(KEY_UP);
        this.keyHandler.cancelRepeat(KEY_DOWN);
        this.keyHandler.cancelRepeat(KEY_LEFT);
        this.keyHandler.cancelRepeat(KEY_RIGHT);
    }
    
    
    var keyAttack = function(e) {
        var delX = 0;
        var delY = 0;
        
        if (!this.keyHandler.isRepeatRunning(KEY_ATTACK)) return; /* hack for timer not cancelling properly issue */ 
        
        if (KEY_UP in this.keyHandler._k) {
            var delY = -1;
        } else if (KEY_DOWN in this.keyHandler._k) {
            var delY = 1;
        } else if (KEY_LEFT in this.keyHandler._k) {
            var delX = -1;
        } else if (KEY_RIGHT in this.keyHandler._k) {
            var delX = 1;
        } else {
            return;
        }
        
        playerAttack.bind(this)(delX, delY);
    }
    
    var keyStopAttack = function() {
        this.keyHandler.restartRepeat(KEY_UP);
        this.keyHandler.restartRepeat(KEY_DOWN);
        this.keyHandler.restartRepeat(KEY_LEFT);
        this.keyHandler.restartRepeat(KEY_RIGHT);
    }
    
    var keyInteract = function(e) {
        var delX = 0;
        var delY = 0;
        
        if (!this.keyHandler.isRepeatRunning(KEY_INTERACT)) return; /* hack for timer not cancelling properly issue */ 
        
        
        if (KEY_UP in this.keyHandler._k) {
            var delY = -1;
        } else if (KEY_DOWN in this.keyHandler._k) {
            var delY = 1;
        } else if (KEY_LEFT in this.keyHandler._k) {
            var delX = -1;
        } else if (KEY_RIGHT in this.keyHandler._k) {
            var delX = 1;
        } else {
            return;
        }
        
        playerInteract.bind(this)(delX, delY);
    }
    
    var keyStopInteract = function() {
        this.keyHandler.restartRepeat(KEY_UP);
        this.keyHandler.restartRepeat(KEY_DOWN);
        this.keyHandler.restartRepeat(KEY_LEFT);
        this.keyHandler.restartRepeat(KEY_RIGHT);
    }
    
    
    
    var keyUp = function() {
        playerMove.bind(this)(0, -1);
    }
    var keyDown = function() {
        playerMove.bind(this)(0, 1);
    }
    var keyLeft = function() {
        playerMove.bind(this)(-1, 0);
    }
    var keyRight = function() {
        playerMove.bind(this)(1, 0);
    }
    
    this.keyHandler.add({
        keyCode: KEY_ATTACK,
        preventDefault: true,
        onDown: keyAttack.bind(this),
        onUp: keyStopAttack.bind(this),
        onHold: {rateMs: 10, callback: keyAttack.bind(this)},
    });
    
    this.keyHandler.add({
        keyCode: KEY_INTERACT,
        preventDefault: true,
        onDown: keyInteract.bind(this),
        onUp: keyStopInteract.bind(this),
        onHold: {rateMs: 10, callback: keyInteract.bind(this)},
    });
    
    this.keyHandler.add({
        keyCode: KEY_UP,
        preventDefault: true,
        onDown: keyUp.bind(this),
        onHold: {rateMs: 100, callback: keyUp.bind(this)},
    });
    
    this.keyHandler.add({
        keyCode: KEY_DOWN,
        preventDefault: true,
        onDown: keyDown.bind(this),
        onHold: {rateMs: 100, callback: keyDown.bind(this)},
    });
    
    this.keyHandler.add({
        keyCode: KEY_LEFT,
        preventDefault: true,
        onDown: keyLeft.bind(this),
        onHold: {rateMs: 100, callback: keyLeft.bind(this)},
    });
    
    this.keyHandler.add({
        keyCode: KEY_RIGHT,
        preventDefault: true,
        onDown: keyRight.bind(this),
        onHold: {rateMs: 100, callback: keyRight.bind(this)},
    });
    
    
    
    
    setInterval(this.render.bind(this), 1000/60);
    
};


var gDebug_keepHowManyFrames = 120;
var gDebug_frameTimeStore = Array(gDebug_keepHowManyFrames);
var gDebug_frameBufPos = 0;
var gDebug_lastTime = new Date().getTime();

Game.prototype.render = function() {
    var gameDiv = $('#game');
    var gameCanvas = $('#game-canvas');
    var canvas = gameCanvas[0];
    
    var ctx = canvas.getContext('2d');
    
    this.centerViewport();
    
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(- this.viewport.x * this.level.tileW, - this.viewport.y * this.level.tileH);
    
    this.level.render(canvas, this.viewport.x, this.viewport.y, canvas.width/this.level.tileW, canvas.height/this.level.tileH);
    
    
    
    // var players = [];
    // for (var i = 0; i < this.level.objCount(); i++) {
        // if (this.level.objAt(i) instanceof Player) {
            // players.push(this.level.objAt(i));
        // } else {
            // this.level.objAt(i).render(canvas);
        // }
    // }
    // for (var i = 0; i < players.length; i++) {
        // players[i].render(canvas);
    // }
    
    
    
    var debug_thisTime = new Date().getTime();
    var debug_dRenderTime = debug_thisTime - gDebug_lastTime;
    gDebug_frameTimeStore[gDebug_frameBufPos] = debug_dRenderTime;
    gDebug_frameBufPos += 1;
    if (gDebug_frameBufPos >= gDebug_keepHowManyFrames) {
        gDebug_frameBufPos = 0;
    }
    gDebug_lastTime = debug_thisTime;
    
    var debug_tMSecs = 0;
    for (var i = 0; i < gDebug_keepHowManyFrames; i++) {
        debug_tMSecs += gDebug_frameTimeStore[i] || 1000/60;
    }
    var fps = Math.floor(gDebug_keepHowManyFrames/(debug_tMSecs/1000));
    
    ctx.setTransform(1,0,0,1,0,0);
    ctx.fillStyle = "rgb(200,200,100)";
    ctx.font = '12pt "Lucida Console", Monaco, monospace';
    ctx.textAlign = "start";
    
    ctx.fillText("FPS: " + fps, 5, 20); 
    $('#fps').text(fps);
    
};

Game.prototype.renderInv = function() {

    var gameDiv = $('#game');
    var invDiv = $('#inv-div');

    var p = this.players[0];
    var inv = p.inventory;
    
    var itemListDiv = $('#item-list-div');
    
    // render inventory item list
    for (var i = 0; i < N_INV_SLOTS; i++) {
        var c = $('#div-cell-'+i);
        
        c.html('');
        var item = $('<div></div>').addClass('item');
        
        if (i >= p.invSize) {
            c.addClass('disabled');
        } else {
            c.removeClass('disabled');
        
            if (inv[i] !== undefined) {
                
                item.css('background-color', 'rgb(' + inv[i].color.rgbString() + ')');
                if (inv[i].img) {
                    item.css('background-image', 'url("'+inv[i].img.src+'")');
                    item.css('background-size', '100% 100%');
                }
                
                item.attr('title', inv[i].name);
                
                if (inv[i].type.isCommodity) {
                    var comLabel = $('<div></div>');
                    comLabel.addClass('commodity-label');
                    
                    comLabel.text(inv[i].count < 1000 ? inv[i].count : 'lots');
                    
                    if (luminance(inv[i].color.r, inv[i].color.g, inv[i].color.b) < 0.5) {
                        comLabel.addClass('light');
                    } else {
                        comLabel.addClass('dark');
                    }
                    
                    comLabel.attr('data-cmUseContext', 'inv-item');
                    comLabel.data('inv-index', i);
                    comLabel.data('inv-type', 'inv');
                    comLabel.data('player', p);
                    
                    item.attr('title', item.attr('title') + ' (' + inv[i].count + ')');
                    item.append(comLabel);
                }
            }
            
        }
        
        item.attr('data-cmUseContext', 'inv-item');
        item.data('inv-index', i);
        item.data('inv-type', 'inv');
        item.data('player', p);
        c.append(item);
    }
    
    // render equipped inventory
    invDiv.find('.slot').html('');
    
    var q = p.equippedItems;
    var qk = Object.keys(q);
    for (var i = 0; i < qk.length; i++) {
        var qItem = q[qk[i]];
        var slot = invDiv.find('#slot-'+qk[i]);
        
        if (qItem) {
        
            var item = $('<div></div>').addClass('item');
            
            item.css('background-color', 'rgb(' + qItem.color.rgbString() + ')');
            item.attr('title', qItem.name + ' (' + slot.data('id') + ' ' + slot.data('type') + ')');
            if (qItem.img) {
                item.css('background-image', 'url("'+qItem.img.src+'")');
                item.css('background-size', '100% 100%');
            }
            
            item.attr('data-cmUseContext', 'inv-item');
            item.data('inv-index', qk[i]);
            item.data('inv-type', 'equip');
            item.data('player', p);
            
            slot.append(item);
            
            if ([ITEM_SLOT._WEAPON_2HAND, ITEM_SLOT._WEAPON_2HAND].indexOf(qItem.type.slot) != -1) {
                var disSlot = undefined;
                if (qk[i] == ITEM_SLOT.WEAPON_R) {
                    // mark slot L disabled
                    disSlot = $('#slot-'+ITEM_SLOT.WEAPON_L);
                    
                } else if (qk[i] == ITEM_SLOT.WEAPON_L) {
                    // mark slot R disabled
                    disSlot = $('#slot-'+ITEM_SLOT.WEAPON_R);
                }
                if (disSlot) {
                    var item = $('<div></div>').addClass('item');
                    item.attr('title', 'Used by 2 Handed Item \'' + qItem.name + '\'');
                    item.addClass('disable');
                    
                    item.attr('data-cmUseContext', 'inv-item');
                    item.data('inv-index', qk[i]);
                    item.data('inv-type', 'equip');
                    item.data('player', p);
                    
                    disSlot.append(item);
                    
                }
            }
        }
    }
    
    var newText;
    var stat;
    
    newText = 'Damage: ' + p.totalDamage();
    stat = $('#stat-damage');
    if (stat.text() != newText) stat.text( newText );
    
    newText = 'Armour: ' + p.totalArmour();
    stat = $('#stat-armour');
    if (stat.text() != newText) stat.text( newText );
    
    newText = Math.round(p.carriedWeight()*100)/100 + (p.maxWeight !== null ? '/' + p.maxWeight : '') + 'kg';
    stat = $('#stat-weight');
    if (stat.text() != newText) stat.text( newText );
    
    
    
    
    
    
    
    var invSelected = this._lastInvSectionSelected == 'inv';
    var qSelected = this._lastInvSectionSelected == 'equip'

    if (invSelected) {
        $('#div-cell-'+this._lastInvSelected).trigger('click');
    } else {
        $('#slot-'+this._lastInvSelected).trigger('click');
    }
    
    
    
    
    
    
    


    /*
    var gameDiv = $('#game');
    var invCanvas = $('#inv-canvas');
    var canvas = invCanvas[0];
    
    var ctx = canvas.getContext('2d');
    
    var w = canvas.width;
    var h = canvas.height;
    
    // clear
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // render border
    ctx.strokeStyle = "rgb(150,100,100)";
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(1,0);
    ctx.lineTo(1,h);
    ctx.stroke();
    
    
    // render text
    ctx.fillStyle = "rgb(150,100,100)";
    ctx.font = '20pt "Lucida Console", Monaco, monospace';
    ctx.textAlign = "center";
    
    ctx.fillText("Inventory", w/2, h/12, 3*w/4); 
    
    
    var p = this.players[0];
    var inv = p.inventory;
    
    var invHStart = 2*h/10;
    var itemH = h/12;
    
    
    ctx.font = '12pt "Lucida Console", Monaco, monospace';
    ctx.textAlign = "start";
    
    for (var i = 0; i < inv.length; i++) {
        ctx.fillText('+ ' + inv[i].name, w/8, invHStart + itemH*i, 3*w/4); 
    }
    
    
    
    
    // ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
    
    
    
    // ctx.strokeStyle = "red";
    // ctx.lineWidth = 5;
    // ctx.beginPath();
    // ctx.moveTo(0,0);
    // ctx.lineTo(w,0);
    // ctx.lineTo(w,h);
    // ctx.lineTo(0,h);
    // ctx.lineTo(0,0);
    // ctx.stroke();
    */
    
}

Game.prototype.centerViewport = function() {
    this.viewport.x = this.players[0].pos.x - this.viewportWidth / 2 / this.level.tileW;
    this.viewport.y = this.players[0].pos.y - this.viewportHeight / 2 / this.level.tileH;
}


Game.prototype.start = function() {
    var p = this.players[0];
    
    
    
    p.respawn();
    
}














// Helpers
Game.Helper = {};
Game.Helper.invSelectionHandler = function(e) {
    var invSelected = e.data.game._lastInvSectionSelected == 'inv';
    var qSelected = e.data.game._lastInvSectionSelected == 'equip'

    if (invSelected) {
        $('#div-cell-'+e.data.game._lastInvSelected).removeClass('selected');
    } else if (qSelected) {
        $('#slot-'+e.data.game._lastInvSelected).removeClass('selected');
    } else {
        throw "Bad _lastInvSectionSelected: '" + e.data.game._lastInvSectionSelected + "'";
    }
    

    // $('#item-list-div').find('.selected').removeClass('selected');
    $(this).addClass('selected');
    
    e.data.game._lastInvSelected = e.data.index;
    e.data.game._lastInvSectionSelected = e.data.invSection;
    console.log(this);
    
    var detailBox = $('#inv-detailbox');
    var detailBoxMain = detailBox.find('.main');
    var detailBoxDetail = detailBox.find('.detail');
    var invItem;
    if (e.data.invSection == 'inv') {
        invItem = e.data.player.inventory[e.data.index]
    } else if (e.data.invSection == 'equip') {
        invItem = e.data.player.equippedItems[e.data.index]
    }
    
    var newHtml;
    
    
    // set main text
    if (invItem) {
        if (invItem.type.isCommodity) {
            newHtml = invItem.count + 'x ' + invItem.name;
        } else {
            newHtml = invItem.name;
        }
    } else {
        newHtml = 'Empty';
    }
    
    if (newHtml != detailBoxMain.html()) detailBoxMain.html( newHtml );
    
    
    // set detail text
    var P_START = '<p>';
    var P_END = '</p>';
    if (invItem) {
        var attrs = [];
    
        
        // slot
        if (invItem.type.slot == ITEM_SLOT._WEAPON_1HAND) {
            attrs.push('1 Handed Weapon');
        } else if (invItem.type.slot == ITEM_SLOT._WEAPON_2HAND) {
            attrs.push('2 Handed Weapon');
        } else if (invItem.type.slot == ITEM_SLOT._SHIELD_1HAND) {
            attrs.push('1 Handed Shield');
        } else if (invItem.type.slot == ITEM_SLOT._SHIELD_2HAND) {
            attrs.push('2 Handed Shield');
        } else if (invItem.type.slot == ITEM_SLOT.HEAD) {
            attrs.push('Head Armour');
        } else if (invItem.type.slot == ITEM_SLOT.FACE) {
            attrs.push('Face Armour');
        } else if (invItem.type.slot == ITEM_SLOT.TORSO) {
            attrs.push('Torso Armour');
        } else if (invItem.type.slot == ITEM_SLOT.SHOULDERS) {
            attrs.push('Shoulder Armour');
        } else if (invItem.type.slot == ITEM_SLOT.ARMS) {
            attrs.push('Arm Armour');
        } else if (invItem.type.slot == ITEM_SLOT.HANDS) {
            attrs.push('Gloves');
        } else if (invItem.type.slot == ITEM_SLOT.BELT) {
            attrs.push('Belt');
        } else if (invItem.type.slot == ITEM_SLOT.LEGS) {
            attrs.push('Leg Armour');
        } else if (invItem.type.slot == ITEM_SLOT.FEET) {
            attrs.push('Shoes');
        } else if (invItem.type.slot == ITEM_SLOT.WRISTS) {
            attrs.push('Wrist Jewelery');
        } else if (invItem.type.slot == ITEM_SLOT.NECK) {
            attrs.push('Necklace');
        } else if (invItem.type.slot == ITEM_SLOT.FINGER_L) {
            attrs.push('Ring (Left)');
        } else if (invItem.type.slot == ITEM_SLOT.FINGER_R) {
            attrs.push('Ring (Right)');
        } else if (invItem.type.slot == ITEM_SLOT.QUIVER) {
            attrs.push('Quiver');
        }
    
        // desc
        attrs.push(invItem.type.description);
        
        // armour-specific
        if (invItem.type.isArmour()) {
            attrs.push('Armour: ' + invItem.type.armour);
        }
        // weapon-specific
        if (invItem.type.isWeapon()) {
            attrs.push('Damage: ' + invItem.type.damage);
        }
        
        // value
        if (invItem.type.isCommodity) {
            attrs.push('Value: ' + invItem.type.cost * invItem.count + ' (' + invItem.count + ' x ' + invItem.type.cost + ' each)');
        } else {
            attrs.push('Value: ' + invItem.type.cost);
        }
        
        
        if (invItem.type.weight) {
            if (invItem.type.isCommodity) {
                attrs.push('Weight: ' + Math.round(invItem.type.weight * invItem.count * 100)/100 + 'kg (' + invItem.count + ' x ' + invItem.type.weight + 'kg each)');
            } else {
                attrs.push('Weight: ' + Math.round(invItem.type.weight*100)/100 + 'kg');
            }
        }
        
        // durability-specific
        if (!isNaN(invItem.type.maxLife)) {
            attrs.push('Durability: ' + invItem.life + '/' + invItem.type.maxLife);
        }
        
        newHtml = P_START + attrs.join(P_END + P_START) + P_END;
    } else {
        newHtml = '';
    }
    
    if (newHtml != detailBoxDetail.html()) detailBoxDetail.html( newHtml );
}








