import Vue from 'vue'
import App from './App.vue'
import router from './router'

//Axios
import axios from 'axios'
import VueAxios from 'vue-axios'
axios.defaults.baseURL = '/api';
Vue.use(VueAxios, axios);

//登入狀態驗證
//if backend return unauth
axios.interceptors.response.use(function (response) {
  return response;
  }, function (error) {
  // 401 Unauth
  if(error.response.status === 401 && window.location.pathname != "/login") {
      // redirect to login page
      window.location.href = "/login";
  }
  return Promise.reject(error);
})
router.beforeEach(async(to,from,next)=>{
  if(to.path != '/login') {   
    axios.post('/login_status') // Check login_status
    .then(function(data){
      if(data.data["status"] == true){
        next();
      }else{
        next("/login")
      }
    })
    .catch(function(data){
      next("/login");
    })
  }else{
    next();
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
