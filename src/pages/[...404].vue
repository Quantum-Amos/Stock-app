
<template>
    <v-responsive class=" login_bg align-center fill-height mx-auto">
        <v-container>
    <v-card width="600" class="bg-white mx-auto text-center pa-8">
      <v-card-title class="text-h1 font-weight-bold text-secondary">404</v-card-title>
        <v-card-text>
            <p class="text-h6">The page you requested cannot be found.</p>
            <v-btn class="bg-secondary my-10" to="/dashboard" v-if="session">
                Dashboard
            </v-btn>
            <v-btn class="bg-secondary my-10" to="/" else>
                Login
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
    const session = sessionStorage.getItem(import.meta.env.VITE_SESSION_KEY)
  </script>
  