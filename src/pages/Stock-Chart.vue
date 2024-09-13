<script setup lang="ts">
import { useAppStore } from '@/stores/app';
import { useFormStore } from '@/stores/form';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'vue-chartjs';


ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);


const appStore = useAppStore();
const formStore = useFormStore();

const rangeInput1 = ref<any>("100-500");
const showrangeInput1 = ref<boolean>(true);
const stocksAvailable = ref<number>(0);
const fromValue = ref<number>(1);
const toValue = ref<number>();
const range = ref<any>();

const chartData = ref<{
    runningStock: {
        labels: string[];
        datasets: {
            label: string;
            backgroundColor: string;
            borderColor: string;
            fill: boolean;
            tension: number;
            pointRadius: number;
            data: number[];
        }[];
    };
    adjustmentStock: {
        labels: string[];
        datasets: {
            label: string;
            backgroundColor: string;
            borderColor: string;
            fill: boolean;
            tension: number;
            pointRadius: number;
            data: number[];
        }[];
    };
    stockOut: {
        labels: string[];
        datasets: {
            label: string;
            backgroundColor: string;
            borderColor: string;
            fill: boolean;
            tension: number;
            pointRadius: number;
            data: number[];
        }[];
    };
    ermQuantity: {
        labels: string[];
        datasets: {
            label: string;
            backgroundColor: string;
            borderColor: string;
            fill: boolean;
            tension: number;
            pointRadius: number;
            data: number[];
        }[];  
    };
}>({
    runningStock: { labels: [], datasets: [] },
    adjustmentStock: { labels: [], datasets: [] },
    stockOut: { labels: [], datasets: [] },
    ermQuantity: { labels: [], datasets: [] },
});

const options = {
    responsive: true,
    maintainAspectRatio: false,
};

function validateRange() {
    const regex = /^(\d+)-(\d+)$/;
    const match = rangeInput1?.value?.match(regex);
    if (match) {
        range.value = [parseInt(match[1]), parseInt(match[2])];
        if (parseInt(match[2]) > stocksAvailable?.value) {
            return "Range above stocks label available"
        } else if (parseInt(match[1]) > parseInt(match[2])) {
            return `Invalid range input:  ${match[1]} should not be greater than ${match[2]}`
        }
        return true;
    }
    else {
        return "Invalid range input"
    }
}

const applyRange = async () => {
    formStore.loading = true
    fromValue.value = range.value[0];
    toValue.value = range.value[1];
    await appStore.getRunningStock(range.value[0], range.value[1], true);
    await appStore.getStockAdjustmentRegistered(range.value[0], range.value[1], true);
    await appStore.getStockOutRegistered(range.value[0], range.value[1], true);
    formStore.loading = false;
};

watchEffect(() => {
    chartData.value.runningStock = {
        labels: appStore?.runningStock?.map((value: any) => value.barcode.code),
        datasets: [
            {
                label: "Running Stock",
                backgroundColor: "#004CEB",
                borderColor: "#36A2EC",
                fill: true,
                data: appStore?.runningStock?.map((value: any) => value.remaining_quantity),
                tension: 0.4,
                pointRadius: 3,
            },
        ],
    };

    chartData.value.adjustmentStock = {
        labels: appStore?.stockAdjustmentRegistered?.map((value: any) => value.code),
        datasets: [
            {
                label: "Stock Adjustment",
                backgroundColor: "#76A2EB",
                borderColor: "#36A2EB",
                fill: true,
                data: appStore?.stockAdjustmentRegistered?.map((value: any) => value.quantity),
                tension: 0.4,
                pointRadius: 3,
            },
        ],
    };

    chartData.value.stockOut = {
        labels: appStore?.stockOutRegistered?.map((value: any) => value.code),
        datasets: [
            {
                label: "Stock Out",
                backgroundColor: "#168CE8",
                borderColor: "#36A2EB",
                fill: true,
                data: appStore?.stockOutRegistered?.map((value: any) => value.quantity),
                tension: 0.4,
                pointRadius: 3,
            },
        ],
    };

    chartData.value.ermQuantity = {
        labels: appStore?.ermQuantity?.map((value: any) => value.erm_code),
        datasets: [
            {
                label: "ERM Quantity",
                backgroundColor: "#56BFEF",
                borderColor: "#36A2EB",
                fill: true,
                data: appStore?.ermQuantity?.map((value: any) => value.quantity),
                tension: 0.4,
                pointRadius: 3,
            },
        ],
    };

    rangeInput1.value = `${fromValue.value}-${toValue.value || chartData.value.runningStock?.labels?.length}`;
    showrangeInput1.value = stocksAvailable?.value >= 1;
});

onMounted(async () => {
    // Fetch data from appStore
    await Promise.all([
        appStore.getRunningStock(null, null, true),
        appStore.getStockAdjustmentRegistered(),
        appStore.getStockOutRegistered(),
        appStore.getErmQuantity()
    ]);

    // Update stocksAvailable
    stocksAvailable.value = chartData.value.runningStock.labels?.length;

    // Update chartData
    chartData.value.runningStock = {
        labels: appStore?.runningStock?.map((value: any) => value.barcode.code),
        datasets: [
            {
                label: "Running Stock",
                backgroundColor: "#36A2EB",
                borderColor: "#36A2EB",
                fill: true,
                data: appStore?.runningStock?.map((value: any) => value.remaining_quantity),
                tension: 0.4,
                pointRadius: 3,
            },
        ],
    };

    chartData.value.adjustmentStock = {
        labels: appStore?.stockAdjustmentRegistered?.map((value: any) => value.code),
        datasets: [
            {
                label: "Stock Adjustment",
                backgroundColor: "#36A2EB",
                borderColor: "#36A2EB",
                fill: true,
                data: appStore?.stockAdjustmentRegistered?.map((value: any) => value.quantity),
                tension: 0.4,
                pointRadius: 3,
            },
        ],
    };

    chartData.value.stockOut = {
        labels: appStore?.stockOutRegistered?.map((value: any) => value.code),
        datasets: [
            {
                label: "Stock Out",
                backgroundColor: "#36A2EB",
                borderColor: "#36A2EB",
                fill: true,
                data: appStore?.stockOutRegistered?.map((value: any) => value.quantity),
                tension: 0.4,
                pointRadius: 3,
            },
        ],
    };
    chartData.value.ermQuantity = {
        labels: appStore?.ermQuantity?.map((value: any) => value.erm_code),
        datasets: [
            {
                label: "ERM CODE QUANTITY",
                backgroundColor: "#36A2EB",
                borderColor: "#36A2EB",
                fill: true,
                data: appStore?.ermQuantity?.map((value: any) => value.quantity),
                tension: 0.4,
                pointRadius: 3,
            },
        ],
    };
});
</script>

<template>
    <v-row>
        <v-col cols="12" class="pa-10">
            <v-row v-if="showrangeInput1">
                <v-col cols="10">
                    <v-text-field label="Enter Stock Range (e.g.,From 100-500)" v-model="rangeInput1"
                        :rules="[validateRange]" variant="outlined"></v-text-field>
                </v-col>
                <v-col cols="2" class="mt-3">
                    <v-btn @click="applyRange" :loading="formStore.loading" class="bg-secondary">Apply</v-btn>
                </v-col>
            </v-row>
            <v-card height="600" title="RUNNING STOCK REPORT" class="text-center">
                <Bar :data="chartData?.runningStock" :options="options" style="height: 530px;" />
            </v-card>
        </v-col>
        <v-col cols="12" class="pa-10">
            <v-card height="600" title="STOCK ADJUSTMENT REPORT" class="text-center">
                <Bar :data="chartData?.adjustmentStock" :options="options" style="height: 530px;" />
            </v-card>
        </v-col>
        <v-col cols="12" class="pa-10">
            <v-card height="600" title="STOCK OUT REPORT" class="text-center">
                <Bar :data="chartData?.stockOut" :options="options" style="height: 530px;" />
            </v-card>
        </v-col>
        <v-col cols="12" class="pa-10">
            <v-card height="600" title="ERM REPORT" class="text-center">
                <Bar :data="chartData?.ermQuantity" :options="options" style="height: 530px;" />
            </v-card>
        </v-col>
    </v-row>
</template>

<route lang="json">{
    "meta": {
        "title": "Stock Chart",
            "layout": "DashboardLayout",
    "auth" : true
    }
}</route>