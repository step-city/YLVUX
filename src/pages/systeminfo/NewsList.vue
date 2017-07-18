<template>
  <div>
    <tab :line-width="2" v-model="index">
      <tab-item :selected="tag === item" v-for="item in taglist" :key="item.id" @click="tag = item">{{item}}</tab-item>
    </tab>
    <div v-if="index === 0">
      <!--<news-list></news-list>-->
    </div>
    <div v-if="index === 1">
      <!--<blog-list></blog-list>-->
    </div>
    <div v-if="index === 2">
      <!--<question-list></question-list>-->
    </div>
    <div v-if="index === 3">
      <!--<event-list></event-list>-->
    </div>
  </div>
</template>
<style scope>

</style>
<script>
import { Tab, TabItem } from 'vux'


const list = () => ['资讯', '博客', '问答', '活动']

export default {

  components: {
    Tab,
    TabItem,
  },
  data() {
    return {
      tag: '资讯',
      taglist: list(),
      index: 0
    }
  },
  ready() {
  },
  methods: {
  }
}
</script>
