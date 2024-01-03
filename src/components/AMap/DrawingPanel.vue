<template>
  <div class="absolute z-10 drawing">
    <div class="h-47px rounded-5px overflow-hidden draw-panel float-left">
      <!--      <a
        class="drawing-box drawing-marker float-left w-64px h-full cursor-pointer"
        :class="geomType === 'marker' ? 'drawing-marker-active' : ''"
        @click="triggerDrawer('marker')"
      ></a>-->
      <a
        class="drawing-box drawing-polyline float-left w-64px h-full cursor-pointer"
        :class="geomType === 'polyline' ? 'drawing-polyline-active' : ''"
        @click="triggerDrawer('polyline')"
      ></a>
      <a
        class="drawing-box drawing-polygon float-left w-64px h-full cursor-pointer"
        :class="geomType === 'polygon' ? 'drawing-polygon-active' : ''"
        @click="triggerDrawer('polygon')"
      ></a>
      <a
        class="drawing-box drawing-circle float-left w-64px h-full cursor-pointer"
        :class="geomType === 'circle' ? 'drawing-circle-active' : ''"
        @click="triggerDrawer('circle')"
      ></a>
      <a
        class="drawing-box drawing-rectangle float-left w-64px h-full cursor-pointer"
        :class="geomType === 'rectangle' ? 'drawing-rectangle-active' : ''"
        @click="triggerDrawer('rectangle')"
      ></a>
    </div>
  </div>
</template>

<script setup>
import { inject, watch } from 'vue';
import useDrawer from '@components/AMap/hooks/useDrawer.js';

defineOptions({ name: 'DrawingPanel' });
const props = defineProps({
  loaded: {
    type: Boolean,
    default: false,
    required:true,
  },
});
const mapRef = inject('mapRef');
const AMap = inject('AMap');

const { geomType, init } = useDrawer(mapRef, AMap);
watch(
  () => props.loaded,
  (newVal) => {
    if (newVal) {
      init();
    }
  },
);
const triggerDrawer = (type) => {
  if (geomType.value === type) {
    geomType.value = '';
  } else {
    geomType.value = type;
  }
};
</script>

<style lang="less" scoped>
.inactivated(@px) {
  background-position: @px 0;
}
.activated(@px) {
  background-position: @px -52px;
}

.drawing {
  inset: 80px auto auto 20px;

  .draw-panel {
    box-shadow: 0 2px 6px 0 rgba(27, 124, 236, 0.5);

    .drawing-box {
      border-right: 1px solid #d2d2d2;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYUAAABjCAMAAABDl+xRAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4RUY1MTQyNzhBNThFMjExQTlDQ0JCMTMzNEIzNTNBQSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4M0ExRDlFOTU4OEMxMUUyOUNDMkFCOUMwMUQzOTI2RSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4M0ExRDlFODU4OEMxMUUyOUNDMkFCOUMwMUQzOTI2RSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5MUY1MTQyNzhBNThFMjExQTlDQ0JCMTMzNEIzNTNBQSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4RUY1MTQyNzhBNThFMjExQTlDQ0JCMTMzNEIzNTNBQSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkLjstsAAAMAUExURR9zsKfJ4eHr8dPk8EGMv+Lp7id8tx1vrOnu8hxtq1max0WOwCl8tpO61ou104a11mGeye3y9Sp/uDKCumKaxJO92lycyKvJ3vL3+xtqqXSmyzR8tGikzb3U5HypzHqu0sLa6x5xruXs8fL09sHW5SB1soOtzlWYxbXS5rXO4VyWwr3S4S6BuXWr0ZzD3iR5tI662VGVxazN49bh6uXv9rzW6NLg6tzn7iBzrOjx902Swu7w8napzSNvpI241srZ5rDN4TSEu6LF3UmRwsrd6s3e6oGy1BxrqabH3UyLtiN2sn2u0NDj74Wz07PL3iFuq6LB2FaWxNLj7ix8tt/p8aLG4KvG22iexmymzeLs8zqAtprC3St0rmWgylKOvDeGvDiFu2OgyyJ5tZG2032w07jR4rnU5yVyrS55sbrS5EyJurbQ4sje7VGRwNnl7D2EuKnL4rHQ5J7C29fn8fb5+maizPDz9TSCuNfX1+Pt9Dt+tCV1sUODtoOv0DqIvTiHvZrB25m+2MbZ5oKx0fj6+8ba6dPi7NHf6VSTwWmhyT+Kvyx/uNrk69fk7tjj6yNxpkeErzKEu97o7vPz8yh6tW6hyFGQv0+Uw6DD3EuMvD2KvvT09CZ6tSl3sf///1WVw/X19f7+/vb29vn5+fv7+/z8/P39/fr6+vf39/j4+CJ4syF0riF3siF0rR9vpiJ5tNLS0iJyqSNyqRtpqE2NuUyNuSuAuSF2sx9yrzyJviZ7tiN4tCV6tU6Ouil+uE6UxB5wrfz9/vr8/ff6/O30+R90seDs9ery+Mvf7vX5/O/2+iV7tpfA3N3r9M7h7r7Y6R9wqB5soiByqyF2sB9upXCoz9Pk7+Lu9Z/F34q42PT19sbc7Nvp8/r7/CJroCJyqCNyqK7O5PHy8iZ5tb/U4/T19bnP4e7z9+Tr8E6OuUiFsEiJu/b393KhxvT29zSAt06Nt5i818zb502MvKfD2VGUwtzl7Ch9t0SFuCJ1sT6IvMbc68nd7KzK4DB/t////2zsHaoAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAO8ElEQVR42uyaeViUxx3HF8EXdje4KyuIJwjoIiwKCBrQqLhRNKJ4BCUeAV5RUGmMEjQ1McTUqAVjorlMjNNIWgKRtklQFLUv7HLfuYhnbpvQJq0xabJNE21n911g3wOYmVeWp8/zfv/g4d053pn5vDPzm/n9FOA4T4U8/YGr33P0+usPH3+9U685qthRRRwVcPTw8Vf5OiquZ8X1cOGzfUq8QvvrulvAbRm31Y794fSUMwac0eGOHH9gu4ccKI5LpPAmkEjhTSCRwptAIoXuFhBScBgDIgrHZQoyBZmCTEGmIFOQKcgUZApYFPYk+ZQdyvGXKQwkhWpVmU2aAaQw1VOlLzPoVZ77Bp5C2KE5OBQuHSrrQQaNCZ3CaC99VmFDcLnXHFIKcy/p3crc9Jq5hBQmGrubHjsbl8JNba5x4eDbQWHv5sfT9bllZS8PxaBgKOtRBvS58LOXW3VhS13hh2WPPURE4amcrtem7SWgME3vxZF+GhYFP9uby/cRU/jrHO9pd89flBNrfXmK3k9VZlQNRafg1YvQKWiYpMIwxivJFMb4k1DYqnN4rW42NoWgXFju5UVjBh89OnjMopfhQ24QBoWbXl4GvdrLK3Y6KYXNbNMrkjXz53pY94Whl3NUgTgUti7j6EObgrEoJFt+WWaxWHRVzZZIAgqzefhnY1IIMjBM3O7pneM1ffchhjEEoVN4kTE88eznoxlmPSmF2QwTtvEpW4PvHfO4X4RBPehymk8gKgWGYe4T252jYAI6hXTL1jZIwRKlsUTjU9gLB5Ejw91YFB7ItVjUBx1H7KDaYsk9gEzBwOjh3zEMs5uQwvYXtfDLCQg64qfXWVipBwVqfR4fhEYB5henABPQKQRT+mgKKiGF+QqfgsrClwqLgp6i1AHcIQtQU5QemcJjlsfgWrTNYplPSCE9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);
    }

    a.drawing-marker-active {
      .activated(-65px);
    }
    .drawing-marker {
      .inactivated(-65px);
      &:hover {
        .activated(-65px);
      }
    }

    a.drawing-polyline-active {
      .activated(-195px);
    }
    .drawing-polyline {
      .inactivated(-195px);
      &:hover {
        .activated(-195px);
      }
    }

    a.drawing-polygon-active {
      .activated(-260px);
    }
    .drawing-polygon {
      .inactivated(-260px);
      &:hover {
        .activated(-260px);
      }
    }

    a.drawing-circle-active {
      .activated(-130px);
    }
    .drawing-circle {
      .inactivated(-130px);
      &:hover {
        .activated(-130px);
      }
    }

    a.drawing-rectangle-active {
      .activated(-325px);
    }
    .drawing-rectangle {
      .inactivated(-325px);
      &:hover {
        .activated(-325px);
      }
    }
  }
}
</style>
