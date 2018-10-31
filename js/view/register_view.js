var View = function(model) {
    this.modal_element = document.getElementById("modal");
    this.modal_element.onclick = display_register_msg;
}

View.prototype = {
    display_register_msg: function() {
        this.modal_element.style.display = 'block';
    }
}