/* GameActor.js */


var gGameActors = [];
var GameActor = function(args) {
    var A = args || {};
    
    GameObject.apply(this, arguments);
    
    this.name = A.name || 'New Actor';
    
    this.maxLife = A.maxLife || 1;
    this.life = A.life || this.maxLife;
    
    if (!A.inheritedFrom) {
        console.log('Created actor: \'' + this.name + '\' @ ' + this.pos.x + ', ' + this.pos.y);
        gGameActors.push(this);
    }
}

GameActor.prototype = new GameObject({inheritedFrom: true});
GameActor.prototype.constructor = GameActor;




GameActor.prototype.isDead = function() {
    return (this.life <= 0);
}




