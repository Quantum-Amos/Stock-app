<script setup lang="ts">
import { useFormStore } from "@/stores/form";
import { getRequestHandler } from "@/utils/httpHandler";
import { formatMoney } from "@/utils/date";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const formStore = useFormStore();
const barCode = ref<any>(null);
const startDate = ref<any>();
const endDate = ref<any>(Date.now());
const formDate = ref<any>();
const form = ref<boolean>(false);
const analysis = ref<any>();
const quantityTotalStockIn = ref<any>();
const totalCostQuantityStockIn = ref<any>();
const quantityTotalStockOut = ref<any>();
const totalCostQuantityStockOut = ref<any>();
const quantityTotalStockAdjustment = ref<any>();
const totalCostQuantityStockAdjustment = ref<any>();


const generateDoc = () => {
    let orderRemodeled: any = []
    let stockIn = analysis.value?.stock_in?.map((item: any, index: number) => {
        return [
            new Date(item?.created_at).toISOString().slice(0, 10),
            item?.quantity,
            formatMoney(item?.cost),
            formatMoney(item?.quantity * item?.cost),
        ];
    });
    analysis.value?.stock_out?.map((item: any, index: number) => {
        return item?.values?.map((newItem: any) => {
            return orderRemodeled.push([
                new Date(newItem?.created_at).toISOString().slice(0, 10),
                newItem?.quantity,
                formatMoney(newItem?.cost),
                formatMoney(newItem?.quantity * newItem?.cost),
            ]);
        })
    });
    let stockAdjustment = analysis.value?.stock_adjustment?.map((item: any, index: number) => {
        return [
            new Date(item?.created_at).toISOString().slice(0, 10),
            item?.quantity,
            formatMoney(item?.cost),
            formatMoney(item?.quantity * item?.cost),
        ];
    });
    let avalableStock = [[], ['AVAILABLE STOCK:'],
    ["",
    quantityTotalStockIn.value - (quantityTotalStockOut.value + quantityTotalStockAdjustment.value), "", formatMoney(totalCostQuantityStockIn.value - (totalCostQuantityStockOut.value + totalCostQuantityStockAdjustment.value))],
    ];
    stockIn.unshift(["STOCK IN:"]);
    stockIn.unshift([]);
    stockIn.push([]);
    stockIn.push([
        "TOTAL",
        quantityTotalStockIn.value,
        "",
        formatMoney(totalCostQuantityStockIn.value),
    ]);

    orderRemodeled.unshift(["STOCK OUT:"]);
    orderRemodeled.unshift([]);
    orderRemodeled.push([]);
    orderRemodeled.push([
        "TOTAL",
        quantityTotalStockOut.value,
        "",
        formatMoney(totalCostQuantityStockOut.value),
    ]);

    var doc = new jsPDF("l", "mm", "a4");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(
        "ANALYTIC CODE ANALYSIS AS AT " +
        new Date(formDate.value).toISOString().slice(0, 10),
        65,
        10
    );
    doc.setFontSize(13);
    doc.setFont("helvetica", "normal");
    doc.text("Analytic Code: " + barCode.value, 15, 20);
    autoTable(doc, {
        head: [["LINE ITEM", "QUANTITY", "COST", "VALUE"]],
        body: [...stockIn, ...orderRemodeled, ...stockAdjustment, ...avalableStock],
        margin: { top: 40 },
        theme: "striped",
        headStyles: {
            fillColor: "#1F4E79",
            minCellHeight: 15,
            valign: "middle",
            textColor: "white",
            fontStyle: "bold",
            fontSize: 15,
        },
        bodyStyles: { minCellHeight: 10, fontSize: 15 },
    });
    doc.autoPrint();
    doc.save("ANALYTIC_CODE-" + barCode.value + "-Analysis-" + new Date().toLocaleDateString() + ".pdf");
};

const getAnalysis = async () => {
    formStore.loading = true;
    let params = "";
    if (startDate.value) {
        params += `?from_=${new Date(startDate.value).toISOString().slice(0, 10)}&`;
    }
    if (endDate.value) {
        if (startDate.value) {
            params += `to_=${new Date(endDate.value).toISOString().slice(0, 10)}`;
        } else {
            params += `?to_=${new Date(endDate.value).toISOString().slice(0, 10)}`;
        }
    }
    formDate.value = endDate.value;
    await getRequestHandler(`analysis/erm_code/${barCode.value}${params}`, true)
        .then((res) => {
            analysis.value = res;
            quantityTotalStockIn.value = res?.stock_in?.reduce(
                (total: number, value: any) => total + value?.quantity,
                0
            );
            totalCostQuantityStockIn.value = res?.stock_in?.reduce(
                (total: number, value: any) => total + value?.quantity * value?.cost,
                0
            );
            quantityTotalStockOut.value = res?.stock_out?.reduce((total: any, num: any) => {
                return (
                    total +
                    num.values.reduce((total: any, value: any) => total + value?.quantity, 0)
                );
            }, 0);

            totalCostQuantityStockOut.value = res?.stock_out?.reduce((total: any, num: any) => {
                return (
                    total +
                    num.values.reduce(
                        (total: any, value: any) => total + value.cost * value.quantity,
                        0
                    )
                );
            }, 0);

            quantityTotalStockAdjustment.value = res?.stock_adjustment?.reduce(
                (total: number, value: any) => total + value?.quantity,
                0
            );
            totalCostQuantityStockAdjustment.value = res?.stock_adjustment?.reduce(
                (total: number, value: any) => total + value.quantity * value.cost,
                0
            );
        })
        .finally(async () => {
            formStore.loading = false;
        });
};
</script>

<template>
    <v-responsive class="px-7 h-100">
        <v-form @submit.prevent="getAnalysis" v-model="form">
            <v-row class="mt-3 h-100">
                <v-col cols="12" md="3">
                    <v-text-field label="ANALYTIC CODE" v-model:model-value="barCode" placeholder="Enter ANALYTIC CODE"
                        :rules="[formStore.rules.required]" class="bg-white" variant="outlined" hide-details/>
                </v-col>
                <v-col cols="12" md="3">
                    <VueDatePicker label="From" v-model="startDate" placeholder="Start Date"
                        :ui="{ input: 'dp-custom-input' }" class="bg-white mb-3" />
                </v-col>
                <v-col cols="12" md="3">
                    <VueDatePicker v-model="endDate" placeholder="End Date" :ui="{ input: 'dp-custom-input' }"
                        class="bg-white mb-3" />
                </v-col>
                <v-col>
                    <v-btn :disabled="!form" :loading="formStore.loading" size="large" color="secondary"
                        class="ml-5 mt-1" type="submit">
                        Extract
                    </v-btn>
                    <v-btn class="ml-2" v-if="analysis" :loading="formStore.loading" color="secondary"
                        @click="generateDoc()" icon="mdi-download" variant="text" title="Download Report"></v-btn>
                </v-col>
            </v-row>
        </v-form>

        <div class="mt-5" v-if="analysis">
            <v-card class="pa-10">
                <v-card-title class="font-weight-bold text-decoration-underline text-center text-h5">ANALYTIC CODE
                    ANALYSIS AS AT
                    {{ new Date(formDate).toISOString().slice(0, 10) }}</v-card-title>
                <v-card-text>
                    <h3>
                        ANALYTIC CODE:
                        <span class="font-weight-regular ml-15">{{
                            barCode
                            }}</span>
                    </h3>

                    <v-row class="mt-9 bg-secondary text-h6 font-weight-bold">
                        <v-col class="text-center">LINE ITEM</v-col>
                        <v-col class="text-center">QUANTITY</v-col>
                        <v-col class="text-center">COST/UNIT</v-col>
                        <v-col class="text-center">VALUE</v-col>
                    </v-row>

                    <v-row class="mt-13">
                        <v-col class="text-center text-h6" style="font-weight: 600" cols="3">STOCK IN:</v-col>
                        <v-col cols="12">
                            <v-row style="font-size: 17px" class="font-weight-medium"
                                v-for="stock_in in analysis?.stock_in">
                                <v-col class="text-center" cols="3">{{
                                    stock_in?.created_at?.split("T")[0]
                                }}</v-col>
                                <v-col class="text-center" cols="3">{{
                                    stock_in?.quantity
                                }}</v-col>
                                <v-col class="text-center" cols="3">{{
                                    formatMoney(stock_in?.cost)
                                }}</v-col>
                                <v-col class="text-center" cols="3">{{
                                    formatMoney(stock_in?.quantity * stock_in?.cost)
                                }}</v-col>
                            </v-row>
                        </v-col>
                        <v-row class="mt-10">
                            <v-row style="font-size: 17px" class="font-weight-medium">
                                <v-col class="text-center text-h6" style="font-weight: 600" cols="3">TOTAL</v-col>
                                <v-col class="text-center" style="
                    font-weight: 600;
                    border-top: 2px solid #000;
                    border-bottom: 2px solid black;
                  " cols="3">
                                    {{ quantityTotalStockIn }}
                                </v-col>
                                <v-col class="text-center" cols="3"></v-col>
                                <v-col class="text-center" style="
                    font-weight: 600;
                    border-top: 2px solid #000;
                    border-bottom: 2px solid black;
                  " cols="3">
                                    {{ formatMoney(totalCostQuantityStockIn) }}
                                </v-col>
                            </v-row>
                        </v-row>
                    </v-row>

                    <v-row class="mt-13">
                        <v-col class="text-center text-h6" style="font-weight: 600" cols="3">STOCK OUT:</v-col>
                        <v-col cols="12">
                            <div v-for="group in analysis?.stock_out">
                                <v-row style="font-size: 17px" class="font-weight-medium mx-4"
                                    v-for="collection in group.values">
                                    <v-col class="text-center mb-3">
                                        {{ collection?.created_at?.split("T")[0] }}
                                    </v-col>
                                    <v-col class="text-center">
                                        {{ collection?.quantity }}
                                    </v-col>
                                    <v-col class="text-center">
                                        {{ formatMoney(collection?.cost) }}
                                    </v-col>
                                    <v-col class="text-center">
                                        {{ formatMoney(collection?.quantity * collection?.cost) }}
                                    </v-col>
                                </v-row>
                            </div>
                        </v-col>
                        <v-row class="mt-10">
                            <v-row style="font-size: 17px" class="font-weight-medium">
                                <v-col class="text-center text-h6" style="font-weight: 600" cols="3">TOTAL</v-col>
                                <v-col class="text-center" style="
                    font-weight: 600;
                    border-top: 2px solid #000;
                    border-bottom: 2px solid black;
                  " cols="3">
                                    {{ quantityTotalStockOut }}
                                </v-col>
                                <v-col class="text-center" cols="3"></v-col>
                                <v-col class="text-center" style="
                    font-weight: 600;
                    border-top: 2px solid #000;
                    border-bottom: 2px solid black;
                  " cols="3">
                                    {{ formatMoney(totalCostQuantityStockOut) }}
                                </v-col>
                            </v-row>
                        </v-row>

                    </v-row>

                    <v-row class="mt-13">
                        <v-col class="text-center text-h6" style="font-weight: 600" cols="3">STOCK ADJUSTMENT:</v-col>
                        <v-col cols="12">
                            <v-row style="font-size: 17px" class="font-weight-medium"
                                v-for="stock_adjustment in analysis?.stock_adjustment">
                                <v-col class="text-center" cols="3">{{
                                    stock_adjustment?.created_at?.split("T")[0]
                                }}</v-col>
                                <v-col class="text-center" cols="3">{{
                                    stock_adjustment?.quantity
                                }}</v-col>
                                <v-col class="text-center" cols="3">{{
                                    formatMoney(stock_adjustment?.cost)
                                }}</v-col>
                                <v-col class="text-center" cols="3">{{
                                    formatMoney(stock_adjustment?.quantity * stock_adjustment?.cost)
                                }}</v-col>
                            </v-row>
                        </v-col>
                        <v-row class="mt-10">
                            <v-row style="font-size: 17px" class="font-weight-medium">
                                <v-col class="text-center text-h6" style="font-weight: 600" cols="3">TOTAL</v-col>
                                <v-col class="text-center" style="
                                font-weight: 600;
                                border-top: 2px solid #000;
                                border-bottom: 2px solid black;
                            " cols="3">
                                    {{ quantityTotalStockAdjustment }}
                                </v-col>
                                <v-col class="text-center" cols="3"></v-col>
                                <v-col class="text-center" style="
                                font-weight: 600;
                                border-top: 2px solid #000;
                                border-bottom: 2px solid black;
                            " cols="3">
                                    {{ formatMoney(totalCostQuantityStockAdjustment) }}
                                </v-col>
                            </v-row>
                        </v-row>

                    </v-row>

                    <v-row class="mt-13">
                        <v-col class="text-center text-h6" style="font-weight: 600;" cols="3">AVAILABLE STOCK:</v-col>
                        <v-col cols="12">
                            <v-row style="font-size: 17px;" class="font-weight-medium">
                                <v-col class="text-center" cols="3"></v-col>
                                <v-col class="text-center" cols="3">{{  quantityTotalStockIn - (quantityTotalStockOut + quantityTotalStockAdjustment )}}</v-col>
                                <v-col class="text-center" cols="3"></v-col>
                                <v-col class="text-center" style="font-weight: 600;" cols="3">
                                    {{ formatMoney(totalCostQuantityStockIn - (totalCostQuantityStockOut +
                                        totalCostQuantityStockAdjustment)) }}
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </div>
    </v-responsive>
</template>

<route lang="json">{
    "meta": {
        "title": "Analysis",
        "layout": "DashboardLayout",
        "auth": true
    }
}</route>

<style>
.dp-custom-input {
    background-color: transparent;
    height: 57px;
}
</style>
