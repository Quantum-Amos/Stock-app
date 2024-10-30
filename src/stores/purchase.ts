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
    const puchaseOrdersPagination = ref<any>()
    const suppliers = ref<any>()
    const page = ref<number>(1)

    watch(() => page.value,async() => {
        await getPurchaseOrders()
    })

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
        await getRequestHandler(`/purchase-orders?size=10&page=${page.value}`, true)
        .then((res) => {
            purchaseOrders.value = res.items
            puchaseOrdersPagination.value = res
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

    const getSuppliers = async() => {
        await getRequestHandler(`/suppliers`, true)
        .then((res) => {
            suppliers.value = res
            uiStore.loading = false
        })
        .catch((error) => {
            console.error(error)
        })
    }


    return { getOrderType, getPurchaseOrders, getPurchaseOrdersById, getPaymentTerms, getSuppliers, paymentTerms, purchaseItems, orderTypes, purchaseOrders, purchaseOrdersById, puchaseOrdersPagination, page, suppliers    }
})