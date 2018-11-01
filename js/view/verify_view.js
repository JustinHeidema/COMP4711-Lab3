var View = function(model) {
    this.model = model;
    this.verify_event = new Event(this);
    this.verify_button_element = document.getElementById("verify_button");
    this.ok_button_element = document.getElementById("ok_button");
    this.modal_element = document.getElementById("modal");
    this.error_message_element = document.getElementById("error_message");

    this.setup_handlers();
    this.enable();
}

View.prototype = {

    setup_handlers: function() {
        this.verify_handler = this.verify.bind(this);
        this.verify_update_handler = this.verify_update.bind(this);
        this.missing_info_error_update_handler = this.missing_info_error_update.bind(this);
    },

    enable: function() {
        this.model.verify_event.add_listener(this.verify_update_handler);
        this.model.missing_info_error_event.add_listener(this.missing_info_error_update_handler);
    },

    verify: function() {
        console.log("verify");
        let email = document.getElementById("emailInputVerify").value;
        let code = document.getElementById("codeInputVerify").value;

        this.verify_event.notify({
            email: email,
            code: code
        });
    },

    verify_update: function() {
        console.log("verify_update");
        this.modal_element.style.display = 'block';
    },

    render: function() {
        this.verify_button_element.onclick = this.verify_handler;
        this.ok_button_element.onclick = function() {
            window.location.href = "index.html";
        }
    },
    missing_info_error_update: function() {
        console.log("hsushshsd");
        this.error_message_element.style.display = 'block';
        this.error_message_element.innerHTML = "Please fill in all fields";
    }
}
