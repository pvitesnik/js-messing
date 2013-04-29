/* Player.js */



var Player = function(args) {
    var A = args || {};
    
    GameActor.apply(this, arguments);
    
    // player specific defaults
    this.name = A.name || 'New Player';
    
    this.invSize = A.invSize || 100;
    this.maxWeight = A.maxWeight || 50; /* null == no maximum */
    
    this.blocking = true;
    
    this.equippedItems = A.equippedItems || {};
    
    this.onEquip = A.onEquip || undefined;
    this.onUnequip = A.onUnequip || undefined;
    
    
    console.log('Created player: \'' + this.name + '\' @ ' + this.pos.x + ', ' + this.pos.y);
}

Player.prototype = new GameActor({inheritedFrom: true});
Player.prototype.constructor = Player;

Player.prototype.render = function(canvas) {

    if (this.hide) return;

    var ctx = canvas.getContext('2d');
    
    /* draw head */ 
    ctx.fillStyle = 'rgb(20,20,20)';
    ctx.fillRect(this.pos.x*this.w,this.pos.y*this.h,this.w,this.h-this.h*3/4);
    
    ctx.fillStyle = 'rgb(150,150,100)';
    ctx.fillRect(this.pos.x*this.w,this.pos.y*this.h+this.w/4,this.w,this.h-this.h*3/4);
    
    
    ctx.fillStyle = 'rgb(0,0,150)';
    ctx.fillRect(this.pos.x*this.w,this.pos.y*this.h+this.h/2,this.w,this.h-this.h/2);
}


Player.prototype.equip = function(obj, count) {
    
    
    if (!obj || !obj.type.canEquip()) return false;
    
    var putInInv = undefined;
    var putInInv2 = undefined;
    
    var targetSlot = obj.type.slot;
    if (obj.type.slot == ITEM_SLOT._WEAPON_2HAND || obj.type.slot == ITEM_SLOT._SHIELD_2HAND) {
        
        targetSlot = ITEM_SLOT.WEAPON_R;
        
        if (this.equippedItems[ITEM_SLOT.WEAPON_L]) {
            putInInv2 = this.equippedItems[targetSlot];
        }
    } else if (obj.type.slot == ITEM_SLOT._WEAPON_1HAND || obj.type.slot == ITEM_SLOT._SHIELD_2HAND) {
        
        var lHand = this.equippedItems[ITEM_SLOT.WEAPON_L];
        var rHand = this.equippedItems[ITEM_SLOT.WEAPON_R];
        
        if (rHand && (rHand.type.slot == ITEM_SLOT._WEAPON_2HAND || rHand.type.slot == ITEM_SLOT._SHIELD_2HAND)) {
            targetSlot = ITEM_SLOT.WEAPON_R;
        } else if (lHand && (lHand.type.slot == ITEM_SLOT._WEAPON_2HAND || lHand.type.slot == ITEM_SLOT._SHIELD_2HAND)) {
            putInInv2 = lHand;
            targetSlot = ITEM_SLOT.WEAPON_R;
        } else if (!rHand) {
            targetSlot = ITEM_SLOT.WEAPON_R;
        } else if (!lHand) {
            targetSlot = ITEM_SLOT.WEAPON_L;
        } else if (obj.type.isWeapon()) {
            // TODO: naive if both are filled, may auto-replace wrong type
            targetSlot = ITEM_SLOT.WEAPON_R;
        } else {
            // TODO: naive if both are filled, may auto-replace wrong type
            targetSlot = ITEM_SLOT.WEAPON_L;
        }
    }
    
    if (this.equippedItems[targetSlot]) {
        putInInv = this.equippedItems[targetSlot];
    }
    this.equippedItems[targetSlot] = obj;
    
    this.removeFromInventory(obj);
    
    if (putInInv) {
        this.addToInventory(putInInv);
    }
    if (putInInv2) {
        this.addToInventory(putInInv2);
    }
    
    gMessage.send('You equipped \'' + (obj.type.isCommodity ? obj.count + 'x ' : '') + obj.name + '\'.');
    
    
    
    if (this.onAddToInv) this.onAddToInv.bind(this)();
    if (this.onRemFromInv) this.onRemFromInv.bind(this)();
    if (this.onEquip) this.onEquip.bind(this)(obj, count);
}

Player.prototype.unequip = function(obj) {
    if (!obj) return;
    
    var q = this.equippedItems;
    var qk = Object.keys(q);
    for (var i = 0; i < qk.length; i++) {
        var qItem = q[qk[i]];
        if (!qItem) continue;
        
        if (qItem === obj) {
            q[qk[i]] = undefined;
        }
    }
    try {
        this.addToInventory(obj);
    } catch (err) {
        // drop the item
        gMessage.send('No room for \'' + (obj.type.isCommodity ? obj.count + 'x ' : '') + obj.name + '\' so you dropped it.');
        dropItem();
    }
    if (this.onUnequip) this.onUnequip.bind(this)(obj, count);
}


Player.prototype.respawn = function() {
    
    this.destoryInventory();
    this.life = this.maxLife;
    
    // TODO: better determine where to respawn?
    this.pos.x = this.startPos.x;
    this.pos.y = this.startPos.y;
    
    
    this.hide = false;
    
    
    gMessage.send(this.name + ', you are alive!');
    
    
    // give player the default starting items
    var r;
    gMessage.surpress = true;
    
    this.addToInventory (
        new GameItem({
            type: gGameItems.Gold,
            count: Math.floor(Math.random()*50 + 50),
            owner: this,
        })
    );
    
    this.equip (
        new GameItem({
            type: gGameItems.Fists,
            owner: this,
        })
    );
    
    this.equip (
        new GameItem({
            type: gGameItems.BlueShirt,
            owner: this,
        })
    );
    
    this.equip (
        new GameItem({
            type: gGameItems.PlainPants,
            owner: this,
        })
    );
    
    gMessage.surpress = false;
}


Player.prototype.totalDamage = function() {
    var q = this.equippedItems;
    var qk = Object.keys(q);
    
    var dmg = 0;
    
    // add equipped items
    for (var i = 0; i < qk.length; i++) {
        var qItem = q[qk[i]];
        
        if (qItem) {
            /* any item can do damage -- items that do no damage have .damage = 0 */ 
            if (qItem.type.isCommodity) dmg += qItem.type.damage * qItem.count;
            else dmg += qItem.type.damage;
        }
    }
    
    // add buffs (inc negative)
    
    
    // add items that add buffs in inventory
    
    
    
    
    return dmg;
}

Player.prototype.totalArmour = function() {
    var q = this.equippedItems;
    var qk = Object.keys(q);
    
    var amr = 0;
    
    // add equipped items
    for (var i = 0; i < qk.length; i++) {
        var qItem = q[qk[i]];
        
        if (qItem) {
            /* any item can add armour -- items that do no armour have .armour = 0 */
            if (qItem.type.isCommodity) amr += qItem.type.armour * qItem.count;
            else amr += qItem.type.armour;
            
        }
    }
    
    // add buffs (inc negative)
    
    
    // add items in inventory
    
    return amr;
}

Player.prototype.carriedWeight = function() {
    var q = this.equippedItems;
    var qk = Object.keys(q);
    
    var wt = 0;
    
    // add equipped items
    for (var i = 0; i < qk.length; i++) {
        var qItem = q[qk[i]];
        
        if (qItem) {
            /* any item can add weight -- items that do no weight have .weight = 0 */ 
            wt += qItem.calcWeight();
        }
    }
    
    // add buffs (inc negative)
    
    
    // add items in inventory
    for (var i = 0; i < this.invSize; i++) {
        var qItem = this.inventory[i];
        
        if (qItem) {
            /* any item can add weight -- items that do no weight have .weight = 0 */ 
            wt += qItem.calcWeight();
        }
    }
    
    
    return wt;
}

Player.prototype.addToInventory = function(obj, index) {
    
    if (this.maxWeight !== null) {
        var weight = this.carriedWeight();
        
        if (obj.calcWeight() + weight > this.maxWeight) {
            // drop the item
            gMessage.send(obj.name + ' is too heavy so you dropped it.');
            this.dropItem(obj);
            return;
        }
    }
    
    var result = GameObject.prototype.addToInventory.bind(this)(obj, index);
    
    gMessage.send( 'Added \'' + (obj.type.isCommodity ? obj.count + 'x ' : '') + obj.name + '\' to your inventory.');

    
    return result;
}


Player.prototype.dropItem = function(obj, count) {
    // remove the item if it's equipped or in inventory
    var found = false;
    var droppedItem;
    
    if (obj.type.isCommodity && count == undefined) {
        count = obj.count;
    }
    
    
    if (!found) {
        var q = this.equippedItems;
        var qk = Object.keys(q);
        for (var i = 0; i < qk.length; i++) {
            if (q[qk[i]] == obj) {
                if (!obj.type.isCommodity || obj.count - count <= 0) {
                    q[qk[i]] = undefined;
                    droppedItem = obj;
                } else {
                    droppedItem = new GameItem(obj);
                    droppedItem.count = count;
                    obj.count -= count;
                }
                if (this.onUnequip) this.onUnequip.bind(this)(obj, count);
                if (this.onRemFromInv) this.onRemFromInv.bind(this)();
                found = true;
                break;
            }
        }
    }
    
    if (!found) {
        for (var i = 0; i < this.invSize; i++) {
            if (this.inventory[i] == obj) {
                if (!obj.type.isCommodity || obj.count - count <= 0) {
                    this.removeFromInventory(obj);
                    droppedItem = obj;
                } else {
                    droppedItem = new GameItem(obj);
                    droppedItem.count = count;
                    obj.count -= count;
                    if (this.onRemFromInv) this.onRemFromInv.bind(this)();
                }
                found = true;
                break;
            }
        }
    }
    if (!found) {
        droppedItem = obj
    }
    
    droppedItem.pos = new Pos(this.pos.x, this.pos.y);
    droppedItem.hide = false;
    
    this.objRem(droppedItem);
    this.owner.objAdd(droppedItem);
    obj.owner = this.owner;
    gMessage.send('You dropped \'' + (droppedItem.type.isCommodity ? count + 'x ' : '') + droppedItem.name + '\'');
}







