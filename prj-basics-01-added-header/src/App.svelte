<script>
  import MeetupGrid from "./Meetups/MeetupGrid.svelte";
  import Header from "./UI/Header.svelte";
  import TextInput from "./UI/TextInput.svelte";

  let title = "";
  let subtitle = "";
  let address = "";
  let email = "";
  let description = "";
  let imageUrl = "";

  let meetups = [
    {
      id: "m1",
      title: "Coding Bootcamp",
      subtitle: "Learn to code in 2 hours",
      description: "In this meetup we will have experts teach you how to code",
      imageUrl:
        "https://cdn.stocksnap.io/img-thumbs/960w/programming-code_1STVFMTBJY.jpg",
      address: "27th Nerd Road, 4]33245 New York",
      contactEmail: "code@test.com",
    },
    {
      id: "m2",
      title: "Swimmers Meetup",
      subtitle: "Let's go swimming!",
      description: "In this meetup we will go swimming",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAbkxJUFalQvzsBx7fEDhakXolossPx-o9_Q&usqp=CAU",
      address: "27th swim lane, 433245 New York",
      contactEmail: "swim@test.com",
    },
  ];

  function addMeetup() {
    let newMeetup = {
      id: Math.random().toString(),
      title: title,
      subtitle: subtitle,
      description: description,
      imageUrl: imageUrl,
      contactEmail: email,
      address: address,
    };
    // create new array for meetups, then use ... syntax to add new meetups to the array
    meetups = [newMeetup, ...meetups];
  }
</script>

<style>
  main {
    margin-top: 5rem;
  }
</style>

<Header />

<main>
  <form on:submit|preventDefault={addMeetup}>
    <TextInput
      id="title"
      label="Title"
      value={title}
      on:input={(event) => (title = event.EventTarget.value)} />

    <TextInput
      id="subtitle"
      label="Subtitle"
      value={subtitle}
      on:input={(event) => (subtitle = event.EventTarget.value)} />

    <TextInput
      id="address"
      label="Address"
      value={address}
      on:input={(event) => (address = event.EventTarget.value)} />

    <div class="form-control">
      <label for="imageUrl">Image URL</label>
      <input type="text" id="imageUrl" bind:value={imageUrl} />
    </div>
    <div class="form-control">
      <label for="email">E-mail</label>
      <input type="email" id="email" bind:value={email} />
    </div>
    <div class="form-control">
      <label for="description">Description</label>
      <textarea rows="3" id="description" bind:value={description} />
    </div>
    <button type="submit">Save</button>
  </form>
  <MeetupGrid {meetups} />
</main>
