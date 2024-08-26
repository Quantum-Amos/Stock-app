<template>
  <v-responsive class="mx-auto px-5" elevation="2">
    <v-row no-gutters class="d-flex mt-4 flex-md-nowrap">
      <v-col class="pr-1" cols="12" md="3" v-for="(item, index) in items">
        <v-card rounded="0" class="pa-2">
          <v-card-title>
            <v-avatar size="small" class="rounded-0"
              ><v-img :src="`../src/assets/${item.src}.png`"></v-img
            ></v-avatar>
          </v-card-title>
          <v-card-text>
            <p class="text-body-1 text-secondary text-capitalize">
              {{ item.src }}
            </p>
            <p class="text-h5 font-weight-bold">5{{ index }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row no-gutters class="d-flex flex-row flex-md-nowrap mt-2">
      <v-col class="mr-sm-3 mb-3" cols="12" md="4" lg="4">
        <v-card elevation="1">
          <AprovalRate />
        </v-card>
      </v-col>
      <v-col cols="12" class="" md="" lg="">
        <v-card elevation="1">
          <TransactionOverview />
        </v-card>
        
      </v-col>
    </v-row>
  </v-responsive>
</template>
<route lang="json">
{
  "meta": {
    "title": "Dashboard",
        "layout": "DashboardLayout",
    "auth" : true
  }
}
</route>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { getRequestHandler } from "@/utils/httpHandler";


const dialog = ref<boolean>(false);
const items = ref<any>([
  { src: "company" },
  { src: "tracker" },
  { src: "vehicle" },
  { src: "driver" },
]);
//
</script>
