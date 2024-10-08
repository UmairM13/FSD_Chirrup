<template>
    <div v-if="user" 
    class=" w-full  border border-gray-900 bg-opacity-85  text-gray-900 font-semibold rounded hover:bg-blue-400 transition ease-in-out delay-120 hover:-translate-y-1 hover:scale-110">
        <h3 class=" text-lg font-semibold">{{ "@" + user.username }}</h3>
        <p class=" text-sm font-normal">{{ user.first_name + " " + user.last_name }}</p>
    </div>
     <br />
</template>

<script>
export default {
    props :{
        user: Object,
    }
}
</script>