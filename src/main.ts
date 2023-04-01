import { createApp } from 'vue'
import router from './router/main'
import App from './App.vue'
// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/js/bootstrap.js';
import './style.css'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* import specific icons */
import { faMagnifyingGlass, faCoffee, faCoins, faBitcoinSign, faXmark, faBars, faCircleInfo, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
import { faHeart, faCircleQuestion } from '@fortawesome/free-regular-svg-icons'
/* add icons to the library */
library.add(faHeart, faCircleQuestion, faCoins, faCoffee,faBitcoinSign, faCircleInfo, faMagnifyingGlass, faXmark, faBars, faHeartSolid)

createApp(App).component('font-awesome-icon', FontAwesomeIcon).use(router).mount('#app')
