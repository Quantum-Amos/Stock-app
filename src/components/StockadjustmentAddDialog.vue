<template>
  <v-dialog transition="dialog-top-transition" persistent max-width="450px" scrollable v-model="dialog">
    <v-card>
      <v-toolbar color="secondary" title="Stock Adjustment"></v-toolbar>
      <p class="text-body-1 text-center mb-3 text-red-darken-2 font-weight-medium">
        {{ formStore.error }}
      </p>
      <p class="text-success text-body-1 text-center mb-3 font-weight-medium">
        {{ formStore.success }}
      </p>
      <v-form v-model="form" @submit.prevent="createStock">
        <v-card-text>
          <StockRunningCombobox v-model:model-value="barcode" label="Barcode" placeholder="eg. BC-2390-09"
            :rules="[]" />
          <DepartmentCombobox v-model:model-value="Data.department_id" :show-label=true />
          <s-t-input-field v-model:model-value="Data.quantity" field-type="number" placeholder="Eg. 25" label="Quantity"
            :rules="[formStore.rules.required]"></s-t-input-field>
        </v-card-text>
        <v-card-actions class="d-flex justify-end">
          <div class="d-flex ga-4 pr-3 pb-3">
            <v-btn variant="outlined" color="secondary" @click="closeDialog">
              Cancel
            </v-btn>
            <v-btn class="bg-secondary" variant="flat" type="submit" :loading="formStore.loading" :disabled="!form">
              Save
            </v-btn>
          </div>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { postRequestHandler } from "@/utils/httpHandler";
import { useFormStore } from "@/stores/form";
import { useAppStore } from "@/stores/app";
import StockRunningCombobox from "./StockRunningCombobox.vue";

const appStore = useAppStore();
const formStore = useFormStore();
const dialog = ref<boolean>(true);
const form = ref<boolean>(false);
const barcode = ref<any>();
const Data = ref<any>({
  department_id: null,
  quantity: null,
});

const emit = defineEmits(["update:dialogValue"]);

onMounted(async () => {
  await appStore.getDepartments();
  await appStore.getBarcodes();
});

const createStock = async () => {
  formStore.loading = true;
  let barcodeData =
    typeof barcode.value == "string"
      ? appStore.barcodes?.filter(
        (item: any) => item.barcode == barcode.value
      )?.[0]?.barcode
      : barcode.value?.barcode;
  await postRequestHandler(`/stock-adjustment/${barcodeData}`, Data.value, true)
    .then((res) => {
      formStore.success = "Stock Adjustment Created Successfully";
      closeDialog();
    })
    .catch((error) => (formStore.error = error))
    .finally(async () => {
      formStore.loading = false;
      appStore.getStockAdjustmentScan();
    });
};

const closeDialog = () => {
  formStore.resetFormStore();
  emit("update:dialogValue", false);
  dialog.value = false;
};
</script>
