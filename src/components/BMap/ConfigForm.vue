<template>
  <Form
    ref="formRef"
    name="custom-validation"
    :labelCol="{
      xs: { span: 24 },
      sm: { span: 5 },
    }"
    :wrapperCol="{
      xs: { span: 24 },
      sm: { span: 18 },
    }"
    :model="formState"
  >
    <FormItem label="交通路况" name="trafficIsOpen">
      <Switch
        v-model:checked="formState.trafficIsOpen"
        @change="toggleTraffic"
        checked-children="开"
        un-checked-children="关"
      />
    </FormItem>
    <FormItem
      label="中心点"
      name="center"
      :help="lngAndLatValidator.help"
      :validateStatus="lngAndLatValidator.status"
      tooltip="BD-09坐标系下的经纬度"
    >
      <FormItem class="inline-block w-40% mr-5% mb-0">
        <Input v-model:value="formState.lng" placeholder="经度" />
      </FormItem>
      <FormItem class="inline-block w-40% mb-0">
        <Input v-model:value="formState.lat" placeholder="纬度" />
      </FormItem>
      <span class="line-height-32px ml-5% font-size-20px cursor-pointer" @click="center"><AimOutlined /></span>
    </FormItem>
    <FormItem label="总长度" name="length">
      <FormItem class="inline-block w-60% mr-5% mb-0">
        <Input v-model:value="formState.length" disabled />
      </FormItem>
      <FormItem class="inline-block w-35% mb-0">
        <Select v-model:value="formState.unit" @change="unitChange">
          <SelectOption value="km">千米</SelectOption>
          <SelectOption value="m">米</SelectOption>
        </Select>
      </FormItem>
    </FormItem>
    <FormItem label="输入" name="input">
      <TextArea disabled :value="formState.input" placeholder="输入数据" :rows="8" />
    </FormItem>
    <FormItem label="过滤器" name="filter">
      <div class="mt-5px select-none color-#999">function (data) {</div>
      <div id="textarea-js"></div>
      <!--      <TextArea v-model:value="formState.filter" placeholder="过滤器逻辑" :rows="4" />-->
      <div class="select-none color-#999">}</div>
      <FormItem class="mb-0" :wrapper-col="{ span: 14, offset: 18 }">
        <Button type="primary" @click="execute">执行</Button>
      </FormItem>
    </FormItem>
    <FormItem label="输出" name="output">
      <TextArea v-model:value="formState.output" placeholder="输出数据" :rows="8" />
    </FormItem>
    <FormItem :wrapper-col="{ span: 14, offset: 15 }">
      <Button type="primary" @click="exportHandler" :icon="h(DownloadOutlined)" :disabled="disabled">导出Excel</Button>
    </FormItem>
  </Form>
</template>

<script setup>
import { inject, onMounted, reactive, h, ref, computed } from 'vue';
import { Button, Form, Input, Select, Switch } from 'ant-design-vue';
import { AimOutlined, DownloadOutlined } from '@ant-design/icons-vue';
import { basicSetup, EditorView } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { autocompletion } from '@codemirror/autocomplete';
import { ClearOverlaysEvent, InputDataChangeEvent } from '@/utils/events.js';
import { exportExcel } from '@/utils/excel.js';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const SelectOption = Select.Option;
defineOptions({ name: 'ConfigForm' });

const formRef = ref();
const mapRef = inject('mapRef');
const disabled = computed(() => {
  if (formState.output) {
    const rawJson = JSON.parse(formState.output);
    if (Array.isArray(rawJson)) {
      return false;
    }
  }
  return true;
});
const formState = reactive({
  trafficIsOpen: false,
  lng: '',
  lat: '',
  length: 0,
  unit: 'm',
  input: '[]',
  filter: '',
  output: '',
});

const emitter = inject('emitter');
emitter.on(InputDataChangeEvent, ({ points, length }) => {
  formState.input = JSON.stringify(points, null, 4);
  formState.length = length || 0;
});
emitter.on(ClearOverlaysEvent, () => {
  formState.input = '[]';
  formState.length = 0;
  formState.unit = 'm';
});

const lngAndLatValidator = reactive({
  status: '',
  help: '',
});

let editor = null;
onMounted(() => {
  editor = new EditorView({
    extensions: [basicSetup, javascript(), autocompletion()],
    parent: document.querySelector('#textarea-js'),
  });
});

const toggleTraffic = (checked) => {
  if (checked) {
    mapRef.value.setTrafficOn();
  } else {
    mapRef.value.setTrafficOff();
  }
};

const center = () => {
  if (formState.lng && formState.lat) {
    // 经度和纬度都填了
    lngAndLatValidator.status = '';
    lngAndLatValidator.help = '';
    mapRef.value.flyTo(new BMapGL.Point(parseFloat(formState.lng), parseFloat(formState.lat)));
  } else if (formState.lng || formState.lat) {
    // 只填了经度和纬度其中一个
    lngAndLatValidator.status = 'warning';
    lngAndLatValidator.help = '请完整填写经度和纬度';
  } else {
    // 经度和纬度都没有填写
    lngAndLatValidator.status = 'error';
    lngAndLatValidator.help = '请完整填写经度和纬度';
  }
};

const unitChange = (value) => {
  switch (value) {
    case 'km':
      formState.length = formState.length / 1000;
      break;
    case 'm':
      formState.length = formState.length * 1000;
      break;
  }
};

const execute = () => {
  const func = new Function('data', editor.state.doc.toString());
  try {
    const res = func(JSON.parse(formState.input));
    if (res) {
      formState.output = JSON.stringify(res, null, 4);
    }
  } catch (e) {
    console.error(e);
    formState.output = e.message;
  }
};

const exportHandler = () => {
  exportExcel(JSON.parse(formState.output));
};
</script>

<style lang="less" scoped></style>
