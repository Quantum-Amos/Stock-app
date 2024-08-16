<template>
  <v-responsive class="fill-height align-center">
    <v-card elevation="1" rounded="lg" class="mx-auto ma-2" max-width="1000">
      <v-card-title class="bg-secondary pa-5">Part Collection</v-card-title>
      <v-card-text class="pa-0">
        <v-form class="pa-10">
          <v-row>
            <v-col class="text-end"
              ><v-chip class="bg-success">Available</v-chip></v-col
            ></v-row
          >
          <v-row>
            <v-col>
              <v-row>
                <v-col cols="12">
                  <BarcodeCombobox
                    v-model:model-value="barCode"
                    :items="items"
                    label="Bar Code"
                    placeholder="eg. BC-2390-09"
                    :rules="[]"
                  />
                </v-col>
                <v-col cols="12">
                  <p>Stock specification</p>
                  <v-text-field variant="outlined"></v-text-field
                ></v-col>
                <v-col cols="12">
                  <p>Location</p>
                  <v-text-field variant="outlined"></v-text-field
                ></v-col>
                <v-col cols="12">
                  <p>Running Stock</p>
                  <v-text-field variant="outlined"></v-text-field
                ></v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-row>
                <v-col cols="12">
                  <BarcodeCombobox
                    v-model:model-value="barCode"
                    :items="items"
                    label="Bar Code"
                    placeholder="eg. BC-2390-09"
                    :rules="[]"
                  />
                </v-col>
                <v-col cols="12">
                  <p>Stock specification</p>
                  <v-text-field variant="outlined"></v-text-field
                ></v-col>
                <v-col cols="12">
                  <p>Location</p>
                  <v-text-field variant="outlined"></v-text-field
                ></v-col>
                <v-col cols="12">
                  <p>Running Stock</p>
                  <v-text-field variant="outlined"></v-text-field
                ></v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="text-center">
              <v-btn class="bg-secondary" @click="cardView = 1">Collect</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-responsive>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { getRequestHandler } from "@/utils/httpHandler";

const cardView = ref<number>(1);
const barCode = ref<number | null>(null);

const items = ref<any>([
  { id: 1, name: "BC-02390-90" },
  { id: 2, name: "AC-02390-90" },
]);
//
</script>
