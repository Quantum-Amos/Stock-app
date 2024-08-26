<template>
  <v-dialog
    transition="dialog-top-transition"
    persistent
    max-width="450px"
    scrollable
    v-model="dialog"
  >
    <v-card>
      <v-toolbar color="secondary" title="Stock Adjustment"></v-toolbar>
      <p
        class="text-body-1 text-center mb-3 text-red-darken-2 font-weight-medium"
      >
        {{ formStore.error }}
      </p>
      <p class="text-success text-body-1 text-center mb-3 font-weight-medium">
        {{ formStore.success }}
      </p>
      <v-form v-model="form">
        <v-card-text>
            <BarcodeCombobox
              v-model:model-value="barcode"
              label="Barcode"
              placeholder="eg. BC-2390-09"
              :rules="[]"
            />
            <p class="">Department</p>
            <v-combobox
              :items="appStore.departments"
              item-title="name"
              item-value="id"
              :return-object="false"
              density="comfortable"
              variant="outlined"
              :rules="[formStore.rules.required]"
              placeholder="Accounts"
              v-model:="Data.department_id"
            >
            </v-combobox>
            <s-t-input-field
              v-model:model-value="Data.quantity"
              field-type="number"
              placeholder="Eg. 25"
              label="Quantity"
              :rules="[formStore.rules.required]"
            ></s-t-input-field>
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
import { useUiStore } from "@/stores/ui";
import { useFormStore } from "@/stores/form";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
const formStore = useFormStore();
const uiStore = useUiStore();
const dialog = ref<boolean>(true);
const form = ref<boolean>(false);
const barcode = ref<string>("");
const Data = ref<any>({
  department_id: null,
  quantity: null,
});
const items = ref<any>([
  { id: 1, name: "BC-02390-90" },
  { id: 2, name: "AC-02390-90" },
]);
const emit = defineEmits(["update:dialogValue"]);

onMounted(async () => {
  await appStore.getDepartments();
});

const createStock = async () => {
  formStore.loading = true;
  uiStore.loading = true;
  await postRequestHandler(`/stock-adjustment/${barcode.value}`, Data.value, true)
    .then((res) => {
      formStore.success = "Stock Created Successfully";
      closeDialog();
    })
    .catch((error) => (formStore.error = error))
    .finally(async () => {
      formStore.loading = false;
      uiStore.loading = false;
      appStore.getStockAdjustmentScan();
    });
};

const closeDialog = () => {
  formStore.resetFormStore();
  emit("update:dialogValue", false);
  dialog.value = false;
};
</script>
