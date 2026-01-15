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
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginView,
        beforeEnter: (to, from, next) => {
            const auth= useAuthStore();
            auth.isAuthenticated ? next('/') : next();
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterView,
        beforeEnter: (to, from, next) => {
            const auth = useAuthStore();
            auth.isAuthenticated ? next('/') : next();
        }
    }
   /* {
        path:'/movie/:movieId',
        name: 'MovieDetails',
        component: MovieDetailsView,
    }*/
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;  