import Vue from 'vue';
import App from './App.vue';
import VConsole from 'vconsole';

Vue.config.productionTip = false;
const vConsole = new VConsole();
console.log('hello world')
new Vue({
    render: h => h(App),
}).$mount('#app');
