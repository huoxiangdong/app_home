<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useStorage, useFetch } from "@vueuse/core";

import { notification } from "ant-design-vue";

const store = useStorage("app-store", { server: "" });
const searchValue = ref("");
const loading = ref(false);

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
  loading.value = true;
  const url = "http://" + value.replace("http://", "");

  const rst = await useFetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    mode: "no-cors",
  });

  loading.value = false;
  const state = rst.statusCode.value;

  if (state !== null) {
    store.value.server = url;
    location.href = url;
  } else {
    openNotificationWithIcon("error");
  }
};

onMounted(() => {});
</script>

<template>
  <div h-screen flex justify-center items-center px-10>
    <a-input-search
      v-model:value="searchValue"
      placeholder="请输入服务器地址"
      enter-button="检索"
      size="large"
      :loading="loading"
      @search="onSearch"
    />
  </div>
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
