<script setup lang="ts">
import { useFormStore } from "@/stores/form";
import { useAppStore } from "@/stores/app";
import { getRequestHandler } from "@/utils/httpHandler";
import VueDatePicker from "@vuepic/vue-datepicker";
import '@vuepic/vue-datepicker/dist/main.css'

const formStore = useFormStore()
const appStore = useAppStore()
const department = ref<any>(null)
const startDate = ref<any>()
const endDate = ref<any>(Date.now())
const formDate = ref<any>()
const form = ref<boolean>(false)
const analysis = ref<any>()
const quantityTotal = ref<any>()
const costTotal = ref<any>()

const getDepartments = async () => {
    formStore.loading = true
    let params = ""
    if (startDate.value) {
        params += `?from_=${new Date(startDate.value).toISOString().slice(0, 10)}&`
    }
    if (endDate.value) {
        if (startDate.value) {
            params += `to_=${new Date(endDate.value).toISOString().slice(0, 10)}`
        } else {
            params += `?to_=${new Date(endDate.value).toISOString().slice(0, 10)}`
        }
    }
    formDate.value = endDate.value
    let dep = typeof department.value == 'string' ? appStore.departments?.filter((item: any) => item.name == department.value)?.[0]?.id : department.value
    await getRequestHandler(`analysis/department/${dep}${params}`, true)
        .then(res => {
            analysis.value = res
            quantityTotal.value = res?.reduce((total: any, num: any) => {
                return total + num.quantity;
            }, 0)
            costTotal.value = res?.reduce((total: any, num: any) => {
                return total + num.cost;
            }, 0)

        })

        .finally(async () => {
            formStore.loading = false;
        });
}


</script>

<template>
    <v-responsive class="px-7 h-100">
        <v-form @submit.prevent="getDepartments" v-model="form">
            <v-row class="mt-3 h-100">
                <v-col cols="12" md="3">
                    <DepartmentCombobox v-model:model-value="department" placeholder="Choose Department"
                        :rules="[formStore.rules.required]" :showLabel="false" />
                </v-col>
                <v-col cols="12" md="3">

                    <VueDatePicker label="From" v-model="startDate" placeholder="Start Date"
                        :ui="{ input: 'dp-custom-input' }" />
                </v-col>
                <v-col cols="12" md="3">
                    <VueDatePicker v-model="endDate" placeholder="End Date" :ui="{ input: 'dp-custom-input' }" />
                </v-col>
                <v-col>
                    <v-btn :disabled="!form" :loading="formStore.loading" size="large" color="secondary"
                        class="ml-5 mt-1" type="submit">
                        Extract
                    </v-btn>
                </v-col>
            </v-row>
        </v-form>

        <div class="mt-5" v-if="analysis">
            <v-card class="pa-10">
                <v-card-title class="font-weight-bold text-decoration-underline text-center text-h5">DEPARTMENT COST
                    ANALYSIS AS AT {{ new Date(formDate).toISOString().slice(0, 10) }}</v-card-title>
                <v-card-text>
                    <h3>Department Name: <span class="font-weight-regular ml-3 text-capitalize">{{ analysis[0]?.name }}</span>
                    </h3>

                    <v-row class="mt-9 bg-secondary text-h6 font-weight-bold">
                        <v-col class="text-center">LINE ITEM</v-col>
                        <v-col class="text-center">QUANTITY</v-col>
                        <v-col class="text-center">COST/UNIT</v-col>
                        <v-col class="text-center">VALUE</v-col>
                    </v-row>

                    <v-row class="mt-13">
                        <v-col class="text-center text-h6" style="font-weight: 600;" cols="3">COLLECTIONS:</v-col>
                        <v-col cols="12">
                            <v-row style="font-size: 17px;" class="font-weight-medium" v-for="collection in analysis">
                                <v-col class="text-center" cols="3">{{ collection?.created_at?.split("T")[0] }}</v-col>
                                <v-col class="text-center" cols="3">{{ collection?.quantity }}</v-col>
                                <v-col class="text-center" cols="3">&pound; {{ collection?.cost }}</v-col>
                                <v-col class="text-center" cols="3">&pound; {{ (collection?.quantity *
                                    collection?.cost).toFixed(2) }}</v-col>
                            </v-row>
                        </v-col>
                    </v-row>

                    <v-row class="mt-13">
                        <v-col cols="12">
                            <v-row style="font-size: 17px;" class="font-weight-medium">
                                <v-col class="text-center text-center text-h6" style="font-weight: 600;"
                                    cols="3">TOTAL</v-col>
                                <v-col class="text-center" cols="3">{{ quantityTotal }}</v-col>
                                <v-col class="text-center" cols="3"> &pound; {{ costTotal.toFixed(2) }}</v-col>
                                <v-col class="text-center" cols="3">&pound; {{ quantityTotal * costTotal.toFixed(2) }}</v-col>
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