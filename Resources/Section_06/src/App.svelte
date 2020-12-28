<script>
	import Product from "./Product.svelte";

	function addToCart(event) {
		console.log(event.detail);
	}

	function deleteProduct(event) {
		console.log(event.detail);
	}
</script>

<!--<style>
</style>-->

<!-- event forwarding and emitting custom events  -->
<!-- throw an alert when user hits Delete or Add to Cart using forwarding -->
<!-- <Product productTitle="A Book" on:click={() => alert('Clicked')} /> -->

<!-- emitting custom events  -->
<Product
	productTitle="A Book"
	on:add-to-cart={addToCart}
	on:delete={deleteProduct} />
