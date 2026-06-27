<template>
    <div class="modal-backdrop d-flex justify-content-center align-items-center">
      <div class="modal-card p-4 bg-white rounded shadow" style="width: 400px; max-width: 90%">
        <h3 class="text-center mb-3">Login</h3>
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <input type="email" v-model="form.email" class="form-control" placeholder="Email" required/>
          </div>
          <div class="mb-3">
            <input type="password" v-model="form.password" class="form-control" placeholder="Password" required/>
          </div>
          <button type="submit" class="btn btn-dark w-100">Login</button>
          <p v-if="errorMsg" class="text-danger text-center mt-2">{{ errorMsg }}</p>
        </form>
        <p class="text-center mt-3">
            You don't have an account?
            <a href="#" @click.prevent="emit('go-register')">Register</a>
        </p>
      </div>
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
const errorMsg = ref('');
const emit = defineEmits(['close', 'go-register']);

const handleLogin = async () => {
    try {
        await auth.login(form.value.email, form.value.password);
        emit('close');
    } catch (error) {
        console.error('Login failed:', error);
        errorMsg.value = 'Invalid email or password.';
    }
};

</script>

<style>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  z-index: 1050;
}

</style>