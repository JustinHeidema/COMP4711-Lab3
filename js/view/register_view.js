var View = function(model) {
    this.model = model;
    this.register_event = new Event(this);
    this.register_button_element = document.getElementById("register_button");
    this.setup_handlers();
}

View.prototype = {

    setup_handlers() {
        this.test_handler = this.test.bind(this);
    },

    test: function() {
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

    // // Setup Handlers
    // setup_handlers: function() {
    //     this.register_handler = this.register.bind(this);
    //     this.test_handler = this.test.bind(this);
    // },
    // display_register_msg: function() {
    //     this.modal_element.style.display = 'block';
    // },

    // test: function() {
    //     console.log("TEST");
    // },

    // register: function () {
    //     console.log("bullshit");
    //     this.test();
    //     // let dataEmail = {
    //     //     Name: 'email',
    //     //     Value: email
    //     // };
    //     // let attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);

    //     // userPool.signUp(email, password, [attributeEmail], null,
    //     //     function signUpCallback(err, result) {
    //     //         if (!err) {
    //     //             onSuccess(result);
    //     //         } else {
    //     //             onFailure(err);
    //     //         }
    //     //     }
    //     // );
    // },

    // handleRegister: function (event) {
    //     // let email = $('#emailInputRegister').val();
    //     // let password = $('#passwordInputRegister').val();
    //     // let password2 = $('#password2InputRegister').val();
    //     let email = '';
    //     let password ='';
    //     let password2 = '';

    //     let onSuccess = function registerSuccess(result) {
    //         document.getElementById("user_error_message").style.display = "none";
    //         let cognitoUser = result.user;
    //         console.log('user name is ' + cognitoUser.getUsername());
    //         let confirmation = ('Registration successful. Please check your email inbox or spam folder for your verification code.');
    //         if (confirmation) {
    //             window.location.href = verifyUrl;
    //         }
    //     };
    //     let onFailure = function registerFailure(err) {
    //         document.getElementById("user_error_message").style.display = "block";
    //     };

    //     if (password === password2) {
    //         document.getElementById("password_error_message").style.display = "none";
    //         this.test();
    //     } else {
    //         document.getElementById("password_error_message").style.display = "block";
    //     }
    // }
}
