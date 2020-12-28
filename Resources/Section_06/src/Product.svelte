<script>
    // allows you to create event dispatching statement
    import { createEventDispatcher } from "svelte";

    export let productTitle;

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
    <h1>{productTitle}</h1>
    <!-- events don't propogate across event boundaries so you need to register the event listener on each button without an assignment-->
    <button on:click={addToCart}>Add to Cart</button>
    <button
        on:click={() => {
            dispatch('delete', 'p1');
        }}>Delete</button>
</article>
