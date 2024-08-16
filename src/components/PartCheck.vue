<template>
  <v-responsive class="fill-height align-center ">
    <v-window v-model="cardView">
      <v-window-item :value="1">
        <v-card elevation="1" rounded="lg" class="mx-auto ma-2" max-width="500">
          <v-card-title class="bg-secondary pa-5">Part Check</v-card-title>
          <v-card-text class="py-15 pa-15">
            <v-form>
              <v-row>
                <v-col>
                  <BarcodeCombobox
                    v-model:model-value="barCode"
                    :items="items"
                    label="Bar Code"
                    placeholder="eg. BC-2390-09"
                    :rules="[]"
                  />
                </v-col>
                <!-- <v-col>
                  <p>Stock specification</p>
                  <v-text-field variant="outlined"></v-text-field
                ></v-col>
                <v-col>
                  <p>Location</p>
                  <v-text-field variant="outlined"></v-text-field
                ></v-col>
                <v-col>
                  <p>Running Stock</p>
                  <v-text-field variant="outlined"></v-text-field
                ></v-col> -->
              </v-row>
              <v-row>
                <v-col class="text-center">
                  <v-btn class="bg-secondary" @click="cardView = 2"
                    >Check Availability</v-btn
                  >
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-window-item>
      <v-window-item :value="2">
        <v-card elevation="1" rounded="lg" class="mx-auto pa-15 ma-2" max-width="500">
          <v-card-text class="pa-0">
            <v-form>
              <v-row>
                <v-col class="text-end"
                  ><v-chip class="bg-success">Available</v-chip></v-col
                >
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
              <v-row>
                <v-col class="text-center">
                  <v-btn
                    class="bg-grey-darken-1 mr-5"
                    width="150"
                    @click="cardView = 1"
                    >Return</v-btn
                  >
                  <v-btn class="bg-secondary" width="150" @click="cardView = 1"
                    >ReOrder Item</v-btn
                  >
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
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
