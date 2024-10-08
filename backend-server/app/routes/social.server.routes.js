const socials = require('../controllers/social.server.controllers');
const auth = require('../lib/authentication');

module.exports = function(app) {
    app.route('/users/:user_id')
        .get(socials.get_user);

    app.route('/users/:user_id/follow')
        .post(auth.isAuthenticated, socials.follow_user)
        .delete(auth.isAuthenticated, socials.unfollow_user);

    app.route('/search')
        .get(socials.search_user);
}