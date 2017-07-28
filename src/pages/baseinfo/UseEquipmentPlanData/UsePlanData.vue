<template>
  <div style="height:100%;">
    <div v-show="!alertVisible">
      <button-tab v-model="demo" style="padding: 5px;margin:0px 15px;">
        <button-tab-item @on-item-click="consoleIndex()">待审批
          <badge v-if="messagenum !== 0" :text="messagenum"></badge>
        </button-tab-item>
        <button-tab-item @on-item-click="consoleSuccess()">已审批</button-tab-item>
        <span class="left-menu" v-on:click="coverShow = !coverShow"></span>
      </button-tab>
      <search v-if="coverShow" placeholder="请输入申请人姓名" :auto-fixed="false" class="search" v-model="serchstr" @on-focus="onFocus" @on-cancel="coverShow = !coverShow"></search>
      <!-- 使用计划审批列表 -->
      <scroller v-model="scrollerStatus" height="-110" lock-x scrollbar-y ref="scroller" :bounce="isbounce" :use-pullup="showUp" :pullup-config="upobj" @on-pullup-loading="selPullUp">
        <div class="box2" style="padding:10px 0;overflow:scroll;-webkit-overflow-scrolling:touch;">
          <p v-for="(list,index) in newUsers" :key="index">
            <form-preview header-label="申请人" :header-value="list.AddName" :bodyItems="list" :footer-buttons="buttons1" :name="list"></form-preview>
          </p>
          <hr>
        </div>
        <load-more :show-loading="false" tip="暂无数据" background-color="#fbf9fe"></load-more>
      </scroller>
      <toast v-model="showToast" text="已加载全部数据"></toast>
    </div>
    <!--详情页面-->
    <transition name="fade">
      <childdetail :parentdate="arr" v-if="alertVisible" @listenTochildEvent="showMsgFromchild"></childdetail>
    </transition>
  
  </div>
</template>

<script>
import { LoadMore, Badge, ButtonTab, ButtonTabItem, Toast, Search, FormPreview, Scroller } from 'vux'
import { mapGetters } from 'vuex'
import api from '../../../fetch/api'
import Childdetail from './UsePlanItemData'

export default {
  components: {
    ButtonTab, ButtonTabItem, Badge, Childdetail, LoadMore,
    Search,
    FormPreview,
    Scroller,
    Toast
  },
  data() {
    return {
      showData: false,
      coverShow: false,
      messagenum: 0,
      alertVisible: false,
      arr: [],
      demo: 1,
      serchstr: '',
      logo: {
        pageSize: 9, //每页记录数  
        currentPage: 1, //当前页
        currentUserProjectID: '',
      },
      show: false,
      showToast: false,
      showUp: true,
      isbounce: false,
      isShowAlert: false,
      lists: [],
      buttons1: [{
        style: 'primary',
        text: '查看详情',
        onButtonClick: (name) => {
          this.arr = name
          this.alertVisible = true
        }
      }],
      upobj: {
        content: '请上拉刷新数据',
        pullUpHeight: 60,
        height: 40,
        autoRefresh: false,
        downContent: '上拉刷新',
        upContent: '释放开始刷新',
        loadingContent: '刷新中...',
        clsPrefix: 'xs-plugin-pullup-'
      },
      isShowLoading: false,
      textLoading: '加载中',
      scrollerStatus: {
        pullupStatus: 'default'
      }
    }
  },
  computed: {
    newUsers: function () {   //实现过滤器
      var key = this.serchstr;
      var lists = this.lists;
      let that = this
      return lists.filter(function (user) {
        if (that.demo === 0) {
          let key = '待审核';
          if (user.state.indexOf(key) !== -1) {
            that.showData = false;
            that.$refs.scroller.reset({ top: 0 });            
            return user;
          } else {
            if (that.messagenum == 0) {
              that.showData = true;
            }
          }
        }
        else if (that.demo === 1) {
          let key = '已审核';
          return user.state.indexOf(key) !== -1;
        }
        else {
          return user.AddName.toLowerCase().indexOf(key.toLowerCase()) != -1
        }

      })
    },
    ...mapGetters({
      getUserData: 'getUserData',
    })

  },
  mounted() {
    if (this.getUserData.RoleNode == '0203') { //子分公司管理员   
      this.getMeetList()
    }
    this.$nextTick(() => {
      this.$refs.scroller.reset()
    })
  },
  methods: {
    showMsgFromchild(val) {
      this.logo.currentPage = 1
      this.messagenum=0
      this.newUsers=[]
      this.lists=[]
      this.getMeetList()
      this.alertVisible = val
      this.$nextTick(() => {
        this.$refs.scroller.reset({ top: 0 })
      })
    },
    onFocus() {
      this.demo = 2
    },
    consoleIndex() {
      this.demo = 0
    },
    consoleSuccess() {
      this.demo = 1
    },
    getMeetList() {
      let _this = this
      _this.logo.currentUserProjectID = _this.getUserData.DeptNodebh
      let params = this.logo;
      api.GetUsePlanData(params).then(response => {
        // sucess callback
        let data = JSON.parse(response);
        if (data && data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            var meetlist = []
            var obj = {
              label: '申请单位',
              value: data[i].ProjectName
            }
            meetlist.push(obj)
            obj = {
              label: '计划日期',
              value: data[i].PlanDate
            }
            meetlist.push(obj)
            obj = {
              label: '设备名称',
              value: data[i].EquipmentName
            }
            meetlist.push(obj)
            obj = {
              label: '规格',
              value: data[i].EquipmentStandard
            }
            meetlist.push(obj)
            obj = {
              label: '进场时间',
              value: data[i].EntryDate
            }
            meetlist.push(obj)
            obj = {
              label: '数量',
              value: data[i].Quantity
            }
            meetlist.push(obj)
            meetlist.PlanID = data[i].ApplicatioID
            meetlist.ProjectID = data[i].ProjectID
            meetlist.AddName = data[i].AddName
            meetlist.ApprovalFlag = data[i].ApprovalFlag

            var mstate = '已审核'

            if (this.getUserData.RoleNode == '0203') { //子分公司管理员  //0未审核，1审批同样，2驳回
              if (data[i].ApprovalFlag === 0) { mstate = '待审核'; _this.messagenum++ }
            }
            meetlist.state = mstate //审核状态
            this.lists.push(meetlist)
          }

        } else {
          _this.showToast = true
          _this.scrollerStatus.pullupStatus = 'disabled' // 禁用下拉
          return;
        }
      })
    },
    selPullUp() {
      console.log('上拉刷新')
      this.logo.currentPage++
      this.getMeetList()
      this.$refs.scroller.donePullup()  //完成调用ref的donePullup方法
    }
  },
  activated() {
    this.$refs.scroller.reset()
  }
}
</script>

 <style type="text/css" scoped>
.left-menu {
  position: absolute;
  width: 2rem;
  height: 2rem;
  margin-top: 0.25rem;
  top: 0.5rem;
  right: 0.5rem;
  background: url('../../../assets/search.png') no-repeat;
  background-size: 2rem;
}

.weui-form-preview__value {
  font-size: 1.1em !important;
  color: black;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s
}

.fade-enter,
.fade-leave-to {
  opacity: 0
}
</style>