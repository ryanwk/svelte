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
  #meetups {
    margin-top: 5rem;
  }
</style>

<Header />
<section id="meetups">
  {#each meetups as meetup}
    <MeetupItem
      title={meetup.title}
      subtitle={meetup.subtitle}
      description={meetup.description}
      imageUrl={meetup.imageUrl}
      email={meetup.contactEmail} />
  {/each}
</section>
