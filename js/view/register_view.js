var View = function(model) {
    this.model = model;
    this.register_event = new Event(this);
    this.register_button_element = document.getElementById("register_button");
    this.setup_handlers();
}

View.prototype = {

    setup_handlers() {
        this.test_handler = this.register.bind(this);
    },

    register: function() {
        let email = document.getElementById("emailInputRegister").value;
        let password = document.getElementById("passwordInputRegister").value;
        let password2 = document.getElementById("password2InputRegister").value;
        this.register_event.notify({
            email: email,
            password: password,
            password2: password2
        });
    },

    render: function() {
        this.register_button_element.onclick = this.test_handler;
    },
}
