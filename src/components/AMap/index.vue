<template>
  <div class="a-map-box w-full h-full">
    <Button
      type="primary"
      :icon="h(ClearOutlined)"
      danger
      class="absolute top-20px left-100px z-10"
      @click="clearOverlays"
      >清除覆盖物</Button
    >
    <DrawingPanel :loaded="loaded"></DrawingPanel>

    <div id="amap" class="w-full h-full"></div>
    <Drawer open title="配置表单" placement="right" :closable="false" :mask="false" :width="400">
      <ConfigForm />
    </Drawer>
  </div>
</template>

<script setup>
import { Button, Select, Drawer } from 'ant-design-vue';
import { h, onMounted, provide, reactive, ref, shallowReactive, shallowRef } from 'vue';
import mitt from 'mitt';
import { ClearOutlined } from '@ant-design/icons-vue';
import AMapLoader from '@amap/amap-jsapi-loader';
import DrawingPanel from '@/components/AMap/DrawingPanel.vue';
import ConfigForm from '@/components/AMap/ConfigForm.vue';
defineOptions({ name: 'AMap' });

const emitter = mitt();
provide('emitter', emitter);
const mapRef = shallowRef();
provide('mapRef', mapRef);
const AMap = shallowRef();
provide('AMap', AMap);
// 存放plugins实例
const plugins = shallowReactive({});
provide('plugins', plugins);
const loaded = ref(false);

const initMap = async () => {
  window._AMapSecurityConfig = {
    securityJsCode: import.meta.env.VITE_AMAP_SECRET,
  };

  try {
    AMap.value = await AMapLoader.load({
      key: import.meta.env.VITE_AMAP_AK, // 申请好的Web端开发者Key，首次调用 load 时必填
      version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: ['Scale', 'MapType', 'MouseTool'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      showIndoorMap: true,
    });

    mapRef.value = new AMap.value.Map('amap', {
      // 设置地图容器id
      viewMode: '3D', // 是否为3D地图模式
      zoom: 15, // 初始化地图级别
      center: [116.397428, 39.90923], // 初始化地图中心点位置
      defaultCursor: 'grab',
    });

    loaded.value = true;
  } catch (e) {
    console.error(e);
  }
};

const initPlugins = () => {
  // 实例化比例尺
  AMap.value.plugin('AMap.Scale', function () {
    const instance = new AMap.value.Scale({});
    mapRef.value.addControl(instance);
    plugins['Scale'] = instance;
  });
};

onMounted(async () => {
  await initMap();
  initPlugins();
});

const clearOverlays = () => {
  mapRef.value.clearMap();
};
</script>

<style lang="less" scoped></style>
