var Model = function() {
    this.register_event = new Event(this);
}


Model.prototype = {
    register: function() {
        console.log("model reigster");
        this.register_event.notify();
    }
}
