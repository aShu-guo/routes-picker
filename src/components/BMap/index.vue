<template>
  <div class="w-full h-full">
    <DrawingPanel />
    <div id="bmap" class="w-full h-full"></div>

    <Drawer open title="配置表单" placement="right" :closable="false" :mask="false" :width="400">
      <ConfigForm />
    </Drawer>
  </div>
</template>

<script setup>
import { inject, onMounted, provide, ref, shallowRef } from 'vue';
import { DrawScene, MarkerDraw } from 'bmap-draw';
import { Drawer } from 'ant-design-vue';
import DrawingPanel from '@components/BMap/DrawingPanel.vue';
import ConfigForm from '@components/BMap/ConfigForm.vue';
import useMap from './hooks/useMap.js';
import mitt from 'mitt';
import { InputDataChangeEvent } from '@components/BMap/hooks/useDrawer.js';
defineOptions({ name: 'BMap' });

const emitter = mitt();
provide('emitter', emitter);
const sceneRef = shallowRef();
provide('sceneRef', sceneRef);
const { mapRef } = useMap({ elementId: 'bmap', center: [116.404, 39.915] });
provide('mapRef', mapRef);

onMounted(() => {
  sceneRef.value = new DrawScene(mapRef.value, {});
  new MarkerDraw(sceneRef.value, {
    isOpen: false,
    isSeries: true,
    enableDragging: true,
    baseOpts: {},
  });
});
</script>

<style lang="less" scoped></style>
