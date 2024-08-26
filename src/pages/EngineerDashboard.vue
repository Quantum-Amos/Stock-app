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
          class="mr-5"
          >Collect</v-btn
          >
          <v-btn
          @click="view = 3"
          :class="view == 3 ? 'bg-secondary' : 'bg-grey-lighten-1'"
          >Advance Search</v-btn
          >

        </v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
      <v-sheet elevation="0" rounded="0" class="fill-height bg-table">
        <template v-if="view == 1">
          <part-check />
        </template>
        <template v-if="view == 2">
          <collect-form />
        </template>
        <template v-if="view == 3">
          <advanced-search />
        </template>
      </v-sheet>
    </v-sheet>
  </v-responsive>
</template>
<route lang="json">
{
  "meta": {
    "title": "Dashboard",
    "layout": "EngineerLayout",
    "auth": true
  }
}
</route>
<script lang="ts" setup>
import { ref } from "vue";

const view = ref<number>(1);
//
</script>
