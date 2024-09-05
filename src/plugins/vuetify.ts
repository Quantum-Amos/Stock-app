/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes :{
      light :{
        colors : {
          primary : "#101820", 
          secondary : "#1F4E79",
          bgDrawer: '#101820',
          card_bg : "#FFDDE6",
          alternate: "#E64261",
          header: "#D8E2EE",
          table : "#D8E2EE",
          toolbar : "#dbe5f0",
          analysis: "#008A8A"
          // global1 : "",
          // global2 : "",
          // global3 : "",
        }
      }
    }
  },
})
