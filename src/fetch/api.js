import axios from './axiosconfig';

export function fetch(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(response => {
        resolve(response);
      }, err => {
        reject(err);
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export default {

  /***用户登录*/
  Login(params) {return fetch('/UserLogin', params)},
  /*** 获取角色对应的菜单列表*/
  GetRoleModule (params) {return fetch('/GetRoleModule', params)},
  // --------------------------------------------------------------------

  /*** 配置计划审批*/
  GetEquipmentFurPlanApproval(params) {return fetch('/EquipmentFurPlanApproval', params)},
  /*** 获取配置计划审批*/
  GetFurEquipmentPlanData(params) {return fetch('/GetFurEquipmentPlanData', params)},
  /*** 获取配置计划审批详情*/
  GetFurEquipmentPlanItemData(params) {return fetch('/GetFurEquipmentPlanItemData', params)},
  // --------------------------------------------------------------------

  /*** 获取购置申请计划审批*/
  GetPurchaseEquipmentPlanData(params) {return fetch('/GetPurchaseEquipmentPlanData', params)},
  /***获取购置申请审批详情*/
  GetPurchaseEquipmentPlanItemData(params) {return fetch('/GetPurchaseEquipmentPlanItemData', params)},
  /*** 购置申请计划审批*/
  PurchaseEquipmentPlanApprover(params) {return fetch('/PurchaseEquipmentPlanApprover', params)},
  // --------------------------------------------------------------------

  /*** 获取集中租赁计划审批单子,type，0项目部数据1公司级数据2建工集团级数据3集团公司级数据  项目部领导=>0子分公司管理员=>1建工机关管理员=>2集团公司管理员=>3*/
  GetRentEquipmentPlanData(params) {return fetch('/GetRentEquipmentPlanData', params)},
  /*** 获取集中租赁计划审批详情单据,项目编号projectID，单据计划主键planID*/
  PlanItemDataList(params) {return fetch('/GetRentEquipmentPlanItemData', params)},
  /*** 审批集中租赁计划，currentUserProjectID当前项目编号,planID计划id，projectID项目编号，approvalOpinion审批意见，IsApproval是否审批 集团公司、项目部领导、建工公司审批需要*/
  RentEquipmentPlanApproval(params) {return fetch('/RentEquipmentPlanApproval', params)},
  /*** 公司审批集中租赁计划，currentUserProjectID当前项目编号,planID计划id，projectID项目编号，approvalOpinion审批意见，IsApproval是否审批,list租赁模式*/
  RentEquipmentPlanGSApproval(params) {return fetch('/RentEquipmentPlanGSApproval', params)},
  // --------------------------------------------------------------------

  /*** 获取使用申请计划审批*/
  GetUsePlanData(params) {return fetch('/GetUseEquipmentPlanData', params)},
  /*** 获取使用申请计划审批详情*/
  GetUsePlanItemData(params) {return fetch('/GetUseEquipmentPlanItemData', params)},
  /*** 使用申请审批情况,内部租赁注意ManageDeptID，ManageDeptName赋值*/
  UsePlanApprovalDetail(params) {return fetch('/UseManageEquipmentPlanApprovalDetail', params)},
  /*** 使用申请审批,IsApproval 1通过2驳回*/
  UsePlanApproval(params) {return fetch('/UseManageEquipmentPlanApproval', params)},
  /*** 获取租赁公司*/
  GetManageDepartment(params) {return fetch('/GetManageDepartment', params)},
    /*** 删除设备来源*/
  UsePlanItemDelete(params) {return fetch('/UseManageEquipmentPlanItemDelete', params)},
  // --------------------------------------------------------------------

  /*** 获取使用申请管理公司审批*/
  GetUseManagePlanData(params) {return fetch('/GetUseManagePlanData', params)},
  /*** 获取使用申请管理公司审批详情*/
  GetUseManageEquipmentPlanItemData(params) {return fetch('/GetUseManageEquipmentPlanItemData', params)},
  // --------------------------------------------------------------------











}
