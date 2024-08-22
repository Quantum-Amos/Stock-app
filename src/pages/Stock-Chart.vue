<script setup lang="ts">
import { useAppStore } from '@/stores/app';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const appStore = useAppStore()

const runningStockLabel = ref<any>()
const runningStockData = ref<any>()
const data = ref<any>()

const adjustmentStockLabel = ref<any>()
const adjustmentStockData = ref<any>()
const data2 = ref<any>()

const stockOutLabel = ref<any>()
const stockOutData = ref<any>()
const data3 = ref<any>()


watchEffect(() => {
    runningStockLabel.value = appStore?.runningStock?.map((value:any) => value.barcode.code)
    runningStockData.value = appStore?.runningStock?.map((value:any) => value.remaining_quantity)
    data.value = {
        labels: runningStockLabel.value,
        datasets: [{
            label: 'Running Stock',
            backgroundColor: ['#1F4E79'],
            borderColor: '#CAEF48',
            fill: true,
            data: runningStockData.value,
            tension: 0.4,
            pointRadius: 3  
        }]
    }

    adjustmentStockLabel.value = appStore?.stockAdjustmentRegistered?.map((value:any) => value.code)
    adjustmentStockData.value = appStore?.stockAdjustmentRegistered?.map((value:any) => value.quantity)
    data2.value = {
        labels: adjustmentStockLabel.value,
        datasets: [{
            label: 'Stock Adjustment',
            backgroundColor: ['#1F4E79'],
            borderColor: '#CAEF48',
            fill: true,
            data: adjustmentStockData.value,
            tension: 0.4,
            pointRadius: 3  
        }]
    }

    stockOutLabel.value = appStore?.stockOutRegistered?.map((value:any) => value.code)
    stockOutData.value = appStore?.stockOutRegistered?.map((value:any) => value.quantity)
    data3.value = {
        labels: stockOutLabel.value,
        datasets: [{
            label: 'Stock Out',
            backgroundColor: ['#1F4E79'],
            borderColor: '#CAEF48',
            fill: true,
            data: stockOutData.value,
            tension: 0.4,
            pointRadius: 3  
        }]
    }
})


const options = {
    responsive: true,
    maintainAspectRatio: false
}

onMounted(async() => {
  await appStore.getRunningStock()
  await appStore.getStockAdjustmentRegistered()
  await appStore.getStockOutRegistered()
})
</script>

<template>
    <v-row>
        <v-col cols="12" class="pa-10">
            <v-card height="600" title="Running Stock Report" class="text-center">
                <Bar :data="data" :options="options" style="height: 530px;"/>
            </v-card>
        </v-col>
        <v-col cols="12" class="pa-10">
            <v-card height="600" title="Stock Adjustment Report" class="text-center">
                <Bar :data="data2" :options="options" style="height: 530px;"/>
            </v-card>
        </v-col>
        <v-col cols="12" class="pa-10">
            <v-card height="600" title="Stock Out Report" class="text-center">
                <Bar :data="data3" :options="options"  style="height: 530px;"/>
            </v-card>
        </v-col>
    </v-row>
</template>

<route lang="json">
    {
        "meta": {
            "title": "Stock Chart",
            "layout": "DashboardLayout"
        }
    }
</route>