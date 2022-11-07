<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'app',
  provide() {
    // 在祖先组件中通过 provide 提供变量
    return {
      reload: this.reload, //  声明一个变量
      stopClick: this.stopClick,
    };
  },
  data() {
    return {
      isRouterAlive: true, // 控制 router-view 是否显示达到刷新效果
    };
  },
  created() {
  },
  methods: {
    // provide中声明的变量
    reload() {
      // 通过 this.isRouterAlive 控制 router-view 达到刷新效果
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
    /// 节流
    stopClick(name = `stopClick`, time = 2000, msg = `请等待2s后再次点击`) {
      return new Promise((resolve, reject) => {
        if (this[name]) {
          this.$message.warning(msg);
          return false;
        }
        this[name] = true;
        this.$store.state.isTabs = true
        setTimeout(() => {
          this[name] = false;
        }, time);
        resolve();
      });
    },
  },
};
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  //padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
