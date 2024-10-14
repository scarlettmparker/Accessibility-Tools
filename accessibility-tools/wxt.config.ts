import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: [
      "activeTab",
      "https://en.wiktionary.org/*",
    ],
    web_accessible_resources: [
      {
        matches: ["*://*/*"],
        resources: ["/assets/styles/*.css", "/assets/images/*.png", "/api/*.ts"]
      }
    ]
  },
});
