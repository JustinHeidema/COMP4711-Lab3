$(function () {
    let poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    };
    let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    let authToken = new Promise(function fetchCurrentAuthToken(resolve, reject) {
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

    authToken.then(function setAuthToken(token) {
        if (token) {
            console.log(token);
            authToken = token;
            let model = new Model(authToken),
            view = new View(model, authToken);
            controller = new Controller(model, view, authToken);
            view.render();
        } else {
            let model = new Model(authToken),
            view = new View(model, authToken);
            controller = new Controller(model, view, authToken);
            view.render();
            // window.location.href = 'index.html';
        }
    }).catch(function handleTokenError(error) {
        
    });
});