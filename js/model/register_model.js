var Model = function() {
    this.register_event = new Event(this);
    this.missing_info_error_event = new Event(this);
    this.passwords_do_not_match_event = new Event(this);
    this.failure_event = new Event(this);
}


Model.prototype = {
    register: function() {
        this.register_event.notify();
    },

    missing_info_error: function() {
        this.missing_info_error_event.notify();
    },

    passwords_do_not_match_error: function() {
        this.passwords_do_not_match_event.notify();
    },

    failure: function() {
        this.failure_event.notify();
    }
}
