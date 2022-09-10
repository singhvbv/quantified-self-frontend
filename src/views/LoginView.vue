<template>
  <div>
    <div class="main">
      <div class="flex-column w-100 h-100">
        <div class="flex-column">
          <div class="flex-wrapper logo-out">
            <p></p>
            <img src="@/assets/image/qs_logo.svg" class="logo-wrapper-out" />
          </div>
        </div>
        <div class="flex-column w-100 h-25 align-image">
          <img src="@/assets/image/welcome.svg" class="w-100 h-100" />
        </div>

        <div class="flex-column w-100 h-75 align-form">
          <form v-on:submit.prevent="submitForm">
            <p class="alert-danger" v-if="invalid_email">Invalid Email</p>
            <p class="alert-danger" v-if="invalid_password">Invalid Password</p>
            <label>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Email"
                v-model="form.email"
              />
            </label>
            <label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                v-model="form.password"
              />
            </label>

            <br />
            <br />

            <button class="neo-button-submit">Login</button>
            <br /><br />
            <p class="small-text">Not a User? <a href="/signup">Register</a></p>
          </form>
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
  name: "LoginView",

  data() {
    return {
      invalid_email: false,
      invalid_password: false,
      form: {
        email: "",
        password: "",
      },
    };
  },

  methods: {
    submitForm() {
      let headers = new Headers();
      headers.append("Content-Type", "application/json");
      this.$http
        .post("http://127.0.0.1:5000/login", this.form, { headers: headers })
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
          if (error.response.data.response.errors.password) {
            this.invalid_password = !this.invalid_password;
            this.form.password = "";
          }
        })
        .finally(() => {
          //Perform action in always
          setTimeout(
            () => (
              (this.invalid_email = false), (this.invalid_password = false)
            ),
            3000
          );
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url("https://fonts.googleapis.com/css?family=Quicksand");
@import "@/assets/css/style.css";
@import "@/assets/css/login.css";
@import "@/assets/css/bootstrap.css";
</style>
