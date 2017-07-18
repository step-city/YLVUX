
<template>
  <div id="app" class="dynamicmodel">
        <loading v-model="loading"></loading> 
		    <keep-alive>
								<transition name="fade">
									<router-view transition-mode="out-in"></router-view>
								</transition>
        </keep-alive>
  </div>
</template>
  
<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { Loading } from 'vux'


export default {
  name: 'app',
    components: {
      Loading
	},
    computed: {
      ...mapGetters([
          'loading'  
      ]),

}
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/1px.less';
@import '~vux/src/styles/close.less';
body {
  background-color: #fbf9fe;
  left: 0;
  bottom: 0;
  width: 100%;
  margin-top: 46px;
}

.fade-transition {
  transition: opacity .2s ease;
} 

.fade-enter, .fade-leave {
  opacity: 0;
}
.fade-enter, .fade-leave-to{
  opacity: 0
}
.dynamicmodel{
    	padding:0px;
				margin:0px;
				height:100%;
				overflow:auto;
}			
</style>
