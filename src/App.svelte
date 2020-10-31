<script>
  export let name;
  let age = 28;

  // this is a labeled statement "$:", reactive variables
  $: uppercaseName = name.toUpperCase();

  function incrementAge() {
    age += 1;
  }
  function changeName() {
    name = "Ryan";
  }
</script>

<style>
  h1 {
    color: purple;
  }
</style>

<h1>Hello {uppercaseName}, my age is {age}!</h1>
<button on:click={incrementAge}>Change Age</button>
<button on:click={changeName}>Change Name</button>
