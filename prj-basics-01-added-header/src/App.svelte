<script>
  import MeetupGrid from "./Meetups/MeetupGrid.svelte";
  import Header from "./UI/Header.svelte";

  const meetups = [
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
</script>

<style>
  main {
    margin-top: 5rem;
  }
</style>

<Header />

<main>
  <form>
    <div class="form-control">
      <label for="title">Title</label>
      <input type="text" id="title" />
    </div>
    <div class="form-control">
      <label for="subtitle">Subtitle</label>
      <input type="text" id="subtitle" />
    </div>
    <div class="form-control">
      <label for="address">Address</label>
      <input type="text" id="address" />
    </div>
    <div class="form-control">
      <label for="imageUrl">Image URL</label>
      <input type="text" id="imageUrl" />
    </div>
    <div class="form-control">
      <label for="email">E-mail</label>
      <input type="email" id="email" />
    </div>
    <div class="form-control">
      <label for="description">Description</label>
      <input type="text" id="description" />
    </div>
  </form>
  <MeetupGrid {meetups} />
</main>
