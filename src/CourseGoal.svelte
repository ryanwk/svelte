<script>
  export let courseGoal;
</script>

<style>
  .course-goal {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    max-width: 30rem;
    border-radius: 5px;
    margin: 1rem 0;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 7rem;
  }

  .user-data {
    width: 67%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  h1 {
    font-size: 1.25rem;
    font-family: "Roboto Slab", sans-serif;
    margin: 0.5rem 0;
  }

  .red {
    color: red;
  }
</style>

<div class="course-goal">
  <header>
    <div class="user-data" class:red={courseGoal.includes('!')}>
      <!-- 2. output user input in an h1 tag. put my course goal for the course in the middle h1 tag in an input field.ContactCard -->
      <h1>{courseGoal}</h1>
    </div>
  </header>
</div>
<!-- 
    4. take the h1 tag (logic that changes css class) and put the h1 tag output into a separate component to which you then pass the user input (the output is received as a prop)
  -->
