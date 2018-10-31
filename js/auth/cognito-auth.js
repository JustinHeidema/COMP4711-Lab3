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

    function register(email, password, onSuccess, onFailure) {
        let dataEmail = {
            Name: 'email',
            Value: email
        };
        let attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);

        userPool.signUp(email, password, [attributeEmail], null,
            function signUpCallback(err, result) {
                if (!err) {
                    onSuccess(result);
                } else {
                    onFailure(err);
                }
            }
        );
    }

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

    function verify(email, code, onSuccess, onFailure) {
        createCognitoUser(email).confirmRegistration(code, true, function confirmCallback(err, result) {
            if (!err) {
                onSuccess(result);
            } else {
                onFailure(err);
            }
        });
    }

    function createCognitoUser(email) {
        return new AmazonCognitoIdentity.CognitoUser({
            Username: email,
            Pool: userPool
        });
    }

    $(function onDocReady() {
        $('#registrationForm').submit(handleRegister);
        $('#signinForm').submit(handleSignin);
        $('#verifyForm').submit(handleVerify);
    });

    function handleRegister(event) {
        let email = $('#emailInputRegister').val();
        let password = $('#passwordInputRegister').val();
        let password2 = $('#password2InputRegister').val();

        let onSuccess = function registerSuccess(result) {
            document.getElementById("user_error_message").style.display = "none";
            let cognitoUser = result.user;
            console.log('user name is ' + cognitoUser.getUsername());
            let confirmation = ('Registration successful. Please check your email inbox or spam folder for your verification code.');
            if (confirmation) {
                window.location.href = verifyUrl;
            }
        };
        let onFailure = function registerFailure(err) {
            console.log(err.toString());
            document.getElementById("user_error_message").style.display = "block";
        };
        event.preventDefault();

        if (password === password2) {
            document.getElementById("password_error_message").style.display = "none";
            register(email, password, onSuccess, onFailure);
        } else {
            document.getElementById("password_error_message").style.display = "block";
        }
    }

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

    function handleVerify(event) {
        let email = $('#emailInputVerify').val();
        let code = $('#codeInputVerify').val();
        event.preventDefault();
        verify(email, code,
            function verifySuccess(result) {
                window.location.href = signinUrl;
            },
            function verifyError(err) {
                // document.getElementById("verify_error_message").style.display = "block";
            }
        );
    }
}(jQuery));
