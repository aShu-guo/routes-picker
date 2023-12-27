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
    <FormItem
      label="中心点"
      name="center"
      :help="lngAndLatValidator.help"
      :validateStatus="lngAndLatValidator.status"
      tooltip="BD-09坐标系下的经纬度"
    >
      <FormItem class="inline-block w-40% mr mb-0">
        <Input v-model:value="formState.lng" placeholder="经度" />
      </FormItem>
      <FormItem class="inline-block w-40% mb-0">
        <Input v-model:value="formState.lat" placeholder="纬度" />
      </FormItem>
      <span class="line-height-32px ml font-size-20px cursor-pointer" @click="center"><AimOutlined /></span>
    </FormItem>
    <FormItem label="输入" name="input">
      <TextArea disabled :value="formState.input" placeholder="输入数据" :rows="10" />
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
      <TextArea v-model:value="formState.output" placeholder="输出数据" :rows="10" />
    </FormItem>
    <!--    <FormItem :wrapper-col="{ span: 14, offset: 4 }">
      <Button type="primary" html-type="submit">Submit</Button>
      <Button style="margin-left: 10px" @click="resetForm">Reset</Button>
    </FormItem>-->
  </Form>
</template>

<script setup>
import { inject, onMounted, reactive, ref } from 'vue';
import { Button, Form, Input } from 'ant-design-vue';
import { AimOutlined } from '@ant-design/icons-vue';
import { InputDataChangeEvent } from '@components/BMap/hooks/useDrawer.js';
import { basicSetup, EditorView } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { autocompletion } from '@codemirror/autocomplete';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
defineOptions({ name: 'ConfigForm' });

const mapRef = inject('mapRef');

const emitter = inject('emitter');
emitter.on(InputDataChangeEvent, (value) => {
  console.log('>>>value:', value);
  formState.input = JSON.stringify(value, null, 4);
});

const formState = reactive({
  lng: '',
  lat: '',
  input: '[]',
  filter: '',
  output: '',
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
</script>

<style lang="less" scoped></style>
