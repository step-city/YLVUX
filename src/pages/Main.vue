<template>
  <div>
    <div>
      <actionsheet :menus="menus" v-model="showMenus" @on-click-menu-menu3="_click" @on-click-menu-menu2="_clickSystem"></actionsheet>
    </div>
    <x-header :transition="headerTransition" style="width:100%;position:absolute;left:0;top:0;" class="header" :right-options="rightOptions" :left-options="leftOptions" @on-click-more="onClickMore" :title="title"></x-header>
    <transition name="fade">
      <router-view></router-view>
    </transition>
    <grid :rows="2" v-show="showGrid">
      <grid-item :link="firstmenulist.ModuleLinkUrl" :label="firstmenulist.ModuleName" v-for="(firstmenulist,index) in menuList" :key="index">
        <img slot="icon" :src="firstmenulist.ModuleIcon">
      </grid-item>
    </grid>
    <x-dialog v-model="showScrollBox" class="dialog-demo">
      <group title="转化角色" style="height:100px;padding:10px 0;">
        <selector :options="lists" title="当前角色" v-model="value3" @on-change="_onChange"></selector>
      </group>
      <div @click="showScrollBox=false">
        <span class="vux-close"></span>
      </div>
    </x-dialog>
  
    <tabbar class="vux-demo-tabbar" icon-class="vux-center" slot="bottom">
      <tabbar-item link="/newsList">
        <img slot="icon" src="../../static/ic_nav_my_pressed.png">
        <span slot="label">微应用</span>
      </tabbar-item>
      <tabbar-item show-dot link="/home" selected>
        <img slot="icon" src="../../static/home.png">
        <span slot="label">主页</span>
      </tabbar-item>
      </tabbar-item>
      <tabbar-item @on-item-click="showScrollBox =!showScrollBox">
        <img slot="icon" src="../../static/user-cert.png">
        <span slot="label">转化角色</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import { Selector,XDialog, Group, XHeader, Actionsheet, Tabbar, TabbarItem, Grid, GridItem } from 'vux'
import { mapGetters } from 'vuex'
import api from '../fetch/api'




export default {
  computed: {
    showGrid() {
      return this.$route.path === '/home'
    },
    ...mapGetters([
      'userInfo', 'getUserData'
    ]),
    headerTransition() {
      return this.direction === 'forward' ? 'vux-header-fade-in-right' : 'vux-header-fade-in-left'
    },
    title() {
      // switch (this.$route.name) {
      //   case 'home':
      //     this.show = true;
      //     return "中铁设备租赁管理系统"
      // }  
      if (this.$route.meta.requireMenue) {
        this.show = true;
      } else {
        this.show = false;
      }
      return this.$route.name
    },
    leftOptions() {
      return {
        showBack: !this.$route.meta.requireMenue//this.$route.path !== '/home'
      }
    },
    rightOptions() {
      return {
        showMore: this.show
      }
    }

  },
  components: {
    XHeader, Group,Grid, GridItem, XDialog,Selector,
    Actionsheet,
    Tabbar,
    TabbarItem
  },
  mounted() {
    var data = this.userInfo
    for (var i = 0; i < data.length; i++) {
      this.lists.push(data[i].RoleName)
    }
    this.value3=this.getUserData.RoleName
    this._fetchRoleModule()
  },
  data() {
    return {
      menuList: {},
      value3: '',
      lists: [],
      showScrollBox: false,
      objectListValue: [],
      objectList: [],
      show1: false,
      show: true,
      menus: {
        // menu1: '转化角色',
        menu2: '系统设置',
        menu3: '注销登录'
      },
      showMenus: false
    }
  },
  methods: {
    //获取菜单列表
    _fetchRoleModule() {
      let _this = this; //es5语法中，回调函数内的this指针为null，所以要先用个变量存储当前的this      
      let param = { 'roleId': _this.getUserData.RoleNode }
      api.GetRoleModule(param).then(response => {
        let data = JSON.parse(response)
        _this.menuList = data
      }, (error) => {
        _this.$vux.toast.show({
          text: '菜单加载失败',
          type: "text",
          position: 'top',
          width: "15em"
        })
      })
    },
    //转化角色
    _onChange(val) {
      let data = this.userInfo
      for (var i = 0; i < data.length; i++) {
        if (data[i].RoleName == val) {
          let params = data[i]
          this.$store.dispatch('getUserData', params)
          this._fetchRoleModule()
          this.showScrollBox=false
        }
      }

    },
    _clickSystem() {
      this.$router.replace('/systemConfig')
    },
    onClickMore() {
      this.showMenus = true
    },
    _click() {
      let that = this
      that.$vux.confirm.show({
        title: '提示',
        content: '确认退出吗?',
        onConfirm() {
          that.$store.dispatch('setSignOut')
          setTimeout(() => {
            that.$router.replace('/login')
          }, 500)
          that.$vux.toast.show({
            text: '退出登录成功',
            type: 'text',
            position: 'top'
          })
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.vux-demo-tabbar {
  position: fixed;
  overflow: auto;
}

.header {
  background-color: RGB(0, 122, 204);
}
</style>
