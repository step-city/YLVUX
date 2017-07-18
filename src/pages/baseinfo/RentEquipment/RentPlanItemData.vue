<template>
  <div class="modal-mask">
    <div>
    <span class="center-menu">集中租赁详情页</span>      
    <x-button class="left-menu" type="default" @click.native="toBack" text="<返回" mini></x-button>
    </div>
    <p v-for="(list,index) in detail" :key="index">
      <formdetail header-label="序号" :header-value="index+1" :bodyItems="list">
        <selector slot="select" title="租赁模式" :options="list1" v-model="list.RentModel" placeholder="请选择租赁模式" :readonly="showRent"></selector>
      </formdetail>
    </p>
    <timeline v-if="showResult">
      <timeline-item>
        <h4 :class="[radio001Value === '通过' ? 'recent' : '']">审批结果： {{radio001Value}}</h4>
        <p :class="[approvalOpinion !== '' ? 'recent' : '']">审批意见: {{approvalOpinion}}</p>
      </timeline-item>
    </timeline>
    <group v-if="showapproval" title="审批结果">
      <radio :options="options" v-model="radio001Value" @on-change="change"></radio>
      <x-textarea title="审批意见：" placeholder="该项不可为空" :max="200" v-model="approvalOpinion"></x-textarea>
    </group>
    <flexbox style="height:140px; text-align:center;margin-bottom:8px;">
      <flexbox-item>
        <x-button type="primary" plain @click.native="toBack" text="返回"></x-button>
      </flexbox-item>
      <flexbox-item v-show="showico">
        <x-button type="primary" @click.native.prevent="acceptButton" text="提交"></x-button>
      </flexbox-item>
    </flexbox>
  </div>
</template>

<script type="text/babel">
import Formdetail from '../../../components/Formdetail'
import { Radio,Timeline, TimelineItem, Selector, FormPreview, XButton, XTextarea, Group, Flexbox, FlexboxItem, Divider } from 'vux'
import api from '../../../fetch/api'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      showResult:false,
      showico: false,
      radio001Value: '同意',
      options: ['同意', '不同意'],
      showapproval: false,
      showRent: true,
      detail: [],
      approvalOpinion: '',
      list1: ['集团公司集中租赁', '大型设备租赁', '三级公司集中租赁', '项目部自行租赁'],
    }
  }
  ,
  components: {
    Selector, Formdetail, Timeline, TimelineItem,Radio,
    FormPreview,
    XButton,
    XTextarea, Group,
    Flexbox, FlexboxItem,
    Divider
  },
  props: ['parentdate'],
  mounted() {
    if (this.parentdate.state == '待审核') {
      if (this.getUserData.RoleNode === '0203') {//子分公司管理员才可以选择模式  
          this.showRent = false                     
        }
      this.showico=true  //显示提交
      this.showapproval=true  //显示选择意见
    }
    this.getDetailData()
  },
  computed: {
    ...mapGetters(
      ['getUserData']
    )
  },
  methods: {
    toBack() {
      this.$emit('listenTochildEvent', false)//派发给父组建

    },
    change(value) { //是否同意
      this.radio001Value = value
    },
    acceptButton() {
      if (this.getUserData.RoleNode === '0201') {//项目部领导
        this.approvalData()
      } else {
        if (!this.approvalOpinion || !this.detail[0].RentModel) {
          this.$vux.alert.show({
            title: '提示！',
            content: '审批意见或租赁模式不可为空...',
          })
        } else {
          this.fetchDate()
          this.showico = false//隐藏提交按钮
        }
      }
    },
    fetchDate() {  //公司审批集中租赁计划
      let _this = this
      let jsons = JSON.stringify(_this.detail)
      let param = { 'currentUserProjectID': _this.getUserData.DeptNodebh, 'planID': _this.parentdate.PlanID, 'projectID': _this.parentdate.ProjectID, 'approvalOpinion': _this.approvalOpinion, 'IsApproval': _this.radio001Value, 'json': jsons }
      api.RentEquipmentPlanGSApproval(param).then(respose => {
        _this.$vux.toast.show({
          text: respose //'审批成功'
        })
        _this.showapproval=false//隐藏意见
        _this.showResult=true //显示结果
        _this.parentdate.state='已审核'
      }, err => {
        console.log(err)
      })
    },
    approvalData() { //项目部审批，不需要修改租赁模式
      let _this = this
      let param = { 'currentUserProjectID': _this.getUserData.DeptNodebh, 'planID': _this.parentdate.PlanID, 'projectID': _this.parentdate.ProjectID, 'approvalOpinion': _this.approvalOpinion, 'IsApproval': _this.radio001Value }
      api.RentEquipmentPlanApproval(param).then(respose => {
        this.$vux.toast.show({
          text: respose //'审批成功'
        })
        _this.showapproval=false//隐藏意见
        _this.showResult=true //显示结果
        _this.parentdate.state='已审核'        
      }, err => {
        console.log(err)
      })
    },
    getDetailData() {
      let that = this
      let params = {
        'pageSize': '9', 'currentPage': '1', 'projectID': that.parentdate.ProjectID, 'planID': that.parentdate.PlanID
      }
      api.PlanItemDataList(params)
        .then(res => {
          let response = JSON.parse(res);
          var data = response.data
          for (var i = 0; i < data.length; i++) {
            var meetlist = []
            var obj = {
              label: '设备名称',
              value: data[i].EquipmentName
            }
            meetlist.push(obj)
            obj = {
              label: '设备规格',
              value: data[i].EquipmentStandard
            }
            meetlist.push(obj)
            obj = {
              label: '租赁数量',
              value: data[i].Quantity
            }
            meetlist.push(obj)
            obj = {
              label: '租赁方式',
              value: data[i].LeaseModel
            }
            meetlist.push(obj)
            obj = {
              label: '租赁起止时间',
              value: data[i].BeginAndEndTime
            }
            meetlist.push(obj)
            obj = {
              label: '备注',
              value: data[i].Remark
            }
            meetlist.push(obj)
            meetlist.RentModel = data[i].RentModel
            that.detail.push(meetlist)

          }
        })
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
.center-menu{
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