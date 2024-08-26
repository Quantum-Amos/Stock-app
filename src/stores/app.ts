import { defineStore } from "pinia";
import { ref } from "vue";
import { getRequestHandler } from "@/utils/httpHandler";
import { useUiStore } from "./ui";


export const useAppStore = defineStore("departmentStore", () => {
  const departments = ref<any>();
  const jobTitles = ref<any>();
  const stockInScan = ref<any>()
  const stockInRegistered = ref<any>()
  const stockOutScan = ref<any>()
  const stockOutRegistered = ref<any>()
  const stockAdjustmentScan = ref<any>()
  const stockAdjustmentRegistered = ref<any>()
  const runningStock = ref<any>()
  const orders = ref<any>()
  const emails = ref<any>()
  const reports = ref<any>()
  const costEvaluation = ref<any>()
  const ermReports = ref<any>()
  const userData = ref<any>(JSON.parse(sessionStorage.getItem(import.meta.env.VITE_SESSION_USER) as ""))
  const uiStore = useUiStore()

  const getDepartments = async () => {
    await getRequestHandler('/department', true)
      .then((res) => {
        departments.value = res
        uiStore.loading = false
      })
      .catch((error) => console.log(error));
  };

  const getJobTitles = async () => {
    await getRequestHandler('/job-title', true)
      .then((res) => {
        jobTitles.value = res
        uiStore.loading = false
      })
      .catch((error) => console.log(error));
  };

  const getStockInScan = async () => {
    await getRequestHandler('/stock-in/history', true)
      .then((res) => {
        stockInScan.value = res
        uiStore.loading = false
      })
      .catch((error) => console.log(error));
  };

  const getStockInRegistered = async () => {
    await getRequestHandler('/stock-in', true)
      .then((res) => {
        stockInRegistered.value = res
        uiStore.loading = false
      })
      .catch((error) => console.log(error));
  };


  const getStockOutScan = async () => {
    await getRequestHandler('/stock-out/history', true)
      .then((res) => {
        stockOutScan.value = res
        uiStore.loading = false
      })
      .catch((error) => console.log(error));
  };

  const getStockOutRegistered = async (fromValue: any = null, toValue: any = null, sorted: boolean = false) => {
    let urlPath = ""
    if (fromValue !== null && toValue !== null){
      urlPath = `?from_value=${fromValue}&to_value=${toValue}&sorted=${sorted}`
    }else if (sorted){
      urlPath = "?sorted=true"
    }
    await getRequestHandler(`/stock-out${urlPath}`, true)
      .then((res) => {
        stockOutRegistered.value = res
        uiStore.loading = false
      })
      .catch((error) => console.log(error));
  };


  const getStockAdjustmentScan = async () => {
    await getRequestHandler('/stock-adjustment/history', true)
      .then((res) => {
        stockAdjustmentScan.value = res
        uiStore.loading = false
      })
      .catch((error) => console.log(error));
  };

  const getStockAdjustmentRegistered = async (fromValue: any = null, toValue: any = null, sorted: boolean = false) => {
    let urlPath = ""
    if (fromValue !== null && toValue !== null){
      urlPath = `?from_value=${fromValue}&to_value=${toValue}&sorted=${sorted}`
    }else if (sorted){
      urlPath = "?sorted=true"
    }
    await getRequestHandler(`/stock-adjustment${urlPath}`, true)
      .then((res) => {
        stockAdjustmentRegistered.value = res
        uiStore.loading = false
      })
      .catch((error) => console.log(error));
  };

  const getRunningStock = async (fromValue: any = null, toValue: any = null, sorted: boolean = false) => {
    let urlPath = ""
    if (fromValue !== null && toValue !== null){
      urlPath = `?from_value=${fromValue}&to_value=${toValue}&sorted=${sorted}`
    }else if (sorted){
      urlPath = "?sorted=true"
    }
    await getRequestHandler(`/stock-running${urlPath}`, true)
      .then((res) => {
        runningStock.value = res
        uiStore.loading = false
      })
      .catch((error) => console.log(error));
  };
  const getOrders = async () => {
    await getRequestHandler('/orders', true)
      .then((res) => {
        orders.value = res
        uiStore.loading = false
      })
      .catch((error) => console.log(error));
  };
  const getEmails = async () => {
    await getRequestHandler('/configure/emails', true)
      .then((res) => {
        emails.value = res
        uiStore.loading = false
      })
      .catch((error) => console.log(error));
  };

  const getCostEvaluation = async () => {
    await getRequestHandler('/cost-evaluation', true)
      .then((res) => {
        costEvaluation.value = res
        uiStore.loading = false
      })
      .catch((error) => console.log(error));
  };

  const getReports = async () => {
    await getRequestHandler('/reports', true)
      .then((res) => {
        reports.value = res
      })
      .catch((error) => console.log(error));
  };

  const getERMReports = async () => {
    await getRequestHandler('/erm', true)
      .then((res) => {
        ermReports.value = res
        uiStore.loading = false
      })
      .catch((error) => console.log(error));
  };

  return {
    departments, jobTitles, stockInScan, stockInRegistered, stockOutScan, stockOutRegistered, stockAdjustmentScan, stockAdjustmentRegistered, runningStock, orders,emails,userData,
    costEvaluation, reports,ermReports,
    getERMReports,
    getDepartments, getJobTitles, getStockInScan, getStockInRegistered, getStockOutScan, getStockOutRegistered, getStockAdjustmentScan, getStockAdjustmentRegistered, getRunningStock,
    getOrders,getEmails, getCostEvaluation, getReports
  };
})