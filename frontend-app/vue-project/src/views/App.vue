<template>
  <div>
    <nav class=" font-semibold text-lg bg-blue-700 border-gray-200 text-gray-950 rounded-sm">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-around mx-auto p-4">
        <router-link class=" transition ease-in-out delay-120 hover:-translate-y-1 hover:scale-110  hover:text-gray-300 rounded order-110" to="/">Home</router-link>
        <div class="order-1">
            <div v-if="showLogin" class=" transition ease-in-out delay-120 hover:-translate-y-1 hover:scale-110  hover:text-gray-300 rounded order-110" >
              <router-link to="/login">Login</router-link>/
              <router-link to="/signup">Sign up</router-link>
            </div>
            <div v-if="showDashboard" class=" transition ease-in-out delay-120 hover:-translate-y-1 hover:scale-110  hover:text-gray-300 rounded order-110" >
              <router-link class="" to="/dashboard">Dashboard</router-link>
            </div>
        </div>
        <router-link class=" transition ease-in-out delay-120 hover:-translate-y-1 hover:scale-110  hover:text-gray-300 rounded order-110" to="/search">Search</router-link>
      </div>
    </nav>
  </div>

  <router-view v-on:mouseenter="renderNavbar()" />
</template>

<script>


export default {
  data() {
    return {
      showDashboard: false,
      showLogin: false,
    }
  },
  methods: {
    renderNavbar() {
      if (localStorage.getItem("user_id")) {
        this.showDashboard = true
        this.showLogin = false
      } else if(localStorage.getItem("user_id") === null) {
        this.showLogin = true
        this.showDashboard = false
      }
    }
  },
  created() {
    this.renderNavbar()
  },
}

</script>
