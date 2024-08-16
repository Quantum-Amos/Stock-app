<template>
    <v-responsive class="" height="700">
        <v-card rounded="0" elevation="12" variant="elevated">
            <v-card variant="flat" class="">
                <v-card-title>
                    <div class="pa-3">Stock Overview</div>
                    <!-- <p>{{socketStore?.data}}</p> -->
                </v-card-title>
            </v-card>
            <v-row class="d-flex" no-gutters>
                <v-col cols="6" md="6">
                    <v-card class="pa-2" variant="flat">
                        <v-card-text>

                            <div class="text-caption">Stock In Register</div>
                            <div class="font-weight-bold text-h5">{{ socketStore?.data?.count_transactions ?? 0 }}</div>
                        </v-card-text>
                    </v-card></v-col>
                <v-col cols="6" md="6">
                    <v-card class=" main_bg pa-2" variant="flat">
                        <v-card-text>

                            <div class="text-caption">Stock Out Register</div>
                            <div class="font-weight-bold text-h5">GH&#x20B5; {{ socketStore?.data?.amount_transactions?.toFixed(2) ?? 0 }}
                            </div>

                        </v-card-text>
                    </v-card></v-col>
            </v-row>
            <v-row no-gutters class="">
                <v-col cols="12">
                    <v-card height="250" class="card_bg" variant="flat">
                        <Line class="mx-auto mt-2" :data=chartData :options="chartOptions" :chart-id="'line-chart'"
                            :dataset-id-key="'labels'" :css-classes="''" :styles="{}" :width="800" :height="240" />
                    </v-card></v-col>
            </v-row>
            <v-row no-gutters class="d-flex flex-column">
                <v-col>
                    <v-card class="pl-2 pt-2" variant="flat">
                        <v-card-title>
                            <div>Running Stock</div>
                        </v-card-title>
                        <v-sheet rounded="sm">
                            <v-table fixed-header hover height="230px">
                                <thead>
                                    <tr>
                                        <th class="text-left" scope="col">Ref</th>
                                        <th class="text-left" scope="col">Issued At</th>
                                        <th class="text-center" scope="col">Amount (GH&#x20B5;)</th>
                                        <th class="text-left" scope="col">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="n in socketStore?.data?.transactions?.slice(0, 5)" :key="n">
                                        <td>{{ n.reference }}</td>
                                        <td>{{ new Date(n.issued_at).toLocaleString() }}</td>
                                        <td class="text-center">{{ n.amount }}</td>
                                        <td class="text-left"> <v-chip class="ma-1"
                                                :color="n.status == 'success' ? 'success' : n.status == 'failed' ? 'error' : 'warning'">
                                                {{ n.status }}
                                            </v-chip></td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-sheet>
                    </v-card></v-col>
            </v-row>
        </v-card>
    </v-responsive>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
// import { useSocketStore } from '@/store/socket'
import { Line } from 'vue-chartjs';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
// const socketStore = useSocketStore()
const socketStore =ref()
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)
const chartOptions = ref({
    responsive: true,
    plugins: {
        legend: {
            display: false,
            labels: {
                usePointStyle: true,
            },
        },
    },
    elements : {
        line : {
            borderColor : '#312C60',
            borderWidth : 3
        }
    }

})
const chartData = ref({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    datasets: [{
        label: 'Monthly Transfers',
        data: [0, 10, 40,20,50,20,10,90,30,40,75,100],
        backgroundColor: ['#6f0be0', '#208a71', '#43e072', 'blue', 'orange', 'purple', '#e3cf86', '#3d5c6b', '#b32b8a'],
        hoverOffset: 4,
        pointRadius: 3,
    }]
})

// watch(() => socketStore?.data, (newData: any) => {
//     let graph_Data: any = [0,0,0,0,0,0,0,0,0,0,0,0]
//     for (let x in socketStore?.data.graph_data) {
//         var key:number = parseInt(x)
//         key--
//         graph_Data[key]=socketStore?.data.graph_data[x]
//     }
//     if (newData) {
//         chartData.value = {
//             labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
//             datasets: [{
//                 label: 'Tranfers',
//                 data: graph_Data,
//                 backgroundColor: ['#6f0be0', '#208a71', '#43e072', 'blue', 'orange', 'purple', '#e3cf86', '#3d5c6b', '#b32b8a'],
//                 hoverOffset: 4,
//                 pointRadius: 3,
//             }]
//         }
//     }
// })
</script>