var Controller = function(model, view) {
    this.model = model;
    this.view = view;

    this.setup_handlers();
    this.enable();
}

Controller.prototype = {

    setup_handlers: function() {
        this.guess_letter_handler = this.guess_letter.bind(this);
    },

    enable: function() {
        this.view.guess_letter_event.add_listener(this.guess_letter_handler);
        return this;
    },

    guess_letter: function(sender, args) {
        this.model.guess_letter(args.letter);
    }
}

