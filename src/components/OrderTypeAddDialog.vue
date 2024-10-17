<script setup lang="ts">
import { useFormStore } from '@/stores/form';
import { usePurchaseStore } from '@/stores/purchase';
import { postRequestHandler } from '@/utils/httpHandler';

const formStore = useFormStore()
const purchaseStore = usePurchaseStore()
const form = ref<boolean>(false)
const name = ref<string>('')
const addOrderType = ref<boolean>(true)

const emit = defineEmits(['update:addOrderType'])

const closeDialog = () => {
    formStore.resetFormStore()
    emit('update:addOrderType', false)
    addOrderType.value = false
}

const createOrderType = async() => {
    formStore.loading = true

    const data = ref<object>({
        name: name.value
    })

    await postRequestHandler("/purchase-order-types", data.value, true)
    .then((res) => {
        console.info(res)
        closeDialog()
    })
    .catch((error) => {
        formStore.error = error
    })
    .finally(async() => {
        formStore.loading = false
        await purchaseStore.getOrderType()
    })
}
</script>

<template>
    <v-dialog transition="dialog-top-transition" max-width="450px" persistent scrollable v-model="addOrderType">
        <v-card>
            <v-toolbar title="Add Order Type" color="secondary" />
            <p class="text-body-1 text-center mb-3 text-red-darken-2 font-weight-medium">
                {{ formStore.error }}
            </p>
            <p class="text-success text-body-1 text-center mb-3 font-weight-medium">
                {{ formStore.success }}
            </p>
            <v-form v-model="form">
                <v-card-text>
                    <s-t-input-field v-model:model-value="name" field-type="string" type="text"
                        placeholder="Eg. Bulk order" label="Name"
                        :rules="[formStore.rules.required]"></s-t-input-field>
                </v-card-text>
                <v-card-actions class="d-flex justify-end">
                    <div class="d-flex ga-4 pr-3 pb-3">
                        <v-btn variant="outlined" color="secondary" @click="closeDialog">
                            Cancel
                        </v-btn>
                        <v-btn class="bg-secondary" variant="flat" type="submit" :loading="formStore.loading"
                            :disabled="!form" @click="createOrderType">
                            Save
                        </v-btn>
                    </div>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>

</template>