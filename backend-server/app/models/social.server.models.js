const db = require("../../database");

const getUser = (user_id, done) => {
    const sql = `SELECT u.user_id, u.first_name, u.last_name, u.username, p.post_id, p.date_published, p.text
                FROM users u
                FULL JOIN posts p ON u.user_id=p.author_id
                WHERE u.user_id=?`;
    //used full join to join the posts and users table with the author_id
    // so that if there are no posts the user details are still included and null is returned

    // get followers, following, posts and likes
    const likesSql = `SELECT u.user_id, u.first_name, u.last_name, u.username
                        FROM users u, likes l
                        WHERE l.post_id=?
                        AND l.user_id=u.user_id`;

    const followingSql = `SELECT u.user_id, u.first_name, u.last_name, u.username
                        FROM users u, followers f
                        WHERE f.user_id=?
                        AND f.follower_id=u.user_id`;

    const followerSql = `SELECT u.user_id, u.first_name, u.last_name, u.username
                        FROM users u, followers f
                        WHERE f.follower_id=?
                        AND f.user_id=u.user_id`;

    const followers = [];
    const following = [];
    const posts = [];

    //Get all the user details and posts
    db.all(sql, [user_id], (err, user_details) => {
        if (err) {
            return done(err)//database error
        }
        //console.log(user_details)
        if (user_details.length === 0) {
            return done(404);//user does not exist
        }

        //used for counting the number of posts
        let counter = 0;

        //console.log(user.user_id)
        db.each(
            followerSql,
            [user_id],
            (err, row) => {
                if (err) {
                    return done(err);
                }

                //console.log(user.user_id)
                followers.push({
                    user_id: row.user_id,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    username: row.username
                })
            },
            () => {
                db.each(
                    followingSql,
                    [user_id],
                    (err, row) => {
                        if (err) {
                            return done(err);
                        }

                        following.push({
                            user_id: row.user_id,
                            first_name: row.first_name,
                            last_name: row.last_name,
                            username: row.username
                        })
                    },
                    () => {

                        //console.log(user_details)
                        //loop through it post
                        user_details.forEach((user) => {

                            const likes = [];

                            //console.log(user.post_id)
                            //get all the likes from each post
                            db.each(
                                likesSql,
                                [user.post_id],
                                (err, row) => {
                                    if (err) {
                                        return done(err);
                                    }

                                    //console.log(user_id);
                                    likes.push({
                                        user_id: row.user_id,
                                        first_name: row.first_name,
                                        last_name: row.last_name,
                                        username: row.username
                                    })
                                    //console.log(user.user_id)

                                },
                                () => {
                                    //checks if the post_id is null and then returns and empty array 
                                    if (user.post_id === null) {
                                        posts.length = 0;
                                        //console.log(posts)
                                    } else {
                                        posts.push({
                                            post_id: user.post_id,
                                            timestamp: user.date_published,
                                            text: user.text,
                                            author: {
                                                user_id: user.user_id,
                                                first_name: user.first_name,
                                                last_name: user.last_name,
                                                username: user.username
                                            },
                                            likes: likes
                                        })
                                    }

                                    //increment counter to keep track of the number of posts in the database
                                    counter++;

                                    //checks if all the posts have been looped
                                    if (counter === user_details.length) {
                                        return done(null, {
                                            user_id: user.user_id,
                                            first_name: user.first_name,
                                            last_name: user.last_name,
                                            username: user.username,
                                            followers,
                                            following,
                                            posts
                                        })
                                    }
                                }
                            )
                        })
                    }
                )
            }
        )
    })
}


const followUser = (user_id, follower_id, done) => {
    //check if the user is already following
    const checkFollowSql = 'SELECT * FROM followers  WHERE follower_id = ? AND user_id=?'; //check if the follower_id and user_id already exist

    db.get(checkFollowSql, [follower_id, user_id], (err, result) => {
        if (err) {
            return done(err); //database error
        }

        if (result) {
            return done(403); //return error code 403 for existing follow
        }

        // add a follower
        const sql = 'INSERT INTO followers (user_id, follower_id) VALUES (?,?)';
        let values = [user_id, follower_id];

        db.run(sql, values, (err) => {
            if (err) {
                return done(err);
            } else {
                return done(null);
            }
        })
    })
}

const unfollowUser = (user_id, follower_id, done) => {
    const checkUnfollowSql = 'SELECT * FROM followers WHERE follower_id=? AND user_id=?';

    db.get(checkUnfollowSql, [follower_id, user_id], (err, result) => {
        if (err) {
            return done(err);
        }
        if (!result) {
            return done(403);
        }


        const sql = 'DELETE FROM followers WHERE user_id =? AND follower_id=?';
        let values = [user_id, follower_id];

        db.run(sql, values, (err) => {
            if (err) {
                return done(err);
            } else {
                return done(null);
            }
        })
    })
}

const searchUser = (q, done) => {

    const sql = `SELECT user_id, first_name, last_name, username 
    FROM users WHERE first_name LIKE ? OR last_name LIKE ? OR username LIKE ? OR username = NULL
    OR (first_name || ' ' || last_name LIKE ?)`;
    let values = ['%' + q + '%', '%' + q + '%', '%' + q + '%', '%' + q + '%'];

    const users = [];

    db.get(sql, values, (err, user_details) => {
        if (err) {
            return done(err);
        }
        // if(!user_details){
        //     return done(400);
        // }

        db.each(
            sql,
            values,
            (err, row) => {
                if (err) return done(err);

                users.push({
                    user_id: row.user_id,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    username: row.username
                })

            },
            (err, num_rows) => {
                if (err) return done(err);

                return done(null, users)
            }
        )
    })
}


module.exports = {
    getUser: getUser,
    followUser: followUser,
    unfollowUser: unfollowUser,
    searchUser: searchUser,
}