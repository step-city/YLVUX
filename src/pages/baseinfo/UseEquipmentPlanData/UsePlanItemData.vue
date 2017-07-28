<template>
  <div>
    <div>
      <span class="center-menu">使用申请审批详情</span>      
      <x-button class="left-menu" type="default" @click.native="toBack" text="<返回" mini></x-button>
      <x-button class="right-menu" v-if="!showapproval" type="warn" @click.native.prevent="_cancelApproval" text="撤销审批" mini></x-button>
    </div>
    <div v-if="description.length>0">
      <p v-for="(list,index) in description" :key="index">
        <formdetail header-label="序号" :header-value="index+1" :bodyItems="list">
          <div class="cartcontrol-wrapper" v-if="showapproval" slot="select">
            <x-button type="primary" mini @click.native="toDelete(list.ItemID)" text="删除"></x-button>
            <x-button type="primary" mini @click.native.prevent="showScrollBox=true" text="添加"></x-button>
          </div>
        </formdetail>
      </p>
    </div>
    <div class="cartcontrol-wrapper" v-if="description.length === 0" slot="select">
      <x-button type="primary" mini @click.native.prevent="showScrollBox=true" text="添加"></x-button>
    </div>
  
    <timeline v-if="showResult">
      <timeline-item>
        <h4 :class="[radio001Value === '通过' ? 'recent' : '']">审批结果： {{radio001Value}}</h4>
      </timeline-item>
    </timeline>
    <group v-if="showapproval" title="审批结果">
      <radio :options="options" v-model="radio001Value" @on-change="change"></radio>
    </group>
    <flexbox style="height:140px; text-align:center;margin-bottom:8px;">
      <flexbox-item>
        <x-button type="primary" plain @click.native="toBack" text="返回"></x-button>
      </flexbox-item>
      <flexbox-item v-show="showico">
        <x-button type="primary" @click.native.prevent="acceptButton" text="提交"></x-button>
      </flexbox-item>
    </flexbox>
    <div>
      <x-dialog v-model="showScrollBox" class="dialog-demo" :dialog-style="{'max-width': '100%', width: '100%', height: '50%'}">
        <p class="dialog-title">添加来源</p>
        <div class="img-box" style="height:200px;padding:1px 1px;overflow:scroll;-webkit-overflow-scrolling:touch;">
          <x-number title="审批数量*" v-model="detail.ApploveQuantity" :min="0" fillable :readonly="showResult"></x-number>
          <selector title="设备来源*" :options="list1" v-model="detail.EquipmentSource" placeholder="请选择设备来源" @on-change="_changeEquipSource" :readonly="showResult"></selector>
          <selector title="租赁公司" :options="listManage" v-model="detail.ManageDeptName" placeholder="请选择租赁公司" @on-change="_changeManage" :readonly="showManage"></selector>
          <x-input title="备注:" v-model="detail.Remark" placeholder="备注信息"></x-input>
        </div>
        <div style="margin-top:-15px;">
          <x-button type="primary" mini @click.native="submit" text="提交"></x-button>
          <x-button type="warn" mini @click.native.prevent="showScrollBox=false" text="取消"></x-button>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6"> 
import Formdetail from '../../../components/Formdetail'
import { Flexbox, FlexboxItem, Timeline, TimelineItem, XDialog, XInput, XNumber, Radio, Cell, Selector, XButton, Group } from 'vux'
import api from '../../../fetch/api'
import { mapGetters } from 'vuex'

export default {
  components: {
    Selector, Radio, XNumber, XInput, XDialog, Formdetail, Timeline, TimelineItem, Flexbox, FlexboxItem,
    XButton,
    Group, Cell
  },
  data() {
    return {
      showResult: false,
      showico: false,
      manage: [],
      showScrollBox: false,
      isApproval: 1,
      submittext: '提交',
      showManage: true,
      radio001Value: '通过',
      options: ['通过', '驳回'],
      showapproval: false,
      detail: { ProjectID: '', ItemID: null, ApplicatioID: '', ApploveQuantity: 0, EquipmentSource: '', ManageDeptID: '', ManageDeptName: '', Remark: '' },
      list1: ['设备调拨', '内部租赁', '外部租赁', '协作队伍自带', '新购'],
      listManage: [],
      logoMsg: "设备租赁审批",
      description: [],
    }
  },
  props: ['parentdate'],
  computed: {
    ...mapGetters(
      ['getUserData']
    ),
  },
  mounted() {
    if (this.parentdate.state === '已审核') {
      this.showico = false
      this.showapproval = false
      this.showManage = true //默认不可编辑
    } else {
      this.showico = true
      this.showapproval = true
      this.fetchManage()
    }
    this.getDetailData()

  },
  methods: {
    toDelete(val) {
      let _this = this
      this.$vux.confirm.show({
        title: '确认',
        content: '确实要删除吗？',
        onConfirm() {
          let param = { 'projectID': _this.parentdate.ProjectID, itemID: val }
          api.UsePlanItemDelete(param).then(res => {
            if (res.indexOf("删除成功") != -1) {
              _this.description = []
              _this.getDetailData()
              _this.$vux.toast.show({
                text: '删除成功'
              })
            }
          }, error => {
            console.log(error)
          })
        }
      })
    },
    submit() { //设备来源提交
      let _this = this
      if (_this.detail.ApploveQuantity === 0 || _this.detail.EquipmentSource === '') {
        _this.$vux.alert.show({
          title: '提示！',
          content: '审批数量或设备来源不可为空...',
        })
      } else {
        _this.detail.ProjectID = _this.parentdate.ProjectID
        _this.detail.ApplicatioID = _this.parentdate.PlanID
        let data = JSON.stringify(_this.detail)
        let param = { 'json': data }
        api.UsePlanApprovalDetail(param).then(res => {
          if (res.indexOf("审批成功") != -1) {
            _this.showScrollBox = false
          }
          this.$vux.toast.show({
            text: '添加成功!'
          })
          _this.description = []
          _this.getDetailData()
        }, error => {
          console.log(error)
        })
      }
    }
    ,
    _changeManage(val) { //改变部门id
      let that = this
      for (var i = 0; i < that.manage.length; i++) {
        let data = that.manage[i].DepartmentName
        let Nodebh = that.manage[i].DepartmentNodebh
        if (data === val) {
          that.detail.ManageDeptID = Nodebh
        }
      }
    },
    _changeEquipSource(val) {//改变租赁方式
      this.detail.EquipmentSource = val
      if (this.detail.EquipmentSource === '内部租赁') {
        this.showManage = false
        this.detail.ManageDeptName = ''
      } else {
        this.showManage = true
        this.detail.ManageDeptName = ''
      }
    },
    fetchManage() {  //获取租赁公司
      let _this = this
      let param = { 'currentUserProjectID': _this.getUserData.DeptNodebh }
      api.GetManageDepartment(param).then(res => {
        let response = JSON.parse(res);
        _this.manage = response
        for (var i = 0; i < response.length; i++) {
          let data = response[i].DepartmentName
          _this.listManage.push(data)
        }
      }, error => {
        console.log(error)
      })
    },
    change(value) { //是否同意 1通过2驳回
      this.radio001Value = value
      if (this.radio001Value === '通过') {
        this.isApproval = 1
      } else if (this.radio001Value === '驳回') {
        this.isApproval = 2
      }
    },
    toBack() { //返回
      this.$emit('listenTochildEvent', false)//派发给父组建
    },
    acceptButton() {
      if (!this.radio001Value) {
        this.$vux.alert.show({
          title: '提示！',
          content: '审批意见不可为空！',
        })
      } else {
        this.fetchDate()
        this.showico = true
      }
    },
    _cancelApproval() {
      let _this = this
      _this.isApproval = 0
      let user = JSON.parse(sessionStorage.getItem('user'));
      let param = { 'projectID': _this.parentdate.ProjectID, 'applicatioID': _this.parentdate.PlanID, 'IsApproval': _this.isApproval, 'userName': user }
      api.UsePlanApproval(param).then(respose => {
        this.$vux.toast.show({
          text: '撤销审批成功'
        })
        _this.toBack()
      }, err => {
        console.log(err)
      })
    },
    fetchDate() {
      let _this = this
      let user = JSON.parse(sessionStorage.getItem('user'));
      let param = { 'projectID': _this.parentdate.ProjectID, 'applicatioID': _this.parentdate.PlanID, 'IsApproval': _this.isApproval, 'userName': user }
      api.UsePlanApproval(param).then(respose => {
        this.$vux.toast.show({
          text: '审批成功'
        })
        _this.showapproval = false
        _this.showManage = true
        _this.showResult = true
        _this.showico = false
      }, err => {

        console.log(err)
      })
    },
    getDetailData() {   // 获取使用申请计划审批详情
      let that = this
      let params = {
        'pageSize': '9', 'currentPage': '1', 'projectID': that.parentdate.ProjectID, 'planID': that.parentdate.PlanID
      }
      api.GetUsePlanItemData(params)
        .then(res => {
          let response = JSON.parse(res);
          var data = response.data
          if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
              var meetlist = []
              var obj = {
                label: '数量',
                value: data[i].ApploveQuantity
              }
              meetlist.push(obj)
              obj = {
                label: '设备来源',
                value: data[i].EquipmentSource
              }
              meetlist.push(obj)
              obj = {
                label: '租赁公司',
                value: data[i].ManageDeptName
              }
              meetlist.push(obj)
              obj = {
                label: '备注',
                value: data[i].Remark
              }
              meetlist.push(obj)
              meetlist.ItemID = data[i].ItemID
              that.description.push(meetlist)
            }
          }
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.cartcontrol-wrapper {
  float: right;
}

.right-menu {
  position: absolute;
  width: 5rem;
  height: 2rem;
  margin-top: 0.25rem;
  top: 0.25rem;
  right: 0.25rem;
  font-size: 12px;
  color: #00DD77;
  background-size: 2rem;
  /*background-color: RGB(0, 122, 204);*/
}

.left-menu {
  position: absolute;
  width: 5rem;
  height: 2rem;
  margin-top: 0.25rem;
  top: 0.25rem;
  left: 0.25rem;
  font-size: 15px;
  color: #00DD77;
  background-size: 2rem;
  background-color: RGB(0, 122, 204);
}

.center-menu {
    position: absolute;
    width: 100%;
    float: right;
    text-align: center;
    height: 30px;
    line-height: 25px;
    top: 0.6rem;
    font-size: 18px;
    color: #fff;
    background-color: RGB(0, 122, 204);
}
</style>


