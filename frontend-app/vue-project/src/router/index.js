import { createRouter, createWebHistory } from 'vue-router';

import Home from "../views/pages/Home.vue"
import Login from "../views/pages/Login.vue"
import SinglePost from "../views/pages/SinglePost.vue"
import Dashboard from "../views/pages/Dashboard.vue"
import SingleUser from "../views/pages/SingleUser.vue"
import SignUp from "../views/pages/SignUp.vue"
import Search from "../views/pages/Search.vue"

const ifAuthenticated = (to, from, next) =>{
    const loggedIn = localStorage.getItem('session_token');
    if (loggedIn){
        next()
        return 
    }
    next('login')
}
const routes = [
    { path: "/", component: Home },
    { path: "/login", component: Login },
    { path: "/posts/:id", component: SinglePost },
    { path: "/dashboard", component: Dashboard, beforeEnter: ifAuthenticated },
    { path: "/users/:id", component: SingleUser },
    { path: "/signup", component: SignUp },
    { path: "/search", component: Search },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;