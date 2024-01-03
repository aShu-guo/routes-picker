import { inject, ref, shallowRef, watch } from 'vue';
import { message } from 'ant-design-vue';
import { InputDataChangeEvent } from '@/utils/events.js';

export default (mapRef, AMap) => {
  const geomTypeRef = ref('');
  const mouseToolRef = shallowRef();
  const emitter = inject('emitter');

  const initCursor = (instance) => {
    const changeCursor = () => {
      instance.setOptions({ cursor: 'pointer' });
    };

    // 移入时，鼠标图标变为pointer
    instance.on('mouseover', changeCursor);
    // 移出时清除图标
    instance.on('mouseout', () => {
      instance.off('mouseover', changeCursor);
    });
  };

  const init = () => {
    mapRef.value.plugin(['AMap.MouseTool'], function () {
      mouseToolRef.value = new AMap.value.MouseTool(mapRef.value);

      mouseToolRef.value.on('draw', function (event) {
        const payload = {};
        initCursor(event.obj);

        // event.obj 为绘制出来的覆盖物对象
        message.info('覆盖物对象绘制完成');
        switch (geomTypeRef.value) {
          case 'polyline':
            payload.points = event.obj.getPath();
            payload.length = event.obj.getLength();
            break;
          case 'polygon':
            payload.points = event.obj.getPath();
            payload.area = event.obj.getArea();
            break;
          case 'circle':
            payload.center = event.obj.getCenter();
            payload.radius = event.obj.getRadius();
            break;
          case 'rectangle':
            payload.center = event.obj.getCenter();
            payload.area = event.obj.getArea();
            break;
          default:
            throw new Error('只支持polyline、polygon、circle、rectangle');
        }
        emitter.emit(InputDataChangeEvent, payload);
      });
    });
  };

  watch(geomTypeRef, (value) => {
    if (value) {
      mapRef.value.setDefaultCursor('crosshair');
      switch (value) {
        case 'polyline':
          mouseToolRef.value.polyline({
            cursor: 'crosshair',
            strokeColor: '#3366FF',
            strokeOpacity: 1,
            strokeWeight: 6,
            strokeStyle: 'solid',
            lineCap: 'round',
          });
          break;
        case 'polygon':
          mouseToolRef.value.polygon({
            cursor: 'crosshair',
            strokeColor: '#FF33FF',
            strokeOpacity: 1,
            strokeWeight: 6,
            fillColor: '#1791fc',
            fillOpacity: 0.4,
            // 线样式还支持 'dashed'
            strokeStyle: 'solid',
            // strokeStyle是dashed时有效
            // strokeDasharray: [30,10],
          });
          break;
        case 'circle':
          mouseToolRef.value.circle({
            cursor: 'crosshair',
            strokeColor: '#FF33FF',
            strokeOpacity: 1,
            strokeWeight: 6,
            fillColor: '#1791fc',
            fillOpacity: 0.4,
            strokeStyle: 'solid',
            // 线样式还支持 'dashed'
            // strokeDasharray: [30,10],
          });

          break;
        case 'rectangle':
          mouseToolRef.value.rectangle({
            cursor: 'crosshair',
            strokeColor: 'red',
            strokeOpacity: 0.5,
            strokeWeight: 6,
            fillColor: 'blue',
            fillOpacity: 0.5,
            // strokeStyle还支持 solid
            strokeStyle: 'solid',
            // strokeDasharray: [30,10],
          });
          break;
        default:
          throw new Error('只支持polyline、polygon、circle、rectangle');
      }
    } else {
      mouseToolRef.value.close();
      mapRef.value.setDefaultCursor('grab');
    }
  });

  return {
    init,
    geomType: geomTypeRef,
  };
};
