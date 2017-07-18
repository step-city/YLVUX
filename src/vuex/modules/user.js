import api from '../../fetch/api'
import * as types from '../types'

const state = {
    // 用户登录状态
    loginStatus: [],
    // 用户登录信息
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || {},
    // 用户数据信息
    userData: JSON.parse(localStorage.getItem('userData')) || []
}

const actions = {
    /**
     * 用户状态
     */
    setloginStatus({ commit }, res) {
      
        commit(types.SET_LOGIN_STATUS, res)      
    },
    /**
     * 用户登录
     */
    setUserInfo({ commit }, res) {
        localStorage.setItem('userInfo',JSON.stringify(res))
        commit(types.SET_USER_INFO, res)
    },

    /**
     * 退出登录
     */
    setSignOut({ commit }) {
        localStorage.removeItem('userInfo')
        localStorage.removeItem('userData')
        commit(types.SET_USER_INFO, {})
        commit(types.SET_LOGIN_STATUS, [])
        commit(types.GET_USER_DATA, [])
    },

     /**
     * 请求用户信息
     */
    getUserData({ commit }, params) {
        localStorage.setItem('userData', JSON.stringify(params))    
        commit(types.GET_USER_DATA,params)
    
    }
    
}

const getters = {
    getUserData: state => state.userData,
    loginStatus: state => state.loginStatus,
    userInfo: state => state.userInfo
}

const mutations = {
    [types.SET_USER_INFO](state, res) {
        state.userInfo = res
    },

    [types.SET_LOGIN_STATUS](state, status) {
        state.loginStatus = status
    },

    [types.GET_USER_DATA](state, res) {
        state.userData = res
    }
    
}

export default {
    state,
    actions,
    getters,
    mutations
}