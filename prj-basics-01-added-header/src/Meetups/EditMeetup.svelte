<script>
  import { createEventDispatcher } from "svelte";
  import TextInput from "../UI/TextInput.svelte";
  import Button from "../UI/Button.svelte";
  import Modal from "../UI/Modal.svelte";
  import { isEmpty, isValidEmail } from "../helpers/validation.js";

  let title = "";
  let subtitle = "";
  let address = "";
  let email = "";
  let description = "";
  let imageUrl = "";

  // this checks if a title meets the validation criteria,  if it does then the isValid is set to true or vice versa
  $: titleValid = !isEmpty(title);
  $: subtitleValid = !isEmpty(subtitle);
  $: addressValid = !isEmpty(address);
  $: emailValid = !isValidEmail(email);
  $: descriptionValid = !isEmpty(description);
  $: imageUrlValid = !isEmpty(imageUrl);
  $: formIsValid =
    titleValid &&
    subtitleValid &&
    addressValid &&
    emailValid &&
    descriptionValid &&
    imageUrlValid;

  const dispatch = createEventDispatcher();

  function submitForm() {
    dispatch("save", {
      title: title,
      subtitle: subtitle,
      address: address,
      email: email,
      description: description,
      imageUrl: imageUrl,
    });
  }

  function cancel() {
    dispatch("cancel");
  }
</script>

<style>
  form {
    width: 100%;
  }
</style>

<Modal title="Edit Meetup Data" on:cancel>
  <form on:submit|preventDefault={submitForm}>
    <TextInput
      id="title"
      label="Title"
      valid={titleValid}
      validityMessage="Please enter a valid title."
      value={title}
      on:input={(event) => (title = event.target.value)} />
    <TextInput
      id="subtitle"
      label="Subtitle"
      valid={subtitleValid}
      validityMessage="Please enter a valid subtitle."
      value={subtitle}
      on:input={(event) => (subtitle = event.target.value)} />
    <TextInput
      id="address"
      label="Address"
      valid={addressValid}
      validityMessage="Please enter a valid Address."
      value={address}
      on:input={(event) => (address = event.target.value)} />
    <TextInput
      id="imageUrl"
      label="Image URL"
      valid={imageUrlValid}
      validityMessage="Please enter a valid image URL."
      value={imageUrl}
      on:input={(event) => (imageUrl = event.target.value)} />
    <TextInput
      id="email"
      label="E-Mail"
      type="email"
      valid={emailValid}
      validityMessage="Please enter a valid E-mail address."
      value={email}
      on:input={(event) => (email = event.target.value)} />
    <TextInput
      id="description"
      label="Description"
      controlType="textarea"
      valid={descriptionValid}
      validityMessage="Please enter a valid description."
      bind:value={description}
      on:input={(event) => (description = event.target.value)} />
  </form>
  <div slot="footer">
    <Button type="button" mode="outline" on:click={cancel}>Cancel</Button>
    <Button type="button" on:click={submitForm} disabled={!formIsValid}>
      Save
    </Button>
  </div>
</Modal>
