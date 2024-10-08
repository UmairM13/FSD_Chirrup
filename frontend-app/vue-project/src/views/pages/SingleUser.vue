<template>
    <div>
        <!-- <h1>User Deatils</h1> -->

        <em v-if="user.loading">Loading users...</em>

        <div v-else>
            <div class=" grid">
                <div class=" flex justify-center text-xl font-semibold">
                    <p> {{ user.first_name + " " + user.last_name }}</p>
                    <br />
                </div>
                <div class=" flex justify-center">
                    <p> {{ "@" + user.username }}</p>
                </div>
                <br />
                <div class=" flex justify-center text-red-500 font-semibold rounded">
                    {{ error }}
                </div>
                <div class=" grid grid-flow-col justify-evenly">
                    <div>
                        <p v-if="user.posts">Posts:{{ user.posts.length }} </p>
                    </div>
                    <div>
                        <p v-if="user.followers">Followers: <button @click="modalActionFollowers()"
                                class=" px-1 size-fit text-gray-700 rounded hover:text-blue-400"> {{ user.followers.length
                                }}
                            </button>
                        </p>
                        <button @click="follow()"
                            class=" border size-fit bg-green-600 rounded hover:scale-105 order-105">Follow</button>
                    </div>
                    <div>
                        <p v-if="user.following">Following: <button @click="modalActionFollowing()"
                                class=" px-1 size-fit text-gray-700 rounded hover:text-blue-400"> {{ user.following.length
                                }}
                            </button>
                        </p>
                        <button @click="unfollow()"
                            class=" bg-red-600 text-base font-normal size-fit rounded hover:scale-105 order-105">Unfollow</button>
                    </div>
                </div>

                <br />

                <ul v-if="user.posts.length" class="  grid grid-flow-row lg:grid-cols-2 gap-2 sm:grid-cols-">
                    <li v-for="post in user.posts" :key="post.post_id" class=" text-center px-4 py-2 ">
                        <div class=" relative m-3 p-5 text-wrap bg-blue-200 rounded shadow-md hover:bg-blue-300">
                            <router-link :to="'/posts/' + post.post_id">
                                <PostDetails :post="post" :Date="formatDate(post.timestamp)">
                                </PostDetails>
                            </router-link>
                            <div class=" absolute bottom-px right-px">
                                <button class=" border size-fit hover:bg-green-600 rounded " @click="like(post.post_id)">
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

        <!-- modal for followers -->
        <div v-if="modalFollowers & user.followers.length !== 0">
            <div class=" absolute bg-black opacity-80 inset-0 z-0 ">
                <div class=" fixed inset-0 flex justify-center items-center">
                    <div class=" relative max-w-xl">
                        <div class=" bg-blue-500 font-semibold w-full border rounded">
                            <h2 class=" text-2xl">Followers
                                <button @click="modalActionFollowers()"
                                    class=" px-5 py-2 text-base font-bold text-red-500 hover:font-extrabold tracking-wider rounded-md transition ease-in-out delay-120 hover:-translate-y-1 hover:scale-110">Close</button>
                            </h2>
                            <ul v-if="user.followers">
                                <li v-for="user in user.followers" :key="user.user_id">
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
        <div v-if="modalFollowing & user.following.length !== 0">
            <div class=" absolute bg-black opacity-80 inset-0 z-0  ">
                <div class=" fixed inset-0 flex justify-center items-center">
                    <div class=" relative max-w-xl">
                        <div class=" bg-blue-500 w-full border rounded">
                            <h2 class=" text-2xl">Following
                                <button @click="modalActionFollowing()"
                                    class=" px-5 py-2 text-base font-bold text-red-500 hover:font-extrabold tracking-wider rounded-md transition ease-in-out delay-120 hover:-translate-y-1 hover:scale-110">Close</button>
                            </h2>
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
import ModalDetails from '../components/ModalDetails.vue';
import PostDetails from '../components/PostDetails.vue';

export default {
    components: {
        UserDetails,
        ModalDetails,
        PostDetails,
    },
    data() {
        return {
            user: {},
            error: "",
            modalFollowers: false,
            modalFollowing: false,
        }
    },
    methods: {
        follow() {
            userService.followUser(this.$route.params.id)
                .then(() => {
                    console.log("Followed successfully")
                    this.loadUser();
                })
                .catch(error => {
                    this.error = error
                })
            setTimeout((error) => {
                this.error = error
            }, 1250);
        },
        unfollow() {
            userService.unfollowUser(this.$route.params.id)
                .then(result => {
                    console.log("Unfollowed Successfully")
                    this.loadUser();
                })
                .catch(error => {
                    this.error = error
                })
            setTimeout((error) => {
                this.error = error
            }, 1250);
        },
        loadUser() {
            this.user.loading = true;

            userService.getUser(this.$route.params.id)
                .then((user) => {
                    this.user = user;
                    //console.log("Got user")

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
            }, 1750);
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
            }, 1750);

        },
    },
    created() {
        this.loadUser();
    }
}
</script>