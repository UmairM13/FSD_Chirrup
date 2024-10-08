const feed = require('../models/feed.server.models');
const socials = require("../models/social.server.models");
const users = require("../models/user.server.models");

const getFeed = (req, res) => {

    let token = req.get('X-Authorization');

    users.getIdFromToken(token, (err, id) => {

        users.getToken(id, (err, token) => {

            if (err) return res.sendStatus(500)

            //check if the user is logged in
            if (token) {

                feed.feed_login(id, (err, results) => {
                    if (err) {
                        //console.log(Error)
                        return res.sendStatus(500)
                    }
                    results.sort(function (a, b) { return b.post_id - a.post_id });
                    //console.log(results);
                    return res.status(200).send(results)
                })

            } else {
                feed.get_feed((err, results) => {
                    if (err) {
                        //console.log(Error)
                        return res.sendStatus(500)
                    }
                    if(results.length === 0){
                        return res.status(200).send("No posts")
                    }
                    results.sort(function (a, b) { return b.post_id - a.post_id });
                    //console.log(results);
                    return res.status(200).send(results)
                })
            }
        })
    })
}

module.exports = {
    getFeed: getFeed
}