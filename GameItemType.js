/* GameItemType.js */

var ACTION_TYPE = {
    NONE :          0,
    INTERACT :      1,
    MELEE_ATTACK :  2,
    RANGED_ATTACK : 3,
};

var ITEM_SLOT = {
    // misc
    INV_ONLY :      0,
    
    // -- meta-types - can equip these
    
    _SHIELD_1HAND : 1,
    _SHIELD_2HAND : 2,
    
    _WEAPON_1HAND : 3,
    _WEAPON_2HAND : 4,
    
    // armour
    HEAD :          5,
    FACE :          6,
    TORSO :         7,
    SHOULDERS :     8,
    ARMS :          9,
    HANDS :         10,
    BELT :          11,
    LEGS :          12,
    FEET :          13,
    
    // jewelery
    WRISTS :        14,
    NECK :          15,
    FINGER_L :      16,
    FINGER_R :      17,
    
    // weapons
    QUIVER :        18,
    
    // -- can't equip these
    WEAPON_L :      19,
    WEAPON_R :      20,
};

var ITEM_SLOT__NOT_EQUIPABLE = ['INV_ONLY', 'WEAPON_L', 'WEAPON_R'];


var GameItemType = function(args) {
    var A = args || {};
    
    this.name = A.name || 'My New Item';
    
    this.color = new Color(A.color) || new Color();
    this.img = A.img || undefined;
    
    this.cost = A.cost || 0;
    this.weight = A.weight || 0;
    
    this.canDrop = A.canDrop !== undefined ? A.canDrop : true;
    this.actionType = A.actionType || ACTION_TYPE.NONE;
    this.slot = A.slot || ITEM_SLOT.INV_ONLY;
    
    this.damage = A.damage || 0;
    this.armour = A.armour || 0;
    
    
    this.maxLife = A.maxLife || NaN;
    
    this.description = A.description || 'An Item.'
    
    this.isCommodity = A.isCommodity || false; /* commodities stack into one pile */
    
    this.autoGen = A.autoGen !== undefined ? A.autoGen : true;
}

GameItemType.prototype.isArmour = function() {
    return ((this.slot >= ITEM_SLOT.HEAD && this.slot <= ITEM_SLOT.FEET) || (this.slot >= ITEM_SLOT._SHIELD_1HAND && this.slot <= ITEM_SLOT._SHIELD_2HAND));
}

GameItemType.prototype.isJewelery = function() {
    return (this.slot >= ITEM_SLOT.WRISTS && this.slot <= ITEM_SLOT.FINGER_R);
}

GameItemType.prototype.isWeapon = function() {
    return ((this.slot >= ITEM_SLOT.QUIVER && this.slot <= ITEM_SLOT.WEAPON_R) || (this.slot >= ITEM_SLOT._WEAPON_1HAND && this.slot <= ITEM_SLOT._WEAPON_2HAND));
}

GameItemType.prototype.canEquip = function() {
    return (this.slot > ITEM_SLOT.INV_ONLY && this.slot <= ITEM_SLOT.QUIVER);
}






