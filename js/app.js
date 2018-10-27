var Hangman = window.Hangman || {};
Hangman.map = Hangman.map || {};
$(function () {
    var authToken;
    Hangman.authToken.then(function setAuthToken(token) {
        if (token) {
            authToken = token;
            let model = new Model(),
            view = new View(model);
            controller = new Controller(model, view);
            view.render();
            console.log(token);
        } else {
            window.location.href = 'signin.html';
        }
    }).catch(function handleTokenError(error) {
        alert(error);
        window.location.href = 'signin.html';
    });
});