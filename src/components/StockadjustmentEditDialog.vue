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
      <v-card-text>
        <v-form v-model="form" @submit.prevent="editStock">
          <v-container>
            <p
              class="text-body-1 text-center mb-3 text-red-darken-2 font-weight-medium"
            >
              {{ formStore.error }}
            </p>
            <p
              class="text-body-1 text-center mb-3 text-success font-weight-medium"
            >
              {{ formStore.success }}
            </p>
            <p class="text-subtitle-2 mb-1">BarCode</p>
            <v-text-field
              :readonly="true"
              v-model="stockData.barcode.barcode"
              variant="outlined"
              density="compact"
            />
            <p class="text-subtitle-2 mb-1">Department</p>
            <v-combobox
              :items="appStore.departments"
              item-title="name"
              item-value="id"
              :return-object="false"
              density="compact"
              variant="outlined"
              :rules="[formStore.rules.required]"
              placeholder="Accounts"
              v-model="Data.department_id"
            />
            <p class="text-subtitle-2 mb-1">Quantity</p>
            <v-text-field
              v-model="Data.quantity"
              variant="outlined"
              density="compact"
            />

            <v-row justify="center" class="mb-4 mt-2">
              <v-col cols="12" md="6">
                <v-btn
                  color="grey-lighten-2"
                  class="mr-1"
                  size="large"
                  :loading="formStore.loading"
                  :disabled="formStore.loading"
                  block
                  variant="flat"
                  type="button"
                  @click="closeDialog"
                  >cancel</v-btn
                >
              </v-col>
              <v-col cols="12" md="6">
                <v-btn
                  :disabled="!form"
                  :loading="formStore.loading"
                  block
                  color="secondary"
                  class="text-white font-weight-medium"
                  size="large"
                  type="submit"
                  variant="elevated"
                >
                  Save
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { putRequestHandler } from "@/utils/httpHandler";
import { useUiStore } from "@/stores/ui";
import { useFormStore } from "@/stores/form";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
const formStore = useFormStore();
const uiStore = useUiStore();
const dialog = ref<boolean>(true);
const form = ref<boolean>(false);
const Data = ref<any>({
  quantity: null,
  department_id : null
});
const props = defineProps<{ stockData: any }>();
const emit = defineEmits(["update:editDialogValue"]);

onMounted(() => {
  Data.value.quantity = props.stockData.quantity;
  Data.value.department_id = props.stockData.department_id;
});

const editStock = async () => {
  uiStore.loading = true;
  formStore.loading = true;
  await putRequestHandler(
    `stock-adjustment/${props.stockData.id}`,
    Data.value,
    true
  )
    .then((res) => {
      formStore.success =
        "Stock " + res?.barcode?.barcode + " Updated Successfully";
      closeDialog();
    })
    .catch((e) => {
      formStore.error = e;
    })
    .finally(async () => {
      formStore.loading = false;
      uiStore.loading = false;
      await appStore.getStockAdjustmentScan();
    });
};

const closeDialog = () => {
  formStore.resetFormStore();
  emit("update:editDialogValue", false);
  dialog.value = false;
};
</script>
