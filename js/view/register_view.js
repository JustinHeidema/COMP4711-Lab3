var View = function(model) {
    this.model = model;
    this.register_event = new Event(this);
    this.register_button_element = document.getElementById("register_button");
    this.ok_button_element = document.getElementById("ok_button");
    this.modal_element = document.getElementById("modal");

    this.setup_handlers();
    this.enable();
}

View.prototype = {

    setup_handlers() {
        this.register_handler = this.register.bind(this);
        this.register_update_handler = this.register_update.bind(this);
    },

    enable: function() {
        this.model.register_event.add_listener(this.register_update_handler);
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

    register_update: function() {
        console.log("register_update");
        this.modal_element.style.display = 'block';
    },

    render: function() {
        this.register_button_element.onclick = this.register_handler;
        this.ok_button_element.onclick = function() {
            window.location.href = "verify.html";
        }
    },
}
