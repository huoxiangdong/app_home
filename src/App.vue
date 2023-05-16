<script setup lang="ts">
import { ref, unref, onBeforeMount, onMounted, computed } from "vue";
import { useNetwork, useStorage, useFetch } from "@vueuse/core";

import { notification } from "ant-design-vue";

const store = useStorage("app-store", { server: "" });
const searchValue = ref("ssc");
const loading = ref(false);

const { isOnline, offlineAt, downlink, downlinkMax, effectiveType, saveData } = useNetwork()

const type = computed(() => {
  return isOnline.value ? 'success' : 'error'
})

const speed = computed(() => {
  // @ts-ignore
  return '网速: ' + unref(downlink) * 1024 / 8 + "KB/s"
})


const message = computed(() => {
  return isOnline.value ? '网络状态: 在线' : '网络状态: 离线'
})

// reset
if (location.hash === "#reset") {
  store.value.server = ""
}

if (store.value.server !== "") {
  location.href = store.value.server;
}

notification.config({
  placement: "topLeft",
  duration: 3,
});

const openNotificationWithIcon = (type: string) => {
  // @ts-ignore
  notification[type]({
    message: searchValue.value,
    description: "请检查服务器地址是否正确，\n 或者检查服务器是否正常运行。",
  });
};

const onSearch = async (value: string) => {
  if (value === "") {
    openNotificationWithIcon("warning");
    return;
  }

  // local
  if (value === 'ssc_wms') {
    // @ts-ignore
    wdsdk.loadUrl('file:///android_asset/ssc_wms/index.html')
  }

  loading.value = true;
  let url = "http://" + value.replace("http://", "");

  if (value === 'ssc') {
    // @ts-ignore
    url = 'http://10.1.14.254:8088'
  }

  if (value === 'dev') {
    // @ts-ignore
    url = 'http://192.168.31.87:4173'
  }

  // const rst = await useFetch(url, {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/x-www-form-urlencoded",
  //   },
  //   mode: "no-cors",
  // });

  loading.value = false;
  //const state = rst.statusCode.value;

  //if (state !== null) {
  store.value.server = url;
  location.href = url;
  //} else {
  //openNotificationWithIcon("error");
  //}
};
onBeforeMount(() => {
  if (store.value.server !== "" && location.hash !== "#reset") {
    location.href = store.value.server;
  }
});
onMounted(() => {
  if (store.value.server !== "" && location.hash !== "#reset") {
    location.href = store.value.server;
  }

});
</script>

<template>
  <a-row h-screen flex justify-center items-center>
    <a-col :span="24" px-10>
      <a-input-search v-model:value="searchValue" :allowClear="true"
      placeholder="请输入服务器地址" enter-button="检索" size="large"
        :loading="loading" @search="onSearch" />
        <div h-10></div>
      <div flex justify-center items-center>
        <a-space>
          <a-alert  w-60 :message="message" :type="type" />
        <a-alert   w-60 :message="speed" :type="type" />
        </a-space>

      </div>

    </a-col>

  </a-row>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.ant-notification-notice-with-icon .ant-notification-notice-description {
  margin-left: 38px;
}
</style>
