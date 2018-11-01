var Controller = function(model, view, authToken) {
    this.model = model;
    this.view = view;
    this.mainUrl = "main.html";

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
        this.signin_handler = this.handleSignin.bind(this);
    },

    enable: function() {
        this.view.signin_event.add_listener(this.signin_handler);
    },

    signin: function(email, password, onSuccess, onFailure) {
        let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: email,
            Password: password
        });

        let cognitoUser = this.createCognitoUser(email);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: onSuccess,
            onFailure: onFailure
        });
    },

    handleSignin: function(sender, args) {
        this.signin(args.email, args.password,
            function signinSuccess() {
                window.location.href = "main.html";
            },
            function signinError(err) {
                document.getElementById("signin_error_message").style.display = "block";
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

