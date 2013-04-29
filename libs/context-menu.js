// adapted from: http://luke.breuer.com/tutorial/javascript-context-menu-tutorial.htm




var _contexts = {};
var _curname = "";
var _cmEnable = true;

function cmInitContext(name, menuDivId, renderFn) {
    
    if (!name || !renderFn || !menuDivId) return;
    
    if (name in _contexts) {
        cmContextUnbind(name);
    }
    
    _contexts[name] = {
        replace : false,
        render : renderFn,
        mouseover : false,
        divId : menuDivId,
    };
    
    $("#"+_contexts[name].divId).on( "mouseover", {name: name}, function(e) { _contexts[e.data.name].mouseover = true;} );
    $("#"+_contexts[name].divId).on( "mouseout", {name: name}, function(e) { _contexts[e.data.name].mouseover = false; } );
    
    
    document.body.onmousedown = cmContextMouseDown;
    document.body.oncontextmenu = cmContextShow;
    
    console.log('cm init: ' + name);
}



function cmContextUnbind(name) {
    $("#"+_contexts[name].divId).off('mouseover');
    $("#"+_contexts[name].divId).off('mouseout');
    delete _contexts[name];
}


function cmContextMouseDown(event) {
    
    if (!_cmEnable) return;
    
    // IE is evil and doesn't pass the event object
    if (event === null)
        event = window.event;
        
    // we assume we have a standards compliant browser, but check if we have IE
    var target = event.target !== null ? event.target : event.srcElement;
    
    var name = target.getAttribute('data-cmUseContext');
    
    if (!_curname) {
        if (!name || !(name in _contexts) || _contexts[name].mouseover) return;
    } else {
        if (_contexts[_curname].mouseover) return;
    }
    
    // only show the context menu if the right mouse button is pressed
    if (event.button == 2 && name) {
        _contexts[name].replace = true;
    } else if (_curname && !_contexts[_curname].mouseover) {
        $("#"+_contexts[_curname].divId).css( 'display', 'none' );
        _curname = "";
    }
}

function cmContextShow(event) {
    
    if (!_cmEnable) return;
    
    // IE is evil and doesn't pass the event object
    if (event === null)
        event = window.event;
        
    // we assume we have a standards compliant browser, but check if we have IE
    var target = event.target !== null ? event.target : event.srcElement;
    
    var name = target.getAttribute('data-cmUseContext');
    if (!name || !(name in _contexts) || _contexts[name].mouseover) return;
    
    if (_contexts[name].replace)
    {
        // call renderfunc
        var result = _contexts[name].render(target, $("#"+_contexts[name].divId),
                {'close' : cmCloseContext,
                 'enable' : cmEnableContext,
                 'disable' : cmDisableContext
                });
        if (result === false) {
            // don't show the context menu
            $("#"+_contexts[name].divId).css( 'display', 'none' );
            return false;
        }

        // document.body.scrollTop does not work in IE
        var scrollTop = document.body.scrollTop ? document.body.scrollTop :
            document.documentElement.scrollTop;
        var scrollLeft = document.body.scrollLeft ? document.body.scrollLeft :
            document.documentElement.scrollLeft;
        
        // hide the menu first to avoid an "up-then-over" visual effect
        $("#"+_contexts[name].divId).css( 'display', 'none' );
        $("#"+_contexts[name].divId).css( 'left', event.clientX + scrollLeft + 'px' );
        $("#"+_contexts[name].divId).css( 'top', event.clientY + scrollTop + 'px' );
        $("#"+_contexts[name].divId).css( 'display', 'block' );
        console.log('showing context menu');


        _contexts[name].replace = false;
        _curname = name;

        return false;
    }
}

function cmCloseContext() {
    
    if (_curname) {
        _contexts[_curname].mouseover = false;
        $("#"+_contexts[_curname].divId).css( 'display', 'none' );
    }
}


function cmDisableContext() {
    _cmEnable = false;
    cmCloseContext();
    return false;
}

function cmEnableContext() {
    _cmEnable = true;
    return false;
}

