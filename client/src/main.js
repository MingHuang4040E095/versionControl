import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'

// import { LMap, LTileLayer, LMarker, LPopup, LControlZoom } from 'vue2-leaflet'
// import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'
// import 'leaflet/dist/leaflet.css'
// Vue.component('l-map', LMap)
// Vue.component('l-tile-layer', LTileLayer)
// Vue.component('l-marker', LMarker)
// Vue.component('l-popup', LPopup)
// Vue.component('v-marker-cluster', Vue2LeafletMarkerCluster)
// Vue.component('l-control-zoom', LControlZoom)

Vue.config.productionTip = false
Vue.prototype.$http = axios

new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
}).$mount('#app')
