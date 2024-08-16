<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  //
  import { useRouter } from 'vue-router';

const router = useRouter()

router.beforeEach((to, from, next) => {
  if(to.path != '/'){
    window.document.title = to.meta.title + " | Stock Management";
  }
  else{
    window.document.title = "Stock Management";
  }
  next();
});

router.onError((error) => {
  if (error.toString().includes('TypeError: error loading dynamically imported module')) {
    window.location.reload()
  }
})
</script>
