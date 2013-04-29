/* GameItem.js */





var GameItem = function(args) {
    var A = args || {};
    
    GameObject.apply(this, arguments);
    
    this.type = A.type; /* type is required */
    
    this.name = this.type.name;
    this.color = new Color(this.type.color) || new Color();
    this.img = this.type.img || undefined;
    
    // TODO: THIS STUFF!!
    this.owner = A.owner;
    this.life = A.life !== undefined ? A.life : this.type.maxLife; /* life of the item */
    
    this.count = A.count || 1; /* number of this item (if a commodity) */ 
    
    // override default
    this.blocking = A.blocking || true; // TODO: default walk-over items? 
    this.onInteract = gObjActions.addToInv;
}

GameItem.prototype = new GameObject({inheritedFrom: true});
GameItem.prototype.constructor = GameItem;


GameItem.prototype.calcWeight = function() {
    if (this.type.isCommodity) {
        return this.count * this.type.weight;
    } else {
        return this.type.weight;
    }
}
