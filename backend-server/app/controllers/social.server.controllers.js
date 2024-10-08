const socials = require("../models/social.server.models");
const users = require("../models/user.server.models");
const Joi = require('joi');

const get_user = (req, res) =>{
    let user_id = parseInt(req.params.user_id);

    socials.getUser(user_id, (err, result) => {
        if (err === 404) return res.sendStatus(404)
        if (err) return res.sendStatus(500)

        return res.status(200).send(result)
    })
}

const follow_user = (req, res) =>{
    let follower_id = parseInt(req.params.user_id);

    let token = req.get('X-Authorization');

    users.getIdFromToken(token, function(err, user_id) {
        if(err) {
            return res.sendStatus(500);
        }
        socials.getUser(follower_id, (err) => {
            if(err === 404) return res.sendStatus(404);

            if(err) return res.sendStatus(500);

            socials.followUser(user_id, follower_id, (err) => {
                //check if there is an  error
                if(err) {
                    //if error code is 403 return the error message
                    if(err === 403){
                        return res.status(403).send({ "error_message": "You already follow this user" });
                    }
                    return res.sendStatus(400);
                } else {
                    return res.sendStatus(200);
                }
            });
        });
    });
}

const unfollow_user = (req, res) =>{
    let follower_id = parseInt(req.params.user_id);

    let token = req.get('X-Authorization');

    //get user id 
    users.getIdFromToken(token, function(err, user_id){
        if(err) {
            return res.sendStatus(500);
        }
        //check the user exists
        socials.getUser(follower_id, (err) => {
            if (err === 404) return res.sendStatus(404)

            if (err) return res.sendStatus(500)

            socials.unfollowUser(user_id, follower_id, (err) => {
                if(err){
                    if(err === 403){
                        return res.status(403).send({ "error_message": "You have already unfollowed this user" });
                    }
                    return res.sendStatus(400);
                } else {
                    return res.sendStatus(200);
                }
            });
        });
    });
}

const search_user = (req, res) =>{
    let q = req.query.q;

    if(!q || q === null || q === undefined){
        q = '';
    }


    socials.searchUser(q, (err, result) =>{
        if(err){
            return res.sendStatus(400);
        } else {
            return res.status(200).send(result);
        }
    })
}

module.exports ={
    get_user: get_user,
    follow_user: follow_user,
    unfollow_user: unfollow_user,
    search_user: search_user,
}