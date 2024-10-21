import { getRequestHandler } from "@/utils/httpHandler";
import { defineStore } from "pinia";
import { useUiStore } from "./ui";

export const usePurchaseStore = defineStore('Purchase Orders', () => {
    const purchaseItems = ref<any>([])
    const uiStore = useUiStore()
    const orderTypes = ref<any>()
    const purchaseOrders = ref<any>()
    const paymentTerms = ref<any>()
    const purchaseOrdersById = ref<any>()

    const getOrderType = async() => {
        await getRequestHandler(`/purchase-order-types`, true)
        .then((res) => {
            orderTypes.value = res
            uiStore.loading = false
        })
        .catch((error) => {
            console.error(error)
        })
    }

    const getPurchaseOrders = async() => {
        await getRequestHandler('/purchase-orders', true)
        .then((res) => {
            purchaseOrders.value = res.items
            uiStore.loading = false
        })
        .catch((error) => {
            console.error(error)
        })
    }

    const getPaymentTerms = async() => {
        await getRequestHandler('/payment-terms', true)
        .then((res) => {
            paymentTerms.value = res
            uiStore.loading = false
        })
        .catch((error) => {
            console.error(error)
        })
    }

    const getPurchaseOrdersById = async(id:number) => {
        await getRequestHandler(`/purchase-orders/${id}`, true)
        .then((res) => {
            purchaseOrdersById.value = res
            uiStore.loading = false
        })
        .catch((error) => {
            console.error(error)
        })
    }

    return { getOrderType, getPurchaseOrders, getPurchaseOrdersById, getPaymentTerms, paymentTerms, purchaseItems, orderTypes, purchaseOrders, purchaseOrdersById    }
})