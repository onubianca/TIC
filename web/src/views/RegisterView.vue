<template>
    <div class="modal-backdrop d-flex justify-content-center align-items-center">
      <div class="modal-card p-4 bg-white rounded shadow" style="width: 400px; max-width: 90%"> 
        <h3 class="text-center mb-3">Register</h3>  
        <form @submit.prevent="handleRegister">  
          <div class="mb-3">
            <input type="text" v-model="form.name" class="form-control" placeholder="Name" required/>
          </div>
          <div class="mb-3">
            <input type="email" v-model="form.email" class="form-control" placeholder="Email" required/>
          </div>
          <div class="mb-3">
            <input type="password" v-model="form.password" class="form-control" placeholder="Password" required/>
          </div>
          <button type="submit" class="btn btn-dark w-100">Register</button>
          <p v-if="errorMsg" class="text-danger text-center mt-2">{{ errorMsg }}</p>
        </form>
        <p class="text-center mt-3">
          Already have an account?
          <a href="#" @click.prevent="emit('go-login')">Login</a>
        </p>
      </div>
    </div>
</template>
  

<script setup>
import {ref} from 'vue';
import {useAuthStore} from '../stores/auth';

const auth = useAuthStore();
const form = ref({
    name: '',
    email: '',
    password: ''
});
const errorMsg = ref('');
const emit = defineEmits(['close', 'go-login']);

const handleRegister = async () => {
    try {
        await auth.register(form.value.email, form.value.password, form.value.name);
        emit('close');
    } catch (error) {
        console.error('Registration failed:', error);
        errorMsg.value = error || 'Registration failed.';
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