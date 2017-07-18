<template>
  <div>
    <div>
      <span class="center-menu">配置计划审批详情</span>      
      <x-button class="left-menu" type="default" @click.native="toBack" text="<返回" mini></x-button>
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
import { Radio, Timeline, TimelineItem, XButton, XTextarea, Group, Flexbox, FlexboxItem, Divider } from 'vux'
import api from '../../../fetch/api'
import { mapGetters } from 'vuex'

export default {
  components: {
    XButton, Formdetail, Timeline, TimelineItem, Radio,
    XTextarea, Group,
    Flexbox, FlexboxItem,
    Divider
  },
  data() {
    return {
      showResult: false,
      showico: false,
      furdate: {},
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
    this.getFurdate()
      if (this.radio001Value === '通过') {
        this.furdate[0].ApprovalFlag = 1
      } else {
        this.furdate[0].ApprovalFlag = 2
      }

  },
  computed: {
    ...mapGetters(
      ['getUserData']
    ),
    nowdate: function () {
      let now = new Date()
      let cmonth = now.getMonth() + 1
      let day = now.getDate()
      if (cmonth < 10) cmonth = '0' + cmonth
      if (day < 10) day = '0' + day
      return now.getFullYear() + '-' + cmonth + '-' + day
    }
  },
  methods: {
    change(value) { //是否同意
      this.radio001Value = value
    },
    toBack() { //返回
      this.$emit('listenTochildEvent', false)
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
    fetchDate() {  //子公司审批
      let _this = this
      _this.furdate[0].ApprovalOpinion = _this.approvalOpinion
      _this.furdate[0].ApprovalDate = _this.nowdate
      let user = JSON.parse(sessionStorage.getItem('user'));
      _this.furdate[0].Approver = user
      let jsons = JSON.stringify(_this.furdate)
      let param = { 'json': jsons }
      api.GetEquipmentFurPlanApproval(param).then(respose => {
        this.$vux.toast.show({
          text: respose //'审批成功'
        })
        _this.showapproval = false//隐藏意见
        _this.showResult = true //显示结果
        _this.parentdate.state = '已审核'
      }, err => {
        console.log(err)
      })
    },
    getFurdate() {  //获取配置计划审批
      let _this = this
      let pams = { 'pageSize': '10', 'currentPage': '1', 'currentUserProjectID': _this.getUserData.DeptNodebh, 'planCode': _this.parentdate.PlanCode }
      api.GetFurEquipmentPlanData(pams).then(response => {
        let res = JSON.parse(response);
        _this.furdate = res.data;
      }, err => {
        console.log('错误', err)
      })
    },
    getDetailData() { //获取详情
      let that = this
      let params = {
        'pageSize': '10', 'currentPage': '1', 'projectID': that.parentdate.ProjectID, 'planID': that.parentdate.PlanID
      }
      api.GetFurEquipmentPlanItemData(params)
        .then(res => {
          let response = JSON.parse(res);
          let data = response.data
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
              label: '调拨数量',
              value: data[i].AllotNum
            }
            meetlist.push(obj)
            obj = {
              label: '新购数量',
              value: data[i].NewNum
            }
            meetlist.push(obj)
            obj = {
              label: '租赁数量',
              value: data[i].LeaseNum
            }
            meetlist.push(obj)
            obj = {
              label: '协作队伍',
              value: data[i].CooperationTeamNum
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
        }, (err) => {
          console.log('请求错误', err)
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


