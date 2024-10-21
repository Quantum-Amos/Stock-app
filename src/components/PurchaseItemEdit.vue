<template>
  <v-dialog transition="dialog-top-transition" persistent max-width="450px" scrollable v-model="dialog">
    <v-card>
      <v-toolbar color="secondary" title="Edit Purchase Order Item"></v-toolbar>
      <v-form v-model="form" @submit.prevent="editOrderType">

        <v-card-text>
          <p class="text-body-1 text-center mb-3 text-red-darken-2 font-weight-medium">
            {{ formStore.error }}
          </p>
          <p class="text-body-1 text-center mb-3 text-success font-weight-medium">
            {{ formStore.success }}
          </p>

           <div>
            <p class="text-subtitle-2 mb-1 ">Barcode</p>
            <v-combobox variant="outlined" density="comfortable" placeholder="Eg. BC-2390-09" :items="appStore2.barcodes" :rules="[formStore.rules.required]" 
            v-model="Data.barcode_id" item-title="barcode" item-value="id"/>
           </div>
           <div>
            <p class="text-subtitle-2 mb-1 ">Supplier Code</p>
            <v-text-field v-model="Data.supplier_code" variant="outlined" density="comfortable"
              placeholder="Eg. 568987645" :rules="[formStore.rules.required]"></v-text-field>
           </div>
           <div>
            <p class="text-subtitle-2 mb-1 ">Quantity</p>
            <v-text-field v-model="Data.quantity" field-type="number" type="number" variant="outlined"
              density="comfortable" placeholder="Eg. 10":rules="[formStore.rules.required]"></v-text-field>
           </div>
           <div>
            <p class="text-subtitle-2 mb-1 ">Price</p>
            <v-text-field variant="outlined" density="comfortable" v-model="Data.price" field-type="number" type="number"
              placeholder="Eg. 100" :rules="[formStore.rules.required]"></v-text-field>
           </div>
           <div>
             <p class="text-subtitle-2 mb-1">Requested By</p>
             <v-combobox variant="outlined" density="comfortable" placeholder="Eg. Peter" v-model="Data.requested_by"
               :items="userStore?.staff" item-title="name" item-value="id" :rules="[formStore.rules.required]" />
           </div>
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
import { usePurchaseStore } from '@/stores/purchase';
import { useUserStore } from '@/stores/user';
import { useAppStore } from '@/stores/app';

const appStore = usePurchaseStore()
const userStore = useUserStore()
const appStore2 = useAppStore()
const formStore = useFormStore()
const uiStore = useUiStore()
const dialog = ref<boolean>(true)
const form = ref<boolean>(false)
const Data = ref<any>({
  barcode_id: "",
  barcode: "",
  supplier_code: "",
  quantity: "",
  price: "",
  requested_by: "",
  requested_by_staff: ""
});
const props = defineProps<{ EditData: any }>()
const emit = defineEmits(['update:editDialogValue'])

onMounted(async() => {
  Data.value.barcode_id = props.EditData.barcode_id
  Data.value.barcode = props.EditData.barcode.barcode
  Data.value.supplier_code = props.EditData.supplier_code
  Data.value.quantity = props.EditData.quantity
  Data.value.price = props.EditData.price
  Data.value.requested_by = props.EditData.requested_by
  Data.value.requested_by_staff = props.EditData.requested_by_staff.name
  await appStore2.getBarcodes()
})

const editOrderType = async () => {
  uiStore.loading = true
  formStore.loading = true

  let barcode =
    typeof  Data.value.barcode_id  == "string"
      ? appStore2.barcodes?.filter(
          (item: any) => item.barcode ==  Data.value.barcode_id 
        )?.[0]?.id
      :  Data.value.barcode_id?.id || Data.value.barcode_id;

    let requestedBy =
    typeof  Data.value.requested_by  == "string"
      ? userStore.staff?.filter(
          (item: any) => item.name ==  Data.value.requested_by 
        )?.[0]?.id
      :  Data.value.requested_by?.id || Data.value.requested_by

  const data = {
    barcode_id: barcode,
    supplier_code: Data.value.supplier_code,
    quantity: Data.value.quantity,
    price: Data.value.price,
    requested_by: requestedBy
  }
  await putRequestHandler(`purchase-order-items/${props.EditData.id}`, data, true)
    .then((res) => {
      formStore.success = 'Purchase Order Item ' + res.name + ' Updated Successfully'
      closeDialog()
    }).catch((e) => {
      formStore.error = e
    }).finally(async () => {
      formStore.loading = false
      uiStore.loading = false
      await appStore.getOrderType()
    })
}

const closeDialog = () => {
  formStore.resetFormStore()
  emit('update:editDialogValue', false)
  dialog.value = false
}


</script>