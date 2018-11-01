var Controller = function(model, view, authToken) {
    this.model = model;
    this.view = view;
    this.verifyUrl = "verify.html";

    this.poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    };

    this.userPool = new AmazonCognitoIdentity.CognitoUserPool(this.poolData);
    this.setup_handlers();
    this.enable();
}

Controller.prototype = {

    setup_handlers: function() {
        this.register_handler = this.handleRegister.bind(this);
    },

    enable: function() {
        this.view.register_event.add_listener(this.register_handler);
    },

    register: function (email, password, onSuccess, onFailure) {
        let dataEmail = {
            Name: 'email',
            Value: email
        };

        console.log(dataEmail);
        let attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);

        this.userPool.signUp(email, password, [attributeEmail], null,
            function signUpCallback(err, result) {
                if (!err) {
                    onSuccess(result);
                } else {
                    onFailure(err);
                }
            }
        );
    },

    handleRegister: function (sender, args) {
        let m = this.model;
        let onSuccess = function registerSuccess(result) {
            let cognitoUser = result.user;
            let confirmation = ('Registration successful. Please check your email inbox or spam folder for your verification code.');
            if (confirmation) {
                m.register();
                // window.location.href = "verify.html";
            }
        };
        let onFailure = function registerFailure(err) {
            console.log("on failure");
            // document.getElementById("user_error_message").style.display = "block";
        };

        if (args.password === args.password2) {
            console.log("password === password")
            this.register(args.email, args.password, onSuccess, onFailure);
            // document.getElementById("password_error_message").style.display = "none";
        } else {
            // document.getElementById("password_error_message").style.display = "block";
        }
    }
}

