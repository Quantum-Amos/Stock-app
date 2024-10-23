<script setup lang="ts">
import { usePurchaseStore } from '@/stores/purchase';
import { useUiStore } from '@/stores/ui';
import { formatDatetime, formatMoney } from '@/utils/date';

const purchaseStore = usePurchaseStore()
const uiStore = useUiStore()
const router = useRouter()

const test = (item: any) => {
    router.push(`/purchasedetails/${item}`)
}


onMounted(async () => {
    await purchaseStore.getPurchaseOrders()
})
</script>

<template>
    <v-responsive class="mx-auto fill-height pa-5" elevation="2">
        <v-sheet elevation="1" class="h-100 mt-2" rounded="lg">
            <v-toolbar elevation="0" class="bg-toolbar">
                <v-toolbar-title class="">Purchase Orders</v-toolbar-title>
                <FilterMenu/>
            </v-toolbar>
            <div class="ma-6">
                <v-skeleton-loader :loading="uiStore.loading" type="card, card, card" class="w-100">
                    <v-card class="bg-toolbar mt-4 pa-2 w-100" v-for="(item, index) in purchaseStore?.purchaseOrders"
                        :key="index">
                        <v-card-text @click="test(item?.id)" class="d-flex justify-space-between cursor-pointer">
                            <div>
                                <p class="text-subtitle-2">Supplier Name</p>
                                <p>{{ item?.supplier_name }}</p>
    
                            </div>
                            <div>
                                <p class="text-subtitle-2">Status</p>
                                <p class="text-uppercase">{{ item?.state }}</p>
                            </div>
                            <div>
                                <p class="text-subtitle-2">Date</p>
                                <p>{{ formatDatetime(item?.created_at).split(" ")[0] }}</p>
                            </div>
                            <div>
                                <p class="text-subtitle-2">Total Cost</p>
                                <p>{{ formatMoney(item?.purchase_order_items?.reduce((total: number, value: any) => total + (value?.quantity * value?.price), 0)) }}</p>
                            </div>
                        </v-card-text>
                    </v-card>
                    <div class="w-100">
                        <v-pagination
                        v-model="purchaseStore.page"
                        rounded="circle"
                        class="mt-3"
                        :length="purchaseStore?.puchaseOrdersPagination?.pages"
                        :total-visible="7"
                        />
                    </div>
                </v-skeleton-loader>
            </div>
        </v-sheet>
        <Notification v-if="uiStore.notification"/>
    </v-responsive>
</template>

<route lang="json">{
    "meta": {
        "title": "View Purchase",
        "layout": "DashboardLayout",
        "auth": true
    }
}</route>