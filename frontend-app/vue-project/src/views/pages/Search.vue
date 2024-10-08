<template>
    <div>
        <h1 class=" flex justify-center text-2xl">Search User</h1>
        <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
        <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
            </div>
            <input name="search" type="text" v-model="q" placeholder="search..."
                class=" block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 " /><button
                @click="search"
                class=" text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 ">Search</button>
        </div>
        <br />
        <em v-if="user.loading">Searching users...</em>
        <div v-else class=" flex justify-center">
            <ul v-if="user.length">
                <li v-for="u in user.slice(0, 15)" :key="u.user_id">
                    <router-link :to="'/users/' + u.user_id">
                        <UserDetails :user="u"></UserDetails>
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { userService } from '../../services/users.service';
import UserDetails from '../components/UserDetails.vue';

export default {
    data() {
        return {
            user: {},
            q: ""
        }
    },
    components: {
        UserDetails,
    },
    watch: {
        q(after, before) {
            this.search();
        }
    },
    methods: {
        search() {
            const { q } = this;
            userService.searchUser(q)
                .then(user => {
                    console.log(user);
                    this.user = user;
                })
                .catch(error => {
                    error = this.error
                })
            setTimeout((error) => {
                this.error = error
            }, 750);
        }
    }
}
</script>