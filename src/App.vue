<template>
  <FloatButtonGroup class="right-20px z-1001" trigger="hover" type="primary">
    <template #icon>
      <AppstoreOutlined />
    </template>
    <FloatButton @click="openMap('b')">
      <template #icon>
        <img class="w-20px" src="@/assets/baidu.png" alt="" />
      </template>
    </FloatButton>
    <FloatButton @click="openMap('a')">
      <template #icon>
        <img class="w-20px" src="@/assets/gaode.png" alt="" />
      </template>
    </FloatButton>
  </FloatButtonGroup>

  <Transition name="overturn">
    <BMap v-if="mapType === 'b'"></BMap>
  </Transition>
  <Transition name="overturn-reverse">
    <AMap v-if="mapType === 'a'"></AMap>
  </Transition>
</template>

<script setup>
import BMap from '@/components/BMap/index.vue';
import AMap from '@/components/AMap/index.vue';
import { FloatButton, FloatButtonGroup } from 'ant-design-vue';
import { AppstoreOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';

const mapType = ref('a');

const openMap = (type) => {
  mapType.value = type;
};
</script>

<style lang="less" scoped>
.overturn-enter-active {
  animation: overturn 1s;
}

.overturn-reverse-enter-active {
  animation: overturn-reverse 1s;
}

@keyframes overturn {
  from {
    transform: rotateY(-180deg) scale(0, 0);
  }

  to {
    transform: rotateY(0deg) scale(1, 1);
  }
}

@keyframes overturn-reverse {
  from {
    transform: rotateY(180deg) scale(0, 0);
  }

  to {
    transform: rotateY(0) scale(1, 1);
  }
}
</style>
