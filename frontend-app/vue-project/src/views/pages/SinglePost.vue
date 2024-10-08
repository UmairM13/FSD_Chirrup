<template>
    <div>
        <em v-if="post.loading">Loading post details...</em>

        <div v-else
            class=" grid justify-normal relative m-3 p-5 h-auto text-wrap bg-blue-200 rounded shadow-md hover:bg-blue-300 ">
            <div>
                <div v-if="this.loggedUser === JSON.stringify(post.author.user_id)">
                    <p>Author: </p>
                    <p class=" hover:underline">
                        <router-link :to="'/dashboard'">
                            {{ post.author.first_name + " " + post.author.last_name }} {{ "@" + post.author.username }}
                        </router-link>
                    </p>
                </div>
                <div v-else>
                    <p>Author: </p>
                    <p class=" hover:underline">
                        <router-link :to="'/users/' + post.author.user_id">
                            {{ post.author.first_name + " " + post.author.last_name }} {{ "@" + post.author.username }}
                        </router-link>
                    </p>
                </div>
            </div>

            <div class=" absolute top-44 right-10 bg-red-500 shadow rounded size-fit ">
                <button class=" size-fit rounded hover:bg-red-600"
                    v-if="this.loggedUser === JSON.stringify(post.author.user_id)" @click="del">
                    <img src="../../assets/trashbin.svg" width="25" height="25">
                </button>
            </div>

            <p>Text: </p>

            <div v-if="this.loggedUser === JSON.stringify(post.author.user_id)" contenteditable  @input="handleInput" @blur="update"
            class=" rounded text-xl">
                {{ post.text }}
            </div>
            <div v-if="error" class=" flex justify-center text-red-500 font-semibold rounded">{{ error }}</div>
            <button class=" border border-gray-800 size-fit rounded hover:bg-blue-400"
                v-if="this.loggedUser === JSON.stringify(post.author.user_id)" @click="update()">Edit</button>
            <div v-else class=" rounded text-xl">
                {{ post.text }}
            </div>

            <p>Date: {{ formatDate(post.timestamp) }}</p>
            <p>Number of likes: <button @click="modalAction()" class=" px-2 rounded hover:shadow-lg hover:bg-blue-400">{{
                post.likes.length }}</button></p>
            <div>
                <button class=" border size-fit hover:bg-green-600 rounded " @click="like(post.post_id)">
                    <img src="../../assets/ThumbsUp.svg" width="20" height="20">
                </button>
                <button class=" border size-fit hover:bg-red-600 rounded" @click="unlike(post.post_id)">
                    <img src="../../assets/ThumbsDown.svg" width="20" height="20">
                </button>
            </div>

            <!-- <div v-if="post.text !== draft && this.loggedUser === JSON.stringify(post.author.user_id)">
                <i>Saved draft</i>
            </div> -->
        </div>

        <!-- modal for likes -->
        <Transition name="fade">
            <div v-if="modal & post.likes.length !== 0">
                <div class=" absolute bg-black opacity-70 inset-0 z-0 ">
                    <div class=" fixed inset-0 flex justify-center items-center">
                        <div class=" relative max-w-xl">
                            <div class=" bg-blue-200 w-full border rounded">
                                <h1 class=" text-2xl">Likes
                                    <button @click="modalAction()"
                                        class=" px-5 py-2 text-base font-bold text-red-500 hover:font-extrabold tracking-wider rounded-md transition ease-in-out delay-120 hover:-translate-y-1 hover:scale-110">
                                        Close</button>
                                </h1>
                                <ul v-if="post.likes">
                                    <li v-for="user in post.likes" :key="post.likes.user_id">
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
        </Transition>

    </div>
</template>

<script>

import { postService } from '../../services/posts.service';
import ModalDetails from '../components/ModalDetails.vue';

export default {
    data() {
        return {
            post: {},
            error: "",
            text: "",
            showButton: false,
            loggedUser: localStorage.getItem("user_id"),
            modal: false,
            draft: localStorage.getItem(this.$route.params.id),
            drop: false,
        }
    },
    components: {
        ModalDetails,
    },
    methods: {
        like() {
            postService.likePost(this.$route.params.id)
                .then((post) => {
                    console.log("Liked post")
                    this.loadPost();
                })
                .catch(error => {
                    this.error = error
                })
            setTimeout((error) => {
                this.error = error
            }, 1750);
        },
        unlike() {
            postService.unlikePost(this.$route.params.id)
                .then((post) => {
                    console.log("Unliked post")
                    this.loadPost();
                })
                .catch(error => {
                    this.error = error
                })
            setTimeout((error) => {
                this.error = error
            }, 1750);
        },
        loadPost() {
            this.post.loading = true;

            postService.getSinglePost(this.$route.params.id)
                .then((post) => {
                    this.post = post;
                })
                .catch(error => this.error = error);
        },
        handleInput(e) {
            this.text = e.target.innerText;
        },
        update() {
            postService.updatePost(this.$route.params.id, this.text)
                .then((post) => {
                    console.log("Post update successfully");
                    this.loadPost();
                })
                .catch(error => {
                    this.error = error
                })
            setTimeout((error) => {
                this.error = error
            }, 1750);
        },
        del() {
            postService.deletePost(this.$route.params.id)
                .then((post) => {
                    console.log("Post deleted successfully");
                    this.$router.push("/dashboard")
                })
                .catch(error => {
                    this.error = error
                })
            setTimeout((error) => {
                this.error = error
            }, 750);
        },
        modalAction() {
            if (this.modal === false) {
                this.modal = true;
            } else {
                this.modal = false;
            }
        },
        formatDate(timestamp) {
            const getDate = new Date(timestamp);
            return getDate.toDateString();
        },
        dropdown() {
            if (this.drop === false) {
                this.drop = true;
            } else {
                this.drop = false;
            }
        }
    },
    created() {
        this.loadPost()
    }
}
</script>