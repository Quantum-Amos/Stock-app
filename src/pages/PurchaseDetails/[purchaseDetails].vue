<script setup lang="ts">
import { useFormStore } from '@/stores/form';
import { usePurchaseStore } from '@/stores/purchase';
import { useUserStore } from '@/stores/user';
import { postRequestHandler, putRequestHandler } from '@/utils/httpHandler';
import { formatMoney } from '@/utils/date';
import PurchaseItemDialog from '@/components/PurchaseItemDialog .vue';
import PurchaseItemDelete from '@/components/PurchaseItemDelete.vue';
import { useUiStore } from '@/stores/ui';

const purchase = ref<boolean>(false)
const purchaseStore = usePurchaseStore()
const route = useRoute()
// const purchaseDetails = ref<any>()
const formStore = useFormStore()
const userStore = useUserStore()
const supplier_name = ref<string>('')
const payment_terms = ref<any>()
const order_type_id = ref<any>()
const purchaseOrder = ref<any>()
const param = ref<any>()
const deleteDialog = ref<boolean>(false);
const deleteData = ref<any>();
const editData = ref<any>()
const editDialog = ref<boolean>(false)
const uiStore = useUiStore()




const editPurchaseOrderItem = (data: any, id: number) => {
    editData.value = { ...data, purchase_id: id };;
    editDialog.value = true;
};


const deletePurchaseItem = (data: any, id: number) => {
    deleteData.value = { ...data, purchase_id: id };
    deleteDialog.value = true;
};

const saveItems = async () => {
    formStore.loading = true

    const data = ref<any>({
        supplier_name: supplier_name.value,
        payment_term_id: payment_terms.value,
        order_type_id: order_type_id.value,
    })

    await putRequestHandler(`/purchase-orders/${purchaseStore?.purchaseOrdersById?.id}`, data.value, true)
        .then((res) => {
            purchaseOrder.value = res
            uiStore.response = `Purchase order successfully Updated`
            uiStore.notification = true
        })
        .catch((error) => {
            uiStore.error = error
            uiStore.notification = true
        })
        .finally(() => {
            formStore.loading = false
            purchaseStore.getPurchaseOrdersById(purchaseStore?.purchaseOrdersById?.id)
        })
}

const validate = async () => {
    formStore.loading = true
    await postRequestHandler(`/purchase-orders/${purchaseStore?.purchaseOrdersById?.id}/update-state`, { state: "validate" }, true)
        .then((res) => {
            purchaseStore.purchaseOrdersById = res
            uiStore.response = `Purchase Order Successfuly Validated`
            uiStore.notification = true
        })
        .catch((error) => {
            uiStore.error = error
            uiStore.notification = true
        })
        .finally(() => formStore.loading = false)
}

const cancel = async () => {
    formStore.loading = true
    await postRequestHandler(`/purchase-orders/${purchaseStore?.purchaseOrdersById?.id}/update-state`, { state: "canceled" }, true)
        .then((res) => {
            purchaseStore.purchaseOrdersById = res
            uiStore.response = `Purchase Order Successfuly Cancelled`
            uiStore.notification = true
        })
        .catch((error) => {
            uiStore.error = error
            uiStore.notification = true
        })
        .finally(() => formStore.loading = false)
}

const send = async () => {
    formStore.loading = true
    await postRequestHandler(`/purchase-orders/${purchaseStore?.purchaseOrdersById?.id}/update-state`, { state: "sent" }, true)
        .then((res) => {
            purchaseStore.purchaseOrdersById = res
            uiStore.response = `Purchase Order Successfuly Sent`
            uiStore.notification = true
        })
        .catch((error) => {
            uiStore.error = error
            uiStore.notification = true
        })
        .finally(() => formStore.loading = false)
}



onMounted(async () => {
    await purchaseStore.getOrderType()
    await userStore.getStaff()
    await purchaseStore.getPurchaseOrders()
    await purchaseStore.getPaymentTerms()
    param.value = route.params
    await purchaseStore.getPurchaseOrdersById(param.value?.purchaseDetails)
    supplier_name.value = purchaseStore?.purchaseOrdersById?.supplier_name
    payment_terms.value = purchaseStore?.purchaseOrdersById?.payment_terms?.id
    order_type_id.value = purchaseStore?.purchaseOrdersById?.order_type_id
})
</script>

<template>
    <v-responsive class="mx-auto fill-height pa-5" elevation="2">
        <div class="d-flex justify-space-between">
            <v-btn icon="mdi-arrow-left" class="bg-secondary" />
            <v-btn icon="mdi-arrow-right" class="bg-secondary" />
        </div>
        <v-row class="align-center">
            <v-col cols="12" md="6">
                <v-timeline direction="horizontal" side="start">
                    <v-timeline-item dot-color="grey" size="small"
                        v-if="purchaseStore?.purchaseOrdersById?.state == 'draft' || purchaseStore?.purchaseOrdersById?.state == 'sent' || purchaseStore?.purchaseOrdersById?.state == 'validate' || purchaseStore?.purchaseOrdersById?.state == 'canceled'">
                        <p class="font-weight-medium">Draft</p>
                    </v-timeline-item>
                    <v-timeline-item dot-color="secondary" size="small"
                        v-if="purchaseStore?.purchaseOrdersById?.state == 'sent' || purchaseStore?.purchaseOrdersById?.state == 'validate' || purchaseStore?.purchaseOrdersById?.state == 'canceled'">
                        <p class="font-weight-medium">Sent</p>
                    </v-timeline-item>
                    <v-timeline-item dot-color="success" size="small"
                        v-if="purchaseStore?.purchaseOrdersById?.state == 'validate' || purchaseStore?.purchaseOrdersById?.state == 'canceled'">
                        <p class="font-weight-medium">Validated</p>
                    </v-timeline-item>
                    <v-timeline-item dot-color="error" size="small"
                        v-if="purchaseStore?.purchaseOrdersById?.state == 'canceled'">
                        <p class="font-weight-medium">Cancelled</p>
                    </v-timeline-item>
                </v-timeline>
                <p>{{ formStore.success }}</p>
            </v-col>
            <v-col cols="12" md="6" class="text-right">
                <div class="d-flex ga-3 justify-end" v-if="purchaseStore?.purchaseOrdersById?.state == 'draft'">
                    <v-btn class="bg-secondary" @click="saveItems" :loading="formStore.loading">
                        Save
                    </v-btn>
                    <v-btn class="bg-secondary" :loading="formStore.loading" @click="send">
                        Send to Vendor
                    </v-btn>
                </div>
                <div class="d-flex ga-3 justify-end" v-if="purchaseStore?.purchaseOrdersById?.state == 'sent'">
                    <v-btn class="bg-secondary" @click="validate" :loading="formStore.loading">
                        Validate
                    </v-btn>
                </div>
                <div class="d-flex ga-3 justify-end" v-if="purchaseStore?.purchaseOrdersById?.state == 'validate'">
                    <v-btn class="bg-secondary" @click="cancel" :loading="formStore.loading">
                        Cancel Order
                    </v-btn>
                </div>
            </v-col>
        </v-row>
        <v-sheet elevation="1" class="h-100 mt-2" rounded="lg">
            <v-toolbar elevation="0" class="bg-toolbar">
                <v-toolbar-title class="">Purchase Item Details</v-toolbar-title>
            </v-toolbar>
            <v-row class="ma-3">
                <v-col cols="12" md="6">
                    <v-text-field label="Supplier Name" variant="outlined" v-model="supplier_name"
                        :readonly="purchaseStore?.purchaseOrdersById?.state != 'draft'" />
                </v-col>
                <v-col cols="12" md="6">
                    <v-combobox label="Payment Terms" variant="outlined" :items="purchaseStore.paymentTerms"
                        :readonly="purchaseStore?.purchaseOrdersById?.state != 'draft'" item-title="name"
                        item-value="id" v-model="payment_terms" />
                </v-col>
                <v-col cols="12" md="6">
                    <v-combobox label="Order Type" variant="outlined" :items="purchaseStore.orderTypes"
                        item-title="name" item-value="id" v-model="order_type_id"
                        :readonly="purchaseStore?.purchaseOrdersById?.state != 'draft'" />
                </v-col>
            </v-row>
            <v-divider color="black" />
            <div class="ma-6 d-flex align-center justify-space-between">
                <div class="d-flex align-center ga-3">
                    <p class="text-body-1">Purchase Items</p>
                    <v-tooltip text="Add Purchase Item" v-if="purchaseStore?.purchaseOrdersById?.state == 'draft'">
                        <template v-slot:activator="{ props }">
                            <v-btn icon="mdi-plus" v-bind="props" variant="flat" color="secondary" size="small"
                                @click="purchase = true" />
                        </template>
                    </v-tooltip>
                </div>
            </div>

            <div class="ma-6">
                <v-card class="bg-toolbar mt-4 pa-2"
                    v-for="item in purchaseStore?.purchaseOrdersById?.purchase_order_items">
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
                        <div v-if="purchaseStore?.purchaseOrdersById?.state == 'draft'">
                            <p class="text-subtitle-2">Actions</p>
                            <div class="d-flex">
                                <v-btn @click="editPurchaseOrderItem(item, purchaseStore?.purchaseOrdersById?.id)"
                                    color="remBlue" variant="text" icon="mdi-pen" hide-details="auto"></v-btn>
                                <v-btn hide-details="auto"
                                    @click="deletePurchaseItem(item, purchaseStore?.purchaseOrdersById?.id)" color="red"
                                    variant="text" icon="mdi-delete"></v-btn>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </div>
        </v-sheet>
        <PurchaseItemDialog v-if="purchase" v-model:add-item-purchase-value="purchase"
            :data="purchaseStore?.purchaseOrdersById" />
        <PurchaseItemDelete v-if="deleteDialog" v-model:dialog-value="deleteDialog" v-bind:delete-data="deleteData" />
        <PurchaseItemEdit v-if="editDialog" v-model:edit-dialog-value="editDialog" v-bind:-edit-data="editData" />
        <Notification v-if="uiStore.notification" />
    </v-responsive>
</template>

<route lang="json">{
    "meta": {
        "title": "Purchase Details",
        "layout": "DashboardLayout",
        "auth": true
    }
}</route>