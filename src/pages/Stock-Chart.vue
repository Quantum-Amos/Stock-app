<script setup lang="ts">
import { useAppStore } from '@/stores/app';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const runningStockLabel = ref<any>()
const runningStockData = ref<any>()
const appStore = useAppStore()

 
const data = {
    labels: runningStockLabel.value,
    datasets: [{
        label: 'Running Stock',
        // backgroundColor: ['#F8FDE4', '#CAEF48', '#CAEF48', '#CAEF48', '#CAEF48', '#CAEF48', '#CAEF48'],
        backgroundColor: ['#1F4E79'],
        borderColor: '#CAEF48',
        fill: true,
        data: runningStockData.value,
        tension: 0.4,
        pointRadius: 3  
    }]
}


const options = {
    responsive: true,
    maintainAspectRatio: false
}

onMounted (async() => {
    await appStore.getRunningStock()
    // runningStockLabel.value = appStore.runningStock.map((value:any) => {
    //     console.log(value)
    //    return value.code
    // })
    // runningStockData.value = appStore.runningStock.map((value:any) => value.quantity)
    console.log(appStore.runningStock)
})
</script>

<template>
    <v-row>
        <v-col cols="12" class="pa-12">
            <v-card height="600" title="Running Stock Report" class="text-center">
                {{ runningStockLabel }}
                <Bar :data="data" :options="options"/>
            </v-card>
        </v-col>
        <v-col cols="12" class="pa-12">
            <v-card height="600" title="Stock Adjustment Report" class="text-center">
                <Bar :data="data" :options="options"/>
            </v-card>
        </v-col>
        <v-col cols="12" class="pa-12">
            <v-card height="600" title="Stock Out Report" class="text-center">
                <Bar :data="data" :options="options"/>
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