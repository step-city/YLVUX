<template>
  <div>
    <div>
      <span class="center-menu">购置申请审批详情</span>      
      <x-button class="left-menu" type="default" @click.native="toBack" text="<返回" mini></x-button>
      <x-button class="right-menu" v-if="!showapproval" type="warn" @click.native.prevent="_cancelApproval" text="撤销审批" mini></x-button>
    </div>
    <p v-for="(list,index) in detail" :key="index">
      <formdetail header-label="序号" :header-value="index+1" :bodyItems="list">
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

<script > 
import Formdetail from '../../../components/Formdetail'
import { Timeline, TimelineItem, Radio, XButton, XTextarea, Group, Flexbox, FlexboxItem, Divider } from 'vux'
import api from '../../../fetch/api'
import { mapGetters } from 'vuex'

export default {
  components: {
    Radio, Formdetail, TimelineItem, Timeline,
    XButton,
    XTextarea, Group,
    Flexbox, FlexboxItem,
    Divider
  },
  data() {
    return {
      showResult: false,
      showico: false,
      selectradio: 1,
      radio001Value: '通过',
      options: ['通过', '驳回'],
      showapproval: false,
      detail: [],
      approvalOpinion: '',
    }
  },
  // props:['parentdate'], 
  props: {
    parentdate: {
      type: Array,
      default: () => []
    },
  },
  mounted() {
    if (this.parentdate.state == '待审核') {
      this.showico = true  //显示提交
      this.showapproval = true  //显示选择意见
    }
    this.getDetailData()
    if (this.radio001Value === '通过') {
        this.selectradio = 1
      } else if(value === '驳回') {
        this.selectradio = 2
    }
  },
  computed: {
    ...mapGetters(
      ['getUserData']
    )
  },
  methods: {
    change(value) { //是否同意, 同意1不同意2
      this.radio001Value = value
    },
    toBack(e) { //返回
      this.$emit('listenTochildEvent', false)
    },
    _cancelApproval() {
      let _this = this
      _this.selectradio = 0
      let user = JSON.parse(sessionStorage.getItem('user'));
      let param = { 'planID': _this.parentdate.PlanID, 'projectID': _this.parentdate.ProjectID, 'userName': user, 'approvalOpinion': _this.approvalOpinion, 'IsApproval': _this.selectradio }
      api.PurchaseEquipmentPlanApprover(param).then(respose => {
        _this.$vux.toast.show({
          text: '撤销审批成功'
        })
        _this.parentdate.state = '待审核'
        _this.toBack()
      }, err => {
        console.log(err)
      })
    },
    acceptButton() {
      if (!this.approvalOpinion) {
        this.$vux.alert.show({
          title: '提示！',
          content: '审批意见不可为空...',
        })
      } else {
        this.fetchDate()
        this.showico = false//隐藏提交按钮
      }
    },
    fetchDate() {  //集团公司审批
      let _this = this
      let user = JSON.parse(sessionStorage.getItem('user'));
      let param = { 'planID': _this.parentdate.PlanID, 'projectID': _this.parentdate.ProjectID, 'userName': user, 'approvalOpinion': _this.approvalOpinion, 'IsApproval': _this.selectradio }
      api.PurchaseEquipmentPlanApprover(param).then(respose => {
        this.$vux.toast.show({
          text: respose //'审批成功'
        })
        this.showapproval = false//隐藏意见
        this.showResult = true //显示结果
        _this.parentdate.state = '已审核'
      }, err => {
        console.log(err)
      })
    },
    getDetailData() { //获取详情
      let that = this
      let params = {
        'pageSize': '10', 'currentPage': '1', 'projectID': that.parentdate.ProjectID, 'planID': that.parentdate.PlanID
      }
      api.GetPurchaseEquipmentPlanItemData(params)
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
              label: '型号',
              value: data[i].EquipmentModel
            }
            meetlist.push(obj)
            obj = {
              label: '租赁数量',
              value: data[i].Quantity
            }
            meetlist.push(obj)

            obj = {
              label: '预购单价(元)',
              value: data[i].Price
            }
            meetlist.push(obj)
            obj = {
              label: '预购金额(元)',
              value: data[i].PurchaseSum
            }
            meetlist.push(obj)
            obj = {
              label: '资金来源',
              value: data[i].FundSource
            }
            meetlist.push(obj)
            obj = {
              label: '进场日期',
              value: data[i].EntryDate
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


