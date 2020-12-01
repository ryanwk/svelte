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
        "https://upload.wikimedia.org/wikipedia/commons/4/4c/UploadWizard_uploading_multiple_files.png",
      address: "27th Nerd Road, 433245 New York",
      contactEmail: "code@test.com",
    },
    {
      id: "m2",
      title: "swim together",
      subtitle: "let go swimming",
      description: "In this meetup we will swim at the local watering hole",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Wroclaw_-_Biblioteka_Uniwersytecka_i_Kosciol_NMP_na_Piasku_01.jpg/2560px-Wroclaw_-_Biblioteka_Uniwersytecka_i_Kosciol_NMP_na_Piasku_01.jpg",
      address: "27th swim lane, 433245 New York",
      contactEmail: "swim@test.com",
    },
  ];
</script>

<style>
  article {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    border-radius: 5px;
    background: white;
    margin: 1rem;
  }

  header,
  .content,
  footer {
    padding: 1rem;
  }

  .image {
    width: 100%;
    height: 14rem;
  }

  .image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  h1 {
    font-size: 1.25rem;
    margin: 0.5rem 0;
    font-family: "Roboto Slab", sans-serif;
  }

  h1.is-favorite {
    background: #01a129;
    color: white;
    padding: 0 0.5rem;
    border-radius: 5px;
  }

  h2 {
    font-size: 1rem;
    color: #808080;
    margin: 0.5rem 0;
  }

  p {
    font-size: 1.25rem;
    margin: 0;
  }

  div {
    text-align: right;
  }
</style>

<Header />
{#each meetups as meetup}
  <MeetupItem />
{/each}
