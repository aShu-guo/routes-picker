import { mount } from '@vue/test-utils';
import { expect, test } from 'vitest';
import BMap from '@/components/BMap/index.vue';
const wrapper = mount(BMap);

it('测试BMap', async () => {
  expect(wrapper.props.title).toContain('Guess User Age App');
});
