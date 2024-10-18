<script setup lang="ts">
import { useFormStore } from '@/stores/form';
import { usePurchaseStore } from '@/stores/purchase';
import { useUserStore } from '@/stores/user';
import { postRequestHandler } from '@/utils/httpHandler';
import { formatMoney } from '@/utils/date';

const purchase = ref<boolean>(false)
const purchaseStore = usePurchaseStore()
const formStore = useFormStore()
const userStore = useUserStore()
const supplier_name = ref<string>('')
const payment_terms = ref<string>('')
const order_type_id = ref<number>()
const purchaseOrder = ref<any>()

const saveItems = async() => {
    formStore.loading = true

    const data = ref<any>({
        supplier_name: supplier_name.value,
        payment_terms: payment_terms.value,
        order_type_id: order_type_id.value,
        purchase_order_items: purchaseStore?.purchaseItems
    })

    // await postRequestHandler('/purchase-orders', data.value, true)
    // .then((res) => {
    //     purchaseOrder.value = res
    // })
    // .catch((error) => {
    //     console.error(error)
    // })
    // .finally(() => {
    //     formStore.loading = false
    // })
    console.log(data.value)
    formStore.loading = false
}


onMounted(async () => {
    await purchaseStore.getOrderType()
    await userStore.getStaff()
})
</script>

<template>
    <v-responsive class="mx-auto fill-height pa-5" elevation="2">
        <v-row class="align-center mb-2">
            <v-col cols="12" md="6">
                <!-- <v-timeline direction="horizontal" side="start">
                    <v-timeline-item dot-color="grey" size="small">
                        <p class="font-weight-medium">Draft</p>
                    </v-timeline-item>
                    <v-timeline-item dot-color="secondary" size="small">
                        <p class="font-weight-medium">Sent</p>
                    </v-timeline-item>
                    <v-timeline-item dot-color="success" size="small">
                        <p class="font-weight-medium">Validate</p>
                    </v-timeline-item>
                </v-timeline> -->
            </v-col>
            <v-col cols="12" md="6" class="text-right">
                <v-btn class="bg-secondary" @click="saveItems">
                    Save
                </v-btn>
                <!-- <v-btn class="bg-secondary">
                    Validate
                </v-btn> -->
            </v-col>
        </v-row>
        <v-sheet elevation="1" class="h-100 mt-2" rounded="lg">
            <v-toolbar elevation="0" class="bg-toolbar">
                <v-toolbar-title class="">Purchase Order</v-toolbar-title>
            </v-toolbar>
            <v-row class="ma-3">
                <v-col cols="12" md="6">
                    <v-text-field label="Supplier Name" variant="outlined" v-model="supplier_name"/>
                </v-col>
                <v-col cols="12" md="6">
                    <v-text-field label="Payment Terms" variant="outlined" v-model="payment_terms"/>
                </v-col>
                <v-col cols="12" md="6">
                    <v-combobox label="Order Type" variant="outlined" :items="purchaseStore.orderTypes"
                        item-title="name" item-value="id" v-model="order_type_id"/>
                </v-col>
            </v-row>
            <v-divider color="black" />
            <div class="ma-6 d-flex align-center justify-space-between">
                <div class="d-flex align-center ga-3">
                    <p class="text-body-1">Purchase Items</p>
                    <v-tooltip text="Add Purchase Item">
                        <template v-slot:activator="{ props }">
                            <v-btn icon="mdi-plus" v-bind="props" variant="flat" color="secondary" size="small"
                                @click="purchase = true" />
                        </template>
                    </v-tooltip>
                </div>
            </div>

            <div class="ma-6">
                <v-card class="bg-toolbar mt-4 pa-2" v-for="(item, index) in purchaseStore?.purchaseItems" :key="index">
                    <v-card-text class="d-flex justify-space-between">
                        <div>
                            <p class="text-subtitle-2">Barcode</p>
                            <p>{{ item?.barcode_id.barcode }}</p>

                        </div>
                        <div>
                            <p class="text-subtitle-2">Supplier Code</p>
                            <p>{{ item?.supplier_code }}</p>
                        </div>
                        <div>
                            <p class="text-subtitle-2">Quantity</p>
                            <p>{{ item?.quantity }}</p>
                        </div>
                        <div>
                            <p class="text-subtitle-2">Price</p>
                            <p>{{ item?.price }}</p>
                        </div>
                        <div>
                            <p class="text-subtitle-2">Requested By</p>
                            <p>{{ item?.requested_by.name }}</p>
                        </div>
                        <div>
                            <p class="text-subtitle-2">Sub Total</p>
                            <p>{{formatMoney(item?.quantity *  item?.price) }}</p>
                        </div>
                    </v-card-text>
                </v-card>
            </div>
        </v-sheet>
        <PurchaseAddDialog v-if="purchase" v-model:add-purchase-value="purchase" />
    </v-responsive>
</template>

<style>
.purchase-items {
    border-right: 1px solid black;
}
</style>

<route lang="json">{
    "meta": {
        "title": "Add Purchase",
        "layout": "DashboardLayout",
        "auth": true
    }
}</route>