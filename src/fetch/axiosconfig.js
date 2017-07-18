import axios from 'axios'
import qs from 'qs'
import stores from '../vuex/store'

// axios 配置
axios.defaults.timeout = 50000; //请求响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.baseURL = 'http://117.34.112.55:8040/AppEquipmentService.asmx';

//POST传参序列化
axios.interceptors.request.use((config) => { 
  stores.dispatch('setLoadingState', true)
  // 在发送请求之前做些什么
  if (config.method === 'post') {
    config.data = qs.stringify(config.data);
  }
  return config;
}, (error) => {
  return Promise.reject('错误', error);
});
//过滤掉html
export function xmltojson(str) {
  let data = str.replace(/<[^<]+>/g, '')
  return data;
}

//返回状态判断
axios.interceptors.response.use((res) => { //配置请求回来的信息 
  let response = xmltojson(res.data)
  stores.dispatch('setLoadingState', false)
  return response;
}, (error) => { 
  stores.dispatch('setloginStatus', '此用户不存在')
  stores.dispatch('setLoadingState', false)  
  return Promise.reject(error);
});

export default axios
