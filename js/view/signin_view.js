var View = function(model) {
    this.model = model;
    this.signin_event = new Event(this);
    this.signin_button_element = document.getElementById("signin_button");
    this.ok_button_element = document.getElementById("ok_button");
    this.modal_element = document.getElementById("modal");

    this.setup_handlers();
    this.enable();
}

View.prototype = {

    setup_handlers() {
        this.signin_handler = this.signin.bind(this);
        this.signin_update_handler = this.signin_update.bind(this);
    },

    enable: function() {
        this.model.signin_event.add_listener(this.signin_update_handler);
    },

    signin: function() {
        let email = document.getElementById("emailInputSignin").value;
        let password = document.getElementById("passwordInputSignin").value;
        this.signin_event.notify({
            email: email,
            password: password
        });
    },

    signin_update: function() {
        this.modal_element.style.display = 'block';
    },

    render: function() {
        this.signin_button_element.onclick = this.signin_handler;
    },
}
