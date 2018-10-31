let Hangman = window.Hangman || {};

(function scopeWrapper($) {
    let signinUrl = 'index.html';
    let mainUrl = 'main.html';
    let registerUrl= 'register.html';
    let verifyUrl = 'verify.html'

    let poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    };

    let userPool;

    userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    if (typeof AWSCognito !== 'undefined') {
        AWSCognito.config.region = _config.cognito.region;
    }

    Hangman.signOut = function signOut() {
        userPool.getCurrentUser().signOut();
        window.location.href= signinUrl;
    };

    Hangman.authToken = new Promise(function fetchCurrentAuthToken(resolve, reject) {
        let cognitoUser = userPool.getCurrentUser();

        if (cognitoUser) {
            cognitoUser.getSession(function sessionCallback(err, session) {
                if (err) {
                    reject(err);
                } else if (!session.isValid()) {
                    resolve(null);
                } else {
                    resolve(session.getIdToken().getJwtToken());
                }
            });
        } else {
            resolve(null);
        }
    });

    function signin(email, password, onSuccess, onFailure) {
        let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: email,
            Password: password
        });

        let cognitoUser = createCognitoUser(email);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: onSuccess,
            onFailure: onFailure
        });
    }

    function createCognitoUser(email) {
        return new AmazonCognitoIdentity.CognitoUser({
            Username: email,
            Pool: userPool
        });
    }

    $(function onDocReady() {
        $('#signinForm').submit(handleSignin);
    });


    function handleSignin(event) {
        let email = $('#emailInputSignin').val();
        let password = $('#passwordInputSignin').val();
        event.preventDefault();
        signin(email, password,
            function signinSuccess() {
                window.location.href = mainUrl;
            },
            function signinError(err) {
                document.getElementById("signin_error_message").style.display = "block";
            }
        );
    }
}(jQuery));
