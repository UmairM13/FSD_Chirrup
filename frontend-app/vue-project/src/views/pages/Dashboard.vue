<template>
    <div class=" bg-blue-100">
        <div class=" flex justify-center text-2xl">
            <h1>Profile</h1>
        </div>
        <form @submit.prevent="handleSubmit(e)" class=" flex justify-end w-auto">
            <button
                class=" px-3 text-red-600 text-lg font-semibold size-fit rounded transition ease-in-out delay-120 hover:-translate-y-1 hover:scale-110 order-110 hover:font-bold">Logout</button>
            <div v-if="error">{{ error }}</div>
        </form>
        <div>
            <em v-if="user.loading">Loading user details...</em>

            <div v-else class=" grid">
                <div>
                    <p> {{ user.first_name + " " + user.last_name }}</p>
                    <p> {{ "@" + user.username }}</p>
                </div>
                <div class=" grid grid-flow-col justify-evenly">
                    <div>
                        <p v-if="user.posts">
                            Posts:{{ user.posts.length }}
                        </P>
                    </div>
                    <div>
                        <p v-if="user.followers">Followers: <button @click="modalActionFollowers()"
                            class=" px-2 size-fit rounded hover:text-blue-400"
                        > {{user.followers.length }}
                            </button>
                        </p>
                    </div>
                    <div>
                        <p v-if="user.following">Following: <button @click="modalActionFollowing()"
                            class=" px-1 size-fit rounded hover:text-blue-400"
                        > {{ user.following.length }}
                            </button>
                        </p>
                    </div>
                </div>

                <br /> <br />

                <textarea name="text" cols="40" rows="10" v-model="text" placeholder="Enter post..."
                    class=" w-96 justify-self-center"></textarea>
                <div v-show="submitted & !text " class="  flex justify-center text-red-500">Enter something</div>
                <br />
                <div class=" flex justify-center">
                    <button v-on:click="addPost"
                        class=" size-fit rounded hover:bg-blue-400 hover:shadow hover:shadow-slate-500">Add
                        Post</button>
                </div>

                <div v-if="error1" class=" flex justify-center text-red-500 font-semibold rounded">{{ error1 }}</div>

                <br />
                <hr />

                <div>
                    <!-- <ul v-if="user.posts.length">
                        <li v-for="post in user.posts" :key="post.post_id">
                            <router-link :to="'/posts/' + post.post_id">
                                {{ post.text }}
                            </router-link>
                        </li>
                    </ul> -->
                    <ul v-if="user.posts.length" class=" grid grid-flow-row lg:grid-cols-2 gap-2 sm:grid-cols-1">
                        <li v-for="post in user.posts" :key="post.post_id"
                            class=" text-center px-4 py-2 ">
                            <div class=" relative m-3 p-5 text-wrap bg-blue-200 rounded shadow-md hover:bg-blue-300">
                                <router-link :to="'/posts/' + post.author.user_id">
                                    <PostDetails :post="post" :error="error" :Date="formatDate(post.timestamp)">
                                    </PostDetails>
                                </router-link>
                                <div class=" absolute bottom-px right-px">
                                    <button class=" border size-fit hover:bg-green-600 rounded "
                                        @click="like(post.post_id)">
                                        <img src="../../assets/ThumbsUp.svg" width="20" height="20">
                                    </button>
                                    <button class=" border size-fit hover:bg-red-600 rounded" @click="unlike(post.post_id)">
                                        <img src="../../assets/ThumbsDown.svg" width="20" height="20">
                                    </button>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- <hr />
            <p>All user info (for debugging during development):</p>
            <p>{{ user }}</p> -->
        </div>

        <!-- modal for followers -->
        <div v-if="modalFollowers">
            <div class=" absolute bg-black opacity-70 inset-0 z-0 ">
                <div class=" fixed inset-0 flex justify-center items-center">
                    <div class=" relative max-w-xl">
                        <div class=" bg-blue-200 w-full border rounded">
                            <h1 class=" text-2xl">Followers
                                <button @click="modalActionFollowers()"
                                    class=" px-5 py-2 text-base font-bold hover:font-extrabold text-red-600 tracking-wider rounded-md transition ease-in-out delay-120 hover:-translate-y-1 hover:scale-110">
                                    Close</button>
                            </h1>
                            <ul v-if="user.followers">
                                <li v-for="user in user.followers" :key="user.followers.user_id">
                                    <router-link :to="'/users/' + user.user_id">
                                        <ModalDetails :user="user"></ModalDetails>
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- modal for following -->
        <div v-if="modalFollowing">
            <div class=" absolute bg-black opacity-85 inset-0 z-0 ">
                <div class=" fixed inset-0 flex justify-center items-center">
                    <div class=" relative max-w-xl">
                        <div class=" bg-blue-200 w-full border rounded">
                            <h1 class=" text-2xl">Following
                                <button @click="modalActionFollowing()"
                                    class=" px-5 py-2 text-base font-bold hover:font-extrabold text-red-600 tracking-wider rounded-md transition ease-in-out delay-120 hover:-translate-y-1 hover:scale-110">
                                    Close</button>
                            </h1>
                            <ul v-if="user.following">
                                <li v-for="user in user.following" :key="user.user_id">
                                    <router-link :to="'/users/' + user.user_id">
                                        <ModalDetails :user="user"></ModalDetails>
                                    </router-link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { userService } from '../../services/users.service';
import { postService } from '../../services/posts.service';
import UserDetails from '../components/UserDetails.vue';
import PostDetails from '../components/PostDetails.vue';
import ModalDetails from '../components/ModalDetails.vue';

export default {
    data() {
        return {
            text: "",
            user: {},
            submitted: false,
            error: "",
            error1: "",
            modalFollowers: false,
            modalFollowing: false,
        }
    },
    methods: {
        handleSubmit(e) {
            userService.logOut()
                .then(result => {
                    console.log("logout successful");
                    this.$router.push("/")
                })
                .catch(error => {
                    this.error = error;
                    return
                })
            setTimeout((error) => {
                this.error = error
            }, 750);
        },
        addPost() {
            this.submitted = true;
            const { text } = this;

            if (!text) {
                return
            }

            postService.addNewPost(text)
                .then(result => {
                    console.log("New post added")
                    this.loadUser();
                })
                .catch(error1 => {
                    this.error1 = error1;
                    this.submitted = false;
                    return
                })
            setTimeout((error, error1) => {
                this.error = error;
                this.error1 = error1;
            }, 750);
        },
        loadUser() {
            this.user.loading = true;

            userService.getUser(localStorage.getItem('user_id'))
                .then((user) => {
                    this.user = user;
                })
                .catch(error => this.error = error);
        },
        modalActionFollowers() {
            if (this.modalFollowers === false) {
                this.modalFollowers = true;
            } else {
                this.modalFollowers = false;
            }
        },
        modalActionFollowing() {
            if (this.modalFollowing === false) {
                this.modalFollowing = true;
            } else {
                this.modalFollowing = false;
            }
        },
        formatDate(timestamp) {
            const getDate = new Date(timestamp);
            return getDate.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        },
        like(post_id) {
            postService.likePost(post_id)
                .then((post) => {
                    console.log("Liked post")
                    this.loadUser();
                })
                .catch(error => {
                    alert(error)
                })
            setTimeout((error) => {
                this.error = error
            }, 750);
        },
        unlike(post_id) {
            postService.unlikePost(post_id)
                .then((post) => {
                    console.log("Unliked post")
                    this.loadUser();
                })
                .catch(error => {
                    alert(error)
                })
            setTimeout((error) => {
                this.error = error
            }, 750);

        },
    },
    created() {
        this.loadUser();
    },
    components: {
        UserDetails,
        PostDetails,
        ModalDetails,
    }
}
</script>