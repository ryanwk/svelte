<script>
  import ContactCard from "./ContactCard.svelte";

  export let name;
  let age = 28;

  // this is a labeled statement "$:", reactive variables
  $: uppercaseName = name.toUpperCase();

  $: console.log(name);

  $: if (name == "ryry") {
    age = 28;
  }

  function incrementAge() {
    age += 1;
  }

  function changeName() {
    name = "ryry";
  }
  function nameInput(event) {
    const enteredValue = event.target.value;
    name = enteredValue;
  }
</script>

<style>
  h1 {
    color: purple;
  }
</style>

<h1>Hello {uppercaseName}, my age is {age}!</h1>
<button on:click={incrementAge}>Change Age</button>
<!-- <button on:click={changeName}>Change Name</button> -->
<!-- specify data input & output -->
<!-- <input type="text" value={name} on:input={nameInput} /> -->
<!-- binding - shorthand for above -->
<input type="text" bind:value={name} on:input={nameInput} />

<!-- since I've imported "ContactCard.svelte" I can use it right in the markup with self closing brackets -->
<!-- pascal case are compiles as svelte components whereas standard html case is compiles as html components -->
<ContactCard />
