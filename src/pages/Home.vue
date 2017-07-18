<template>
  <div>
    <swiper :list="list" :min-moving-distance="20" style="margin:0 auto;" :aspect-ratio="300/800" loop auto dots-position="center"></swiper>
    <group-title>公告：</group-title>
    <swiper auto height="30px" direction="vertical" :interval=2000 class="text-scroll" :show-dots="false">
      <swiper-item>
        <p>中铁主要施工设备租赁指导单价的通知</p>
      </swiper-item>
      <swiper-item>
        <p>分公司管理员操作手册</p>
      </swiper-item>
      <swiper-item>
        <p>专业公司简易操作手册</p>
      </swiper-item>
      <swiper-item>
        <p>项目部管理使用手册</p>
      </swiper-item>
      <swiper-item>
        <p>关于公司批量修改净值的问题</p>
      </swiper-item>
      <swiper-item>
        <p>关于规范租赁有关规定的通知</p>
      </swiper-item>
    </swiper>  
  </div>
</template>

<script type="text/babel">
import {  GroupTitle, SwiperItem, Swiper} from 'vux'

export default {
  components: {
    GroupTitle, SwiperItem, Swiper
  },
  data() {
    return {
      list: [{
        url: '',
        img: '../../static/logo1.jpg',
        title: '集中租赁计划审批'
      }, {
        url: '',
        img: '../../static/logo2.jpg',
        title: '配置计划审批'
      }, {
        url: '',
        img: '../../static/logo3.jpg',
        title: '申请计划审批'
      }]
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.weui-grid {
  display: block;
  text-align: center;
  color: rgb(240, 20, 20);
}
.weui-msg {
    padding-top: 13px;
    text-align: center;
}
</style>
