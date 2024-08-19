<template>
  <v-responsive class="fill-height align-center">
    <v-card elevation="1" rounded="lg" class="mx-auto ma-2" max-width="1000">
      <v-card-title class="bg-secondary pa-5 d-flex justify-space-between">
        <span>Part Collection</span>
        <span>#Orders: {{ numberOrders.number }}</span>
      </v-card-title>
      <v-card-text class="pa-0">
        <p v-if="formStore.error"
        class="text-body-1 text-center py-5 text-red-darken-2 font-weight-medium"
      >
        {{ formStore.error }}
        </p>
        <p v-if="formStore.success" class="text-success text-body-1 text-center py-5 font-weight-medium">
          {{ formStore.success }}
        </p>
        <v-form class="pa-10">
          <v-row>
            <v-col class="text-end"
              ><v-chip v-show="data?.available" :class="data?.available ? data.available === 'available' ?'bg-success' : 'bg-alternate' : ''">
                {{ data?.available ? data.available === 'available' ? data.available.toUpperCase(): data.available.toUpperCase() : ''}}
              </v-chip></v-col
            ></v-row
          >
          <v-row>
            <v-col>
              <v-row>
                <v-col cols="12">
                  <BarcodeCombobox
                    v-model:model-value="barCode"
                    :items="items"
                    label="Barcode"
                    placeholder="eg. BC-2390-09"
                    @update:modelValue="handleOnChange"
                    :rules="[]"
                  />
                </v-col>
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
                  :readonly="true"
                  v-model="data.location"
                  ></v-text-field
                ></v-col>
                <v-col cols="12">
                  <p>Quantity Available</p>
                  <v-text-field variant="outlined"
                  :readonly="true"
                  v-model="data.running_stock"
                ></v-text-field
                ></v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-row>
                <v-col cols="12">
                  <p>Order Date</p>
                  <v-text-field
                  variant="outlined"
                  :readonly="true"
                  v-model="todaysData"
                  ></v-text-field
                ></v-col>
                <v-col cols="12">
                  <p>Job Number</p>
                  <v-text-field
                  variant="outlined"
                  v-model="inputData.job_number"
                  ></v-text-field
                ></v-col>
                <v-col cols="12">
                  <p>Part Name</p>
                  <v-text-field
                  variant="outlined"
                  v-model="inputData.part_name"
                  ></v-text-field
                ></v-col>
                <v-col cols="12">
                  <p>Order Quantity</p>
                  <v-text-field 
                  variant="outlined" 
                  type="number"
                  v-model="inputData.quantity"
                  ></v-text-field
                ></v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row>
            <v-col class="text-center">
              <v-btn
              class="bg-secondary"
              @click="addOrder"
              :loading="formStore.loading"
              block
              type="button"
              color="secondary"
              size="large"
              variant="elevated"
              >Collect</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-responsive>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useFormStore } from "@/stores/form";
import { getRequestHandler, postRequestHandler } from "@/utils/httpHandler";

const formStore = useFormStore();
const cardView = ref<number>(1);
const barCode = ref<number | null>(null);
const numberOrders = ref<number | null>(0);
const data = ref<any>({})
const todaysData = ref<any>(new Date().toLocaleDateString())
const items = ref<any>([
  { id: 1, name: "BC-02390-90" },
  { id: 2, name: "AC-02390-90" },
]);
const inputData = ref<any>({
  job_number: "",
  part_name: "",
  quantity: 0,
})

//
const handleOnChange = async (newBarcode) => {
  await getRequestHandler(`/stock/${newBarcode}/available`, true)
  .then((res) =>  {
    data.value = res
  })
  .catch((error) => {
    data.value = {}
    console.log(error)
});
}

const addOrder = async () =>  {
  formStore.loading = true
  await postRequestHandler(`/stock/${barCode.value}/collect`,inputData.value,true)
  .then((res) => {
      formStore.success = "Your Order has been completed successfully";
      inputData.value = {}
      data.value = {}
    })
    .catch((error) => {
      formStore.error = error
    })
    .finally(async () => {
      formStore.loading = false;
      await getNumberOfOrders();
    });
}

const getNumberOfOrders = async () => {
  await getRequestHandler("/orders/done", true)
  .then((res) =>  {
    numberOrders.value = res
  })
  .catch((error) => console.log(error));
}

onMounted(async () => {
  await getNumberOfOrders()
})
</script>
