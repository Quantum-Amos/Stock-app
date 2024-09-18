<script setup lang="ts">
import StockRunningCombobox from "@/components/StockRunningCombobox.vue";
import { useFormStore } from "@/stores/form";
import { useAppStore } from "@/stores/app";
import { getRequestHandler } from "@/utils/httpHandler";
import { formatMoney } from "@/utils/date";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const formStore = useFormStore();
const appStore = useAppStore();
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


const generateDoc = () => {
    let stockIn = analysis.value?.stock_in?.map((item: any, index: number) => {
        return [
            new Date(item?.created_at).toISOString().slice(0, 10),
            item?.quantity,
            formatMoney(item?.cost),
            formatMoney(item?.quantity * item?.cost),
        ];
    });
    let stockOut = analysis.value?.stock_out?.map((item: any, index: number) => {
        return [
            new Date(item?.created_at).toISOString().slice(0, 10),
            item?.quantity,
            formatMoney(item?.cost),
            formatMoney(item?.quantity * item?.cost),
        ];
    });
    let avalableStock = [[], ['AVAILABLE STOCK:'],
    [analysis.value?.available_stock?.created_at?.split("T")[0],
    analysis.value?.available_stock?.quantity, "", formatMoney(totalCostQuantityStockIn.value - totalCostQuantityStockOut.value)],
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

    stockOut.unshift(["STOCK OUT:"]);
    stockOut.unshift([]);
    stockOut.push([]);
    stockOut.push([
        "TOTAL",
        quantityTotalStockOut.value,
        "",
        formatMoney(totalCostQuantityStockOut.value),
    ]);

    var doc = new jsPDF("l", "mm", "a4");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(
        "PRODUCT COST ANALYSIS AS AT " +
        new Date(formDate.value).toISOString().slice(0, 10),
        65,
        10
    );
    doc.setFontSize(13);
    doc.setFont("helvetica", "normal");
    doc.text("Product Barcode: " + analysis.value?.description?.barcode, 15, 20);
    doc.text(
        "Product Description: " + analysis.value?.description?.specification,
        15,
        25,
        { maxWidth: 270 }
    );
    autoTable(doc, {
        head: [["LINE ITEM", "QUANTITY", "COST", "VALUE"]],
        body: [...stockIn, ...stockOut, ...avalableStock],
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
    doc.save("Product-" + analysis.value?.description?.barcode + "-Analysis" + new Date().toLocaleDateString() + ".pdf");
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
    let barcode =
        typeof barCode.value == "string"
            ? appStore.barcodes?.filter(
                (item: any) => item.barcode == barCode.value
            )?.[0]?.barcode
            : barCode.value.barcode;
    await getRequestHandler(`analysis/${barcode}${params}`, true)
        .then((res) => {
            analysis.value = res;
            quantityTotalStockIn.value = res?.stock_in?.reduce(
                (total: number, value: any) => total + value?.quantity,
                0
            );
            totalCostQuantityStockIn.value = res?.stock_in?.reduce(
                (total: number, value: any) => total + value.quantity * value.cost,
                0
            );
            quantityTotalStockOut.value = res?.stock_out?.reduce(
                (total: number, value: any) => total + value?.quantity,
                0
            );
            totalCostQuantityStockOut.value = res?.stock_out?.reduce(
                (total: number, value: any) => total + value.quantity * value.cost,
                0
            );
        })
        .finally(async () => {
            formStore.loading = false;
        });
};

onMounted(async () => {
    await appStore.getBarcodes();
});
</script>

<template>
    <v-responsive class="px-7 h-100">
        <v-form @submit.prevent="getAnalysis" v-model="form">
            <v-row class="mt-3 h-100">
                <v-col cols="12" md="3">
                    <StockRunningCombobox label="" v-model:model-value="barCode" placeholder="Enter Barcode"
                        :rules="[formStore.rules.required]" class="bg-white mb-3" />
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
                <v-card-title class="font-weight-bold text-decoration-underline text-center text-h5">PRODUCT COST
                    ANALYSIS AS AT
                    {{ new Date(formDate).toISOString().slice(0, 10) }}</v-card-title>
                <v-card-text>
                    <h3>
                        Product Barcode:
                        <span class="font-weight-regular ml-15">{{
                            analysis?.description?.barcode
                            }}</span>
                    </h3>
                    <h3 class="mt-4">
                        Product Description:
                        <span class="font-weight-regular ml-8">{{
                            analysis?.description?.specification
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
                            <v-row style="font-size: 17px" class="font-weight-medium"
                                v-for="stock_out in analysis?.stock_out">
                                <v-col class="text-center" cols="3">{{
                                    stock_out?.created_at?.split("T")[0]
                                    }}</v-col>
                                <v-col class="text-center" cols="3">{{
                                    stock_out?.quantity
                                    }}</v-col>
                                <v-col class="text-center" cols="3">{{
                                    formatMoney(stock_out?.cost)
                                    }}</v-col>
                                <v-col class="text-center" cols="3">{{
                                    formatMoney(stock_out?.quantity * stock_out?.cost)
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
                        <v-col class="text-center text-h6" style="font-weight: 600;" cols="3">AVAILABLE STOCK:</v-col>
                        <v-col cols="12">
                            <v-row style="font-size: 17px;" class="font-weight-medium">
                                <v-col class="text-center" cols="3">{{
                                    analysis?.available_stock?.created_at?.split("T")[0] }}</v-col>
                                <v-col class="text-center" cols="3">{{ analysis?.available_stock?.quantity }}</v-col>
                                <v-col class="text-center" cols="3"></v-col>
                                <v-col class="text-center" style="font-weight: 600;" cols="3">
                                    {{ formatMoney(totalCostQuantityStockIn - totalCostQuantityStockOut) }}
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
