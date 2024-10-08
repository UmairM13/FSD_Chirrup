<template>
    <div class=" flex justify-center">
        <div class=" w-full bg-blue-200 rounded-lg shadow dark:border sm:max-w-md xl:p-0">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 ">
                    Create and account
                </h1>
                <form @submit.prevent="handleSubmit" class="space-y-4">
                    <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900">First Name: </label>
                    <input type="first_name" name="first_name" v-model="first_name" required autocomplete="first_name"
                        class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
                    <div v-show="submitted && !first_name">First Name is required</div>

                    <label for="last_name" class="block mb-2 text-sm font-medium text-gray-900">Last Name: </label>
                    <input type="last_name" name="last_name" v-model="last_name" required
                        class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
                    <div v-show="submitted && !last_name">Last Name is required</div>

                    <label for="username" class="block mb-2 text-sm font-medium text-gray-900">Username: </label>
                    <input type="username" name="username" v-model="username" autocomplete="username" required
                        class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
                    <div v-show="submitted && !username">Username is required</div>

                    <label for="password" class="block mb-2 text-sm font-medium text-gray-900">Password: </label>
                    <input type="password" name="password" v-model="password" required
                        class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
                    <div v-show="submitted && !password">Password is required</div>

                    <div v-if="showPassword === true">
                        <p> {{ password }}</p>
                    </div>

                    <button
                        class="w-full text-gray-900 bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                        SignUp
                    </button>

                    <div v-if="error" class=" text-red-500 font-semibold rounded">{{ error }}</div>

                    <div class="text-sm font-normal text-gray-900">
                        <p>Already have an account? </p>
                        <router-link :to="'/login'">
                            <p class=" font-semibold text-blue-600 hover:underline">Login here</p>
                        </router-link>
                    </div>
                </form>
                <div class=" size-fit text-gray-900 bg-blue-600 hover:bg-blue-700 font-medium rounded text-sm px-5 py-2.5 text-center">
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
            first_name: "",
            last_name: "",
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

            const { first_name, last_name, username, password } = this;

            if (!(first_name && last_name && username && password)) {
                this.error = "User already exists"
                return;
            }

            const nameRegex = /^[a-zA-Z]{2,32}$/
            if (!(nameRegex.test(first_name))) {
                this.error = "First name should be more than 2 chars and not have any special characters"
                return;
            };
            if (!(nameRegex.test(last_name))) {
                this.error = "Last name should be more than 2 chars and not have any special characters"
                return;
            };

            const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*+]).{8,32}$/
            if (!(passwordRegex.test(password))) {
                this.error = "Password not strong enough!"
                return;
            }

            userService.addNewUser(first_name, last_name, username, password)
                .then(result => {
                    console.log("New user added")
                    this.$router.push("/login")
                })
                .catch(error => {
                    this.error = error;
                    this.submitted = false;
                })
            setTimeout((error) => {
                this.error = error;
            }, 1250);
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