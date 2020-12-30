<script>
	import tick from "svelte";
	import Product from "./Product.svelte";
	import Modal from "./Modal.svelte";

	let products = [
		{
			id: "p1",
			title: "A book",
			price: 9.99,
		},
	];

	let showModal = false;
	let closable = true;
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

<button on:click={() => (showModal = true)}>Show Modal</button>

{#if showModal}
	<Modal
		on:cancel={() => (showModal = false)}
		on:close={() => (showModal = false)}
		let:didAgree={closable}>
		<h1 slot="header">Hello!</h1>
		<p>This works!</p>
		<button
			slot="footer"
			on:click={() => (showModal = false)}
			disabled={!closable}>Confirm</button>
	</Modal>
{/if}
