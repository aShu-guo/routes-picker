import { PolylineDraw, PolygonDraw, OperateEventType, RectDraw, CircleDraw } from 'bmap-draw';
import { inject, onMounted, ref, shallowRef, watch } from 'vue';
export const InputDataChangeEvent = 'data-change';
/**
 * 折线绘制hook
 * @return {{close: close, open: open}}
 */
const usePolylineDrawer = (sceneRef) => {
  let polylineDraw = null;
  const emitter = inject('emitter');
  const init = () => {
    polylineDraw = new PolylineDraw(sceneRef.value, {
      hideTip: false, // 显示绘制提示（默认显示）
      isOpen: true,
      labelOptions: {
        borderRadius: '2px',
        background: '#b5d3fb',
        border: '1px solid #b5d3fb',
        color: '#333',
        fontSize: '12px',
        letterSpacing: '0',
        padding: '5px',
      },
      baseOpts: {
        strokeWeight: 4,
        strokeOpacity: 1,
        fillOpacity: 0.2,
      },
    });

    sceneRef.value.addEventListener(OperateEventType.COMPLETE, (e) => {
      emitter.emit(InputDataChangeEvent, polylineDraw.overlay.getPath());
    });
  };

  const open = () => {
    if (polylineDraw) {
      polylineDraw.open();
    } else {
      init();
    }
  };

  const close = () => {
    polylineDraw.close();
  };

  return {
    open,
    close,
  };
};

/**
 * 多边形绘制hook
 * @return {{close: close, open: open}}
 */
const usePolygonDrawer = (sceneRef) => {
  let polygonDraw = null;
  const emitter = inject('emitter');
  const init = () => {
    polygonDraw = new PolygonDraw(sceneRef.value, {
      hideTip: false, // 显示绘制提示（默认显示）
      isOpen: true,
      labelOptions: {
        borderRadius: '2px',
        background: '#b5d3fb',
        border: '1px solid #b5d3fb',
        color: '#333',
        fontSize: '12px',
        letterSpacing: '0',
        padding: '5px',
      },
      baseOpts: {
        strokeWeight: 4,
        strokeOpacity: 1,
        fillOpacity: 0.2,
      },
    });

    sceneRef.value.addEventListener(OperateEventType.COMPLETE, (e) => {
      emitter.emit(InputDataChangeEvent, polygonDraw.overlay.getPath());
    });
  };

  const open = () => {
    if (polygonDraw) {
      polygonDraw.open();
    } else {
      init();
    }
  };

  const close = () => {
    polygonDraw.close();
  };

  return {
    open,
    close,
  };
};

/**
 * 圆形绘制hook
 * @return {{close: close, open: open}}
 */
const useCircleDrawer = (sceneRef) => {
  let circleDrawer = null;
  const emitter = inject('emitter');
  const init = () => {
    circleDrawer = new CircleDraw(sceneRef.value, {
      hideTip: false, // 显示绘制提示（默认显示）
      isOpen: true,
      labelOptions: {
        borderRadius: '2px',
        background: '#b5d3fb',
        border: '1px solid #b5d3fb',
        color: '#333',
        fontSize: '12px',
        letterSpacing: '0',
        padding: '5px',
      },
      baseOpts: {
        strokeColor: '#6d77f9',
        fillColor: '#fff',
        strokeWeight: 5,
        strokeOpacity: 1,
        fillOpacity: 0.2,
      },
    });

    sceneRef.value.addEventListener(OperateEventType.COMPLETE, (e) => {
      emitter.emit(InputDataChangeEvent, circleDrawer.circle.getPath());
    });
  };

  const open = () => {
    if (circleDrawer) {
      circleDrawer.open();
    } else {
      init();
    }
  };

  const close = () => {
    circleDrawer.close();
  };

  return {
    open,
    close,
  };
};

/**
 * 矩形绘制hook
 * @return {{close: close, open: open}}
 */
const useRectDrawer = (sceneRef) => {
  let rectDrawer = null;
  const emitter = inject('emitter');
  const init = () => {
    rectDrawer = new RectDraw(sceneRef.value, {
      hideTip: false, // 隐藏绘制提示
      isOpen: true,
      isSeries: true,
      labelOptions: {
        borderRadius: '2px',
        background: '#b5d3fb',
        border: '1px solid #b5d3fb',
        color: '#333',
        fontSize: '12px',
        letterSpacing: '0',
        padding: '5px',
      },
      baseOpts: {
        fillColor: '#fff',
        strokeWeight: 5,
        strokeOpacity: 1,
        fillOpacity: 0.2,
      },
    });

    sceneRef.value.addEventListener(OperateEventType.COMPLETE, (e) => {
      emitter.emit(InputDataChangeEvent, rectDrawer.polygon.getPath());
    });
  };

  const open = () => {
    if (rectDrawer) {
      rectDrawer.open();
    } else {
      init();
    }
  };

  const close = () => {
    rectDrawer.close();
  };

  return {
    open,
    close,
  };
};

/**
 * 绘制hook
 * @param sceneRef
 */
export default (sceneRef) => {
  let currentClose = '';
  // 支持：marker、polyline、polygon、circle、rectangle
  const geomTypeRef = ref('');
  const { open: polylineOpen, close: polylineClose } = usePolylineDrawer(sceneRef);
  const { open: polygonOpen, close: polygonClose } = usePolygonDrawer(sceneRef);
  const { open: circleOpen, close: circleClose } = useCircleDrawer(sceneRef);
  const { open: rectOpen, close: rectClose } = useRectDrawer(sceneRef);

  // 懒加载，只有触发click事件时才new对应的绘制实例
  watch(geomTypeRef, (value) => {
    if (value) {
      switch (value) {
        case 'polyline':
          polylineOpen();
          currentClose = polylineClose;
          break;
        case 'polygon':
          polygonOpen();
          currentClose = polygonClose;
          break;
        case 'circle':
          circleOpen();
          currentClose = circleClose;
          break;
        case 'rectangle':
          rectOpen();
          currentClose = rectClose;
          break;
        default:
          throw new Error('只支持polyline、polygon、circle、rectangle');
      }
    } else {
      currentClose();
    }
  });

  return {
    geomType: geomTypeRef,
  };
};
