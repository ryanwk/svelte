<script>
    export let productTitle;
</script>

<style>
</style>

<article>
    <h1>{productTitle}</h1>
    <!-- events don't propogate across event boundaries so you need to register the event listener on each button without an assignment-->
    <button on:click>Add to Cart</button>
    <button>Delete</button>
</article>
