var View = function(model) {
    this.model = model;
    this.register_event = new Event(this);
    this.register_button_element = document.getElementById("register_button");
    this.ok_button_element = document.getElementById("ok_button");
    this.modal_element = document.getElementById("modal");
    this.error_message_element = document.getElementById("error_message");

    this.setup_handlers();
    this.enable();
}

View.prototype = {

    setup_handlers() {
        this.register_handler = this.register.bind(this);
        this.register_update_handler = this.register_update.bind(this);
        this.missing_info_error_update_handler = this.missing_info_error_update.bind(this);
        this.passwords_do_not_match_error_update_handler = this.passwords_do_not_match_error_update.bind(this);
    },

    enable: function() {
        this.model.register_event.add_listener(this.register_update_handler);
        this.model.missing_info_error_event.add_listener(this.missing_info_error_update_handler);
        this.model.passwords_do_not_match_event.add_listener(this.passwords_do_not_match_error_update_handler);
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
        this.modal_element.style.display = 'block';
    },

    render: function() {
        this.register_button_element.onclick = this.register_handler;
        this.ok_button_element.onclick = function() {
            window.location.href = "verify.html";
        }
    },

    missing_info_error_update: function() {
        this.error_message_element.style.display = 'block';
        this.error_message_element.innerHTML = "Please fill in all fields";
    },

    passwords_do_not_match_error_update: function() {
        this.error_message_element.style.display = 'block';
        this.error_message_element.innerHTML = "Passwords do not match";
    }
}
