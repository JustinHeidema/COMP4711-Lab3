var Model = function() {
    this.verify_event = new Event(this);

}


Model.prototype = {
    verify: function() {
        console.log("model verify");
        this.verify_event.notify();
    }
}
