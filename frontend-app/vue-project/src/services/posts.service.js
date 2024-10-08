const getFeed = () => {
    return fetch("http://localhost:3333/feed",
    {
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": localStorage.getItem("session_token")
        }
    })

    .then((response) => {
        if(response.status === 200){
            return response.json();
        } else if(response.status === 404){
            throw "Follow some users to see their posts or add some posts"
        } else{
            throw "Something went wrong"
        }
    })

    .then((resJson) => {
        return resJson
    })

    .catch((error) => {
        console.log("Err", error)
        return Promise.reject(error)
    })
}

const getSinglePost = (post_id) =>{
    return fetch("http://localhost:3333/posts/" + post_id)
    .then((response) => {
        if(response.status === 200){
            return response.json();
        } else {
            throw "Something went wrong"
        }
    })

    .then((resJson) => {
        return resJson
    })

    .catch((error) => {
        console.log("Err", error)
        return Promise.reject(error)
    })
}

const addNewPost = (text) => {
    return fetch("http://localhost:3333/posts",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": localStorage.getItem("session_token")
        },
        body: JSON.stringify({
            "text": text
        })
    })
    .then(response => {
        if(response.status === 201){
            return response.json();
        }else if(response.status === 400){
            throw "Bad language used";
        }else{
            throw "something went wrong"
        }
    })
    // .then(rJson => {
    //     localStorage.setItem("post_id", rJson.post_id)
    //     return rJson
    // })
    .catch(err => {
        console.log("Err", err);
        return Promise.reject(err)
    })
}

const likePost = (post_id) => {
    return fetch("http://localhost:3333/posts/" + post_id + "/like",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": localStorage.getItem("session_token")
        }
    })
    .then(response => {
        if(response.status === 200){
            return
        }else if(response.status === 401){
            throw "Login to like this post";
        }else if(response.status === 403){
            throw "You have already liked this post";
        }else{
            throw "something went wrong"
        }
    })
    .catch(err => {
        console.log(err);
        return Promise.reject(err)
    })
}

const unlikePost = (post_id) => {
    return fetch("http://localhost:3333/posts/" + post_id + "/like",
    {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": localStorage.getItem("session_token")
        }
    })
    .then(response => {
        if(response.status === 200){
            return
        }else if(response.status === 401){
            throw "Login to unlike this post";
        }else if(response.status === 403){
            throw "You have already unliked this post";
        }else{
            throw "something went wrong"
        }
    })
}

const updatePost = (post_id, text) => {
    return fetch("http://localhost:3333/posts/" + post_id,
    {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": localStorage.getItem("session_token")
        },
        body: JSON.stringify({
            "text": text
        })
    })
    .then(response => {
        if(response.status === 200){
            return;
        }else if(response.status === 400){
            throw "Bad language used";
        }else if(response.status === 401){
            throw "You need to be logged in to edit your post";
        }else if(response.status === 403){
            console.log("You can only edit your own post");
        }else if(response.status === 404){
            throw "Post not found";
        }else{
            throw "something went wrong"
        }
    })
    .catch(err => {
        console.log("Err", err);
        return Promise.reject(err)
    })
}

const deletePost = (post_id) => {
    return fetch("http://localhost:3333/posts/" + post_id,
    {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": localStorage.getItem("session_token")
        }
    })
    .then(response => {
        if(response.status === 200){
            return;
        }else if(response.status === 401){
            throw "You need to be logged in to delete your post";
        }else if(response.status === 403){
            console.log("You can only edit your own post");
        }else if(response.status === 404){
            throw "Post not found";
        }else{
            throw "something went wrong"
        }
    })
    .catch(err => {
        console.log("Err", err);
        return Promise.reject(err)
    })
}

export const postService = {
    getFeed,
    getSinglePost,
    addNewPost,
    likePost,
    unlikePost,
    updatePost,
    deletePost,
}
