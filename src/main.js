import Vue from 'vue'
import Notifications from 'vue-notification'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faClone,faUpload,faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faClone,faUpload,faGithub,faArrowLeft)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false
Vue.use(Notifications)
Vue.filter('truncate', function (text, stop, clamp) {
  return text.replace('https://','').slice(0, stop) + (stop < text.length ? clamp || '..' : '')
})
new Vue({
  render: h => h(App),
}).$mount('#app')
