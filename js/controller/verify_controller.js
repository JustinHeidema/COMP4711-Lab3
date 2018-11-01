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

    verify: function(email, code, onSuccess, onFailure) {
        console.log("controller verify");
        this.createCognitoUser(email).confirmRegistration(code, true, function confirmCallback(err, result) {
            if (!err) {
                onSuccess(result);
            } else {
                onFailure(err);
            }
        });
    },

    handleVerify: function(sender, args) {
        console.log("handle verify")
        let m = this.model;
        if (args.email == "" || args.code == "") {
            console.log("PAUOHSDPFOIHQWEF");
            m.missing_info_error();
        } else {
            this.verify(args.email, args.code,
                function verifySuccess(result) {
                    console.log("WHYYY");
                    m.verify();
                },
                function verifyError(err) {
                    console.log("BULLSHIT");
                    // document.getElementById("verify_error_message").style.display = "block";
                }
            );
        }

    },

    createCognitoUser: function(email) {
        return new AmazonCognitoIdentity.CognitoUser({
            Username: email,
            Pool: this.userPool
        });
    }
}

