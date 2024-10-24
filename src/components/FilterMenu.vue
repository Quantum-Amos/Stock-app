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

const clear = () => {
    supplier_name.value = ''
    date.value = null
    state.value = ''
}

const applyFilter = async() => {
    formStore.loading = true

   
//    params.value = `?supplier_name=${supplier_name.value}&created_at_max=${new Date(date.value?.[0]).toISOString().slice(0, 10)}&created_at_min=${new Date(date.value?.[1]).toISOString().slice(0, 10)}&state=${state.value}`
   const params = ref<any>('?')
        if (supplier_name.value){
            params.value +=`supplier_name=${supplier_name.value}&`
        }
        if (date.value?.length > 1){
            if (date.value?.[0]){
                params.value += `created_at_min=${new Date(date.value?.[0]).toISOString().slice(0, 10)}&`
            }
            if (date.value?.[1]){
                params.value += `created_at_max=${new Date(date.value?.[1]).toISOString().slice(0, 10)}&`
            } else {
                params.value += `created_at_max=${new Date(Date.now()).toISOString().slice(0, 10)}&`
            }
        }
        if(state.value){
            params.value += `state=${state.value}&`
        }

        if (params.value.endsWith("&")){
            params.value = params.value.slice(0,-1)
        }

    console.log(params.value);

   await getRequestHandler(`/purchase-orders${params.value}`)
   .then((res) => {
        purchaseStore.purchaseOrders = res.items
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
                    :items="[{ title: 'Draft', value: 'draft' }, { title: 'Sent', value: 'sent' }, { title: 'Validate', value: 'validate' }, { title: 'Cancelled', value: 'canceled' }]" />
                </div>
            </v-card-text>

            <v-card-actions class="pa-3 ga-4 justify-center">
                <v-btn variant="outlined" @click="applyFilter" :loading="formStore.loading">
                    Apply Filter
                </v-btn>
                <v-btn variant="outlined" @click="clear" :loading="formStore.loading">
                    Clear
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-menu>
</template>