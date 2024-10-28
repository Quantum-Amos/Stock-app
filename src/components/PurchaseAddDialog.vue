<script setup lang="ts">
import { useFormStore } from '@/stores/form';
import { usePurchaseStore } from '@/stores/purchase';
import { useUiStore } from '@/stores/ui';
import { useUserStore } from '@/stores/user';

const formStore = useFormStore()
const purchaseStore = usePurchaseStore()
const userStore = useUserStore()
const uiStore = useUiStore()
const form = ref<boolean>(false)
const addPurchase = ref<boolean>(true)
const barcode_id = ref<number>()
const supplier_code = ref<string>('')
const quantity = ref<number>()
const price = ref<number>()
const requested_by = ref<any>()

const emit = defineEmits(['update:addPurchaseValue'])

const closeDialog = () => {
    formStore.resetFormStore()
    emit('update:addPurchaseValue', false)
    addPurchase.value = false
}

const addPurchaseItem = () => {
    formStore.loading = true
    const data = ref<object>({
        barcode_id: barcode_id.value,
        supplier_code: supplier_code.value,
        quantity: quantity.value,
        price: price.value,
        requested_by: requested_by.value
    })

    purchaseStore.purchaseItems.push(data.value)
    formStore.loading = false
    closeDialog()
    uiStore.response = `Purchase Item Added Successfully`
    uiStore.notification = true
}

</script>

<template>
    <v-dialog transition="dialog-top-transition" max-width="450px" persistent scrollable v-model="addPurchase">
        <v-card>
            <v-toolbar title="Add Purchase Item" color="secondary" />
            <p class="text-body-1 text-center mb-3 text-red-darken-2 font-weight-medium">
                {{ formStore.error }}
            </p>
            <p class="text-success text-body-1 text-center mb-3 font-weight-medium">
                {{ formStore.success }}
            </p>
            <v-form v-model="form">
                <v-card-text>
                    <BarcodeCombobox label="Barcode" placeholder="Eg. BC-2390-09" v-model:model-value="barcode_id" :rules="[formStore.rules.required]"/>
                    <s-t-input-field v-model:model-value="supplier_code" field-type="string" type="text"
                        placeholder="Eg. 568987645" label="Supplier Reference"
                        :rules="[formStore.rules.required]"></s-t-input-field>
                    <s-t-input-field v-model:model-value="quantity" field-type="number" type="number"
                        placeholder="Eg. 10" label="Quantity"
                        :rules="[formStore.rules.required]"></s-t-input-field>
                    <s-t-input-field v-model:model-value="price" field-type="number" type="number"
                        placeholder="Eg. 100" label="Price" :rules="[formStore.rules.required]"></s-t-input-field>
                    <p class="text-subtitle-2 mb-1">Requested By</p>
                    <v-combobox variant="outlined" density="comfortable" placeholder="Eg. Peter" v-model="requested_by" :items="userStore?.staff"
                    item-title="name" item-value="id" :rules="[formStore.rules.required]"/>
                </v-card-text>
                <v-card-actions class="d-flex justify-end">
                    <div class="d-flex ga-4 pr-3 pb-3">
                        <v-btn variant="outlined" color="secondary" @click="closeDialog">
                            Cancel
                        </v-btn>
                        <v-btn class="bg-secondary" variant="flat" type="submit" :loading="formStore.loading"
                            :disabled="!form" @click="addPurchaseItem">
                            Save
                        </v-btn>
                    </div>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>