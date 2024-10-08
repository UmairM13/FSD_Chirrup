<template>
    <div class=" bg-gray-200">

        <em v-if="loading">Loading posts...</em>
        <div v-else class=" ">
            <ul v-if="posts.length" class=" grid grid-flow-row lg:grid-cols-2 gap-2 sm:grid-cols-1">
                <li v-for="post in posts" :key="post.post_id" class=" text-center px-4 py-2 ">
                    <div class=" relative m-3 p-5 text-wrap bg-blue-200 rounded shadow-md hover:bg-blue-300">
                        <router-link :to="'/posts/' + post.author.user_id">
                            <PostDetails :post="post" :error="error" :Date="formatDate(post.timestamp)"></PostDetails>
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
</template>

<script>
import { postService } from '../../services/posts.service';
import PostDetails from '../components/PostDetails.vue';

export default {
    data() {
        return {
            posts: [],
            error: "",
            loading: true,
        }
    },
    components: {
        PostDetails,
    },
    methods: {
        like(post_id) {
            postService.likePost(post_id)
                .then((post) => {
                    console.log("Liked post")
                    this.loadFeed();
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
                    this.loadFeed();
                })
                .catch(error => {
                    alert(error)
                })
            setTimeout((error) => {
                this.error = error
            }, 1750);
        },
        loadFeed() {
            postService.getFeed()
                .then(posts => {
                    this.posts = posts
                    this.loading = false
                })
                .catch(error => {
                    this.error = error
                    this.loading = false
                    return
                });
        },
        formatDate(timestamp) {
            const getDate = new Date(timestamp);
            return getDate.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        }
    },
    mounted() {
        this.loadFeed();
    }
}
</script>