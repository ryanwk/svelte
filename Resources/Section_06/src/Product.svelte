<script>
    // allows you to create event dispatching statement
    import { createEventDispatcher } from "svelte";

    export let title;
    export let price;
    export let bestseller = false;

    const dispatch = createEventDispatcher();

    // this function invokes createEventDispatcher via the dispatch function
    function addToCart() {
        // takes name of event that should be listened to
        dispatch("add-to-cart", { id: "p1" });
    }
</script>

<style>
</style>

<article>
    <h1>{title}</h1>
    <h2>${price}</h2>

    {#if bestseller}
        <h3>Best Seller</h3>
    {/if}
    <!-- events don't propogate across event boundaries so you need to register the event listener on each button without an assignment-->
    <button on:click={addToCart}>Add to Cart</button>
    <button
        on:click={() => {
            dispatch('delete', 'p1');
        }}>Delete</button>
</article>
