import { defineStore } from "pinia";
import { ref } from "vue";
import { getRequestHandler } from "@/utils/httpHandler";


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
  const userData = ref<any>(JSON.parse(sessionStorage.getItem(import.meta.env.VITE_SESSION_USER) as ""))

  const getDepartments = async () => {
    await getRequestHandler('/department', true)
      .then((res) => {
        departments.value = res
      })
      .catch((error) => console.log(error));
  };

  const getJobTitles = async () => {
    await getRequestHandler('/job-title', true)
      .then((res) => {
        jobTitles.value = res
      })
      .catch((error) => console.log(error));
  };

  const getStockInScan = async () => {
    await getRequestHandler('/stock-in/history', true)
      .then((res) => {
        stockInScan.value = res
      })
      .catch((error) => console.log(error));
  };

  const getStockInRegistered = async () => {
    await getRequestHandler('/stock-in', true)
      .then((res) => {
        stockInRegistered.value = res
      })
      .catch((error) => console.log(error));
  };


  const getStockOutScan = async () => {
    await getRequestHandler('/stock-out/history', true)
      .then((res) => {
        stockOutScan.value = res
      })
      .catch((error) => console.log(error));
  };

  const getStockOutRegistered = async () => {
    await getRequestHandler('/stock-out', true)
      .then((res) => {
        stockOutRegistered.value = res
      })
      .catch((error) => console.log(error));
  };


  const getStockAdjustmentScan = async () => {
    await getRequestHandler('/stock-adjustment/history', true)
      .then((res) => {
        stockAdjustmentScan.value = res
      })
      .catch((error) => console.log(error));
  };

  const getStockAdjustmentRegistered = async () => {
    await getRequestHandler('/stock-adjustment', true)
      .then((res) => {
        console.log(res)
        stockAdjustmentRegistered.value = res
      })
      .catch((error) => console.log(error));
  };

  const getRunningStock = async () => {
    await getRequestHandler('/stock-running', true)
      .then((res) => {
        runningStock.value = res
      })
      .catch((error) => console.log(error));
  };
  const getOrders = async () => {
    await getRequestHandler('/orders', true)
      .then((res) => {
        orders.value = res
      })
      .catch((error) => console.log(error));
  };
  const getEmails = async () => {
    await getRequestHandler('/configure/emails', true)
      .then((res) => {
        emails.value = res
      })
      .catch((error) => console.log(error));
  };

  return {
    departments, jobTitles, stockInScan, stockInRegistered, stockOutScan, stockOutRegistered, stockAdjustmentScan, stockAdjustmentRegistered, runningStock, orders,emails,userData,
    getDepartments, getJobTitles, getStockInScan, getStockInRegistered, getStockOutScan, getStockOutRegistered, getStockAdjustmentScan, getStockAdjustmentRegistered, getRunningStock,
    getOrders,getEmails
  };
})