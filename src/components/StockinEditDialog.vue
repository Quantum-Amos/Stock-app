<template>
    <v-dialog transition="dialog-top-transition" persistent max-width="450px" scrollable v-model="dialog">
        <v-card>
            <v-toolbar color="secondary" title="Stock In"></v-toolbar>
            <v-form v-model="form" @submit.prevent="editStock">
              <v-card-text>
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
                v-model="Data.barcode"
                variant="outlined"
                density="comfortable"
              />
              <p class="text-subtitle-2 mb-1">Specification</p>
              <v-text-field
                v-model="Data.specification"
                variant="outlined"
                density="comfortable"
              />
              <p class="text-subtitle-2 mb-1">Location</p>
              <v-text-field
                v-model="Data.location"
                variant="outlined"
                density="comfortable"
              />
              <p class="text-subtitle-2 mb-1">Quantity</p>
              <v-text-field
                v-model="Data.quantity"
                variant="outlined"
                density="comfortable"
              />
              <p class="text-subtitle-2 mb-1">Cost</p>
              <v-text-field
                v-model="Data.cost"
                variant="outlined"
                density="comfortable"
              /> 
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
import { ref, onMounted } from 'vue';
import { putRequestHandler } from '@/utils/httpHandler';
import { useUiStore } from '@/stores/ui';
import { useFormStore } from '@/stores/form';
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
const formStore = useFormStore()
const uiStore = useUiStore()
const dialog = ref<boolean>(true)
const form = ref<boolean>(false)
  const Data = ref<any>({
  barcode: "",
  specification: "",
  location: "",
  quantity: null,
  cost: null,
});
const props = defineProps<{ stockData: any }>()
const emit = defineEmits(['update:editDialogValue'])

onMounted(()=>{
  Data.value.barcode = props.stockData.barcode.barcode
  Data.value.specification = props.stockData.barcode.specification
  Data.value.location = props.stockData.barcode.location
  Data.value.quantity = props.stockData.quantity
  Data.value.cost = props.stockData.costs.cost
})

const editStock = async () => {
    uiStore.loading = true
    formStore.loading = true
    await putRequestHandler(`stock/${props.stockData.id}`, Data.value, true)
        .then((res) => {
            formStore.success = 'Stock ' + res?.barcode?.barcode + ' Updated Successfully'
            closeDialog()
        }).catch((e) => {
            formStore.error = e
        }).finally(async () => {
            formStore.loading = false
            uiStore.loading = false
            await appStore.getStockInScan()
        })
}



const closeDialog = () => {
    formStore.resetFormStore()
    emit('update:editDialogValue', false)
    dialog.value = false
}


</script>