import Vue from 'vue';
import Router from 'vue-router';
import BitcoinComponent from '@/components/BitcoinComponent';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'BitcoinComponent',
            component: BitcoinComponent
        }
    ]
})
