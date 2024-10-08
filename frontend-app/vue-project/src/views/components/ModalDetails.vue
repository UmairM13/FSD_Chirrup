<template>
    <div class=" bg-opacity-85 bg-blue-300 text-gray-900 font-semibold rounded hover:bg-blue-400 transition ease-in-out delay-120 hover:-translate-y-1 hover:scale-110"
    v-if="user">
        <h3>{{ "@" + user.username }}</h3>
        <p>{{ user.first_name + " " + user.last_name }}</p>
    </div>
</template>

<script>
export default {
    props :{
        user: Object,
    }
}
</script>