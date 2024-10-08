<template>
    <div>
      <nav class="bg-white border-gray-200 dark:bg-gray-900 text-gray-300 rounded-sm">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-around mx-auto p-4">
          <router-link class=" hover:bg-cyan-700 rounded order-110" to="/">Home</router-link>
          <div v-if="Lshow" class="order-1">
            <router-link class=" hover:bg-cyan-700 rounded " to="/login">Login</router-link>/
            <router-link class=" hover:bg-cyan-700 rounded" to="/signup">Sign up</router-link>
          </div>
          <router-link v-if="Dshow" class=" hover:bg-cyan-700 rounded order-1" to="/dashboard">Dashboard</router-link>
          <router-link class=" hover:bg-cyan-700 rounded" to="/search">Search</router-link>
        </div>
      </nav>
  
      
    </div>
  </template>

<script>
export default {
    props: {
        Dshow: Boolean,
        Lshow: Boolean,
        reload: String,
    }
}
</script>