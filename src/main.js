import App from "./App.svelte";

const app = new App({
  target: document.body,
  props: {
    name: "Hello megan",
    age: "28",
  },
});

export default app;
