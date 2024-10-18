<script setup lang="ts">
import { useFormStore } from '@/stores/form';
import { usePurchaseStore } from '@/stores/purchase';
import { useUserStore } from '@/stores/user';
import { postRequestHandler } from '@/utils/httpHandler';
import { formatMoney } from '@/utils/date';

const purchase = ref<boolean>(false)
const purchaseStore = usePurchaseStore()
const route = useRoute()
const purchaseDetails = ref<any>()
const formStore = useFormStore()
const userStore = useUserStore()
const supplier_name = ref<string>('')
const payment_terms = ref<string>('')
const order_type_id = ref<any>()
const purchaseOrder = ref<any>()
const param = ref<any>()

const resetForm = () => {
    supplier_name.value = ''
    payment_terms.value = ''
    order_type_id.value = null
    purchaseStore.purchaseItems = []
}

const saveItems = async() => {
    formStore.loading = true

    const data = ref<any>({
        supplier_name: supplier_name.value,
        payment_terms: payment_terms.value,
        order_type_id: order_type_id.value?.id,
        purchase_order_items: purchaseStore?.purchaseItems?.map((purchaseitem: any) => {
            return {
                barcode_id: purchaseitem?.barcode_id?.id,
                requested_by: purchaseitem?.requested_by?.id,
                price: purchaseitem?.price,
                quantity: purchaseitem?.quantity,
                supplier_code: purchaseitem?.supplier_code
            }
        })
    })

    await postRequestHandler('/purchase-orders', data.value, true)
    .then((res) => {
        purchaseOrder.value = res
        formStore.success = `Purchase order successfully added`
        console.log(res)
        resetForm()
    })
    .catch((error) => {
        console.error(error)
    })
    .finally(() => {
        formStore.loading = false
    })
}


onMounted(async () => {
    await purchaseStore.getOrderType()
    await userStore.getStaff()
    await purchaseStore.getPurchaseOrders()
    param.value = route.params
    purchaseDetails.value = purchaseStore?.purchaseOrders?.[param.value?.purchaseDetails]
    supplier_name.value = purchaseDetails.value?.supplier_name
    payment_terms.value = purchaseDetails.value?.payment_terms
    order_type_id.value = purchaseDetails.value?.order_type_id

})
</script>

<template>
    <v-responsive class="mx-auto fill-height pa-5" elevation="2">
        <v-row class="align-center">
            <v-col cols="12" md="3">
                <v-timeline direction="horizontal" side="start">
                    <v-timeline-item dot-color="grey" size="small">
                        <p class="font-weight-medium">Draft</p>
                    </v-timeline-item>
                    <v-timeline-item dot-color="secondary" size="small" v-if="purchaseDetails?.state == 'sent'">
                        <p class="font-weight-medium">Sent</p>
                    </v-timeline-item>
                    <v-timeline-item dot-color="success" size="small" v-if="purchaseDetails?.state == 'validate'">
                        <p class="font-weight-medium">Validate</p>
                    </v-timeline-item>
                </v-timeline>
                <p>{{ formStore.success }}</p>
            </v-col>
            <v-col cols="12" md="9" class="text-right">
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
                <v-toolbar-title class="">Purchase Item Details</v-toolbar-title>
            </v-toolbar>
            {{ purchaseDetails }}
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
                <v-card class="bg-toolbar mt-4 pa-2" v-for="item in purchaseDetails?.purchase_order_items">
                    <v-card-text class="d-flex justify-space-between">
                        <div>
                            <p class="text-subtitle-2">Barcode</p>
                            <p>{{ item?.barcode?.barcode }}</p>

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
                            <p>{{ item?.requested_by_staff?.name }}</p>
                        </div>
                        <div>
                            <p class="text-subtitle-2">Sub Total</p>
                            <p>{{ formatMoney(item?.sub_total) }}</p>
                        </div>
                    </v-card-text>
                </v-card>
            </div>
        </v-sheet>
        <PurchaseAddDialog v-if="purchase" v-model:add-purchase-value="purchase" />
    </v-responsive>
</template>

<route lang="json">{
    "meta": {
        "title": "Purchase Details",
        "layout": "DashboardLayout",
        "auth": true
    }
}</route>