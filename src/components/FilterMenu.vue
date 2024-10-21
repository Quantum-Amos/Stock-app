<script setup lang="ts">
import { useFormStore } from '@/stores/form';
import { usePurchaseStore } from '@/stores/purchase';
import { getRequestHandler } from '@/utils/httpHandler';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const menu = ref<boolean>(false)
const purchaseStore = usePurchaseStore()
const formStore = useFormStore()
const supplier_name = ref<string>('')
const date = ref<any>()
const state = ref<string>('')
const disabled = ref<boolean>(true)

watchEffect(() => {
    if(supplier_name.value && date.value && state.value){
        disabled.value = false
    } else {
        disabled.value = true
    }
})

const applyFilter = async() => {
    formStore.loading = true

   const params = ref<any>()
   params.value = `?supplier_name_=${supplier_name.value}&created_at_max_=${new Date(date.value?.[0]).toISOString().slice(0, 10)}&created_at_min_=${new Date(date.value?.[1]).toISOString().slice(0, 10)}&state=_${state}`

   await getRequestHandler(`/purcahse-orders${params.value}`)
   .then((res) => {
        purchaseStore.purchaseOrders = res
   })
   .catch((error) => {
    console.error(error)
   })
   .finally(() => {
    formStore.loading = false
   })
}
</script>

<template>
    <v-menu v-model="menu" :persistent="true" :close-on-content-click="false" location="bottom" width="350"
        min-width="400">
        <template v-slot:activator="{ props }">
            <v-btn title="Filter" class="text-remBlue" icon="mdi-filter-outline" v-bind="props" />
        </template>

        <v-card>
            <div class="d-flex">
                <v-card-title>Filter</v-card-title>
                <v-icon class="ml-auto mt-3 mr-3" @click="menu = false" icon="mdi-close"></v-icon>
            </div>

            <v-card-text>
                <div class="mt-3">
                    <v-text-field label="Supplier name" v-model="supplier_name" hide-details density="compact"
                        placeholder="Supplier name" variant="outlined" clearable></v-text-field>
                </div>
                <div class="mt-4">
                    <VueDatePicker v-model="date" range :teleport="true" allow-prevent-default
                        placeholder="Start - End date" />
                </div>
                <div class="mt-4">
                    <v-select label="State" v-model="state" hide-details density="compact" placeholder="State" variant="outlined"
                    :items="[{ title: 'Draft', value: 'draft' }, { title: 'Sent', value: 'sent' }, { title: 'Validate', value: 'Validate' }, { title: 'Cancelled', value: 'canceled' }]" />
                </div>
            </v-card-text>

            <v-card-actions class="pa-3">
                <v-spacer></v-spacer>
                <v-btn variant="outlined" @click="applyFilter" :loading="formStore.loading" :disabled="disabled">
                    Apply Filter
                </v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
    </v-menu>
</template>