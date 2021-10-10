<template>
    <div class="mapGeneral">
        <!-- <div style="height: 100%;"> -->
        <div>{{ value }}</div>
        <div>{{ name }}</div>
        <l-map :zoom="zoom" :center="mapLocation_computed" :options="mapOptions" @update:center="getCenter">
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <!-- <l-control-zoom position="bottomleft"></l-control-zoom> -->
            <v-marker-cluster ref="clusterRef">
                <l-marker v-if="coordinate_marker.length" :lat-lng="coordinate_marker" :icon="icon"></l-marker>
            </v-marker-cluster>
            <!-- <l-marker v-for="(park , index) in displayData" :key="`marker-${index}`" :lat-lng="park.經緯度.split('，')">
                        <l-popup :content="ParkingNews(index)"></l-popup>
                        </l-marker> -->
        </l-map>
        <img class="pin-img" :src="pinImg" />
        <div class="tool-box">
            <button @click="setMarker" style="margin-right:1.5rem">標記</button>
            <button @click="goToMarker">回到標記點位</button>
            <button @click="commit">測試</button>
        </div>
    </div>
</template>
<script>
import { LMap, LTileLayer, LMarker, LPopup, LControlZoom } from 'vue2-leaflet'
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'
import 'leaflet/dist/leaflet.css'
export default {
    components: {
        'l-map': LMap, //主地圖
        'l-tile-layer': LTileLayer, //圖層
        'l-marker': LMarker, //打點
        'l-popup': LPopup, //彈框
        'v-marker-cluster': Vue2LeafletMarkerCluster, //叢集
        'l-control-zoom': LControlZoom, //縮放
    },
    props: {
        //地圖位置
        mapLocation: {
            type: Array,
            default: function() {
                return [22.9977989, 120.2611459]
            },
        },
        name: {
            type: String,
            default: null,
        },
        value: {
            type: Number,
            defalut: null,
        },
    },
    computed: {
        //地圖位置
        mapLocation_computed: {
            get() {
                return this.mapLocation //抓父組件傳過來的值
            },
            set(value) {
                this.$emit('update:mapLocation', value)
            },
        },
    },
    data() {
        return {
            //---------------- ↓ 地圖相關設定  ↓ ----------------
            // url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', //OSM地圖
            url: 'https://wmts.nlsc.gov.tw/wmts/EMAP/default/EPSG:3857/{z}/{y}/{x}', //台灣通用電子地圖
            zoom: 16, //地圖縮放比例
            // mapLocation_computed: [22.9977989, 120.2611459], //初始中心座標
            mapCenter: [22.9977989, 120.2611459], //當前地圖中心座標(針腳的位置)
            // attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors', //右下角
            attribution: '測試', //右下角補充說明文字
            mapOptions: {
                zoomControl: false, //關閉縮放縮放工具
            },
            pinImg: require('@/assets/pin.svg'),
            icon: L.icon({
                iconUrl: require('@/assets/location.svg'),
                iconSize: [50, 50],
                iconAnchor: [25, 50],
            }),

            coordinate_marker: [], //標記點位座標
        }
    },
    methods: {
        //取得地圖中心座標
        getCenter(coordinate) {
            console.log(coordinate)
            this.mapCenter = [coordinate.lat, coordinate.lng]
            this.$emit('currentMapCenter', this.mapCenter)
        },
        //標記點位
        setMarker() {
            this.coordinate_marker = this.mapCenter
            this.$emit('update:mapLocation', this.mapCenter)
            this.$emit('update', this.mapCenter)
        },
        //回到標記點位
        goToMarker() {
            console.log(this.coordinate_marker)
            if (!this.coordinate_marker.length) return
            let condition_lat = this.mapLocation_computed[0] === this.coordinate_marker[0] //當地圖緯度跟標記點一樣時為true
            let condition_lng = this.mapLocation_computed[1] === this.coordinate_marker[1] //當地圖經度跟標記點一樣時為true

            if (condition_lat && condition_lng) {
                //座標完全相同時，先把地圖座標換成當前位置座標，避免無法移動至標記位置
                this.mapLocation_computed = this.mapCenter
            }
            this.$nextTick(() => {
                this.mapLocation_computed = this.coordinate_marker
            })
        },
        tt() {
            alert('tt')
        },
        commit() {
            alert('123')
            this.$emit('commit', 'Map')
        },
    },
    created() {
        let obj = {
            tt: this.tt,
        }
        this.$emit('methods', obj)
    },
}
</script>
<style lang="scss">
.mapGeneral {
    position: relative;
    width: 100%;
    height: 100%;

    border: 2px solid #ccc;
    border-radius: 8px;
    box-shadow: 3px 4px 18px 0px #828282;
    z-index: 1;
    .pin-img {
        position: absolute;
        top: calc(50% - 25px);
        left: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none; //關閉滑鼠事件，讓他可以被穿透
        width: 50px;
        height: auto;
        z-index: 2;
    }

    .vue2leaflet-map {
        z-index: 1;
    }
    .tool-box {
        margin-top: 1rem;
        button {
            background: #5ca6b3;
            // border: 1px solid #103b3a;
            border-radius: 4px;
            box-shadow: 1px 1px 3px 0px #5ca6b3;
            color: #d1e8ee;
            padding: 4px 12px;
        }
    }
}
</style>
