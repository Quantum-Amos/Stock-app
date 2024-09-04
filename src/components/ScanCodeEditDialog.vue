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
            <p class="text-subtitle-2 mb-1">ERM Code</p>
            <v-text-field
              v-model="Data.erm_code"
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
import { useFormStore } from '@/stores/form';
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
const formStore = useFormStore()
const dialog = ref<boolean>(true)
const form = ref<boolean>(false)
const Data = ref<any>({
barcode: "",
specification: "",
location: "",
erm_code: ""
});
const props = defineProps<{ stockData: any }>()
const emit = defineEmits(['update:editDialogValue'])

onMounted(()=>{
Data.value.barcode = props.stockData.barcode
Data.value.specification = props.stockData.specification
Data.value.location = props.stockData.location
Data.value.erm_code = props.stockData.erm_code
})

const editStock = async () => {
  formStore.loading = true
  await putRequestHandler(`barcode/${props.stockData.id}`, Data.value, true)
      .then((res) => {
          formStore.success = 'Scan Code ' + res?.barcode + ' Updated Successfully'
          closeDialog()
      }).catch((e) => {
          formStore.error = e
      }).finally(async () => {
          formStore.loading = false
          await appStore.getBarcodes()
      })
}



const closeDialog = () => {
  formStore.resetFormStore()
  emit('update:editDialogValue', false)
  dialog.value = false
}


</script>