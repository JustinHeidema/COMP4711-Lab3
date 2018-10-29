$(function () {
    let authToken;
    Hangman.authToken.then(function setAuthToken(token) {
        if (token) {
            authToken = token;
            let model = new Model(),
            view = new View(model);
            controller = new Controller(model, view);
            view.render();
            console.log(token);
        } else {
            window.location.href = 'index.html';
        }
    }).catch(function handleTokenError(error) {
        // console.log("Incorrect username or password");
        // window.location.href = 'index.html';
    });
});