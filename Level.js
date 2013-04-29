/* Level.js */

var Level = function(args) {
    var A = args || {};
    
    // this.w = A.w || 5000;
    // this.h = A.h || 5000;
    this.w = A.w || 500;
    this.h = A.h || 500;
    
    this.tileW = A.tileW || 10;
    this.tileH = A.tileH || 10;
    
    this.origin = new Pos(A.origin || {x:this.w/2, y:this.h/2});
    
    this.objects = [];
    
    this.MAX_WATER_BLOBS = A.MAX_WATER_BLOBS || 100;
    this.MAX_WATER_BLOB_SIZE = A.MAX_WATER_BLOB_SIZE || 300;
    
    this.MAX_BUILDINGS = A.MAX_BUILDINGS || 200;
    this.MAX_BUILDING_SIZE = A.MAX_BUILDING_SIZE || 15;
    this.MIN_BUILDING_SIZE = A.MIN_BUILDING_SIZE || 5;
    this.MAX_BUILDING_DOORS = A.MAX_BUILDING_DOORS || 8;
    this.MIN_BUILDING_DOORS = A.MIN_BUILDING_DOORS || 1;
    
    // this.MIN_ITEMS_TO_GENERATE = A.MIN_ITEMS_TO_GENERATE || 1000;
    // this.MAX_ITEMS_TO_GENERATE = A.MAX_ITEMS_TO_GENERATE || 5000;
    this.MIN_ITEMS_TO_GENERATE = A.MIN_ITEMS_TO_GENERATE || 100;
    this.MAX_ITEMS_TO_GENERATE = A.MAX_ITEMS_TO_GENERATE || 500;
    
    this.terrain = this.generateTerrain(this.w, this.h, this.origin);
    
    this.generateItems();
    
}

extend(Level.prototype, objCont);


Level.prototype.render = function(canvas, x, y, w, h) {
    var ctx = canvas.getContext("2d");
    var t = this.terrain;
    
    var minXVisible = x;
    var maxXVisible = x+w;
    var minYVisible = y;
    var maxYVisible = y+h;
    
    minXVisible = Math.max(minXVisible,0);
    minYVisible = Math.max(minYVisible,0);
    
    for (var x = minXVisible; x < t.length; x++) {
        if (x > maxXVisible) break;
        
        for (var y = minYVisible; y < t[x].length; y++) {
            if (y > maxYVisible) break;
        
        
            if (t[x][y] === '#') { /* wall */
                ctx.fillStyle = 'rgb(0,150,0)';
                ctx.fillRect(x*this.tileW,y*this.tileH,this.tileW,this.tileH);
            } else if (t[x][y] === '@') { /* rubble */
                ctx.fillStyle = 'rgb(70,50,50)';
                ctx.fillRect(x*this.tileW,y*this.tileH,this.tileW,this.tileH);
            } else if (t[x][y] === '~') { /* water */
                if (Math.random() < 0.5) {
                    ctx.fillStyle = 'rgb(140,255,255)';
                } else {
                    ctx.fillStyle = 'rgb(150,255,255)';
                }
                
                ctx.fillRect(x*this.tileW,y*this.tileH,this.tileW,this.tileH);
            } else if (t[x][y] === '=') { /* h-wood*/
                
                var partH = this.tileH/6;
                
                for (var i = 0; i < 6; i++) {
                    if (i % 2) {
                        ctx.fillStyle = 'rgb(150,100,100)';
                    } else {
                        ctx.fillStyle = 'rgb(100,50,50)';
                    }
                    ctx.fillRect(x*this.tileW, y*this.tileH+partH*i, this.tileW, partH);
                }
                
            } else if (t[x][y] === '|') { /* v-wood */
                
                var partW = this.tileW/6;
                
                for (var i = 0; i < 6; i++) {
                    if (i % 2) {
                        ctx.fillStyle = 'rgb(150,100,100)';
                    } else {
                        ctx.fillStyle = 'rgb(100,50,50)';
                    }
                    ctx.fillRect(x*this.tileW+partW*i, y*this.tileH, partW, this.tileH);
                }
                
            } else if (t[x][y] === '$') { /* walls */
                
                var partH = this.tileH/10;
                
                for (var i = 0; i < 10; i++) {
                    if (i % 2) {
                        ctx.fillStyle = 'rgb(150,100,100)';
                    } else {
                        ctx.fillStyle = 'rgb(100,50,50)';
                    }
                    ctx.fillRect(x*this.tileW, y*this.tileH+partH*i, this.tileW, partH);
                }
                
            } else if (t[x][y] === ']') { /* door (closed) */
                
                var partW = this.tileW/2;
                
                for (var i = 0; i < 2; i++) {
                    if (i % 2) {
                        ctx.fillStyle = 'rgb(150,100,100)';
                    } else {
                        ctx.fillStyle = 'rgb(150,120,120)';
                    }
                    ctx.fillRect(x*this.tileW+partW*i, y*this.tileH, partW, this.tileH);
                }
                
            } else if (t[x][y] === '[') { /* door (open) */
                
                var partW = this.tileW/2;
                
                ctx.fillStyle = 'rgb(75,50,50)';
                ctx.fillRect(x*this.tileW+partW*1, y*this.tileH, partW, this.tileH);
                
                
            } else if (t[x][y] === '_') { /* floor */
                
                var partW = this.tileW/2;
                var partH = this.tileH/2;
                
                for (var i = 0; i < 4; i++) {
                    if (i % 2) {
                        ctx.fillStyle = 'rgb(120,100,120)';
                    } else {
                        ctx.fillStyle = 'rgb(130,120,130)';
                    }
                    ctx.fillRect(x*this.tileW+partW*i, y*this.tileH+partH*i, partW, partH);
                }
                
            } else if (t[x][y] === '+') { /* boundary */ 
                ctx.fillStyle = 'rgb(0,100,0)';
                ctx.fillRect(x*this.tileW,y*this.tileH,this.tileW,this.tileH);
            }
        }
    }
    
    // render all visible objects that we own
    // TODO: naive, could be improved
    
    // ensure that players are rendered last
    var players = [];
    for (var i = 0; i < this.objCount(); i++) {
        var obj = this.objAt(i);
        if (obj.pos.x >= minXVisible && obj.pos.x <= maxXVisible && obj.pos.y >= minYVisible && obj.pos.y <= maxYVisible) {
            if (obj instanceof Player) {
                players.push(obj);
            } else {
                obj.render(canvas);
            }
        }
    }
    for (var i = 0; i < players.length; i++) {
        players[i].render(canvas);
    }
    
}


Level.prototype.generateTerrain = function(w, h, origin) {
    
    var t = new Array(w);
    for (var i = 0; i < t.length; i++) {
        t[i] = new Array(h);
    }
    
    // test: define lower bound
    // 0,0, is top-left
    
    // init
    for (var x = 0; x < t.length; x++) {
        for (var y = 1; y < t[x].length-1; y++) {
            if (x == 0 || x == t.length-1) {
                t[x][y] = '+';
            } else {
                t[x][y] = ' ';
            }
        }
        
        t[x][0] = '+';
        t[x][t[x].length-1] = '+';
    }
    
    // blob generator
    
    // generate waterblobs
    
    var nWaterBlobs = Math.floor(Math.random()*this.MAX_WATER_BLOBS);
    console.log('MAX_WATER_BLOBS: ' + this.MAX_WATER_BLOBS);
    
    console.log('nWaterBlobs: ' + nWaterBlobs);
    
    for (var i = 0; i < nWaterBlobs; i++) {
        var x = Math.floor(Math.random()*w);
        var y = Math.floor(Math.random()*h);
        var size = Math.floor(Math.random()*this.MAX_WATER_BLOB_SIZE);
        
        console.log('x: ' + x + ', y: ' + y + ', size: ' + size);
    
        // generate the waterblob
        for (var n = 0; n < size; n++) {
            var sX = x;
            var sY = x;
            while (t[sX][sY] != ' ') {
                sX += (Math.random() < 0.8) ? ( (Math.random() < 0.5) ? +1 : -1 ) : 0;
                sY += (Math.random() < 0.8) ? ( (Math.random() < 0.5) ? +1 : -1 ) : 0;
                if (sX <= 0) sX = 0;
                if (sY <= 0) sY = 0;
                if (sX >= w) sX = w-1;
                if (sY >= h) sY = h-1;
            }
            t[sX][sY] = '~';
        }
    }
    
    // render buildings
    
    var nBuildings = Math.floor(Math.random()*this.MAX_BUILDINGS);
    
    console.log('nBuildings: ' + nBuildings);
    
    for (var i = 0; i < nBuildings; i++) {
        var x = Math.floor(Math.random()*(w-this.MIN_BUILDING_SIZE));
        var y = Math.floor(Math.random()*(h-this.MIN_BUILDING_SIZE));
        var sizeX = Math.floor(Math.random()*this.MAX_BUILDING_SIZE);
        var sizeY = Math.floor(Math.random()*this.MAX_BUILDING_SIZE);
        var nDoors = Math.floor(Math.random()*this.MAX_BUILDING_DOORS);
        var allowWaterOverlay = (Math.random() < 0.2);
        
        var doorsPlaced = 0;
        
        
        if (sizeX < this.MIN_BUILDING_SIZE) sizeX = this.MIN_BUILDING_SIZE;
        if (sizeY < this.MIN_BUILDING_SIZE) sizeY = this.MIN_BUILDING_SIZE;
        if (nDoors < this.MIN_BUILDING_DOORS) nDoors = this.MIN_BUILDING_DOORS;
        
        console.log('x: ' + x + ', y: ' + y + ', sizeX: ' + sizeX + ', sizeY: ' + sizeY + ', nDoors: ' + nDoors + ', allowWaterOverlay: ' + allowWaterOverlay);
        
        for (var delX = 0; delX < sizeX; delX++) {
            var absX = x + delX;
            if (absX >= w) break;
            for (var delY = 0; delY < sizeY; delY++) {
                var absY = y + delY;
                if (absY >= h) break;
                
                if (!(t[absX][absY] == ' ' || (allowWaterOverlay && t[absX][absY] == '~'))) continue; /* already occupied */
                
                var top = delY == 0;
                var bottom = delY == sizeY-1;
                var left = delX == 0 ;
                var right = delX == sizeX-1;
                
                
                if (top || bottom || left || right) {
                    
                    if (doorsPlaced < nDoors && !(top && left) && !(top && right) && !(bottom && left) && !(bottom && right) && Math.random() < 0.2) {
                        // place doors
                        t[absX][absY] = ']';
                        doorsPlaced += 1;
                    } else {
                        // place walls
                        t[absX][absY] = '$';
                    }
                    
                } else {
                    // place floor
                    t[absX][absY] = '_';
                }
            }
        }
        
    }
    
    
    
    for (var x = 1; x < t.length-1; x++) {
        for (var y = 1; y < t[x].length-1; y++) {
        
            
            if (x == origin.x && y == origin.y) {
                
                if (t[x][y] == '~') {
                
                    
                    console.log('spawned in water!');
                    var CANNOT_ESCAPE_THROUGH = ['~', '+'];
                
                    // build a bridge to leave the water from
                    
                    // search in all directions
                    
                    var _check = function(cX, cY) {
                        if (CANNOT_ESCAPE_THROUGH.indexOf(t[cX][cY]) == -1) {
                            // can escape
                            return true;
                        } else {
                            // can't escape
                            return false;
                        }
                    }
                    
                    if (_check(x+1,y) || _check(x-1,y) || _check(x,y+1) || _check(x,y-1)) {
                        // all is fine, can escape -- naive ;)
                        
                        console.log('can get out!!');
                        
                    } else {
                        
                        var tryX;
                        var tryY;
                        var makeBridge = null;
                        
                        if (!makeBridge) {
                            // try up
                            tryX = x;
                            tryY = y;
                            while (!_check(tryX,tryY) && y >= 1) {
                                tryY -= 1;
                            }
                            if (_check(tryX,tryY)) {
                                // success, make a bridge
                                makeBridge = 'up'
                            }
                        }
                        
                        if (!makeBridge) {
                            // try down
                            tryX = x;
                            tryY = y;
                            while (!_check(tryX,tryY) && y >= 1) {
                                tryY += 1;
                            }
                            if (_check(tryX,tryY)) {
                                // success, make a bridge
                                makeBridge = 'down'
                                break;
                            }
                        }
                        
                        if (!makeBridge) {
                            // try left
                            tryX = x;
                            tryY = y;
                            while (!_check(tryX,tryY) && y >= 1) {
                                tryX -= 1;
                            }
                            if (_check(tryX,tryY)) {
                                // success, make a bridge
                                makeBridge = 'left'
                                break;
                            }
                        }
                        
                        if (!makeBridge) {
                            // try right
                            tryX = x;
                            tryY = y;
                            while (!_check(tryX,tryY) && y >= 1) {
                                tryX += 1;
                            }
                            if (_check(tryX,tryY)) {
                                // success, make a bridge
                                makeBridge = 'right'
                                break;
                            }
                        }
                        
                        if (!makeBridge) {
                            // failure in all directions, regenerate
                            return this.generateTerrain(w, h, origin);
                        } else {
                            console.log('making bridge');
                            // make the bridge
                            var tX = x;
                            var tY = y;
                            
                            while(!_check(tX, tY)) {
                                t[tX][tY] = makeBridge == 'up' || makeBridge == 'down' ? '=' : '|';
                                if (makeBridge == 'up') tY -= 1;
                                else if (makeBridge == 'down') tY += 1;
                                else if (makeBridge == 'left') tX -= 1;
                                else if (makeBridge == 'right') tY += 1;
                            }
                        }
                    }
                    
                }
                if ([' ', '=', '|', '_'].indexOf(t[x][y]) != -1) { 
                    t[x][y] = ' ';
                }
                
            } else if (t[x][y] != ' ') {
                ; /* already filled */
            } else if (Math.random() < 0.2) {
                t[x][y] = '#';
            } else if (Math.random() < 0.05) {
                t[x][y] = '@';
            } else {
                t[x][y] = ' ';
            }
        }
    }
    return t;
}


Level.prototype.generateItems = function() {

    var nItems = Math.floor(((this.MAX_ITEMS_TO_GENERATE-this.MIN_ITEMS_TO_GENERATE) * Math.random()) + this.MIN_ITEMS_TO_GENERATE);
    console.log('nItems: ' + nItems);
    
    var chooseFrom = [];
    
    var gIkeys = Object.keys(gGameItems);
    for (var i = 0; i < gIkeys.length; i++) {
        if (gGameItems[gIkeys[i]].autoGen) {
            chooseFrom.push({
                itemType: gGameItems[gIkeys[i]]
            });
        }
    }
    
    for (var i = 0; i < nItems; i++) {
        
        // evenly distribute (for now)
        var itemType = chooseFrom[Math.floor(Math.random() * chooseFrom.length)].itemType;
        
        
        var count = 0;
        
        // choose a pos that's currently clear
        do {
            var x = Math.floor(Math.random()*this.w);
            var y = Math.floor(Math.random()*this.w);
        } while (this.terrain[x][y] != '_' && this.terrain[x][y] != ' ');
        
        // choose a quantity if required
        if (itemType.isCommodity) {
            count = Math.floor(Math.random()*5+1);
        }
        
        new GameItem({
            type: itemType,
            count: count,
            hide: false,
            pos: new Pos(x,y),
            owner: this,
        })
        
    }
    
    
}


