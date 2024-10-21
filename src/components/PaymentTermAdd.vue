<script setup lang="ts">
import { useFormStore } from '@/stores/form';
import { usePurchaseStore } from '@/stores/purchase';
import { postRequestHandler } from '@/utils/httpHandler';

const formStore = useFormStore()
const purchaseStore = usePurchaseStore()
const form = ref<boolean>(false)
const data = ref<any>({
    name: "",
    num_of_days: ""
})
const addOrderType = ref<boolean>(true)

const emit = defineEmits(['update:addOrderType'])

const closeDialog = () => {
    formStore.resetFormStore()
    emit('update:addOrderType', false)
    addOrderType.value = false
}

const createPaymentTerm = async () => {
    formStore.loading = true

    const inputData = ref<object>({
        name: data.value?.name,
        num_of_days: data.value?.num_of_days,
    })

    await postRequestHandler("/payment-terms", inputData.value, true)
        .then((res) => {
            formStore.success = "Payment Term Added successfully"
            closeDialog()
        })
        .catch((error) => {
            formStore.error = error
        })
        .finally(async () => {
            formStore.loading = false
            await purchaseStore.getPaymentTerms()
        })
}
</script>

<template>
    <v-dialog transition="dialog-top-transition" max-width="450px" persistent scrollable v-model="addOrderType">
        <v-card>
            <v-toolbar title="Add Payment Terms" color="secondary" />
            <p class="text-body-1 text-center mb-3 text-red-darken-2 font-weight-medium">
                {{ formStore.error }}
            </p>
            <p class="text-success text-body-1 text-center mb-3 font-weight-medium">
                {{ formStore.success }}
            </p>
            <v-form v-model="form" @submit.prevent="createPaymentTerm">
                <v-card-text>
                    <s-t-input-field v-model:model-value="data.name" field-type="string" type="text"
                        placeholder="Eg. Contract" label="Name" :rules="[formStore.rules.required]"></s-t-input-field>
                    <s-t-input-field v-model:model-value="data.num_of_days" field-type="string" type="text"
                        placeholder="Eg. 300" label="Number of days"
                        :rules="[formStore.rules.required]"></s-t-input-field>
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