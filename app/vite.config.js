import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://localhost:4000',
      '/morning-club': 'http://localhost:4000',
      '/wednesday-club': 'http://localhost:4000',
      '/approved-morning-clubs': 'http://localhost:4000',
      '/approved-wednesday-clubs': 'http://localhost:4000',
      '/teacher-availability': 'http://localhost:4000',
      '/misdemeanors': 'http://localhost:4000',
      '/ai-merges': 'http://localhost:4000',
      '/assess-similarity': 'http://localhost:4000',
      '/ai-merge-suggestions': 'http://localhost:4000',
      '/send-merge-emails': 'http://localhost:4000',
      '/club-enrollments': 'http://localhost:4000',
      '/user-clubs': 'http://localhost:4000',
      '/club': 'http://localhost:4000',
      '/upload-club-image': 'http://localhost:4000',
    }
  }
})