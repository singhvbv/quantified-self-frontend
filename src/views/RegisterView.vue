<template>
  <div>
    <div class="main">
      <div class="flex-column">
        <div class="flex-wrapper logo-out">
          <p></p>
          <img src="@/assets/image/qs_logo.svg" class="logo-wrapper-out" />
        </div>
      </div>
      <div class="row flex-row w-100 h-100">
        <div class="flex-column w-50 registration-parent">
          <div class="flex-column h-75 w-75 registration-box">
            <br />
            <p class="large-text-bold">Register for better life!</p>
            <br />

            <form v-on:submit.prevent="submitForm">
              <p class="alert-danger" v-if="invalid_email">
                Email already exist
              </p>

              <label>
                <input
                  type="email"
                  required
                  placeholder="Email"
                  id="email"
                  v-model="form.email"
                />
              </label>
              <label>
                <input
                  type="password"
                  id="password"
                  required
                  placeholder="Password"
                  v-model="form.password"
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  onchange="this.setCustomValidity(this.validity.patternMismatch ? 'Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters' : ''); if(this.checkValidity()) form.password.pattern = this.value;"
                />
              </label>
              <label>
                <input
                  type="password"
                  id="password_confirm"
                  v-model="form.password_confirm"
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  onchange="this.setCustomValidity(this.validity.patternMismatch ? 'Please enter the same Password as above' : '');"
                  required
                  placeholder="Confirm Password"
                />
              </label>
              <br />
              <br />

              <button class="neo-button-submit" id="register_btn">
                Register
              </button>
              <br /><br />
              <p class="small-text">
                Already a User? <a href="/login">Login</a>
              </p>
            </form>
          </div>
        </div>
        <div class="flex-column w-50 align-image">
          <img src="@/assets/image/tracker.svg" class="signup-image w-100" />
        </div>
      </div>
    </div>
    <FooterComponent />
  </div>
</template>

<script>
import FooterComponent from  '@/components/FooterComponent.vue';
export default {
  mounted() {
    let token = localStorage.getItem("token");
    if (token != null || token != undefined) {
      window.location = "dashboard";
    }
  },
  components: {
    FooterComponent,
  },
  name: "RegisterView",

  data() {
    return {
      invalid_email: false,
      form: {
        email: "",
        password: "",
        password_confirm: "",
      },
    };
  },

  methods: {
    submitForm() {
      let headers = new Headers();
      headers.append("Content-Type", "application/json");
      this.$http
        .post("http://127.0.0.1:5000/register", this.form, { headers: headers })
        .then((res) => {
          if (res.data.response.user.authentication_token) {
            localStorage.setItem(
              "token",
              res.data.response.user.authentication_token
            );
            window.location = "dashboard";
          }
          //Perform Success Action
        })
        .catch((error) => {
          console.log(error);
          if (error.response.data.response.errors.email) {
            this.invalid_email = !this.invalid_email;
            this.form.email = "";
          }
        })
        .finally(() => {
          //Perform action in always
          setTimeout(() => (this.invalid_email = false), 3000);
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url("https://fonts.googleapis.com/css?family=Quicksand");
@import "@/assets/css/style.css";
@import "@/assets/css/signup.css";
@import "@/assets/css/bootstrap.css";
</style>
