<script>
	import Product from "./Product.svelte";
</script>

<!--<style>
</style>-->

<!-- event forwarding and emitting custom events  -->
<!-- throw an alert when user hits Delete or Add to Cart using forwarding -->
<!-- <Product productTitle="A Book" on:click={() => alert('Clicked')} /> -->

<!-- emitting custom events  -->
<Product
	productTitle="A Book"
	on:add-to-cart={() => alert('Add to cart!')}
	on:delete={() => {
		alert('Delete!');
	}} />
