const login = (username, password) => {
    return fetch("http://localhost:3333/login",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    })
    .then(response => {
        if(response.status === 200){
            return response.json();
        }else if(response.status === 400){
            throw "Username or password is incorrect";
        }else{
            throw "something went wrong"
        }
    })
    .then(rJson => {
        localStorage.setItem("user_id", rJson.user_id);
        localStorage.setItem("session_token", rJson.session_token)
        return rJson
    })
    .catch(err => {
        console.log(err);
        return Promise.reject(err)
    })
}

const logOut = () => {
    return fetch("http://localhost:3333/logout",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": localStorage.getItem("session_token")
        }
    })
    .then((response) => {
        if(response.status === 200){
            localStorage.removeItem("user_id")
            localStorage.removeItem("session_token")
            return
        }else if(response.status === 401){
            throw "Not logged in"
        } else {
            throw "Something went wrong"
        }
    })
    .catch((error) => {
        console.log("Err", error)
        return Promise.reject(error)
    })
}

const getUser = (user_id) => {
    return fetch("http://localhost:3333/users/" + user_id)
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

const addNewUser = (first_name, last_name, username, password) => {
    return fetch("http://localhost:3333/users",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "first_name": first_name,
            "last_name": last_name,
            "username": username,
            "password": password
        })
    })
    .then(response => {
        if(response.status === 201){
            return response.json();
        }else if(response.status === 400){
            throw "User already exists";
        }else{
            throw "something went wrong"
        }
    })
    .catch(err => {
        console.log(err);
        return Promise.reject(err)
    })
}

const followUser = (user_id) => {
    return fetch("http://localhost:3333/users/" + user_id + "/follow",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": localStorage.getItem("session_token")
        }
    })
    .then(response => {
        if(response.status === 200){
            //throw "Followed user successfully"
            return 
        }else if(response.status === 401){
            throw "Login to follow this user";
        }else if(response.status === 403){
            throw "You are already following this user";
        }else{
            throw "something went wrong"
        }
    })
    .catch(err => {
        console.log(err);
        return Promise.reject(err)
    })
}

const unfollowUser = (user_id) => {
    return fetch("http://localhost:3333/users/" + user_id + "/follow",
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
            throw "Login to unfollow this user";
        }else if(response.status === 403){
            throw "You are not following this user";
        }else{
            throw "something went wrong"
        }
    })
}

const searchUser = (q) => {
    return fetch("http://localhost:3333/search?q="+q)
    .then(response => {
        if(response.status === 200){
            return response.json();
        }else {
            throw "user does not exist"
        }
    })
    .catch(err => {
        console.log(err);
        return Promise.reject(err)
    })
}

export const userService = {
    login,
    logOut,
    getUser,   
    addNewUser,
    followUser,
    unfollowUser,
    searchUser,
}