import 'vuetify/styles'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { aliases, md } from 'vuetify/iconsets/md'
import { VTimePicker } from 'vuetify/labs/VTimePicker'

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#0D47A1',
        secondary: '#0a5cb8',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107'
      },
    },
  },
  icons: {
    iconfont: 'md',
    aliases,
    sets: {
      md,
    },
  },
  components: {
    VDateInput,
    VTimePicker,
  },
});

