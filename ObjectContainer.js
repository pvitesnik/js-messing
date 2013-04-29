/* ObjectContainer.js */

var objCont = {
    
    objAdd : function(obj) {
        this.objects.push(obj);
    },
    
    objRem : function(obj) {
        var index = this.objIndexOf(obj);
        if (index != -1) {
            this.objects.splice(index, 1);
        }
        console.log('removed object from owner');
        console.log(obj);
        console.log(this);
    },
    
    objIndexOf : function(obj) {
        return (this.objects.indexOf(obj));
    },
    
    objAt : function(index) {
        return this.objects[index];
    },
    
    objCount : function(obj) {
        return this.objects.length;
    },
    
    objAsRaw : function() {
        return this.objects;
    }
}



