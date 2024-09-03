<template>
  <v-responsive class="fill-height align-center ">
    <v-window v-model="cardView">
      <v-window-item :value="1">
        <v-card elevation="1" rounded="lg" class="mx-auto ma-2" max-width="500">
          <v-card-title class="bg-secondary pa-5">Part Check</v-card-title>
          <v-card-text class="py-15 pa-15">
            <v-form v-model="form" @submit.prevent="handleClick">
              <v-row>
                <v-col>
                  <StockRunningCombobox
                    v-model:model-value="barCode"
                    :items="items"
                    label="Barcode"
                    placeholder="eg. BC-2390-09"
                    :rules="[formStore.rules.required]"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col class="text-center">
                  <v-btn
                  class="bg-secondary"
                  type="submit"
                  :loading="formStore.loading"
                  :disabled="!form"
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
                  ><v-chip :class="data.available == 'available' ? 'bg-success': 'bg-alternate'">{{ data.available == 'available' ? data?.available.toUpperCase(): data?.available.toUpperCase()}}</v-chip></v-col
                >
                <v-col cols="12">
                  <p>Barcode</p>
                  <v-text-field
                  variant="outlined"
                  v-model="data.barcode"
                  density="compact"
                  :readonly="true"
                  ></v-text-field
                ></v-col>
                <v-col cols="12">
                  <p>Stock specification</p>
                  <v-textarea
                  variant="outlined"
                  v-model="data.specification"
                  density="compact"
                  :readonly="true"
                  rows="4"
                  no-resize
                  ></v-textarea
                ></v-col>
                <v-col cols="12">
                  <p>Location</p>
                  <v-text-field
                  variant="outlined"
                  v-model="data.location"
                  density="compact"
                  :readonly="true"
                  ></v-text-field
                ></v-col>
                <v-col cols="12">
                  <p>Running Stock</p>
                  <v-text-field
                  variant="outlined"
                  v-model="data.running_stock"
                  density="compact"
                  :readonly="true"
                  ></v-text-field
                ></v-col>
              </v-row>
              <v-row>
                <v-col class="text-center">
                  <v-btn
                    class="bg-secondary mr-5"
                    width="150"
                    @click="cardView = 1"
                    >Return</v-btn
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
import { useFormStore } from "@/stores/form";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore()
const formStore = useFormStore()
const form = ref<boolean>(false)
const cardView = ref<number>(1);
const barCode = ref<number | null| any>(null);
const data = ref<any>()
const items = ref<any>([
  { id: 1, name: "BC-02390-90" },
  { id: 2, name: "AC-02390-90" },
]);

onMounted(async()=>{
  await appStore.getBarcodes()
})

const handleClick = async () => {
  formStore.loading = true;
  let barcode =
    typeof barCode.value == "string"
      ? appStore.barcodes?.filter(
          (item: any) => item.barcode == barCode.value
        )?.[0]?.id
      : barCode.value.id;
  await getRequestHandler(`/stock/${barcode}/available`, true)
  .then((res) =>  {
    data.value = res
    return cardView.value = 2
  })
  .catch((error) => console.error(error))
  .finally(()=> {
    formStore.loading = false;
  })
}
//
</script>
