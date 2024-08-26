<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
//
import { useRouter } from "vue-router";

const router = useRouter();

// router.beforeEach((to, from, next) => {
//   if(to.path != '/'){
//     window.document.title = to.meta.title + " | Stores Management System";
//   }
//   else{
//     window.document.title = "Stores Management System";
//   }
//   next();
// });


router.beforeEach((to, from, next) => {
  let session_user = JSON.parse(sessionStorage.getItem(import.meta.env.VITE_SESSION_USER) || '{}')
if(to.meta.auth){
  if(sessionStorage.getItem(import.meta.env.VITE_SESSION_KEY)){
    if(to.path.includes('dashboard')){
      if(session_user.roles.name == 'engineer'){
        window.document.title = to.meta.title + " | Store Management";
        next()
      }
      else{
        next('/stock-chart')
      }
    }
    else if(to.path.includes('stock-chart')){
      if(session_user.roles.name == 'stock_controller'){
        window.document.title = to.meta.title + " | Store Management";
        next()
      }
      else{
        next('/EngineerDashboard')
      }
    }
    else{
      window.document.title = to.meta.title + " | Store Management";
      next()
    }
  }
  else{
    window.document.title = "Store Management";
    router.replace('/')
  }
} else{
  if(sessionStorage.getItem(import.meta.env.VITE_SESSION_KEY)){
    router.push('/engineerdashboard')
  }
  else{
    window.document.title = "Store Management";
    next()
  }
} 
});

router.onError((error) => {
  if (
    error
      .toString()
      .includes("TypeError: error loading dynamically imported module")
  ) {
    window.location.reload();
  }
});
</script>
