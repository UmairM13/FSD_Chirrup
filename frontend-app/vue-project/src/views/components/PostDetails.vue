<template>
    <div v-if="post">
        <div v-if="loggedUser === JSON.stringify(post.author.user_id)">
            <p class=" absolute top-0 left-5 text-base hover:underline"><router-link :to="'/dashboard'">
                    {{
                        post.author.first_name + " " +
                        post.author.last_name }} </router-link> <router-link :to="'/dashboard'"><small> {{
        "@" + post.author.username }} </small>
                    <small> ᛫ {{ Date }} </small></router-link></p>
        </div>
        <div v-else>
            <p class=" absolute top-0 left-5 text-base hover:underline"><router-link :to="'/users/' + post.author.user_id">
                    {{
                        post.author.first_name + " " +
                        post.author.last_name }} </router-link> <router-link :to="'/users/' + post.author.user_id"><small> {{
        "@" + post.author.username }} </small>
                    <small> ᛫ {{ Date }} </small></router-link></p>
        </div>
        <p class=" text-xl">
            <router-link :to="'/posts/' + post.post_id">
                {{ post.text }}
            </router-link>
        </p>
        <div class=" absolute bottom-0">
            <p><small>likes: {{ post.likes.length }}</small></p>
        </div>
        <div v-if="error" class="">
            {{ error }}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        post: Object,
        Like: Function,
        Unlike: Function,
        error: String,
        Date: String,
        loggedUser: String,
    }
}
</script>