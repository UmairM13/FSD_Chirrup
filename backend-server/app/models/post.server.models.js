const db = require("../../database");

const addNewPost = (post, author_id, done) => {

    const sql = 'INSERT INTO posts (text, date_published, author_id) VALUES (?, ?, ?)';
    let values = [post.text, Date.now(), author_id];

    db.run(sql, values, function (err) {
        if (err) return done(err);
        return done(null, this.lastID);
    })
}

const getSinglePost = (post_id, done) => {

    const sql = `SELECT p.post_id, p.date_published, p.text, u.user_id, u.first_name, u.last_name, u.username
                 FROM posts p, users u
                 WHERE p.post_id=?
                 AND p.author_id = u.user_id`;

    db.get(sql, [post_id], function (err, post_details) {
        if (err) {
            console.log("DB error:", err);
            return done(err);
        }
        if (!post_details) {
            console.log("post not found");
            return done(404);
        }


        //to get the likes
        const sql = `SELECT u.user_id, u.first_name, u.last_name, u.username
                    FROM users u, likes l
                    WHERE l.post_id=?
                    AND l.user_id=u.user_id`;

        const likes = [];
        db.each(
            sql,
            [post_id],
            (err, row) => {
                if (err) return done(err);

                likes.push({
                    user_id: row.user_id,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    username: row.username
                })
            },
            (err, num_rows) => {
                if (err) return done(err);

                return done(null, {
                    post_id: post_details.post_id,
                    timestamp: post_details.date_published,
                    text: post_details.text,
                    author: {
                        user_id: post_details.user_id,
                        first_name: post_details.first_name,
                        last_name: post_details.last_name,
                        username: post_details.username
                    },
                    likes: likes
                })
            }
        )
    })
}

const updatePost = (post_id, user_id, new_text, done) => {

    const sql = 'SELECT post_id, author_id FROM posts WHERE post_id=? AND author_id=?'

    db.get(sql, [post_id, user_id], (err, result) => {
        if (err) {
            return done(err);
        }
        if (!result) {
            return done(403);
        }
        const sql = 'UPDATE posts SET text=? WHERE post_id=?'

        db.run(sql, [new_text, post_id], (err) => {
            return done(err);
        })
    })
}

const deletePost = (post_id, done) => {
    const sql = 'DELETE FROM posts WHERE post_id=?'

    db.run(sql, [post_id], (err) => {
        return done(err);
    })
}

const likePost = (user_id, post_id, done) => {
    //check if the post has been liked already
    const checkLikeSql = 'SELECT * FROM likes WHERE post_id=? AND user_id=?'; //checks if the user_id and post_id already exist

    db.get(checkLikeSql, [post_id, user_id], (err, result) => {
        if (err) {
            return done(err); //database error
        }
        if (result) {
            return done(403); //return error code 403 for trying to like the same post twice
        }



        const sql = 'INSERT INTO likes (post_id, user_id) VALUES (?,?)';
        let values = [post_id, user_id];

        db.run(sql, values, (err) => {
            if (err) {
                return done(err); // database error

            } else {
                return done(null); //no errors
            }
        })
    })
}

const unlikePost = (user_id, post_id, done) => {
    const checkUnlikeSql = 'SELECT * FROM likes WHERE post_id=? AND user_id=?';

    db.get(checkUnlikeSql, [post_id, user_id], (err, result) => {
        if (err) {
            return done(err);
        }
        //check if the user_id and post_id do not exist in the database. the opposite of likePost
        if (!result) {
            return done(403);
        }


        const sql = 'DELETE FROM likes WHERE post_id=? AND user_id=?';
        let values = [post_id, user_id];

        db.run(sql, values, (err) => {
            return done(err);
        })
    })
}

module.exports = {
    addNewPost: addNewPost,
    getSinglePost: getSinglePost,
    updatePost: updatePost,
    deletePost: deletePost,
    likePost: likePost,
    unlikePost: unlikePost,
}