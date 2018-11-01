var View = function(model) {
    this.model = model;
    this.verify_event = new Event(this);
    this.verify_button_element = document.getElementById("verify_button");
    this.setup_handlers();
}

View.prototype = {

    setup_handlers: function() {
        this.verify_handler = this.verify.bind(this);
    },

    enable: function() {
        
    },

    verify: function() {
        let email = document.getElementById("emailInputVerify").value;
        let code = document.getElementById("codeInputVerify").value;

        this.verify_event.notify({
            email: email,
            code: code
        });
    },

    render: function() {
        this.verify_button_element.onclick = this.verify_handler;
    }
}
