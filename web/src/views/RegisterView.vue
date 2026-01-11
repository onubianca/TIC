<template>
    <div>
        <h2>Register</h2>
        <form @submit.prevent="handleRegister">
            <div>
                <input type="text" id="username" v-model="form.name" placeholder="Name" required />
                <input type="email" id="email" v-model="form.email" placeholder="Email" required />
                <input type="password" id="password" v-model="form.password" placeholder="Password" required />
                <button type="submit" class="btn btn-dark btn-submit">Register</button>
                <p v-if="authError" class="error">{{ authError }}</p>
            </div>
        </form>
        <p class="link-text">
            Already have an account? <router-link to="/login">Login here</router-link>
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
    name: '',
    email: '',
    password: ''
});

const handleRegister = async () => {
    try {
        await auth.register(form.value.name, form.value.email, form.value.password);
        router.push('/');
    } catch (error) {
        console.error('Registration failed:', error);
    }
};
</script>