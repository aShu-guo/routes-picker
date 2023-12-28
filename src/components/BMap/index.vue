<template>
  <div class="w-full h-full">
    <DrawingPanel />

    <div id="bmap" class="w-full h-full"></div>

    <Button
      type="primary"
      :icon="h(ClearOutlined)"
      danger
      class="absolute top-20px left-100px z-10"
      @click="clearOverlays"
      >清除覆盖物</Button
    >

    <Drawer open title="配置表单" placement="right" :closable="false" :mask="false" :width="400">
      <ConfigForm />
    </Drawer>
  </div>
</template>

<script setup>
import { h, inject, onMounted, provide, ref, shallowRef } from 'vue';
import { DrawScene, MarkerDraw, OperateEventType } from 'bmap-draw';
import { Drawer, Button, Modal } from 'ant-design-vue';
import DrawingPanel from '@components/BMap/DrawingPanel.vue';
import ConfigForm from '@components/BMap/ConfigForm.vue';
import useMap from './hooks/useMap.js';
import mitt from 'mitt';
import { ClearOutlined } from '@ant-design/icons-vue';
import { ClearOverlaysEvent } from '@/utils/events.js';
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

const clearOverlays = () => {
  Modal.confirm({
    closable: false,
    content: () => {
      return h('p', '确认清除所有覆盖物吗？');
    },
    cancelText: '取消',
    okText: '确认',
    onOk: () => {
      mapRef.value.clearOverlays();
      emitter.emit(ClearOverlaysEvent);
    },
  });
};
</script>

<style lang="less" scoped></style>
