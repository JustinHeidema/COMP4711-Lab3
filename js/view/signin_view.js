var View = function(model) {
    this.model = model;
    this.signin_event = new Event(this);
    this.modal_element = document.getElementById("modal");
    this.login_with_badgebook_button_element = document.getElementById("login_with_badgebook_button");

    this.setup_handlers();
    this.enable();
}

View.prototype = {

    // Sets up handlers for several functions
    setup_handlers() {
        this.signin_update_handler = this.signin_update.bind(this);
        this.badgebook_login_handler = this.badgebook_login.bind(this);
    },

    // Configure listeners
    enable: function() {
        this.model.signin_event.add_listener(this.signin_update_handler);
    },

    // Updates UI based on signin action
    signin_update: function() {
        this.modal_element.style.display = 'block';
    },


    // Initial rendering of page
    render: function() {
        let loggedIn = badgeBookTokenHandler.isBadgeBookUserLoggedIn();
        console.log(loggedIn);
        console.log("TESTING");
        this.login_with_badgebook_button_element.onclick = this.badgebook_login_handler;
    },

    badgebook_login: function() {
        console.log("LOGIN CLICKED");
        badgeBookTokenHandler.loginWithBadgeBook();
    }
}
