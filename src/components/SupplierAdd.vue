<script setup lang="ts">
import { useFormStore } from '@/stores/form';
import { usePurchaseStore } from '@/stores/purchase';
import { useUiStore } from '@/stores/ui';
import { postRequestHandler } from '@/utils/httpHandler';

const formStore = useFormStore()
const purchaseStore = usePurchaseStore()
const uiStore = useUiStore()
const form = ref<boolean>(false)
const data = ref<any>({
    name: ""
})
const supplierAdd = ref<boolean>(true)

const emit = defineEmits(['update:supplierAdd'])

const closeDialog = () => {
    formStore.resetFormStore()
    emit('update:supplierAdd', false)
    supplierAdd.value = false
}

const createPaymentTerm = async () => {
    formStore.loading = true

    const inputData = ref<object>({
        name: data.value?.name
    })

    await postRequestHandler("/suppliers", inputData.value, true)
        .then((res) => {
            closeDialog()
            uiStore.response = `Supplier Added successfully`
            uiStore.notification = true
        })
        .catch((error) => {
            formStore.error = error
        })
        .finally(async () => {
            formStore.loading = false
            await purchaseStore.getSuppliers()
        })
}
</script>

<template>
    <v-dialog transition="dialog-top-transition" max-width="450px" persistent scrollable v-model="supplierAdd">
        <v-card>
            <v-toolbar title="Add Supplier" color="secondary" />
            <p class="text-body-1 text-center mb-3 text-red-darken-2 font-weight-medium">
                {{ formStore.error }}
            </p>
            <p class="text-success text-body-1 text-center mb-3 font-weight-medium">
                {{ formStore.success }}
            </p>
            <v-form v-model="form" @submit.prevent="createPaymentTerm">
                <v-card-text>
                    <s-t-input-field v-model:model-value="data.name" field-type="string" type="text"
                        placeholder="Eg. Nestle" label="Name" :rules="[formStore.rules.required]"></s-t-input-field>
                </v-card-text>
                <v-card-actions class="d-flex justify-end">
                    <div class="d-flex ga-4 pr-3 pb-3">
                        <v-btn variant="outlined" color="secondary" @click="closeDialog">
                            Cancel
                        </v-btn>
                        <v-btn class="bg-secondary" variant="flat" type="submit" :loading="formStore.loading"
                            :disabled="!form">
                            Save
                        </v-btn>
                    </div>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>

</template>