var Model = function() {
    this.signin_event = new Event(this);
}


Model.prototype = {
    signin: function() {
        this.signin_event.notify();
    }
}
