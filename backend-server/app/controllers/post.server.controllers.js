const posts = require("../models/post.server.models");
const users = require("../models/user.server.models");
const Joi = require('joi');

const add_post = (req, res) => {

    let token = req.get('X-Authorization');
    users.getIdFromToken(token, function (err, id) {
        if (err) {
            return res.sendStatus(500);
        }

        const schema = Joi.object({
            text: Joi.string().required()
        });

        const { error } = schema.validate(req.body);
        if (error) return res.sendStatus(400);

        let post = Object.assign({}, req.body);

        //profanity filter
        var Filter = require('bad-words'),
            filter = new Filter();

        if (filter.isProfane(post.text) === true) {
            return res.status(400).send({ "error_message": "bad language used" })
        }

        posts.addNewPost(post, id, (err, id) => {
            if (err) {
                return res.sendStatus(500);
            } else {
                return res.status(201).send({ post_id: id });
            }
        })
    });
};

const get_post = (req, res) => {
    let post_id = parseInt(req.params.post_id);

    posts.getSinglePost(post_id, (err, result) => {
        if (err === 404) return res.sendStatus(404)
        if (err) return res.sendStatus(500)

        return res.status(200).send(result)
    })
};

const update_post = (req, res) => {
    let post_id = parseInt(req.params.post_id);

    let token = req.get('X-Authorization');
    users.getIdFromToken(token, function (err, id) {
        if (err) {
            return res.sendStatus(500);
        }

        //check that the post exists
        posts.getSinglePost(post_id, (err, post) => {
            if (err === 404) return res.sendStatus(404)
            if (err) return res.sendStatus(500)

            const schema = Joi.object({
                "text": Joi.string().required()
            })

            const { error } = schema.validate(req.body);
            if (error) return res.status(400).send({ "error_message": error.details[0].message });

            //profanity filter
            var Filter = require('bad-words'),
                filter = new Filter();

            if (filter.isProfane(req.body.text) === true) {
                return res.status(400).send({ "error_message": "bad language used" })
            }

            posts.updatePost(post_id, id, req.body.text, (err) => {
                if (err) {
                    if (err === 403) {
                        return res.status(403).send({ "error_message": "Unauthorized" });
                    }
                    return res.sendStatus(500);
                } else {
                    return res.sendStatus(200);
                }
            })
        })
    });
};

const delete_post = (req, res) => {
    let post_id = parseInt(req.params.post_id);

    posts.getSinglePost(post_id, (err) => {
        if (err === 404) return res.sendStatus(404)
        if (err) return res.sendStatus(500)

        posts.deletePost(post_id, (err) => {
            if (err) {
                return res.sendStatus(400);
            } else {
                return res.sendStatus(200);
            }
        });
    });
}

const add_like = (req, res) => {

    let post_id = parseInt(req.params.post_id);

    //get the user id
    let token = req.get('X-Authorization');
    users.getIdFromToken(token, function (err, user_id) {
        if (err) {
            return res.sendStatus(500);
        }

        //check the post exist
        posts.getSinglePost(post_id, (err) => {
            if (err === 404) return res.sendStatus(404)
            if (err) return res.sendStatus(500)

            posts.likePost(user_id, post_id, function (err) {
                if (err) {
                    //if error code is 403 return error message
                    if (err === 403) {
                        return res.status(403).send({ "error_message": "You have already liked this post" });
                    }
                    return res.sendStatus(400);
                } else {
                    return res.sendStatus(200);
                }
            });
        });
    });
}

const remove_like = (req, res) => {

    let post_id = parseInt(req.params.post_id);

    let token = req.get('X-Authorization');
    users.getIdFromToken(token, function (err, user_id) {
        if (err) {
            return res.sendStatus(500);
        }

        posts.getSinglePost(post_id, (err) => {
            if (err === 404) return res.sendStatus(404)
            if (err) return res.sendStatus(500)

            posts.unlikePost(user_id, post_id, function (err) {
                if (err) {
                    if (err === 403) {
                        return res.status(403).send({ "error_message": "You have already unliked this post" });
                    }
                    return res.sendStatus(400);
                } else {
                    return res.sendStatus(200);
                }
            });
        });

    });
}

module.exports = {
    add_post: add_post,
    get_post: get_post,
    update_post: update_post,
    delete_post: delete_post,
    add_like: add_like,
    remove_like: remove_like,
};
