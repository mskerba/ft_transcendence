import { defineConfig } from 'vite'
// @ts-ignore
import React from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [React()],
})
