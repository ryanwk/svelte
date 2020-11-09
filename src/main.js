import App from "./App.svelte";

const app = new App({
  target: document.body,
  props: {
    name: "ryan",
    age: "28",
  },
});

export default app;
