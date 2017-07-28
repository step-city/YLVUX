<template>
    <div>
        <x-header :left-options="{showBack: false}" title="中铁一局设备管理系统" class="header" style="width:100%;position:absolute;left:0;top:0;"></x-header>
        <div style="text-align:center">
            <img src="../../static/logo.png"></x-img>
        </div>
        <group>
            <x-input ref="userCode" title="用户名" type="text" v-model.trim="loginForm.userCode" required placeholder="请输入账号" is-type="text" :min="1">
            </x-input>
        </group>
        <group>
            <x-input ref="password" title="密 码" type="password" required v-model.trim="loginForm.password" placeholder="请输入密码" is-type="password" :min="1">
            </x-input>
        </group>
        <div style="padding:15px;">
            <x-button @click.native="_login" type="primary" text="登录"></x-button>
            <x-button @click.native="_resetForm" type="warn" text="取消"></x-button>
        </div>
    </div>
</template>
 
<script type="text/babel">
import { mapActions, mapGetters } from 'vuex'
import api from '../fetch/api'
import { XInput, Group, XButton, Cell, XHeader } from 'vux'
export default {
    components: {
        XInput,
        XButton,
        Group,
        Cell,
        XHeader
    },
    data() {
        return {
            err:'',
            loginForm: {
                userCode: 'admin',//liuqijiang
                password: ''
            }
        }
    },
    computed: {
        ...mapGetters([
            'loginStatus'
        ])
    },
    methods: {
        ...mapActions({
            setUserInfo: 'setUserInfo',
            setSignOut: 'setSignOut',
            getUserData: 'getUserData',
            setloginStatus:'setloginStatus'
        }),
        _resetForm() {
            this.$refs.userCode.reset()
            this.$refs.password.reset()
        },
        _login() {
            let that = this
            if (!that.loginForm.userCode || !that.loginForm.userCode) {
                that.$vux.alert.show({
                    title: '登录异常！',
                    content: '请填写完整'
                })
                return
            } else {
                let data = that.loginForm;
                api.Login(data)
                    .then(res => {
                        let name = JSON.stringify(that.loginForm.userCode)
                        sessionStorage.setItem('user', name);   
                        that.setloginStatus(res)                     
                        let data = JSON.parse(res)
                        that.getUserData(data[0])
                        that.setUserInfo(data)
                        that.$vux.toast.show({
                            text: '登录成功，欢迎您使用本系统...',
                            type: "text",
                            position: 'top',
                            width: "15em"
                        })
                        that.$router.replace('/home')
                    })
                    .catch(error => {
                        that.$vux.alert.show({
                            title: '登录异常！',
                            content: that.loginStatus,
                            onHide() {
                                    that.$refs.userCode.reset()
                                    that.$refs.password.reset()
                            }
                        })
                        return
                    })
            }

        },
        mounted() {
            this.setSignOut()
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header {
    /*background-color: #0077FF; */
    background-color: RGB(0, 122, 204);
}
</style>