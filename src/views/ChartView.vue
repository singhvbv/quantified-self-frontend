<template>
<div>
<div class="main dashboard flex-row">


    <div class="flex-column side-bar h-100">
        <div class="icon-space flex-column h-100">
            <div>
                <a href="dashboard" title="dashboard"><i class="fa fa-home icon-css" aria-hidden="true"></i><br></a>
                <a href="logs" title="view history"><i class="fa fa-list icon-css" aria-hidden="true"></i><br></a>
                <a href="settings" title="Settings"><i class="fa fa-cog icon-css" aria-hidden="true"></i><br /></a>

            </div>
            <div><a href="logout" title="logout"><i class="fa fa-power-off icon-css" aria-hidden="true"></i></a></div>
        </div>

    </div>


    <div class="flex-column h-100 main-board">
        <div class="working-board h-100 flex-column">
        <div class="flex-wrapper" ><p class="xl-large-text-bold w-75 user-name">Last 7 Days Recording Frequency</p>
            <img src="@/assets/image/qs_logo.svg"  class="logo-wrapper"/>
                </div>

            <div class="stat-board-resize flex-column flex-wrapper">

                <div class=" h-100 w-100 flex-row flex-wrapper">

                    <div class="h-100  w-100 flex-column flex-wrapper justify-content-center">
                        <br>
                        <div class="chart-resize w-100 flex-column flex-wrapper">
                             <img class="stat-img"   v-bind:src="image_src" id="chart_img" >
                        </div>
                    </div>

                </div>


            </div>

        </div>

    </div>


</div>
<FooterComponent />
<!-- loading modal -->
<LoadingComponent v-if="showLoading" />

</div>

</template>


<script>
import LoadingComponent from '@/components/LoadingComponent.vue';
import FooterComponent from  '@/components/FooterComponent.vue';

export default {
  name: 'ChartView',
  props: {
    msg: String
  },
    components: {
    LoadingComponent,
    FooterComponent,
},
  data() {
      return {
        showLoading : false,
        image_src : null,
      };
    },
        
    created() {
      // call the api to get the tracker data
      this.showLoading = true;
      let headers = {
        "Content-Type": "application/json;charset=utf-8",
      };
  
      headers["Authentication-Token"] = localStorage.getItem("token");
      this.$http
        .get("http://127.0.0.1:5000/api/charts?id="+this.$route.query.id, { headers: headers })
        .then((res) => {
        console.log(res)    
          //Perform Success Action
        this.showLoading = false;
          this.image_src = "http://127.0.0.1:5000/"+res.data['image_url']
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          //Perform action in always

        });
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import url('https://fonts.googleapis.com/css?family=Quicksand');
    @import '@/assets/css/style.css';
    @import '@/assets/css/dashboard.css';
    @import '@/assets/css/bootstrap.css';


</style>
