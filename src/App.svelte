<script>
  let enteredPassword = " ";
  let passwordValidity = "short";
  let passwords = [];

  $: if (enteredPassword.trim().length < 5) {
    passwordValidity = "short";
  } else if (enteredPassword.trim().length > 10) {
    passwordValidity = "long";
  } else passwordValidity = "good";

  function confirmPassword() {
    if (passwordValidity === "good") {
      passwords = [...passwords, enteredPassword];
    }
  }
  function removePassword(index) {
    passwords = passwords.filter((pw, idx) => {
      return idx !== index;
    });
  }
</script>

<style>
  #form {
    width: 30rem;
    max-width: 100%;
  }
</style>

<h1>Assignment</h1>

<p>Solve these tasks.</p>

<ol>
  <li>
    Add a enteredPassword input field and save the user input in a variable.
  </li>
  <li>
    Output "Too short" if the password is shorter than 5 characters and "Too
    long" if it's longer than 10.
  </li>
  <li>
    Output the password in a paragraph tag (below the input or below the
    warnings) if it's between these boundaries.
  </li>
  <li>
    Add a button and let the user add the passwords to an array (an array that
    grows with every password that was entered - not too long not too short).
  </li>
  <li>Output the array values (= passwords) in a unordered list (ul tag).</li>
  <li>Bonus: If a password is clicked, remove it from the list.</li>
</ol>

<div class="form">
  <h3>Password</h3>
  <input type="text" bind:value={enteredPassword} /><button
    on:click={confirmPassword}>Confirm Password
  </button>
</div>

<!-- password input field validation -->
{#if passwordValidity === 'long'}
  <p>Password is too long</p>
{:else if passwordValidity === 'short'}
  <p>Password is too short</p>
{:else}
  <p>Password: {enteredPassword}</p>
{/if}

<ul>
  {#each passwords as pw, i}
    <li on:click={removePassword.bind(this, i)}>{pw}</li>
  {/each}
</ul>
