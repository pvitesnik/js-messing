/* GameObject.js */

var gObjActions = {};

gObjActions.addToInv = function(user) {
    this.pos = new Pos(0, 0);   /* move to non-valid location */
    this.hide = true;           /* don't render */
    
    user.addToInventory(this);  /* push to inv */
    
    console.log('Added ' + this.name + ' to the inventory of ' + user.name);
}







var GameObject = function(args) {
    var A = args || {}
    
    this.owner = A.owner || undefined;
    
    this.name = A.name || 'New Object';
    
    this.pos = new Pos(A.pos) || new Pos();
    this.startPos = new Pos(A.startPos) || new Pos();
    this.w = A.w || 10;
    this.h = A.h || 10;
    
    this.color = new Color(A.color) || new Color(0, 0, 150);
    this.sprite = A.sprite || undefined;
    this.spriteBM = A.spriteBM || undefined;
    
    this.hide = A.hide === undefined ? true : A.hide;
    this.blocking = A.blocking || false;
    
    this.invSize = A.invSize || 1;
    
    this.inventory = A.inventory || []; /* contains other game objects */
    
    this.objects = A.objects || []; /* be an objCont! */ 
    
    // if on the ground
    this.onInteract = A.onInteract || undefined;
    this.onAttacked = A.onAttacked || undefined;
    
    this.onAddToInv = A.onAddToInv || undefined;
    this.onRemFromInv = A.onRemFromInv || undefined;
    
    // if used from inventory
    this.onInteractWith = A.onInteractWith || undefined;
    this.onAttackWith = A.onAttackWith || undefined;
    
    console.log(this);
    
    if (!A.inheritedFrom) { /* prevent inheritance calls from pushing to the list */
        if (!this.owner) throw "GameObject requires owner";
        this.owner.objAdd((this));
    }
}

extend(GameObject.prototype, objCont);

GameObject.prototype.render = function(canvas) {
    
    if (this.hide) return;
    var ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'rgb(' + this.color.rgbString() + ')';
    ctx.fillRect(this.pos.x*this.w,this.pos.y*this.h,this.w,this.h);
    
    var s = this.sprite;
    if (s) {
        var bm = this.sprite.bookmarks[this.spriteBM];
        var img = this.sprite.img;
        
        var xUnit = img.width / bm.zoomX
        var yUnit = img.height / bm.zoomY;
        ctx.drawImage(img, xUnit * bm.xOffset, yUnit * bm.yOffset, xUnit, yUnit, this.pos.x*this.w, this.pos.y*this.h, this.w, this.h);
    }
}

GameObject.prototype.destoryInventory = function() {
    
    this.inventory = [];
    
    if (this.onRemFromInv) this.onRemFromInv.bind(this)();
}

GameObject.prototype.removeFromInventory = function(obj) {
    var i = this.inventory.indexOf(obj);
    if (i >= 0) {
        this.inventory[i] = undefined;
        if (this.onAddToInv) this.onAddToInv.bind(this)(obj);
    }
}

GameObject.prototype.addToInventory = function(obj, index) {

    if (index === undefined) {
        for (var i = 0; i < this.invSize; i++) {
            if (this.inventory[i] === undefined) {
                index = i;
                break;
            }
        }
    }
    
    if (index === undefined) {
        throw "Out of Room";
    }
    
    var added = false;
    
    if (obj.type.isCommodity) {
        // do we already have any of this commodity?
        for (var i = 0; i < this.invSize; i++) {
            
            if (this.inventory[i] && this.inventory[i].type === obj.type) {
                this.inventory[i].count += obj.count;
                added = true;
                // original will be destroyed later
                obj.owner.objRem(obj);
                
                obj = this.inventory[i];
                
                break;
            }
        }
    }
    if (!added) {
        obj.owner.objRem(obj);
        this.objAdd(obj);
        obj.owner = this;
        this.inventory[index] = obj;
    }
    
    
    if (this.onAddToInv) this.onAddToInv.bind(this)(obj);
}

GameObject.prototype.inventoryContains = function(obj) {
    return (this.inventory.indexOf(obj) != -1);
}


GameObject.prototype.isAt = function(x, y) {
    // TODO: improve to handle width + height properly
    return this.pos.equals(new Pos({x: x, y: y}));
}





