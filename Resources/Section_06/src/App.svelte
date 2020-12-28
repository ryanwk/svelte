<script>
	import Product from "./Product.svelte";
</script>

<!--<style>
</style>-->
<!-- throw an alert when user hits Delete or Add to Cart using forwarding -->
<Product productTitle="A Book" on:click={() => alert('Clicked')} />
