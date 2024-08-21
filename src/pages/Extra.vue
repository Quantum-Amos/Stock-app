<script setup lang="ts">
import { useAppStore } from '@/stores/app';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'
import { Bar, Pie } from 'vue-chartjs'
import { validColorCodes } from '@/utils/colors';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const appStore = useAppStore()

const departmentSmsLabel = ref<any>()
const departmentSmsData = ref<any>()
const departmentSmsData2 = ref<any>()
const data = ref<any>()

const adjustmentStockLabel = ref<any>()
const adjustmentStockData = ref<any>()
const adjustmentStockData2 = ref<any>()
const adjustmentStockData3 = ref<any>()
const data2 = ref<any>()

const engineerLabel = ref<any>()
const engineerData = ref<any>()
const data3 = ref<any>()


watchEffect(() => {
    departmentSmsLabel.value = appStore?.reports?.department_number_quantity_order?.map((value:any) => value.department)
    departmentSmsData.value = appStore?.reports?.department_number_quantity_order?.map((value:any) => value.number_of_orders)
    departmentSmsData2.value = appStore?.reports?.department_number_quantity_order?.map((value:any) => value.quantity_of_orders)

    data.value = {
        labels: departmentSmsLabel.value,
        datasets: [{
            label: 'NUMBER OF COLLECTION THROUGH SMS',
            backgroundColor: ['#1F4E79'],
            borderColor: '#CAEF48',
            fill: true,
            data: departmentSmsData.value,
            tension: 0.4,
            pointRadius: 3  
        },
        {
            label: 'QUANTITY THROUGH SMS',
            backgroundColor: ['#CAEF48'],
            borderColor: '#CAEF48',
            fill: true,
            data: departmentSmsData2.value,
            tension: 0.4,
            pointRadius: 3  
        }]
    }

    adjustmentStockLabel.value = appStore?.reports?.department_adjustment_order?.map((value:any) => value.department)
    adjustmentStockData.value =  appStore?.reports?.department_adjustment_order?.map((value:any) => value.number_of_adjustments)
    adjustmentStockData2.value = appStore?.reports?.department_adjustment_order?.map((value:any) => value.number_of_orders)
    adjustmentStockData3.value = adjustmentStockData.value?.map((element:any, index:any) => element + adjustmentStockData2.value[index]) 

    data2.value = {
        labels: adjustmentStockLabel.value,
        datasets: [{
            label: 'ADJUSTED COLLECTION',
            backgroundColor: ['#1F4E79'],
            borderColor: '#CAEF48',
            fill: true,
            data: adjustmentStockData.value,
            tension: 0.4,
            pointRadius: 3  
        },
        {
            label: 'SMS COLLECTION',
            backgroundColor: ['#CAEF48'],
            borderColor: '#CAEF48',
            fill: true,
            data: adjustmentStockData2.value,
            tension: 0.4,
            pointRadius: 3  
        },
        {
            label: 'TOTAL COLLECTION MADE',
            backgroundColor: ['#DBE5F0'],
            borderColor: '#CAEF48',
            fill: true,
            data: adjustmentStockData3.value,
            tension: 0.4,
            pointRadius: 3  
        }
    ]
    }

    engineerLabel.value = appStore?.reports?.department_engineer?.map((value:any) => value.department)
    engineerData.value = appStore?.reports?.department_engineer?.map((value:any) => value.number_of_engineers)
    data3.value = {
        labels: engineerLabel.value,
        datasets: [{
            label: 'DEPARTMENT REGISTERED ENGINEERS',
            backgroundColor: validColorCodes,
            borderColor: '#CAEF48',
            fill: true,
            data: engineerData.value,
            tension: 0.4,
            pointRadius: 3  
        }]
    }
})


const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
}

onMounted(async() => {
  await appStore.getReports()
})
</script>

<template>
    <v-row>
        <v-col cols="12" class="pa-10">
            <v-card height="600" title="DEPARTMENT SMS COLLECTION MATRIX" class="text-center">
                <Bar :data="data" :options="options" style="height: 520px;"/>
            </v-card>
        </v-col>
        <v-col cols="12" class="pa-10">
            <v-card height="600" title="DEPARTMENT COMMULATIVE COLLECTION MATRIX" class="text-center">
                <Bar :data="data2" :options="options" style="height: 530px;"/>
            </v-card>
        </v-col>
        <v-col cols="12" class="pa-10">
            <v-card height="600" title="DEPARTMENT REGISTERED ENGINEERS" class="text-center">
                <Pie :data="data3" :options="options" style="height: 530px;"/>
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