import { getRequestHandler } from "@/utils/httpHandler";
import { defineStore } from "pinia";

export const usePurchaseStore = defineStore('Purchase Orders', () => {
    const purchaseItems = ref<any>([])
    const orderTypes = ref<any>()

    const getOrderType = async() => {
        await getRequestHandler(`/purchase-order-types`, true)
        .then((res) => {
            orderTypes.value = res
        })
        .catch((error) => {
            console.error(error)
        })
    }

    return { getOrderType, purchaseItems, orderTypes }
})