<script>
  import Header from "./UI/Header.svelte";
  import MeetupGrid from "./Meetups/MeetupGrid.svelte";
  import TextInput from "./UI/TextInput.svelte";
  import Button from "./UI/Button.svelte";
  import EditMeetup from "./Meetups/EditMeetup.svelte";

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

  let editMode = null;

  function addMeetup(event) {
    const newMeetup = {
      id: Math.random().toString(),
      title: event.detail.title,
      subtitle: event.detail.subtitle,
      description: event.detail.description,
      imageUrl: event.detail.imageUrl,
      contactEmail: event.detail.email,
      address: event.detail.address,
    };
    // create new array for meetups, then use ... syntax to add new meetups to the array
    meetups = [newMeetup, ...meetups];
  }

  function cancelEdit() {
    editMode = null;
  }

  function toggleFavorite(event) {
    const id = event.detail;
    const updatedMeetup = {
      ...meetups.find((m) => m.id === id),
    }; //executes on meetup id then returns true if found and returns a single copy of that meetup obj
    updatedMeetup.isFavorite = !updatedMeetup.isFavorite; // toggles true or false
    const meetupIndex = meetups.findIndex((m) => m.id === id); // stores found meetup in meetups
    const updatedMeetups = [...meetups]; // copy entire meetups array
    updatedMeetups[meetupIndex] = updatedMeetup; // update copied array
    meetups = updatedMeetups;
  }
</script>

<style>
  main {
    margin-top: 5rem;
  }
  .meetup-controls {
    margin: 1rem;
  }
</style>

<Header />

<main>
  <div class="meetup-controls">
    <Button caption="New Meetup" on:click={() => (editMode = 'add')} />
    {#if editMode === 'add'}
      <EditMeetup on:save={addMeetup} on:cancel={cancelEdit} />
    {/if}
    <MeetupGrid {meetups} on:togglefavorite={toggleFavorite} />
  </div>
</main>
