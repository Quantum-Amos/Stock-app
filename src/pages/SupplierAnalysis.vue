<script setup lang="ts">
import { useFormStore } from "@/stores/form";
import { getRequestHandler } from "@/utils/httpHandler";
import { formatMoney } from "@/utils/date";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { usePurchaseStore } from "@/stores/purchase";

const formStore = useFormStore();
const purchaseStore = usePurchaseStore()
const supplier_name = ref<string>('')
const startDate = ref<any>();
const endDate = ref<any>(Date.now());
const formDate = ref<any>();
const form = ref<boolean>(false);
const analysis = ref<any>();
const quantityTotal = ref<any>();
const totalCostQuantity = ref<any>();


const generateDoc = () => {
    let stockIn  = []
    analysis.value?.map((item: any, index: number) => {
    return item?.purchase_order_items?.map((newItem: any) => {
        return stockIn.push([
          new Date(newItem?.created_at).toISOString().slice(0, 10),
          newItem?.supplier_code,
          newItem?.barcode?.barcode,
          newItem?.quantity,
          formatMoney(newItem?.price),
          formatMoney(newItem?.sub_total),
        ]);
      })
  });

    stockIn.unshift(["PURCHASE ITEMS:"]);
    stockIn.unshift([]);
    stockIn.push([]);
    stockIn.push([
        "TOTAL",
        "",
        "",
        quantityTotal.value,
        "",
        formatMoney(totalCostQuantity.value),
    ]);

    var doc = new jsPDF("l", "mm", "a4");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(
        "SUPPLIER ANALYSIS AS AT " +
        new Date(formDate.value).toISOString().slice(0, 10),
        65,
        10
    );
    doc.setFontSize(13);
    doc.setFont("helvetica", "normal");
    doc.text("Supplier Name: " + analysis.value[0]?.suppliers?.name, 15, 20);
    autoTable(doc, {
        head: [["CREATED AT", "SUPPLIER CODE", "PRODUCT CODE", "QUANTITY", "COST", "VALUE"]],
        body: [...stockIn],
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
    doc.save("Analysis-for-supplier-" + analysis.value[0]?.suppliers?.name + "-at-" + new Date().toLocaleDateString() + ".pdf");
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
    await getRequestHandler(`analysis/purchase-orders/${supplier_name.value}${params}`, true)
        .then((res) => {
            analysis.value = res
            quantityTotal.value = res?.reduce((total: any, num: any) => {
                return (
                total +
                num.purchase_order_items.reduce(
                    (total: any, value: any) => total + value.quantity,
                    0
                )
                );
            }, 0);
            totalCostQuantity.value = res?.reduce((total: any, num: any) => {
                return (
                total +
                num.purchase_order_items.reduce(
                    (total: any, value: any) => total + value.sub_total,
                    0
                )
                );
            }, 0);
        })
        .finally(async () => {
            formStore.loading = false;
        });
};

onMounted(async () => {
    await purchaseStore.getSuppliers()
})
</script>

<template>
    <v-responsive class="px-7 h-100">
        <v-form @submit.prevent="getAnalysis" v-model="form">
            <v-row class="mt-3 h-100">
                <v-col cols="12" md="3">
                    <v-combobox label="Supplier Name" variant="outlined" v-model="supplier_name"
                        :items="purchaseStore.suppliers" item-title="name" item-value="id" :return-object="false"/>
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
                    <v-btn class="ml-2" v-if="analysis?.length >= 1" :loading="formStore.loading" color="secondary"
                        @click="generateDoc()" icon="mdi-download" variant="text" title="Download Report"></v-btn>
                </v-col>
            </v-row>
        </v-form>

        <div class="mt-5" v-if="analysis?.length >= 1">
            <v-card class="pa-10">
                <v-card-title class="font-weight-bold text-decoration-underline text-center text-h5">SUPPLIER
                    ANALYSIS AS AT
                    {{ new Date(formDate).toISOString().slice(0, 10) }}</v-card-title>
                <v-card-text>
                    <h3>
                        Supplier Name:
                        <span class="font-weight-regular ml-15">{{analysis[0]?.suppliers?.name}}</span>
                    </h3>

                    <v-row class="mt-9 bg-secondary text-h6 font-weight-bold">
                        <v-col class="text-center">CREATED AT</v-col>
                        <v-col class="text-center">SUPPLIER CODE</v-col>
                        <v-col class="text-center">PRODUCT CODE</v-col>
                        <v-col class="text-center">QUANTITY</v-col>
                        <v-col class="text-center">COST/UNIT</v-col>
                        <v-col class="text-center">VALUE</v-col>
                    </v-row>

                    <v-row class="mt-13">
                        <v-col class="text-center text-h6" style="font-weight: 600" cols="3">PURCHASE ITEMS:</v-col>
                        <v-col cols="12">
                            <v-row style="font-size: 17px" class="font-weight-medium"
                                v-for="purchase_order in analysis">
                                <v-row style="font-size: 17px; margin-bottom: 3px; margin-left: 20px;" class="font-weight-medium"
                                    v-for="purchase_items in purchase_order?.purchase_order_items">
                                <v-col class="text-center" cols="2">{{
                                    purchase_items?.created_at?.split("T")[0]
                                }}</v-col>
                                <v-col class="text-center" cols="2">
                                    {{  purchase_items?.supplier_code }}
                                </v-col>
                                <v-col class="text-center" cols="2">
                                    {{  purchase_items?.barcode?.barcode }}
                                </v-col>
                                <v-col class="text-center" cols="2">{{
                                    purchase_items?.quantity
                                }}</v-col>
                                <v-col class="text-center" cols="2">{{
                                    formatMoney(purchase_items?.price)
                                }}</v-col>
                                <v-col class="text-center" cols="2">{{
                                    formatMoney(purchase_items?.sub_total)
                                }}</v-col>
                            </v-row>
                        </v-row>
                        </v-col>
                        <v-row class="mt-10">
                            <v-row style="font-size: 17px" class="font-weight-medium">
                                <v-col class="text-center text-h6" style="font-weight: 600" cols="2">TOTAL</v-col>
                                <v-col class="text-center" cols="4"></v-col>
                                <v-col class="text-center" style="
                                font-weight: 600;
                                border-top: 2px solid #000;
                                border-bottom: 2px solid black;
                                " cols="2">
                                    {{ quantityTotal }}
                                </v-col>
                                <v-col class="text-center" cols="2"></v-col>
                                <v-col class="text-center" style="
                                font-weight: 600;
                                border-top: 2px solid #000;
                                border-bottom: 2px solid black;
                                " cols="2">
                                    {{ formatMoney(totalCostQuantity) }}
                                </v-col>
                            </v-row>
                        </v-row>
                    </v-row>

                    <!-- <v-row class="mt-13">
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

                    </v-row> -->

                    <!-- <v-row class="mt-13">
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

                    </v-row> -->

                    <!-- <v-row class="mt-13">
                        <v-col class="text-center text-h6" style="font-weight: 600;" cols="3">AVAILABLE STOCK:</v-col>
                        <v-col cols="12">
                            <v-row style="font-size: 17px;" class="font-weight-medium">
                                <v-col class="text-center" cols="3">{{
                                    analysis?.available_stock?.created_at?.split("T")[0] }}</v-col>
                                <v-col class="text-center" cols="3">{{ analysis?.available_stock?.quantity }}</v-col>
                                <v-col class="text-center" cols="3"></v-col>
                                <v-col class="text-center" style="font-weight: 600;" cols="3">
                                    {{ formatMoney(totalCostQuantityStockIn - (totalCostQuantityStockOut +
                                        totalCostQuantityStockAdjustment)) }}
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row> -->
                </v-card-text>
            </v-card>
        </div>
        <v-card class="pa-10" v-else>
      <v-card-text class="text-center text-h6 font-weight-bold">No Data Found</v-card-text>
    </v-card>
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
