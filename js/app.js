$(function () {
    let authToken;
    Hangman.authToken.then(function setAuthToken(token) {
        if (token) {
            authToken = token;
            let model = new Model(authToken),
            view = new View(model, authToken);
            controller = new Controller(model, view, authToken);
            view.render();
        } else {
            window.location.href = 'index.html';
        }
    }).catch(function handleTokenError(error) {
        // console.log("Incorrect username or password");
        // window.location.href = 'index.html';
    });
});