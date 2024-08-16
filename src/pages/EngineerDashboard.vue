<template>
  <v-responsive class="mx-auto fill-height pa-5" elevation="2">
    <v-sheet elevation="0" class="h-100 bg-transaparent" rounded="lg">
      <v-toolbar elevation="0" class="bg-toolbar">
        <v-toolbar-title class=""
          ><v-btn
            @click="view = 1"
            class="mr-5"
            :class="view == 1 ? 'bg-secondary' : 'bg-grey-lighten-1'"
            >Part Check</v-btn
          >
          <v-btn
          @click="view = 2"
          :class="view == 2 ? 'bg-secondary' : 'bg-grey-lighten-1'"
          >Collect</v-btn
          ></v-toolbar-title
          >
        </v-toolbar>
        <v-divider></v-divider>
      <!-- <Transition name="slide-fade">
      <p class="text-h5 font-weight-bold pa-5" v-if="displayHeader">Running Stock</p>
    </Transition> -->
      <!-- <v-divider class="w-100"></v-divider> -->
      <v-sheet elevation="0" rounded="0" class="fill-height bg-table">
        <template v-if="view == 1">
          <part-check />
        </template>
        <template v-if="view == 2">
          <collect-form />
        </template>
      </v-sheet>
    </v-sheet>
  </v-responsive>
</template>
<route lang="json">
{
  "meta": {
    "title": "Dashboard",
    "layout": "EngineerLayout"
  }
}
</route>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { getRequestHandler } from "@/utils/httpHandler";

const view = ref<number>(1);
const items = ref<any>([
  { id: 1, name: "BC-02390-90" },
  { id: 2, name: "AC-02390-90" },
]);
//
</script>
