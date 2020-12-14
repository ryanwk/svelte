<script>
  export let controlType;
  export let id;
  export let label;
  export let rows;
  export let value;
</script>

<div class="form-control">
  <label for={id}>label</label>
  {#if controlType === 'textarea'}
    <textarea {rows} {id} vaue={value} on:input />
  {:else}<input type="text" {id} bind:value={label} />{/if}
</div>
