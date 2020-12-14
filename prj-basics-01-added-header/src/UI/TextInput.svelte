<script>
  export let controlType;
</script>

<div class="form-control">
  <label for="description">Description</label>
{#if controlType === 'textarea'}
  <textarea rows="3" id="description" bind:value={description} />

{:else}
  <input type="text" id="title" bind:value={title} />
</div>
{/if}
</div>