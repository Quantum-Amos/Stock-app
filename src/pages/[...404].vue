
<template>
    <v-responsive class="align-center fill-height mx-auto">
        <v-container>
    <v-card width="600" class="bg-white mx-auto text-center pa-10">
      <v-card-title class="text-h1 font-weight-bold">404</v-card-title>
        <v-card-text>
            <p class="text-h6">The page you requested cannot be found.</p>
            <v-btn class="bg-secondary my-10" to="/dashboard">
                Dashboard
            </v-btn>
        </v-card-text>
    </v-card>
  </v-container>
    </v-responsive>
  </template>
  <route lang="json">
  {
    "meta": {
      "title": "Home",
      "layout": "default"
    }
  }
  </route>
  <script lang="ts" setup>
  //
  </script>
  