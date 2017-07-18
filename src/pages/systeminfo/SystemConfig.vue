<template>
  <div>
    <div class="avatar">
      <img src="../../../static/ic_nav_my_pressed.png" alt="">
    </div>
    <group>
      <x-switch title="分享" v-model="show1"></x-switch>
      <x-switch title="账号与安全" v-model="show3"></x-switch>
      <x-switch title="帮助与反馈" v-model="show5"></x-switch>
    </group>
    <group title="switch" style="margin-bottom:50px;">
      <cell v-for="(item,index) in cellLists" :link="item.link" :title="item.text" :value="item.desc" is-link :key="index">
        <img slot="icon" width="20" style="display:block;margin-right:5px;" :src="item.iconUrl">
      </cell>
    </group>
    <actionsheet v-model="show1" :menus="menus1" @on-click-menu="click" show-cancel></actionsheet>
  
    <actionsheet v-model="show3" :menus="menus3" @on-click-menu="click" @on-click-menu-delete="onDelete" show-cancel></actionsheet>
  
    <actionsheet v-model="show5" :menus="menus5" show-cancel @on-click-menu="click"></actionsheet>
  
    <toast v-model="showSuccess">删除</toast>
    <qrcode value="http://www.ziwusoft.com/" :size="35" type="img" class="qcode" fg-color="#000000"></qrcode>
  
  </div>
</template>


<script type="text/babel">
import { Qrcode, Cell, XInput, XButton, Actionsheet, Group, XSwitch, Toast } from 'vux'


export default {
  computed: {
    author() {
      return this.$store.state.author
    }
  },
  components: {
    Actionsheet, Cell, Qrcode,
    Group,
    XSwitch,
    Toast,
    XInput, XButton
  },
  data() {
    return {
      cellLists: [
        { link: 'user/set', iconUrl: '../../../static/user-set.png', text: '设置', desc: '' },
        { link: '', iconUrl: '../../../static/user-call.png', text: '联系客服', desc: '029-88227793' },
        { link: 'http://www.ziwusoft.com/', iconUrl: '../../../static/user-cert.png', text: '关于我们', desc: '陕西梦龙科技有限公司' }
      ],
      inputTxt: '',
      show1: false,
      menus1: {
        menu1: '分享给好友',
        menu2: '分享给朋友圈'
      },

      show3: false,
      show5: false,
      menus5: [ {
        label: '默认颜色',
        type: 'primary',
        value: '001'
      }, {
        label: '警告颜色',
        type: 'warn'
      }],
      showSuccess: false,
      menus3: {
        'title.noop': 'Are you sure?<br/><span style="color:#666;font-size:12px;">Once deleted, you will never find it.</span>',
        delete: '<span style="color:red">Delete</span>'
      }
    }
  },
  filters: {
    cents(value) {
      return (value / 100).toFixed(2);
    }
  },
  methods: {
    click(key) {
      console.log(key)
    },
    onDelete() {
      this.showSuccess = true
    }
  }
}
</script>

<style scoped>
.avatar {
  text-align: center;
  width: px2rem(160px);
  height: px2rem(160px);
  margin: 0 auto;
  border: 2px solid rgba(255, 255, 255, 0.95);
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}
.qcode {
  text-align: right;
  margin-top: 60px;
  top: 0.5rem;
  display: block;
  position: absolute;
  right: 15px;
}
</style>
