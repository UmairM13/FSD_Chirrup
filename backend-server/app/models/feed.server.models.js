const db = require("../../database");

const get_feed = (done) => {

    //const sql = `SELECT * FROM posts`
    const sql = `SELECT p.post_id, p.date_published, p.text, u.user_id, u.first_name, u.last_name, u.username
                 FROM posts p, users u
                 WHERE p.author_id = u.user_id
                 ORDER BY p.post_id`;

    //to get the likes
    const likesSql = `SELECT DISTINCT u.user_id, u.first_name, u.last_name, u.username
                      FROM users u, likes l, posts p
                      WHERE l.post_id=?
                      AND l.user_id=u.user_id`;


    const posts = [];

    //Get all the posts
    db.all(sql, function (err, post_details) {
        if (err) {
            console.log("DB error:", err);
            return done(err);
        }

        if (post_details.length === 0) {
            return done(null, posts);
        }
        //used for counting the number of posts
        let counter = 0;

        //console.log(post_details)
        //loop through it post
        post_details.forEach((post) => {
            const likes = [];

            //console.log(post.post_id)
            //get all the likes from each post
            db.each(
                likesSql,
                [post.post_id],
                (err, row) => {
                    if (err) {
                        return done(err);
                    }

                    //console.log(post.post_id);
                    likes.push({
                        user_id: row.user_id,
                        first_name: row.first_name,
                        last_name: row.last_name,
                        username: row.username
                    })

                },
                () => {
                    posts.push({
                        post_id: post.post_id,
                        timestamp: post.date_published,
                        text: post.text,
                        author: {
                            user_id: post.user_id,
                            first_name: post.first_name,
                            last_name: post.last_name,
                            username: post.username
                        },
                        likes: likes
                    })

                    //increment counter to keep track of the number of posts in the database
                    counter++;

                    //checks if all the posts have been looped
                    if (counter === post_details.length) {
                        return done(null, posts)
                    }
                })
        })
    })

}

const feed_login = (user_id, done) => {

    //gets the posts from the user that's logged in 
    const sql = `SELECT DISTINCT p.post_id, p.date_published, p.text, u.user_id, u.first_name, u.last_name, u.username
                 FROM followers f, users u, posts p
                 WHERE u.user_id = p.author_id
                 AND (f.follower_id = p.author_id OR p.author_id=?)
                 AND (f.user_id=? OR u.user_id =?)
                 ORDER BY p.post_id`;

    //to get the likes
    const likesSql = `SELECT DISTINCT u.user_id, u.first_name, u.last_name, u.username
                      FROM users u, likes l, posts p
                      WHERE l.post_id=?
                      AND l.user_id=u.user_id`;


    const posts = [];

    //Get all the posts for the user that's logged in
    db.all(sql, [user_id,user_id,user_id], (err, post_details) => {
        if (err) {
            //console.log("DB error:", err);
            return done(err);
        }
        //console.log(post_details)
        if (post_details.length === 0) {
            return done(null, posts);
        }

        //used for counting the number of posts
        let counter = 0;

        //console.log(post_details)
        //loop through it post
        post_details.forEach((post) => {
            const likes = [];

            //console.log(post.post_id)
            //get all the likes from each post
            db.each(
                likesSql,
                [post.post_id],
                (err, row) => {
                    if (err) {
                        return done(err);
                    }

                    //console.log(post.post_id);
                    likes.push({
                        user_id: row.user_id,
                        first_name: row.first_name,
                        last_name: row.last_name,
                        username: row.username
                    })

                },
                () => {
                    posts.push({
                        post_id: post.post_id,
                        timestamp: post.date_published,
                        text: post.text,
                        author: {
                            user_id: post.user_id,
                            first_name: post.first_name,
                            last_name: post.last_name,
                            username: post.username
                        },
                        likes: likes
                    })

                    //increment counter to keep track of the number of posts in the database
                    counter++;

                    //checks if all the posts have been looped
                    if (counter === post_details.length) {
                        return done(null, posts)
                    }
                }
            )
        })
    })
}


module.exports = {
    get_feed: get_feed,
    feed_login: feed_login
}