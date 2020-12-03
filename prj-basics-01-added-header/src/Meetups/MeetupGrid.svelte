<script>
  import MeetupItem from "./MeetupItem.svelte";
</script>

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
