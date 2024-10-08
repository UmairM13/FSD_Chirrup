<template>
    <div class=" flex items-center justify-center m-10">
        <div class=" w-full bg-blue-200 rounded-lg shadow dark:border sm:max-w-md xl:p-0">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 ">
                    Login
                </h1>
                <form @submit.prevent="handleSubmit(e)">
                    <label for="username" class="block mb-2 text-sm font-medium text-gray-900">Username: </label>
                    <input type="username" name="username" v-model="username" autocomplete="username"
                        class=" bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
                    <div v-show="submitted & !username">username is required</div>

                    <label for="password" class="block mb-2 text-sm font-medium text-gray-900">Password: </label>
                    <input type="password" name="password" v-model="password"
                        class=" bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
                    <!-- <button class=" rounded bg-blue-600" @click="toggleShow">
                        show
                    </button> -->
                    <div v-if="showPassword === true">
                        <p> {{ password }}</p>
                    </div>

                    <div v-show="submitted && !password">Password is required</div>

                    <br />

                    <button
                        class="w-full text-gray-900 bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Login</button>

                    <div v-if="error" class=" text-red-500 font-semibold rounded">{{ error }}</div>

                    <div class="text-sm font-normal text-gray-900">
                        <p>Don't have an account yet?</p>
                        <router-link :to="'/signup'">
                            <p class=" font-semibold text-blue-600 hover:underline">Sign up here</p>
                        </router-link>
                    </div>
                </form>
                <div
                    class=" size-fit text-gray-900 bg-blue-600 hover:bg-blue-700 font-medium rounded text-sm px-5 py-2.5 text-center">
                    <button @click="toggleShow"> Show Password</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { userService } from '../../services/users.service';

export default {
    data() {
        return {
            username: "",
            password: "",
            submitted: false,
            error: "",
            showPassword: false,
        }
    },
    methods: {
        handleSubmit(e) {
            this.submitted = true

            this.error = ""

            const { username, password } = this;

            if (!(username && password)) {
                this.error = "Wrong username or password supplied"
                return;
            }

            userService.login(username, password)
                .then(result => {
                    console.log("Auth successful")
                    this.$router.push("/dashboard")
                })
                .catch(error => {
                    this.error = error;
                    this.submitted = false;
                })
            setTimeout((error) => {
                this.error = error
            }, 1750);
        },
        toggleShow() {
            if (this.showPassword === false) {
                this.showPassword = true;
            } else {
                this.showPassword = false;
            }
        }
    }
}
</script>