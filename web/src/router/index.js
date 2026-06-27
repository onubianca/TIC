import {createRouter, createWebHistory} from 'vue-router';
import {useAuthStore} from '@/stores/auth';

import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue'; 
import RegisterView from '@/views/RegisterView.vue';



const routes = [    
    {
        path: '/',
        name: 'Home',
        component: HomeView
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;  