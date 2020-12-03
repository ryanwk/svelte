<script>
  import MeetupItem from "./Meetups/MeetupItem.svelte";
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

<main />
