<!-- Minimal layout for development -->
<script setup lang="ts">
import { ref } from "vue";
import Header from "./components/dev/Header.vue";
import Sidebar from "./components/dev/Header.vue";

const { t } = useI18n();
const appConfig = useAppConfig();
const pageTitle = useCollectivoTitle();
const getSideBarOpen = ref(false);

function toggleSideBar() {
  menuStore.setSideBarOpen(getSideBarOpen.value ? false : true);
}
</script>

<template>
  <Head>
    <Title v-if="t(pageTitle) == ''">{{
      t(appConfig.collectivo.projectName)
    }}</Title>
    <Title v-else
      >{{ t(pageTitle) }} - {{ t(appConfig.collectivo.projectName) }}</Title
    >
  </Head>
  <div id="collectivo-frame" class="flex h-screen bg-mila font-sans">
    <!-- Backdrop (when sidebar is open) -->
    <div
      id="collectivo-backdrop"
      :class="getSideBarOpen ? 'block' : 'hidden'"
      class="fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"
      @click="toggleSideBar()"
    ></div>

    <!-- Sidebar -->
    <div
      id="collectivo-sidebar"
      :class="
        getSideBarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'
      "
      class="fixed inset-y-0 left-0 z-30 w-60 overflow-y-auto scrollbar-hide transition duration-300 transform bg-white lg:translate-x-0 lg:static lg:inset-0 border-r-2 border-slate-500"
    >
      <Sidebar />
    </div>

    <!-- Main -->
    <div
      id="collectivo-main"
      class="flex-1 flex flex-col overflow-hidden default-layout"
    >
      <!-- Header -->
      <div class="w-full h-14 border-b-2 border-slate-500"><Header /></div>

      <!-- Content -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto">
        <div class="mx-auto h-full p-4">
          <slot> </slot>
        </div>
      </main>
    </div>
  </div>
</template>
