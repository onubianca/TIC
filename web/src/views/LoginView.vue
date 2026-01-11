<template>
    <div>
        <h1>Login</h1>
        <form @submit.prevent="handleLogin">
            <div>
                <input type="email" id="email" v-model="form.email" placeholder="Email" required />
                <input type="password" id="password" v-model="form.password" placeholder="Password" required />
                <button type="submit" class="btn btn-dark btn-submit">Login</button>
                <p v-if="authError" class="error">{{ authError }}</p>

            </div>
        </form>
        <p class="link-text">
            Don't have an account? <router-link to="/register">Register here</router-link>
        </p>
    </div>
</template>

<script setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {useAuthStore} from '../stores/auth';

const router = useRouter();
const auth = useAuthStore();
const form = ref({
    email: '',
    password: ''
});

const handleLogin = async () => {
    try {
        await auth.login(form.value.email, form.value.password);
        router.push('/');
    } catch (error) {
        console.error('Login failed:', error);
    }
};

</script>

<style>

</style>