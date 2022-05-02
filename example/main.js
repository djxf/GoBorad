import Vue from 'vue';
import App from './App.vue';
import VConsole from 'vconsole';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
Vue.config.productionTip = false;
const vConsole = new VConsole();
console.log('hello world')
new Vue({
    render: h => h(App),
}).$mount('#app');

