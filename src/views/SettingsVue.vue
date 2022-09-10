<template>
<div>
<div class="main dashboard flex-row">


    <div class="flex-column side-bar h-100">
        <div class="icon-space flex-column h-100">
            <div>
                <a href="dashboard" title="dashboard"><i class="fa fa-home icon-css" aria-hidden="true"></i><br></a>
                <a href="logs" title="view history"><i class="fa fa-list icon-css" aria-hidden="true"></i><br></a>
                <a href="settings" title="Settings"><i class="fa fa-cog icon-css" aria-hidden="true"></i><br></a>

            </div>
            <div><a href="logout" title="logout"><i class="fa fa-power-off icon-css" aria-hidden="true"></i></a></div>
        </div>

    </div>


    <div class="flex-column h-100 main-board">
        <div class="working-board h-100 flex-column">
        <div class="flex-wrapper" ><p class="xl-large-text-bold w-75 user-name">Settings</p>
            <img src="@/assets/image/qs_logo.svg"  class="logo-wrapper"/>
                </div>

            <div class="stat-board-resize flex-column flex-wrapper">
              <table>
                <tbody>
                  <tr>
                 
              <td>
              <br>
               <p class="medium-text-bold w-75 user-name">Export Logs as CSV :</p>
               <br>
                <fieldset>
              <div class="radio-button-class">
               <button class="neo-button-export ct_create_btn"
                                        id="ct_create_btn" @click="exportLogsCSV"> Export
                                </button>
              </div>
</fieldset>
</td>
<td>
                  
                
              <br><br>
               <p class=" medium-text-bold w-75 user-name">Monthly Report Email Type :</p>
               <br>
               <fieldset>
                <div class="radio-button-class">
                  
                  <input v-model="monthly_rep_type" type="radio" class="radio" name="report_type" value="html" id="html" checked />
                  <label for="html">HTML</label>
                  <input v-model="monthly_rep_type" type="radio" class="radio" name="report_type" value="pdf" id="pdf" />
                  <label for="pdf">PDF</label>
                   <button class="neo-button-save ct_create_btn"
                                        id="ct_create_btn" @click="saveMonthlyReportType"> Save
                                </button>
                </div>
              </fieldset>
              </td>
</tr>
<br>

<tr>
  <td>
     <p class=" medium-text-bold w-75 user-name">Import Logs</p>
     <br>
      <fieldset>
                <div class="radio-button-class">
                  
                <p>Download the Import Utility <button class="neo-button-download"
                                        id="ct_create_btn" @click="downloadImportUtility"> Download
                                </button></p> 

                <br>
                                  
                <div class="custom-file">
  <input type="file" class="custom-file-input" id="customFileLang" lang="en" v-on:change="importFile($event)">
  <label class="custom-file-label label-align" for="customFileLang">Import Logs</label>
</div>
                </div>
              </fieldset>
  </td>
</tr>
          </tbody>
               
              </table>

            </div>

        </div>

    </div>


</div>
<FooterComponent />
<div v-if="showsExportSnack" id="snackbar"  class="show">Export will be downloaded shortly !!</div>
<div v-if="showsKImportSnack" id="snackbar"  class="show">Import Utility will be downloaded shortly !!</div>
<div v-if="showsKImportLogSnack" id="snackbar"  class="show">Importing of logs will finish shortly !!</div>

<!-- loading modal -->
<LoadingComponent v-if="showLoading" />

</div>

</template>


<script>
import LoadingComponent from '@/components/LoadingComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';

export default {
  name: 'SettingsView',
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
    monthly_rep_type : 'html',
    showsExportSnack:false,
    showsKImportSnack :false,
    showsKImportLogSnack : false,
      };
    },
    methods:
    {
      saveMonthlyReportType:function()
      {
 
              // call the api to get settings
      this.showLoading = true;
      let headers = {
        "Content-Type": "application/json;charset=utf-8",
      };
      
      let data = {
          "monthly_report_type": this.monthly_rep_type
      };

      headers["Authentication-Token"] = localStorage.getItem("token");
      this.$http
        .post("http://127.0.0.1:5000/api/settings",data, { headers: headers })
        .then((res) => {
        console.log(res);
          //Perform Success Action
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          //Perform action in always
      this.showLoading = false;
        });

      },
      async exportLogsCSV()
      {
         
      let headers = {
        "Content-Type": "application/json;charset=utf-8",
      };
      this.showsExportSnack = true;
        setTimeout(() => { this.showsExportSnack = false; }, 2000)
      headers["Authentication-Token"] = localStorage.getItem("token");
      this.$http
        .get("http://127.0.0.1:5000/api/export_logs", { headers: headers })
        .then((res) => {
        let blob = new Blob([res.data], { type: 'text/csv' }),
        url = window.URL.createObjectURL(blob)

        window.open(url)

        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          //Perform action in always
     
        });
      },
      async downloadImportUtility()
      {
              let headers = {
        "Content-Type": "application/vnd.ms-excel",
        
      };
      this.showsKImportSnack = true;
      setTimeout(() => { this.showsKImportSnack = false; }, 2000)
      headers["Authentication-Token"] = localStorage.getItem("token");
      this.$http
        .get("http://127.0.0.1:5000/api/import_utility", {responseType: 'blob', headers: headers })
        .then((res) => {

              const url = window.URL.createObjectURL(new Blob([res.data]));
              const a = document.createElement("a");
              
              a.href = url;
              const filename = `import_utility.xlsx`;
              a.setAttribute('download', filename);
              document.body.appendChild(a);
              a.click();
              a.remove();
        

        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          //Perform action in always
     
        });

      },
      async importFile(event)
      {
 
      var formData = new FormData();
      var importFile =  event.target.files[0]
      formData.append("import_excel", importFile);
      this.showsKImportLogSnack = true;
      setTimeout(() => { this.showsKImportLogSnack = false; }, 2000)
      let headers = {
        'Content-Type': 'multipart/form-data',
        
      };
      headers["Authentication-Token"] = localStorage.getItem("token");
      this.$http
        .post("http://127.0.0.1:5000/api/import_logs",formData, { headers: headers })
        .then((res) => {

        console.log(res)

        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          //Perform action in always
          
        });

      }
    },
    
     created() {
      // call the api to get settings
      this.showLoading = true;
      let headers = {
        "Content-Type": "application/json;charset=utf-8",
      };
  
      headers["Authentication-Token"] = localStorage.getItem("token");
      this.$http
        .get("http://127.0.0.1:5000/api/settings", { headers: headers })
        .then((res) => {
        if (res.data.data != "None")
        {
            this.monthly_rep_type = res.data.data.monthly_report_type
        }
          //Perform Success Action

        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          //Perform action in always
      this.showLoading = false;
        });
    },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

fieldset {
      overflow: hidden;
      margin-left:50px;
      color:#657388;
    }
    
    .radio-button-class {
      float: left;
      clear: none;
    }
    
    label {
      float: left;
      clear: none;
      display: block;
      padding: 0px 1em 0px 8px;
    }
    
    input[type=radio],
    input.radio {
      float: left;
      clear: none;
      margin: 2px 0 0 2px;
    }

    @import url('https://fonts.googleapis.com/css?family=Quicksand');
    @import '@/assets/css/style.css';
    @import '@/assets/css/dashboard.css';
    @import '@/assets/css/bootstrap.css';


</style>
