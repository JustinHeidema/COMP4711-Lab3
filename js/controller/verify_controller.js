var Controller = function(model, view, authToken) {
    this.model = model;
    this.view = view;
    this.signinUrl = "index.html";

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
        this.verify_handler = this.handleVerify.bind(this);
    },

    enable: function() {
        this.view.verify_event.add_listener(this.verify_handler);
    },

    test: function() {
        console.log('ALALALALALA');
    },

    verify: function(email, code, onSuccess, onFailure) {
        this.createCognitoUser(email).confirmRegistration(code, true, function confirmCallback(err, result) {
            if (!err) {
                onSuccess(result);
            } else {
                onFailure(err);
            }
        });
    },

    handleVerify: function(sender, args) {
        this.verify(args.email, args.code,
            function verifySuccess(result) {
                window.location.href = signinUrl;
            },
            function verifyError(err) {
                // document.getElementById("verify_error_message").style.display = "block";
            }
        );
    },

    createCognitoUser: function(email) {
        return new AmazonCognitoIdentity.CognitoUser({
            Username: email,
            Pool: this.userPool
        });
    }
}

