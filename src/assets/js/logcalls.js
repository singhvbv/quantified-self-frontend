import LoadingComponent from '@/components/LoadingComponent.vue';
import FooterComponent from  '@/components/FooterComponent.vue';

export default {
    name: "LogsView",
    props: {
      msg: String,
    },
    components: {
        LoadingComponent,
        FooterComponent,
      },
    data() {
      return {
        showDeleteDialog : false,
        showNoteDialog : false,
        showLoading : false,
        datas: null,
        today: null,
        tracker_log_id : null,
        showSnack: false,
        showError: false,
        inner_data: null,
        note:null,
        show_value_label: false,
        show_num_value: false,
        show_time_value: false,
        show_single_select_value: false,
        show_multi_select_value: false,
        value_type:null,
        num_value:null,
        hour_value:null,
        min_value:null,
        sec_value:null,
        lists:[],
        curr_list_value : null,
        curr_multilist_value:[],
      };
    },
    methods: {
      deletePrompt: function (tracker_log_id) {
      this.showDeleteDialog = !this.showDeleteDialog;
      this.tracker_log_id = tracker_log_id;
      },
      hideDeletePrompt: function () {
      this.showDeleteDialog = !this.showDeleteDialog;
      this.tracker_log_id = null;
      },
      hideNotePrompt: function () {
      this.showNoteDialog = !this.showNoteDialog;
      this.inner_data = null;
      },
      deleteThisNow: function () {
      this.showDeleteDialog = !this.showDeleteDialog;
      // call the api to delete the logs
      let log_id = this.tracker_log_id
      let headers = {
        "Content-Type": "application/json;charset=utf-8",
      };
      this.showLoading = true;
      headers["Authentication-Token"] = localStorage.getItem("token");
      this.$http
        .delete("http://127.0.0.1:5000/api/tracker_data/"+this.tracker_log_id, { headers: headers })
        .then((res) => {
          console.log(res);
          //Perform Success Action
           this.showSnack = !this.showSnack;
           this.showLoading = false;  
           
            let local =  JSON.parse(localStorage.getItem("logsData"));
            let local_cp =  local
            let logs_updated = local_cp.data.data.filter(function(item, index){
              console.log(index)

              return item.id != log_id;
            })
            local.data.data = logs_updated
            

            localStorage.setItem("logsData", JSON.stringify(local));
           
          
        })
        .catch((error) => {
          console.log(error);
          this.showError =!this.showError;
          this.showLoading = false;  
  
        })
        .finally(() => {
          //Perform action in always
           // After 2 seconds, remove the show class from DIV
              setTimeout(function () {
                location.reload();
              }, 1000);
        });
  
      },
      openNoteModal: function (data) {
      this.show_value_label= false;
      this.show_num_value= false;
      this.show_time_value= false;
      this.show_single_select_value= false;
      this.show_multi_select_value= false;
      this.inner_data = data;
      this.value_type =null;
      this.note=null,
      this.num_value=null;
      this.hour_value=null;
      this.min_value=null;
      this.sec_value=null;
      this.lists=[];
      this.curr_list_value = null;
      this.curr_multilist_value =[];
  
      // check data type values
      let data_type = null;
      if (this.inner_data.user_tracker_id.tracker_identity_id.id =="1")
      {
      data_type = this.inner_data.user_tracker_id.custom_tracker_id.tracker_type_id.type;
      }
      else{
      data_type = this.inner_data.user_tracker_id.tracker_id.tracker_type_id.type;
      }
      if(this.inner_data.tracker_note_id != "None")
      {
          this.note =this.inner_data.tracker_note_id.note;
      }
      if (data_type.trim()== "number")
      {   
          this.showNoteDialog = !this.showNoteDialog;
          this.show_value_label = true;
          this.show_num_value = true;
          this.num_value = this.inner_data.value;
          this.value_type="number";
      }
      else if (data_type.trim()== "time_duration")
      {   
          this.showNoteDialog = !this.showNoteDialog;
          this.show_value_label = true;
          this.show_time_value = true;
          let value = this.inner_data.value.replaceAll(' ', '').replace('Hours', '-').replace('Minutes', '-').replace('Seconds', '-')
          let valArray = value.split("-");
          this.hour_value = valArray[0];
          this.min_value = valArray[1];
          this.sec_value = valArray[2]
          this.value_type="time_duration";
      }
      else if (data_type.trim()== "list")
      {
          this.show_value_label = true;
          
          this.show_single_select_value = true;
          this.value_type="list";
  
      // call the api to get the list data
      this.showLoading = true;  
      let headers = {
        "Content-Type": "application/json;charset=utf-8",
      };
  
      headers["Authentication-Token"] = localStorage.getItem("token");
      this.$http
        .get("http://127.0.0.1:5000/api/tracker_data/" + this.inner_data.id + '?type=list', { headers: headers })
        .then((res) => { 
          //Perform Success Action
          console.log(res.data);
          this.lists=res.data;
          this.curr_list_value = this.inner_data.value;
          this.showNoteDialog = !this.showNoteDialog;
          console.log(this.curr_list_value);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.showLoading = false;  
          //Perform action in always
        });
      }
      else if (data_type.trim()== "multi_list")
      {
          this.show_value_label = true;
          this.show_multi_select_value = true;
          this.value_type="multi_list";
          // call the api to get the list data
          
      this.showLoading = true;  
      let headers = {
        "Content-Type": "application/json;charset=utf-8",
      };
  
      headers["Authentication-Token"] = localStorage.getItem("token");
      this.$http
        .get("http://127.0.0.1:5000/api/tracker_data/" + this.inner_data.id + '?type=list', { headers: headers })
        .then((res) => {        
          //Perform Success Action
          this.curr_multilist_value = this.inner_data.value.split(",");
          console.log(res.data);
          this.lists=res.data;
          this.showNoteDialog = !this.showNoteDialog;
          console.log(this.curr_multilist_value);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.showLoading = false;  
          //Perform action in always
        });
      }
      else
      {
        this.showNoteDialog = !this.showNoteDialog;
      }
     },
      patchThisLog: function()
      {
        let value = 1;
        if (this.value_type == "number")
        {
        value = document.getElementById("tracker_num_val").value;
        }
        else if (this.value_type == "time_duration")
        {
          
        let hrs =  document.getElementById("tracker_time_hrs").value;
        let mins = document.getElementById("tracker_time_mins").value;
        let secs = document.getElementById("tracker_time_secs").value;
  
        value = hrs + ' Hours ' + mins + ' Minutes ' + secs + ' Seconds ';
  
        }
        else if (this.value_type == "multi_list") {
          value = this.curr_multilist_value.join();
      }
      else if (this.value_type == "list") {
          value = this.curr_list_value;
      }
  
        let data = {
          "tracker_data_id": this.inner_data.id,
          "type": this.value_type,
          "value": value,
          "note": this.note,
      };
      
      this.showLoading = true; 
      this.showNoteDialog = !this.showNoteDialog;
            let headers = {
        "Content-Type": "application/json;charset=utf-8",
      };
  
      headers["Authentication-Token"] = localStorage.getItem("token");
        this.$http
          .patch("http://127.0.0.1:5000/api/tracker_data", data, { headers: headers })
          .then((res) => {
            this.showLoading = false;  
            console.log(res)
            this.showSnack = true;
            //Perform Success Action
            data.value= value
            localStorage.removeItem('logsData');
            
          })
          .catch((error) => {
            console.log(error)
            this.showError = true;
          })
          .finally(() => {
            //Perform action in always
            setTimeout(
              () => (
                (location.reload())
              ),
              600
            );
          });
  
      }
      },
  
    
    created() {

      let logsData = localStorage.getItem("logsData");

      if (logsData == null || logsData == undefined) {

      // call the api to get the tracker data
      this.showLoading = true;
      let headers = {
        "Content-Type": "application/json;charset=utf-8",
      };
  
      headers["Authentication-Token"] = localStorage.getItem("token");
      this.$http
        .get("http://127.0.0.1:5000/api/logs", { headers: headers })
        .then((res) => {

          localStorage.setItem("logsData", JSON.stringify(res));
          console.log(res.data.data);
          this.datas = res.data.data;
          this.today = res.data.today;
          //Perform Success Action
          this.showLoading = false;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          //Perform action in always
        });
      }
      else
      {
        let res = JSON.parse(localStorage.getItem("logsData"));
        this.datas = res.data.data;
        this.today = res.data.today;

      }
    },
  };