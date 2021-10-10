<template>
    <div style="height:550px;width:100%">
        <button @click="childMethodsTest">子組件Methods測試</button>
        <h3>當前座標{{ map_center[0] + ',' + map_center[1] }}</h3>
        <h4>標記點位座標{{ coordinate_marker[0] + ',' + coordinate_marker[1] }}</h4>
        <form @submit.prevent="setCenter">
            <v-text-field label="Another input" v-model="location"></v-text-field>
        </form>
        <!-- <MapGeneral
            :mapLocation.sync="mapLaction"
            @update="updateLocation"
            @currentMapCenter="getCurrentMapCenter"
            @click="tt"
        /> -->
        <router-view @methods="getChildMethods" :value="456" v-on="$listeners"></router-view>
    </div>
</template>
<script>
import MapGeneral from '@/components/MapGeneral.vue'

export default {
    components: {
        MapGeneral,
    },
    data() {
        return {
            //---------------- ↓ 地圖相關設定  ↓ ----------------
            // url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', //OSM地圖
            url: 'https://wmts.nlsc.gov.tw/wmts/EMAP/default/EPSG:3857/{z}/{y}/{x}', //台灣通用電子地圖
            zoom: 16, //地圖縮放比例
            mapLaction: [22.9977989, 120.2611459], //初始中心座標
            map_center: [22.9977989, 120.2611459], //當前地圖中心座標
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
            // coordinate,
            location: [], //座標位置
            childMethods: {},
        }
    },
    methods: {
        setCenter() {
            this.mapLaction = this.location.split(',')
            console.log(this.location)
            console.log(this.mapLaction)
        },
        //更新座標位址
        updateLocation(latlng = []) {
            if (!latlng.length) return
            this.location = latlng
        },
        //取得當前地圖中心點
        getCurrentMapCenter(latlng = []) {
            if (!latlng.length) return
            this.map_center = latlng
        },
        getChildMethods(methods) {
            this.childMethods = methods
        },
        childMethodsTest() {
            this.childMethods.tt()
            this.$emit('test', 'yyy')
        },
    },
}
</script>
<style lang="scss">
.map {
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
    // &::before {
    //     content: '+';
    //     position: absolute;
    //     top: 50%;
    //     left: 50%;
    //     transform: translate(-50%, -50%);
    //     pointer-events: none; //關閉滑鼠事件，讓他可以被穿透
    //     color: #fd8d8dbb;
    //     font-size: 4rem;
    //     z-index: 2;
    // }

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
