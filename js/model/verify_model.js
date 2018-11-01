var Model = function() {
    this.verify_event = new Event(this);
    this.missing_info_error_event = new Event(this);
}


Model.prototype = {
    verify: function() {
        console.log("model verify");
        this.verify_event.notify();
    },

    missing_info_error: function() {
        this.missing_info_error_event.notify();
    }
}
