import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: [
      "activeTab",
      "http://localhost:8080/",
      "https://localhost:8080/",
      "http://localhost:8080/*",
      "https://localhost:8080/*"
    ],
    web_accessible_resources: [
      {
        matches: ["*://*/*"],
        resources: ["/assets/styles/*.css", "/assets/images/*.png", "/api/*.ts"]
      }
    ]
  },
});
