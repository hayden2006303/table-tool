import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Ant from 'ant-design-vue';
import ElementUI from 'element-ui';
import plugins from '@/views/plugins';
import 'element-ui/lib/theme-chalk/index.css';
import 'ant-design-vue/dist/antd.css';

Vue.use(Ant);
Vue.use(ElementUI);
Vue.use(plugins);


Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
