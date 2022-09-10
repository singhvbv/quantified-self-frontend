import LoadingComponent from "@/components/LoadingComponent.vue";
import FooterComponent from  '@/components/FooterComponent.vue';
export default {
  name: "DashboardView",
  props: {
    msg: String,
  },
  components: {
    LoadingComponent,
    FooterComponent,
  },
  data() {
    return {
      showLoading: false,
      inner_data: null,
      user_email: null,
      outer_loop_count:1,
      user_trackers_list : [],
      predefined_trackers_list : [],
      showChoiceDialog:false,
      showTrackerDialog:false,
      showNumberDialog:false,
      showTimerDialog:false,
      showMultiSelectDialog:false,
      showSingleSelectDialog:false,
      showCustomTrackerDialog:false,
      showEditTrackerDialog:false,
      showEditorDialog:false,
      showEditUnit:false,
      showCustomUnit:false,
      showCustomEditorModal:3,
      unit_visibility : 'hide_class',
      custom_unit_visibility : 'hide_class',
      list_class_visibility : 'hide_class',
      showSnack: false,
      showError: false,
      multi_select:null,
      custom_post_form: 
      {
        ct_tracker_name: "",
        ct_icon: "",
        ct_color: "",
        ct_desc: "",
        ct_type: "",
        ct_unit: "",
        ct_custom_unit: "",
        ct_settings: "",
      },
      custom_edit_form: 
      {
        edit_ct_tracker_name: "",
        edit_ct_icon: "",
        edit_ct_color: "",
        edit_ct_desc: "",
        edit_ct_unit: "",
        edit_ct_custom_unit: "",
      },
      tracker_unit_name : 'Unit :',
      ct_settings_value : [],
      user_tracker_id: null,
    };
  },
  methods: {
    openChoiceModal: function () {
      this.showChoiceDialog = !this.showChoiceDialog;

    },
    hideChoicePrompt: function()
    {
      this.showChoiceDialog = false;
      this.showTrackerDialog = false;
      this.showCustomTrackerDialog =false;
      this.showNumberDialog =false;
      this.showTimerDialog=false;
      this.showMultiSelectDialog=false;
      this.showSingleSelectDialog=false;
      this.showEditorDialog=false;
      this.showCustomEditorModal=3;
      this.showEditTrackerDialog=false;
    },
    save_this_tracker: function(id)
    {
      this.showLoading = true;
      this.showTrackerDialog = false;
      let data = {
          "tracker_id": id
      };
      let headers = {
            "Content-Type": "application/json;charset=utf-8",
          };

    headers["Authentication-Token"] = localStorage.getItem("token");
    this.$http
      .post("http://127.0.0.1:5000/api/user_tracker",data, { headers: headers })
      .then((res) => {
        console.log(res.data);
        localStorage.removeItem('dashData');
         location.reload();
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
    show_hide_unit:function(value)
    {
      this.custom_unit_visibility = 'hide_class';
      if (value == "number") {
        this.unit_visibility = 'show_class';
        let ct_unit = document.getElementById("ct_unit").value;
        this.show_hide_custom_unit(ct_unit);

    }
    else
    {
      this.unit_visibility = 'hide_class';
    }

    if (value == "list" || value == "multi_list") {
      this.list_class_visibility = 'show_class';

    }
    else {
      this.list_class_visibility = 'hide_class';

    }


    },
    show_hide_custom_unit:function(value)
    {
      if (value=="custom")
      {
        this.custom_unit_visibility = 'show_class';
        this.showCustomUnit = true;
      }
      else
      {
        this.showCustomUnit = false;      
        this.custom_unit_visibility = 'hide_class';
      }


    },
    openCustomTrackerModal: function()
    {
      this.showChoiceDialog = false;
      this.showCustomTrackerDialog = !this.showCustomTrackerDialog;
      //this.showLoading = true;
    },
     openTrackerModal: function()
    {
      this.showChoiceDialog = !this.showChoiceDialog;
      this.showTrackerDialog = !this.showTrackerDialog;
      this.showLoading = true;

      // call the api to get tracker data

          let headers = {
      "Content-Type": "application/json;charset=utf-8",
    };

    headers["Authentication-Token"] = localStorage.getItem("token");
    this.$http
      .get("http://127.0.0.1:5000/api/tracker", { headers: headers })
      .then((res) => {
        console.log(res.data);
        this.predefined_trackers_list = res.data;
        
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
    checkValidity:function(id)
    {
        let allAreFilled = true;
        document.getElementById(id).querySelectorAll("[required]").forEach(function(i) {
          if (!i.value) { 
            allAreFilled = false;  
            }
            })
        if (allAreFilled) {
          allAreFilled = true;
        }
        return allAreFilled;
    },
    saveCustomTracker: function()
      {
        
       if (this.checkValidity("custom_tracker_form"))
       {

 this.showCustomTrackerDialog = false;
        this.showLoading = true;
      let headers = {
      "Content-Type": "multipart/form-data",
    };

    headers["Authentication-Token"] = localStorage.getItem("token");
      this.$http
        .post("http://127.0.0.1:5000/api/custom_tracker", this.custom_post_form, { headers: headers })
        .then((res) => {
console.log(res);
localStorage.removeItem('dashData');
            location.reload();
          //Perform Success Action
        })
        .catch((error) => {
console.log(error);
        })
        .finally(() => {
          //Perform action in always
      this.showLoading = false;
        });
       }
    },
recordTrack:function(user_tracker)
{
  let tracker_type = null;
  let tracker_unit = null;
  this.user_tracker_id = user_tracker.id;
  
  if(user_tracker.tracker_id != 'None')
  {
  tracker_type = user_tracker.tracker_id.tracker_type_id;
  tracker_unit = user_tracker.tracker_id.tracker_unit_id;
  this.ct_settings_value = user_tracker.tracker_id.settings.replaceAll("'",'').replaceAll("[",'').replaceAll("]",'').replaceAll('"','').split(",");
    console.log(this.ct_settings_value)
  }
  else
  {
  tracker_type = user_tracker.custom_tracker_id.tracker_type_id;
  tracker_unit = user_tracker.custom_tracker_id.tracker_unit_id;
  this.ct_settings_value = user_tracker.custom_tracker_id.settings.replaceAll("'",'').replaceAll("[",'').replaceAll("]",'').split(",");

 

  }
  //save the data 
  if (tracker_type == "1") {
    console.log(this.user_tracker_id);
//call the save function directly
    this.save_tracker_data("tap", 1);

  }
  else if(tracker_type == "5") {
//call the save function directly
        let tracker_unit_name = tracker_unit.unit;
        //show enter number dialog
        //replace the unit
        this.showNumberDialog=true;
        this.tracker_unit_name = "Unit (" + tracker_unit_name + " ) :";
        
  }
   else if(tracker_type == "2") {

    this.showTimerDialog=true;
   }

   else if(tracker_type == "3") {

    this.showMultiSelectDialog=true;
   }

  else if(tracker_type == "4") {

    this.showSingleSelectDialog=true;
   }
},
openTrackerEditor:function(user_tracker)
{
  this.user_tracker = user_tracker;
  this.showEditorDialog =true;
  if (user_tracker.tracker_identity_id ==1)
  {
    this.showCustomEditorModal = 1;
  }
  else
  {
    this.showCustomEditorModal = 2;
  }
  
},
deleteThisNow:function()
{
  this.showEditorDialog =false;
  this.showLoading = true;
            let headers = {
       "Content-Type": "application/json;charset=utf-8",
    };

    headers["Authentication-Token"] = localStorage.getItem("token");
      this.$http
        .delete("http://127.0.0.1:5000/api/user_tracker/" + this.user_tracker.id, { headers: headers })
        .then((res) => {
console.log(res);
            this.showSnack = !this.showSnack;
            localStorage.removeItem('dashData');
          //Perform Success Action
          setTimeout(function () {
                location.reload();
              }, 1000);

        })
        .catch((error) => {
           
              console.log(error);
        })
        .finally(() => {
          //Perform action in always
        
         
      this.showLoading = false;

        });


},
editThisTracker:function()
{
this.showEditTrackerDialog=true;
this.showEditUnit =false;
this.showCustomUnit =false;
this.showEditorDialog =false;

let ct = this.user_tracker.custom_tracker_id;
//put the values 
        this.custom_edit_form.edit_ct_tracker_name= ct.name;
        this.custom_edit_form.edit_ct_icon= ct.tracker_icon;
        this.custom_edit_form.edit_ct_color= ct.tracker_color;
        if (ct.description !="None")
        {
      this.custom_edit_form.edit_ct_desc= ct.description;
        }
        if (ct.tracker_unit_id !="None")
        {
          this.custom_edit_form.edit_ct_unit= ct.tracker_unit_id.unit;
          console.log(this.edit_ct_unit);
          this.showEditUnit =true;
        }
        if (ct.custom_unit !="None")
        {
          this.custom_edit_form.edit_ct_custom_unit= ct.custom_unit;
          this.showCustomUnit =true;
          this.showEditUnit =true;
        }
        
      

},
submit_edit_custom_form:function()
{
    if (this.checkValidity("custom_edit_form"))
       {
        this.showEditTrackerDialog =false;
        this.showLoading =true;

         var data = {
        "ct_tracker_id": this.user_tracker.custom_tracker_id.id,
        "name": this.custom_edit_form.edit_ct_tracker_name,
        "color": this.custom_edit_form.edit_ct_color,
        "icon": this.custom_edit_form.edit_ct_icon,
        "desc": this.custom_edit_form.edit_ct_desc,
        "unit": this.custom_edit_form.edit_ct_unit,
        "custom_unit": this.custom_edit_form.edit_ct_custom_unit,
    };

      let headers = {
       "Content-Type": "application/json;charset=utf-8",
    };

    headers["Authentication-Token"] = localStorage.getItem("token");
      this.$http
        .patch("http://127.0.0.1:5000/api/custom_tracker", data, { headers: headers })
        .then((res) => {
console.log(res);
            this.showSnack = !this.showSnack;
          //Perform Success Action
          localStorage.removeItem('dashData');
          setTimeout(function () {
                location.reload();
              }, 1000);

        })
        .catch((error) => {
           
              console.log(error);
        })
        .finally(() => {
          //Perform action in always
        
         
      this.showLoading = false;

        });

       }


},
showDeleteModal:function()
{
  this.showCustomEditorModal = 2;
},
save_numerical_data:function()
{
         if (this.checkValidity("number_type_form"))
       {
  let value = document.getElementById("tracker_num_val").value;
  this.save_tracker_data("number",value);
  this.showNumberDialog = false;
       }
},
save_timer_data:function()
{
           if (this.checkValidity("time_type_form"))
       {
  let hrs = document.getElementById("tracker_time_hrs").value;
  let secs = document.getElementById("tracker_time_mins").value;
  let mins = document.getElementById("tracker_time_secs").value;
  let value = hrs + ' Hours ' + mins + ' Minutes ' + secs + ' Seconds ';
  this.save_tracker_data("time_duration",value);
  this.showTimerDialog = false;
       }
},
save_multi_select_data:function()
{
             if (this.checkValidity("multi_type_form"))
       {
  this.showMultiSelectDialog = false;  
let value = this.multi_select;
this.save_tracker_data("multi_list",value);
       }
},
save_single_select_data:function()
{
    if (this.checkValidity("single_type_form"))
       {
  this.showSingleSelectDialog = false;  
let value = document.getElementById("single_select_val").value;
this.save_tracker_data("list",value);
       }
},
save_tracker_data:function(type, value)
{
  this.showLoading=true;
 let data = {
        "user_tracker_id": this.user_tracker_id,
        "type": type,
        "value": value.toString(),
    };

          let headers = {
       "Content-Type": "application/json;charset=utf-8",
    };

    headers["Authentication-Token"] = localStorage.getItem("token");
      this.$http
        .post("http://127.0.0.1:5000/api/tracker_data", data, { headers: headers })
        .then((res) => {
console.log(res);
            this.showSnack = !this.showSnack;
            localStorage.removeItem('logsData');
            localStorage.removeItem('dashData');
          //Perform Success Action
          setTimeout(function () {
                location.reload();
              }, 1000);

        })
        .catch((error) => {
           
              console.log(error);
        })
        .finally(() => {
          //Perform action in always
        
         
      this.showLoading = false;

        });
}
  },
  created() {
    let dashData = localStorage.getItem("dashData");

    if (dashData == null || dashData == undefined) {

    // call the api to get the tracker data
    this.showLoading = true;
    let headers = {
      "Content-Type": "application/json;charset=utf-8",
    };

    headers["Authentication-Token"] = localStorage.getItem("token");
    this.$http
      .get("http://127.0.0.1:5000/api/dashboard", { headers: headers })
      .then((res) => {
        //Perform Success Action
        this.showLoading = false;
        this.inner_data = res.data;
        this.user_email = this.inner_data.user;
        this.outer_loop_count = parseInt(this.inner_data.outer_loop_count),
        this.user_trackers_list = this.inner_data.user_trackers_list,
        console.log(res);
        localStorage.setItem("dashData", JSON.stringify(res));

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
      let res = JSON.parse(localStorage.getItem("dashData"));
      this.inner_data = res.data;
      this.user_email = this.inner_data.user;
      this.outer_loop_count = parseInt(this.inner_data.outer_loop_count),
      this.user_trackers_list = this.inner_data.user_trackers_list

    }
  },
};
