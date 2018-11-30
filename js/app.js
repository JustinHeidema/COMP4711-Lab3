$(function () {
    let claims = badgeBookTokenHandler.getCurrentUserClaims();
    let token = badgeBookTokenHandler.getCurrentToken();
    let model = new Model(claims, token),
    view = new View(model, claims, token);
    controller = new Controller(model, view, claims, token);
    view.render();
});