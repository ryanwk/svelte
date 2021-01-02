<script>
  import MeetupGrid from "./Meetups/MeetupGrid.svelte";
  import Header from "./UI/Header.svelte";
  import TextInput from "./UI/TextInput.svelte";
  import Button from "./UI/Button.svelte";

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
      isFavorite: false,
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
      isFavorite: false,
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

  function toggleFavorite(event) {
    const id = event.detail;
    const updatedMeetup = {
      ...meetups.find((m) => m.id === id),
    };
    updatedMeetup.isFavorite = !updatedMeetup.isFavorite; // toggles true or false
    const meetupIndex = meetups.findIndex((m) => m.id === id); //
    const updatedMeetups = [...meetups]; // copy entire meetups array
    updatedMeetups[meetupIndex] = updatedMeetup; // update copied array
    meetups = updatedMeetups;
  }
</script>

<style>
  main {
    margin-top: 5rem;
  }
  form {
    width: 30rem;
    max-width: 90%;
    margin: auto;
  }
</style>

<Header />

<main>
  <form on:submit|preventDefault={addMeetup}>
    <TextInput
      id="title"
      label="Title"
      type="text"
      value={title}
      on:input={(event) => (title = event.target.value)} />

    <TextInput
      id="subtitle"
      label="Subtitle"
      type="text"
      value={subtitle}
      on:input={(event) => (subtitle = event.target.value)} />

    <TextInput
      id="address"
      label="Address"
      type="text"
      value={address}
      on:input={(event) => (address = event.target.value)} />

    <TextInput
      id="imageUrl"
      label="Image Url"
      type="image"
      value={imageUrl}
      on:input={(event) => (imageUrl = event.target.value)} />

    <TextInput
      id="email"
      label="E-mail"
      type="email"
      value={email}
      on:input={(event) => (email = event.target.value)} />

    <TextInput
      id="description"
      label="Description"
      controlType="textarea"
      value={description}
      on:input={(event) => (description = event.target.value)} />
    <Button type="submit" caption="Save" />
  </form>
  <MeetupGrid {meetups} on:togglefavorite={toggleFavorite} />
</main>
