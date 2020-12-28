<script>
	import Product from "./Product.svelte";
	import Modal from "./Modal.svelte";

	let products = [
		{
			id: "p1",
			title: "A book",
			price: 9.99,
		},
	];

	function addToCart(event) {
		console.log(event.detail);
	}

	function deleteProduct(event) {
		console.log(event.detail);
	}
</script>

<!--<style>
</style>-->

<!-- event forwarding -->
<!-- throw an alert when user hits Delete or Add to Cart using forwarding -->
<!-- <Product productTitle="A Book" on:click={() => alert('Clicked')} /> -->

<!-- emitting custom events with spread operator -->
{#each products as product}
	<Product
		{...product}
		on:add-to-cart={addToCart}
		on:delete={deleteProduct} />
{/each}
