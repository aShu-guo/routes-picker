import { onMounted, onUnmounted, shallowRef } from 'vue';

/**
 *
 * @param elementId
 * @param center [lng, lat]
 */
export default ({ elementId, center, zoom = 15 }) => {
  const mapRef = shallowRef();

  onMounted(() => {
    mapRef.value = new BMapGL.Map(elementId);
    const point = new BMapGL.Point(center[0], center[1]);
    mapRef.value.centerAndZoom(point, zoom);
    mapRef.value.enableScrollWheelZoom();
    mapRef.value.disableDoubleClickZoom();

    // 添加地图控件
    // 1. 添加比例尺控件
    mapRef.value.addControl(new BMapGL.ScaleControl());
    // 2. 添加城市列表控件
    mapRef.value.addControl(new BMapGL.CityListControl({ offset: new BMapGL.Size(20, 20) }));
    //
    mapRef.value.setMapType(BMAP_NORMAL_MAP); // 设置地图类型为地球模式

    mapRef.value.addEventListener('dblclick', (e) => {
      console.log('>>>e:', e);
    });
  });

  onUnmounted(() => {
    mapRef.value.destroy();
  });
  return { mapRef };
};
