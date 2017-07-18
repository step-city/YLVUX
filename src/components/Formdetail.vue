<template>
  <div class="vux-form-preview weui-form-preview">
    <div class="weui-form-preview__bd"  >   
        <label class="weui-form-preview__label">{{headerLabel}}</label>
        <span class="weui-form-preview__value">{{headerValue}}</span>    
      <div class="weui-form-preview__item" v-for="(item,index) in bodyItems" :key="index">
        <label class="weui-form-preview__label" v-text="item.label"></label>
        <span class="weui-form-preview__value" v-text="item.value"></span>
      </div>
    </div>
    <slot name="select"></slot>                
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      headerLabel: String,
      headerValue: Number,
      bodyItems: {
        type: Array
      }
    }
  }

</script>

<style lang="less" scoped>
@import '~vux/src/styles/weui/widget/weui_cell/weui_form/weui-form-preview.less';

  .vux-form-preview {
    overflow: hidden;
  }
</style>
