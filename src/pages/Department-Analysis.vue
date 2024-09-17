<script setup lang="ts">
import { useFormStore } from "@/stores/form";
import { useAppStore } from "@/stores/app";
import { getRequestHandler } from "@/utils/httpHandler";
import VueDatePicker from "@vuepic/vue-datepicker";
import { formatMoney } from "@/utils/date";
import "@vuepic/vue-datepicker/dist/main.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const formStore = useFormStore();
const appStore = useAppStore();
const department = ref<any>(null);
const startDate = ref<any>();
const endDate = ref<any>(Date.now());
const formDate = ref<any>();
const form = ref<boolean>(false);
const analysis = ref<any>();
const quantityTotal = ref<any>();
const costTotal = ref<any>();
const totalCostQuantity = ref<any>();

const generateDoc = () => {
  let orderRemodeled = analysis.value?.map((item: any, index: number) => {
    return [
      new Date(item?.values[0]?.created_at).toISOString().slice(0, 10),
      item?.values[0]?.barcode,
      item?.values?.[0].quantity,
      formatMoney(item?.values[0].cost),
      formatMoney(item?.values[0].quantity * item?.values[0].cost),
    ];
  });
  orderRemodeled.unshift([]);
  orderRemodeled.unshift(["COLLECTIONS", "", "", "", ""]);
  orderRemodeled.unshift([]);
  orderRemodeled.push([]);
  orderRemodeled.push([
    "TOTAL",
    "",
    quantityTotal.value,
    "",
    formatMoney(totalCostQuantity.value),
  ]);
  var doc = new jsPDF("l", "mm", "a4");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(
    "DEPARTMENT COST ANALYSIS AS AT " +
      new Date(formDate.value).toISOString().slice(0, 10),
    60,
    10
  );
  doc.setFontSize(13);
  doc.text("Department Name: " + analysis.value?.[0]?.name, 15, 20);
  autoTable(doc, {
    head: [["LINE ITEM", "BARCODE", "QUANTITY", "COST", "VALUE"]],
    body: orderRemodeled,
    margin: { top: 30 },
    theme: "striped",
    headStyles: {
      fillColor: "#1F4E79",
      minCellHeight: 15,
      valign: "middle",
      textColor: "white",
      fontStyle: 'bold',
      fontSize: 15
    },
    bodyStyles: { minCellHeight: 10, fontSize: 15 },
  });
  doc.autoPrint();
  doc.save(analysis.value?.[0]?.name + '-Analysis' + new Date().toLocaleDateString() + ".pdf");
};

const getDepartments = async () => {
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
  let dep =
    typeof department.value == "string"
      ? appStore.departments?.filter(
          (item: any) => item.name == department.value
        )?.[0]?.id
      : department.value;
  await getRequestHandler(`analysis/department/${dep}${params}`, true)
    .then((res) => {
      analysis.value = res;
      quantityTotal.value = res?.reduce((total: any, num: any) => {
        return (
          total +
          num.values.reduce(
            (total: any, value: any) => total + value.quantity,
            0
          )
        );
      }, 0);

      costTotal.value = res?.reduce((total: any, num: any) => {
        return (
          total +
          num.values.reduce((total: any, value: any) => total + value.cost, 0)
        );
      }, 0);

      totalCostQuantity.value = res?.reduce((total: any, num: any) => {
        return (
          total +
          num.values.reduce(
            (total: any, value: any) => total + value.cost * value.quantity,
            0
          )
        );
      }, 0);
    })

    .finally(async () => {
      formStore.loading = false;
    });
};
</script>

<template>
  <v-responsive class="px-7 h-100">
    <v-form @submit.prevent="getDepartments" v-model="form">
      <v-row class="mt-3 h-100">
        <v-col cols="12" md="3">
          <DepartmentCombobox
            v-model:model-value="department"
            placeholder="Choose Department"
            :rules="[formStore.rules.required]"
            :showLabel="false"
            class="bg-white mb-3"
          />
        </v-col>
        <v-col cols="12" md="3">
          <VueDatePicker
            label="From"
            v-model="startDate"
            placeholder="Start Date"
            :ui="{ input: 'dp-custom-input' }"
            class="bg-white mb-3"
          />
        </v-col>
        <v-col cols="12" md="3">
          <VueDatePicker
            v-model="endDate"
            placeholder="End Date"
            :ui="{ input: 'dp-custom-input' }"
            class="bg-white mb-3"
          />
        </v-col>
        <v-col>
          <v-btn
            :disabled="!form"
            :loading="formStore.loading"
            size="large"
            color="secondary"
            class="ml-5 mt-1"
            type="submit"
          >
            Extract
          </v-btn>
          <v-btn
            class="ml-2"
            v-if="analysis?.length >= 1"
            :loading="formStore.loading"
            color="secondary"
            @click="generateDoc()"
            icon="mdi-download"
            variant="text"
            title="Download Report"
          ></v-btn>
        </v-col>
      </v-row>
    </v-form>

    <div class="mt-5" v-if="analysis?.length >= 1">
      <v-card class="pa-10">
        <v-card-title
          class="font-weight-bold text-decoration-underline text-center text-h5"
          >DEPARTMENT COST ANALYSIS AS AT
          {{ new Date(formDate).toISOString().slice(0, 10) }}</v-card-title
        >
        <v-card-text>
          <h3>
            Department Name:
            <span class="font-weight-regular ml-3 text-capitalize">{{
              analysis[0]?.name
            }}</span>
          </h3>

          <v-row class="mt-9 bg-secondary text-h6 font-weight-bold">
            <v-col class="text-center">LINE ITEM</v-col>
            <v-col class="text-center">BARCODE</v-col>
            <v-col class="text-center">QUANTITY</v-col>
            <v-col class="text-center">COST/UNIT</v-col>
            <v-col class="text-center">VALUE</v-col>
          </v-row>

          <v-row class="mt-13">
            <v-col class="text-center text-h6" style="font-weight: 600" cols="3"
              >COLLECTIONS:</v-col
            >
            <v-col cols="12">
              <div v-for="group in analysis">
                <v-row
                  style="font-size: 17px"
                  class="font-weight-medium mx-4"
                  v-for="collection in group.values"
                >
                  <v-col class="text-center mb-3">
                    {{ collection?.created_at?.split("T")[0] }}
                  </v-col>
                  <v-col class="text-center">
                    {{ collection?.barcode }}
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
          </v-row>

          <v-row class="mt-13">
            <v-col cols="12">
              <v-row style="font-size: 17px" class="font-weight-medium">
                <v-col
                  class="text-center text-center text-h6"
                  style="font-weight: 600"
                  >TOTAL</v-col
                >
                <v-col class="text-center"></v-col>
                <v-col
                  class="text-center"
                  style="
                    font-weight: 600;
                    border-top: 2px solid #000;
                    border-bottom: 2px solid black;
                  "
                >
                  {{ quantityTotal }}
                </v-col>
                <v-col class="text-center"></v-col>
                <v-col
                  class="text-center"
                  style="
                    font-weight: 600;
                    border-top: 2px solid #000;
                    border-bottom: 2px solid black;
                  "
                >
                  {{ formatMoney(totalCostQuantity) }}
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>
    <v-card class="pa-10" v-else>
      <v-card-text class="text-center text-h6 font-weight-bold"
        >No Data Found</v-card-text
      >
    </v-card>
  </v-responsive>
</template>

<route lang="json">
{
  "meta": {
    "title": "Analysis",
    "layout": "DashboardLayout",
    "auth": true
  }
}
</route>

<style>
.dp-custom-input {
  background-color: transparent;
  height: 57px;
}
</style>
