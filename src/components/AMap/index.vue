<template>
  <div class="w-full h-full">
    <div id="a-map-box" class="w-full h-full"></div>
  </div>
</template>

<script setup>
import AMapLoader from '@amap/amap-jsapi-loader';
import { onMounted, onUnmounted } from 'vue';

defineOptions({ name: 'AMap' });
window._AMapSecurityConfig = {
  securityJsCode: import.meta.env.VITE_AMAP_SECRET,
};
let map = null;

onMounted(() => {
  AMapLoader.load({
    key: import.meta.env.VITE_AMAP_AK, // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ['AMap.Scale'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((AMap) => {
      map = new AMap.Map('a-map-box', {
        // 设置地图容器id
        viewMode: '3D', // 是否为3D地图模式
        zoom: 15, // 初始化地图级别
        center: [116.397428, 39.90923], // 初始化地图中心点位置
      });
    })
    .catch((e) => {
      console.log(e);
    });
});

onUnmounted(() => {
  map?.destroy();
});
</script>

<style lang="less" scoped></style>
