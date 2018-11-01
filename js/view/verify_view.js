var View = function(model) {
    this.model = model;
    this.verify_event = new Event(this);
    this.verify_button_element = document.getElementById("verify_button");
    this.ok_button_element = document.getElementById("ok_button");
    this.modal_element = document.getElementById("modal");
    this.setup_handlers();
    this.enable();
}

View.prototype = {

    setup_handlers: function() {
        this.verify_handler = this.verify.bind(this);
        this.verify_update_handler = this.verify_update.bind(this);
    },

    enable: function() {
        this.verify_event.add_listener(this.verify_update_handler);
    },

    verify: function() {
        let email = document.getElementById("emailInputVerify").value;
        let code = document.getElementById("codeInputVerify").value;

        this.verify_event.notify({
            email: email,
            code: code
        });
    },

    verify_update: function() {
        this.modal_element.style.display = 'block';
    },

    render: function() {
        this.verify_button_element.onclick = this.verify_handler;
        this.ok_button_element.onclick = function() {
            window.location.href = "index.html";
        }
    }
}
