/* InputHandler.js */




var KeyHandler = function(args) {
    this.init(args);
}

KeyHandler.prototype.init = function(args) {
    var A = args || {}

    this._k = {};
    this._meta = {};
    this.special = A.special || [];
    
    /* 
        special : {
            keyCode : int,                          // must be present (native js keyCode)
            onDown : fn,                            // default: none (callback(event))
            onUp : fn,                              // default: none (callback(event))
            onHold : {rateMs: int, callback: fn},   // default: 0 / none (callback())
            preventDefault: bool,                   // default: false
        }
    */
    
    var _handleKeyDown = function(e) {
    
        // browser compatibility!
        if (!e && window.event) {
            e = window.event;
        }
        
        var keyCode = e.keyCode ? e.keyCode : 
            e.charCode ? e.charCode : e.which;
        
        if (keyCode) {
            if (!(keyCode in this._k)) {
                this._k[keyCode] = new Date().getTime();
                
                for (var i = 0; i < this.special.length; i++) {
                    var s = this.special[i];
                    // console.log('hold: ' + keyCode);
                    if (keyCode === s.keyCode) {
                        var m = this._meta[keyCode] = {};
                        var context = {keyCode: keyCode};
                    
                        /* s.onDown */
                        if (s.onDown) {
                            s.onDown.bind(context)(e);
                        }
                        /* s.onUp */
                        /* s.onHold */
                        if (s.onHold) {
                            m.intervalId = setInterval(s.onHold.callback.bind(context), s.onHold.rateMs);
                        }
                        /* s.preventDefault */
                        if (s.preventDefault) {
                            e.preventDefault();
                        }
                    }
                }
            }
        }
    };
    
    var _handleKeyPress = function(e) {
        // browser compatibility!
        if (!e && window.event) {
            e = window.event;
        }
        
        var keyCode = e.keyCode ? e.keyCode : 
            e.charCode ? e.charCode : e.which;
        
        if (keyCode) {
            for (var i = 0; i < this.special.length; i++) {
                if (this.special[i].preventDefault) {
                    e.preventDefault();
                }
            }
        }
    }
    
    var _handleKeyUp = function(e) {
        
        // browser compatibility!
        if (!e && window.event) {
            e = window.event;
        }
        
        var keyCode = e.keyCode ? e.keyCode : 
            e.charCode ? e.charCode : e.which;
        
        this.lift(keyCode, e);
    };
    
    $(window).on('keydown', _handleKeyDown.bind(this));
    $(window).on('keypress', _handleKeyPress.bind(this));
    $(window).on('keyup', _handleKeyUp.bind(this));
}

KeyHandler.prototype.add = function(special) {
    for (var i = 0; i < this.special.length; i++) {
        if (this.special[i] === special.keyCode) {
            this.special[i] = special;
            return;
        }
    }
    this.special.push(special);
}

KeyHandler.prototype.lift = function(keyCode, e) {
    if (keyCode) {
        if (keyCode in this._k) {
            delete this._k[keyCode];
            // console.log('release: ' + keyCode);
            
            
            for (var i = 0; i < this.special.length; i++) {
                var s = this.special[i];
                if (keyCode === s.keyCode) {
                    var m = this._meta[keyCode];
                    var context = {keyCode: keyCode};
                
                    /* s.onDown */
                    /* s.onUp */
                    if (s.onUp) {
                        s.onUp.bind(context)(e);
                    }
                    /* s.onHold */
                    /* s.preventDefault */
                    if (s.preventDefault) {
                        if (e) e.preventDefault();
                    }
                    if (m.intervalId !== undefined) {
                        clearInterval(m.intervalId);
                    }
                    delete this._meta[keyCode];
                }
            }
            
            
        }
    }
}

KeyHandler.prototype.cancelRepeat = function(keyCode) {
    if (keyCode) {
        if (keyCode in this._k) {
            for (var i = 0; i < this.special.length; i++) {
                var s = this.special[i];
                if (keyCode === s.keyCode) {
                    var m = this._meta[keyCode];
                    if (m.intervalId !== undefined) {
                        clearInterval(m.intervalId);
                        m.intervalId = undefined;
                        delete m.intervalId;
                    }
                }
            }
        }
    }
}

KeyHandler.prototype.restartRepeat = function(keyCode) {
    if (keyCode) {
        if (keyCode in this._k) {
            for (var i = 0; i < this.special.length; i++) {
                var s = this.special[i];
                if (keyCode === s.keyCode) {
                    var context = {keyCode: keyCode};
                    var m = this._meta[keyCode];
                    m = m || {};
                    if (s.onHold && m.intervalId === undefined) {
                        m.intervalId = setInterval(s.onHold.callback.bind(context), s.onHold.rateMs);
                    }
                }
            }
        }
    }
}

KeyHandler.prototype.isRepeatRunning = function(keyCode) {
    if (keyCode) {
        if (keyCode in this._k) {
            for (var i = 0; i < this.special.length; i++) {
                var s = this.special[i];
                if (keyCode === s.keyCode) {
                    var m = this._meta[keyCode];
                    m = m || {};
                    if (s.onHold && m.intervalId !== undefined) return true;
                    else return false;
                }
            }
        }
    }
    return false;
}




