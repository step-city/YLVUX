import Login from '../pages/Login.vue'
import Main from '../pages/Main.vue'
import Page404 from '../pages/Page404.vue'
import Home from '../pages/Home.vue'
import SystemConfig from '../pages/systeminfo/SystemConfig.vue'
import Model1 from '../pages/baseinfo/RentEquipment/Model1.vue'
import UsePlanData from '../pages/baseinfo/UseEquipmentPlanData/UsePlanData.vue'
import NewsList from '../pages/systeminfo/NewsList.vue'
import FurEquipment from '../pages/baseinfo/FurEquipment/FurEquipment.vue'              
import PurchaseEquipment from '../pages/baseinfo/PurchaseEquipment/PurchaseEquipment.vue' 

const routes=[
  {path: '/login', component: Login },      
  {
    path: '/',
    component: Main,
    name: '系统管理',
    children: [
      {path: '/home', component: Home, name: '中铁一局设备管理系统', meta: {requireMenue: true}},
      {path: '/furEquipment', component: FurEquipment, name: '配置计划审批', meta: {requireMenue: false}},
      {path: '/model1', component: Model1 , name: '集中租赁审批', meta: {requireMenue: false}}, 
      {path: '/purchaseEquipment', component: PurchaseEquipment , name: '购置计划审批', meta: {requireMenue: false}},
      {path: '/usePlanData', component: UsePlanData , name: '申请计划审批', meta: {requireMenue: false}}, 
      {path: '/newsList', component: NewsList , name: '微应用', meta: {requireMenue: true}},
      {path: '/systemConfig', component: SystemConfig , name: '系统设置', meta: {requireMenue: true}}, 
      {path: '/*',component: Page404,meta: {requireMenue: false}}      
    ]
  },
      {path: '/*',component: Page404,meta: {requireMenue: false}}      
];

export default routes;