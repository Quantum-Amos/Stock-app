<template>
  <v-dialog
    transition="dialog-top-transition"
    persistent
    max-width="450px"
    scrollable
    v-model="dialog"
  >
    <v-card>
      <v-toolbar color="secondary" title="Stock In"></v-toolbar>
      <p
        class="text-body-1 text-center mb-3 text-red-darken-2 font-weight-medium"
      >
        {{ formStore.error }}
      </p>
      <p class="text-success text-body-1 text-center mb-3 font-weight-medium">
        {{ formStore.success }}
      </p>
      <v-form v-model="form" @submit.prevent="createStock">
        <v-card-text> 
            <BarcodeCombobox
                v-model:model-value="barCode"
                :items="items"
                label="Barcode"
                placeholder="eg. BC-2390-09"
                 :rules="[formStore.rules.required]"
              />
            <s-t-input-field
              v-model:model-value="Data.quantity"
              field-type="number"
              placeholder="Eg. 105"
              label="Quantity"
              :rules="[formStore.rules.required]"
            ></s-t-input-field>
            <s-t-input-field
              v-model:model-value="Data.cost"
              field-type="number"
              placeholder="Eg. 23"
              label="Cost"
              :rules="[formStore.rules.required]"
            ></s-t-input-field>
            <s-t-input-field
              v-model:model-value="Data.erm_code"
              field-type="string"
              placeholder="Eg. TAP2344"
              label="ERM Code"
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
import { ref } from "vue";
import { postRequestHandler } from "@/utils/httpHandler";
import { useFormStore } from "@/stores/form";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
const formStore = useFormStore();
const dialog = ref<boolean>(true);
const form = ref<boolean>(false);
const barCode = ref<any>(null);
const items = ref<any>([
  { id: 1, name: "BC-02390-90" },
  { id: 2, name: "AC-02390-90" },
]);

const Data = ref<any>({
  barcode_id: "",
  quantity: null,
  cost: null,
  erm_code: null,
});

const emit = defineEmits(["update:dialogValue"]);

const createStock = async () => {
  formStore.loading = true;
  Data.value.barcode_id = barCode.value?.id
  await postRequestHandler("/stock", Data.value, true)
    .then((res) => {
      formStore.success = "Stock Created Successfully";
      closeDialog();
    })
    .catch((error) => (formStore.error = error))
    .finally(async () => {
      formStore.loading = false;
      await appStore.getStockInScan()
    });
};

const closeDialog = () => {
  formStore.resetFormStore();
  emit("update:dialogValue", false);
  dialog.value = false;
};
</script>
