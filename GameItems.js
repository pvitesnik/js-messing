/* GameItems.js */



var gGameItems = {

    // Weapons
    Fists : new GameItemType({
        name: 'Your Fists',
        description: 'These are your fists, you can punch things with them.',
        
        cost: 0,
        
        canDrop : false,
        actionType : ACTION_TYPE.MELEE_ATTACK,
        slot : ITEM_SLOT._WEAPON_2HAND,
        
        color: new Color(150, 120, 120),
        imgPath: 'img/icon/fists.png',
        
        damage : 1,
        armour: 0,
        
        autoGen: false,
    }),
    
    Sword : new GameItemType({
        name: 'A Sword',
        description: 'A Sword. At least twice as good as your fists for killing things.',
        
        cost: 10,
        weight: 5,
        
        canDrop : true,
        actionType : ACTION_TYPE.MELEE_ATTACK,
        slot : ITEM_SLOT._WEAPON_1HAND,
        
        color: new Color(140, 140, 130),
        imgPath: 'img/icon/sword-basic.png',
        // imgPath: 'img/icon/treasure-chest-basic.png',
        
        damage : 2,
        armour: 0,
        
        maxLife: 10,
    }),
    
    
    // Armour
    
    BlueShirt : new GameItemType({
        name: 'A Blue Shirt',
        description: 'It\'s blue with a nice picture on the front.',
        
        cost: 1,
        weight: 0.5,
        
        canDrop : true,
        actionType : ACTION_TYPE.NONE,
        slot : ITEM_SLOT.TORSO,
        
        color: new Color(0, 0, 120),
        
        damage : 0,
        armour: 0,
    }),
    
    PlainPants : new GameItemType({
        name: 'Plain Pants',
        description: 'You get the feeling that maybe these pants need a wash.',
        
        cost: 1,
        weight: 1,
        
        canDrop : true,
        actionType : ACTION_TYPE.NONE,
        slot : ITEM_SLOT.LEGS,
        
        color: new Color(120, 80, 80),
        imgPath: 'img/icon/pants-basic.png',
        
        damage : 0,
        armour: 0,
    }),
    
    OldBoots : new GameItemType({
        name: 'A Pair of Old Boots',
        description: 'Really? Oh well, you suppose that you could wear the boots in a pinch.',
        
        cost: 1,
        weight: 2,
        
        canDrop : true,
        actionType : ACTION_TYPE.NONE,
        slot : ITEM_SLOT.FEET,
        
        color: new Color(150, 100, 100),
        
        damage : 0,
        armour: 1,
    }),
    
    
    
    
    
    // Potions
    ShinyPotion : new GameItemType({
        name: 'A Shiny Potion',
        description: 'This potion is incredibly shiny. No really, it\'s super shiny.',
        
        cost: 50,
        weight: 0.1,
        
        canDrop : true,
        actionType : ACTION_TYPE.NONE,
        slot : ITEM_SLOT.INV_ONLY,
        
        color: new Color(0, 50, 200),
        imgPath: 'img/icon/potion-basic.png',
        
        damage : 0,
        armour: 0,
    }),
    
    DullPotion : new GameItemType({
        name: 'A Dull Potion',
        description: 'This potion is so dull you nearly fall asleep.',
        
        cost: 15,
        weight: 0.1,
        
        canDrop : true,
        actionType : ACTION_TYPE.NONE,
        slot : ITEM_SLOT.INV_ONLY,
        
        color: new Color(90, 90, 150),
        imgPath: 'img/icon/potion-basic.png',
        
        damage : 0,
        armour: 0,
    }),
    
    
    
    
    
    
    
    
    
    // Commodities
    Gold : new GameItemType({
        name: 'Gold',
        description: 'Gold, cash, money, moolah, coin, dosh... you get the idea.',
        
        cost: 1,
        
        isCommodity: true,
        
        canDrop : false,
        actionType : ACTION_TYPE.NONE,
        slot : ITEM_SLOT.INV_ONLY,
        
        color: new Color(150, 150, 0),
        imgPath: 'img/icon/coin-basic.png',
        
        damage : 0,
        armour: 0,
    }),
    
    Wood : new GameItemType({
        name: 'Wood',
        description: 'A piece of wood.',
        
        cost: 1,
        weight: 5,
        
        isCommodity: true,
        
        canDrop : true,
        actionType : ACTION_TYPE.NONE,
        slot : ITEM_SLOT.INV_ONLY,
        
        color: new Color(60, 50, 50),
        
        damage : 0,
        armour: 0,
    }),
    
    
    // Misc
    SlipperyFish : new GameItemType({
        name: 'A Slippery Fish',
        description: 'The fish is slippery, but looks quite tasty.',
        
        cost: 1,
        weight: 0.2,
        
        isCommodity: true,
        
        canDrop : true,
        actionType : ACTION_TYPE.NONE,
        slot : ITEM_SLOT.INV_ONLY,
        
        color: new Color(120, 200, 100),
        imgPath: 'img/icon/fish-small.png',
        
        damage : 0,
        armour: 0,
    }),
    
    GiantFish : new GameItemType({
        name: 'A Giant Fish',
        description: 'The fish is really big. You wonder how it got so large and decide not to go in the water.',
        cost: 3,
        weight: 3,
        
        isCommodity: true,
        
        canDrop : true,
        actionType : ACTION_TYPE.NONE,
        slot : ITEM_SLOT.INV_ONLY,
        
        color: new Color(200, 200, 200),
        imgPath: 'img/icon/fish-big.png',
        
        damage : 0,
        armour: 0,
    }),
    
    SlimyFish : new GameItemType({
        name: 'A Slimy Fish',
        description: 'The fish is slimy, probably not worth eating.',
        cost: 2,
        weight: 0.5,
        
        isCommodity: true,
        
        canDrop : true,
        actionType : ACTION_TYPE.NONE,
        slot : ITEM_SLOT.INV_ONLY,
        
        color: new Color(120, 180, 120),
        imgPath: 'img/icon/fish-small.png',
        
        damage : 0,
        armour: 0,
    }),
    
    
    FrankenFish : new GameItemType({
        name: 'Frankenstein\'s Fish',
        description: 'What is this monstrosity? My eeeeyeees!.',
        
        cost: 100,
        
        isCommodity: true,
        
        canDrop : true,
        actionType : ACTION_TYPE.NONE,
        slot : ITEM_SLOT.INV_ONLY,
        
        color: new Color(120, 180, 120),
        imgPath: 'img/icon/fish-frank.png',
        
        damage : 0,
        armour: 0,
    }),
}




