<template>
  <v-responsive height="700">
    <v-card rounded="0" elevation="5" variant="elevated">
      <v-card class="" variant="flat">
        <v-card-title>
          <div class="pa-3">Stock rate</div>
        </v-card-title>
      </v-card>
      <v-row class="d-flex align-end" no-gutters>
        <v-col cols="6" md="6">
          <v-card class="pa-1" variant="flat">
            <v-card-text>
              <div class="text-caption">Stock In</div>
              <!-- {{ chartData.datasets[0].data }}{{ dddfata }} -->
              <div class="text-caption">(value)</div>
              <div class="font-weight-bold text-h5">
                {{
                  Math.ceil(
                    (socketStore?.data?.successful_transactions?.length /
                      socketStore?.data?.transactions?.length) *
                    100
                  ) || 0
                }}%
              </div>
            </v-card-text>
          </v-card></v-col>
        <v-col cols="6" md="6">
          <v-card class="main_bg pa-1" variant="flat">
            <v-card-text>
              <div class="text-caption">Stock Out</div>
              <div class="text-caption">(value)</div>
              <div class="font-weight-bold text-h5">
                {{
                  Math.floor(
                    (socketStore?.data?.failed_transactions?.length /
                      socketStore?.data?.transactions?.length) *
                    100
                  ) || 0
                }}%
              </div>
            </v-card-text>
          </v-card></v-col>
      </v-row>
      <v-row no-gutters class="">
        <v-col>
          <v-card height="350" class="card_bg">
            <Doughnut :data="chartData" :options="chartOptions" :chart-id="'doughnut-chart'" :dataset-id-key="'labels'"
              :css-classes="''" :styles="{}" :width="60" :height="300" />
          </v-card></v-col>
      </v-row>
      <v-row no-gutters class="d-flex flex-column">
        <v-col>
          <v-card class="pl-5 pt-5" variant="flat">
            <v-card-subtitle class="text-caption">Stock In Amount</v-card-subtitle>
            <v-card-text style="color: #d6120f;" class="mt-n2 text-h5 font-weight-bold">GH&#x20B5; {{ (socketStore?.data?.amount_transactions -
              socketStore?.data?.amount_transactions_success || 0)?.toFixed(2) || 0 }}</v-card-text>
          </v-card></v-col>
        <v-col>
          <v-card class="pl-5 pb-10" variant="flat">
            <v-card-subtitle class="text-caption">Stock Out Amount</v-card-subtitle>
            <v-card-text style="color: #0ea11b;" class="mt-n2 text-h5 font-weight-bold text-success">GH&#x20B5;
              {{
                socketStore?.data?.amount_transactions_success?.toFixed(2) ?? 0
              }}</v-card-text>
          </v-card></v-col>
      </v-row></v-card>
  </v-responsive>
</template>
<script setup lang="ts">
import { ref, watch, watchEffect, onMounted } from 'vue';
// import { useSocketStore } from '@/store/socket'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, ArcElement } from 'chart.js'

// const socketStore = useSocketStore()
const chart = ref<boolean>(false)
const socketStore = ref<any>()

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, ArcElement)

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    animateRotate: true
  },
  plugins: {
    legend: {
      labels: {
        usePointStyle: true,
      },
    }
  }
})

const chartData = ref<any>({
  labels: ['Stock In', 'Stock Out'],
  datasets: [{
    label: 'Tranfers',
    data: [10, 40],
    backgroundColor: ['#24344D ', '#1F4E79 '],
    hoverOffset: 4
  }]
})

// watch(() => socketStore.data, (newData: any) => {
//   if (newData) {
//     chartData.value = {
//       labels: ['Failed', 'Successful'],
//       datasets: [{
//         label: 'Tranfers',
//         data: [socketStore.data?.failed_transactions?.length, socketStore.data?.successful_transactions?.length],
//         backgroundColor: ['#d6120f', '#0ea11b'],
//         hoverOffset: 4
//       }]
//     }
//   }
// })

</script>
