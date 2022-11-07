import Table from '@/views/components/TableTools/index.vue';

const plugins = {
    install: (Vue) => {
        Vue.component('Table', Table);
    },
};
export default plugins;
