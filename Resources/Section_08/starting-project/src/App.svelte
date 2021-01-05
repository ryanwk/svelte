<script>
    import CustomInput from "./CustomInput.svelte";
    import Toggle from "./Toggle.svelte";

    let val = "Helur";
    let price = 0;
    let selectedOption = 1;
    let agreed;
    let favColor = "red";
    let singleFavColor = "green";

    $: console.log(val);
    $: console.log(selectedOption);
    $: console.log(price);
    $: console.log(agreed);
    $: console.log(favColor);
    $: console.log(singleFavColor);

    function setValue(event) {
        val = event.target.value;
    }
</script>

<!-- <input type="text" value={val} on:input={setValue}> -->
<!-- <input type="text" bind:value={val} /> -->
<CustomInput bind:val />

<Toggle bind:chosenOption={selectedOption} />

<input type="number" bind:value={price} />

<label> <input type="checkbox" bind:checked={agreed} /> Agree to terms? </label>

<h1>Favorite Color</h1>
<label>
    <input type="radio" name="color" value="red" bind:group={favColor} />Red
</label>
<label>
    <input type="radio" name="color" value="green" bind:group={favColor} />Green
</label>
<label>
    <input
        type="radio"
        name="color"
        value="yellow"
        bind:group={favColor} />Yellow</label>

<!-- <select>
    <option value="green" bind:group={singleFavColor}>green</option>
    <option value="red" bind:group={singleFavColor}>red</option>
    <option value="blue" bind:group={singleFavColor}>blue</option>
</select> -->

<select bind:value={singleFavColor}>
    <option value="green">green</option>
    <option value="red">red</option>
    <option value="blue">blue</option>
</select>
