<template>
  <div class="error-content">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="error-text">
            <h1 class="error">404 Error</h1>
            <h4>Oops! This page Could Not Be Found!</h4>
            <p>
              Sorry bit the page you are looking for does not exist, have been
              removed or name changed.
            </p>
            <router-link to="/" class="btn btn-primary btn-round"
              >Back To Home</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.error-content {
  padding: 0 0 70px;
  height: 100vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.error-text {
  text-align: center;
}
.error {
  font-size: 180px;
  font-weight: 100;
}
</style>
