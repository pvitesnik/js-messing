/* Message.js */


var Message = function(args){
    var A = args || {};

    this.log = [];
    this.divId = A.divId || 'message-div';
    this.surpress = A.surpress || false;
};


Message.prototype.send = function(msg) {
    if (this.surpress) return;
    
    this.log.push(msg);
    
    var div = $('#' + this.divId);
    if (!div) return;
    
    var height = div.height();
    var scrollHeight = div[0].scrollHeight;
    var st = div.scrollTop();
    var wasAtBottom = (st+20 >= scrollHeight - height); // TODO: hacks, no idea why, but there is a 20 offset (css issue/custom scroll-bars perhaps?)
    
    
    var msgDiv = $('<div></div>');
    msgDiv.addClass('message');
    msgDiv.text(msg);
    
    
    div.append($('<div class="row"></div>').append(msgDiv));
    
    if (wasAtBottom) {
        div[0].scrollTop = div[0].scrollHeight;
    }
}


Message.prototype.clear = function(msg) {
    this.log = [];

    var div = $('#' + this.divId);
    if (!div) return;
    div.html('');
}





var gMessage = new Message();





