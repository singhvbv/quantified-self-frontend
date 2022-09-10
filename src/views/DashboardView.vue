<template>
  <div>
    <div class="main dashboard flex-row">
      <div class="flex-column side-bar h-100">
        <div class="icon-space flex-column h-100">
          <div>
            <a href="#" title="dashboard"
              ><i class="fa fa-home icon-css" aria-hidden="true"></i><br
            /></a>
            <a href="logs" title="view history"
              ><i class="fa fa-list icon-css" aria-hidden="true"></i><br
            /></a>
            <a href="settings" title="Settings"><i class="fa fa-cog icon-css" aria-hidden="true"></i><br /></a>
          </div>
          <div>
            <a href="logout" title="logout"
              ><i class="fa fa-power-off icon-css" aria-hidden="true"></i
            ></a>
          </div>
        </div>
      </div>

      <div class="flex-column h-100 main-board">
        <div class="working-board h-100 flex-column">
          <div class="h-25 flex-column">
            <div class="flex-wrapper">
              <p class="xl-large-text-bold w-75 user-name">Hello {{ user_email }} !</p>
              <img src="@/assets/image/qs_logo.svg" class="logo-wrapper" />
            </div>
          </div>
          <div class="h-75 flex-column card-wrapper">
            <div v-if="outer_loop_count != 1" class="outer-div">
            <div v-for="n in outer_loop_count" :key="n"  class="flex-row w-100 cards">
              <div v-for="user_tracker in user_trackers_list[n-1]" :key="user_tracker.id" class="neo-card flex-column h-90">
                 <div  v-on:click="
  user_tracker == 'last' ?
    openChoiceModal() :
    recordTrack(user_tracker)" v-bind:style="'display:contents'" >
                                  
                <div v-if="user_tracker.id" class="kebab_menu kebab-class" @click.stop="openTrackerEditor(user_tracker)">
                  <i class="fas fa-ellipsis-v"></i>
                </div>
                
                <div v-if="user_tracker !='last'" class="inner-icon-2 flex-column">
                    
                <i  v-if="user_tracker !='last' && user_tracker.custom_tracker_id != `None`"  v-bind:class="user_tracker.custom_tracker_id.tracker_icon"  v-bind:style="'color: '+user_tracker.custom_tracker_id.tracker_color" aria-hidden="true"></i>

                <i  v-if="user_tracker !='last' &&  user_tracker.tracker_id != `None`"  v-bind:class="user_tracker.tracker_id.tracker_icon" v-bind:style="'color: '+user_tracker.tracker_id.tracker_color"  aria-hidden="true"></i>

   
                   <p v-if="user_tracker !='last' && user_tracker.custom_tracker_id !='None'" class="card-title-text flex-column">
                   {{user_tracker.custom_tracker_id.name }}
                   </p> 
                   <p v-if="user_tracker !='last' && user_tracker.tracker_id !='None'" class="card-title-text flex-column">
                   {{user_tracker.tracker_id.name }}
                   </p> 
                   </div>
                  <div v-if="user_tracker =='last'" class="inner-icon-1 flex-column">
                 <i v-if="user_tracker =='last'" class="fa fa-plus" aria-hidden="true" v-bind:style="'color: #657388'" ></i>

                   <p v-if="user_tracker =='last'" class="card-title-text flex-column">
                   Add Tracker 
                   </p> 
                    
                
                </div>
                <p v-if=" user_tracker !='last' && user_tracker.last_updated !='None'" class="card-footer-text-2 flex-column">
                  {{ user_tracker.last_updated.split(",")[1].split(" 00")[0] }} 
                </p>
                <p v-if="user_tracker.last_updated =='None'" class="card-footer-text-2 flex-column">
                 Never Tracked 
                </p>
                </div>
              </div>

            </div>
</div>

            <div v-if="outer_loop_count == 1" class="flex-row w-100 cards">
              <div
                class="neo-card-btm flex-column h-90"
                @click="openChoiceModal"
              >
                <div class="inner-icon-btm flex-column">
                  <i class="fa fa-plus" aria-hidden="true"></i>
                  <p class="card-title-text flex-column">Add Tracker</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <FooterComponent />
<!-- The actual snackbar -->
<div id="snackbar"  v-bind:class="
                                showSnack
                                  ? 'show'
                                  : 'hide'
                              ">Event Successfull !!</div>
<div id="error_snackbar"   v-bind:class="
                                showError
                                  ? 'show'
                                  : 'hide'
                              ">Something Went Wrong !!</div>

    <!-- loading modal -->
<LoadingComponent v-if="showLoading" />

 <!-- choice modal -->
<template v-if="showChoiceDialog">
<div id="choiceModal" class="modal show " tabindex="-1" style="display: block;">
    <div class="modal-dialog">
        <div class="modal-content modal-parent">

            <div class="modal-box h-100 flex-column">


                <div class="flex-row w-100  h-75 list-parent">
                    <div class="list-card h-100 flex-column" @click="openTrackerModal">
                        <i class="fa fa-list modal-icon"></i>
                        <p class="modal-icon-text">Select Tracker From List</p>
                    </div>
                    <div class="list-card h-100 flex-column" @click="openCustomTrackerModal">
                        <i class="fa fa-plus modal-icon"></i>
                        <p class="modal-icon-text">Add Custom Tracker</p>
                    </div>

                </div>


                <div class="flex-column w-100 h-25 ">
                    <img src="@/assets/image/select.svg" class="w-100 h-100 selection-image"/>
                  <div class=" h-100 flex-column w-50 choice-btn" @click="hideChoicePrompt">

                  <button class="neo-button-cancel cancel_btn"
                                id="ct_create_btn" > Cancel
                        </button>
                    </div>
                   
                </div>


            </div>

        </div>
    </div>
</div>
<div class="modal-backdrop show"></div>
</template> 

 <!-- predefined tracker modal -->
<template v-if="showTrackerDialog">
<div id="openTrackerModal" class="modal show " tabindex="-1" style="display: block;">
    <div class="modal-dialog">
       <div class="modal-content modal-parent">

            <div class="modal-box h-100 flex-column">

                <p class="select-tracker-text"> Select a Tracker</p>
                <div v-for="item in predefined_trackers_list" :key="item.id" id="tracker-rep-block">

            <div @click="save_this_tracker(item.id)" class="flex-row w-100  h-75 list-parent-tracker">
                                <div class="list-card-tracker h-100 w-100 flex-row">
                                   <div class="flex-row w-75 h-100 tracker-list-items">
                                      <i v-bind:class="item.tracker_icon +' tracker-icon'" v-bind:style="'color:' + item.tracker_color"></i>
                                                <p class="tracker-title"> {{ item.name }}</p>      </div>
                                                  <div class="flex-row  w-25 h-100 tracker-list-items">
                                                        <p class="tracker-type">{{ item.tracker_type }}</p>
                                                                   </div>
                                        </div>
                   
                                   </div>
                </div>

                  <div class=" h-100 flex-column w-50 choice-btn" @click="hideChoicePrompt">

                  <button class="neo-button-cancel cancel_btn"
                                id="ct_create_btn" > Cancel
                        </button>
                    </div>


            </div>

        </div>
    </div>
</div>
<div class="modal-backdrop show"></div>
</template> 

 <!-- custom tracker modal -->
<template v-if="showCustomTrackerDialog">
<div id="openCustomTrackerModal" class="modal show " tabindex="-1" style="display: block;">
    <div class="modal-dialog">
        <div class="modal-content modal-parent">

            <div class="modal-box h-100 flex-column">
                <form id="custom_tracker_form" class="normal-form-div w-100 flex-wrapper"
                      v-on:submit.prevent="saveCustomTracker" >
                    <div class="custom-modal-box h-100 w-100 flex-column">
                        <p class="select-tracker-text"> Create a Tracker</p>
                        <div class="flex-wrapper flex-column">
                            <div class="flex-row w-100  h-75 flex-wrapper custom-list">
                                <label class="normal-label align-self-center flex-wrapper w-25">Tracker Name</label>
                                <input class="normal-input flex-wrapper w-75" id="ct_tracker_name"
                                  v-model="custom_post_form.ct_tracker_name"    name="ct_tracker_name" type="text" required/>


                            </div>

                            <div class="flex-row w-100  h-75 flex-wrapper custom-list">

                                <label class="align-self-center flex-wrapper w-25">Icon&nbsp;<a
                                        href="https://fontawesome.com/v5/search" target="_blank"> visit</a></label>
                                <input class="normal-input flex-wrapper w-75" id="ct_icon" name="ct_icon" type="text"
                              v-model="custom_post_form.ct_icon"         placeholder="fa fa-plus"/>


                            </div>

                            <div class="flex-row w-100  h-75 flex-wrapper custom-list">

                                <label class="align-self-center flex-wrapper w-25 first-label">Icon Color</label>
                                <input class="flex-wrapper w-25 align-self-center input-color" id="ct_color"
                                       name="ct_color"
                                  v-model="custom_post_form.ct_color"     type="color" value="#f50142"/>

                                <label class="align-self-center flex-wrapper w-25 second-label">Type</label>
                                <select v-model="custom_post_form.ct_type"  name="ct_type" id="ct_type" class="w-50 normal-input"
                                        v-on:change="show_hide_unit($event.target.value);" required>
                                    <option value="tap">Tap</option>
                                    <option value="number">Number</option>
                                    <option value="time_duration">Time Duration</option>
                                    <option value="list">List</option>
                                    <option value="multi_list">Multi Select List</option>
                                </select>
                            </div>
                            <div id="unit_div" v-bind:class="unit_visibility + ' flex-row w-100  h-75 flex-wrapper custom-list'">


                                <label class="align-self-center flex-wrapper w-25 second-label">Unit :</label>
                                <select v-model="custom_post_form.ct_unit"  name="ct_unit" id="ct_unit" class="w-70 normal-input"
                                    :required="unit_visibility =='show_class' ? true : false"     v-on:change="show_hide_custom_unit($event.target.value)">
                                    <option value="celcius">Celcius</option>
                                    <option value="fahrenheit">Fahrenheit</option>
                                    <option value="kelvin">Kelvin</option>
                                    <option value="steps">Steps</option>
                                    <option value="reps">Reps</option>
                                    <option value="gram">Gram</option>
                                    <option value="kilogram">Kilogram</option>
                                    <option value="lbs">lbs</option>
                                    <option value="oz">Oz</option>
                                    <option value="feet">Feet</option>
                                    <option value="cm">cm</option>
                                    <option value="meter">Meter</option>
                                    <option value="km">KM</option>
                                    <option value="mile">Mile</option>
                                    <option value="cal">Cal</option>
                                    <option value="kcal">KCal</option>
                                    <option value="custom">Custom</option>

                                </select>
                            </div>


                            <div id="custom_unit_div" v-bind:class="custom_unit_visibility + ' flex-row w-100  h-75 flex-wrapper custom-list'">

                                <label class="align-self-center flex-wrapper w-25">Custom Unit </label>
                                <input v-model="custom_post_form.ct_custom_unit"  :required="custom_unit_visibility =='show_class' ? true : false"  class="normal-input flex-wrapper w-75" id="ct_custom_unit" name="ct_custom_unit"
                                       type="text" placeholder="Unit Name"/>


                            </div>

                            <div  v-bind:class="list_class_visibility + ' list_div  flex-row w-100  h-75 flex-wrapper custom-list'">

                                <label class="align-self-center flex-wrapper w-100">List Options - Seperate by Pressing
                                    Enter or by Comma</label>


                            </div>
                            <div v-bind:class="list_class_visibility + ' list_div  flex-row w-100  h-75 flex-wrapper custom-list'">


                                <textarea class="normal-input-text-area flex-wrapper w-100" type="text" placeholder=""
                                     v-model="custom_post_form.ct_settings"    :required="list_class_visibility =='show_class' ? true : false"  id="ct_settings" name="ct_settings" aria-multiline="true"></textarea>


                            </div>


                            <div class="flex-row w-100  h-75 flex-wrapper custom-list">

                                <label class="align-self-center flex-wrapper w-100">Description </label>


                            </div>
                            <div class=" flex-row w-100  h-75 flex-wrapper custom-list">


                                <textarea class="normal-input-text-area flex-wrapper w-100" type="text" placeholder=""
                                  v-model="custom_post_form.ct_desc"         id="ct_desc" name="ct_desc" aria-multiline="true"></textarea>


                            </div>


                            <div class=" flex-row w-100  h-75 flex-wrapper custom-list">

              
                  
                                <button class="w-50 neo-button-submit ct_create_btn margin-btn-custom"
                                        id="ct_create_btn" @click="saveCustomTracker"> Create
                                </button>

                                <button class="w-50 neo-button-cancel cancel_btn margin-btn-custom"
                                @click.prevent="hideChoicePrompt" type="button"> Cancel
                        </button>

                            </div>

                        </div>
                    </div>

                </form>

            </div>

        </div>
    </div>
</div>
<div class="modal-backdrop show"></div>
</template> 


<template v-if="showNumberDialog">
  <div id="openNumberModal" class="modal show " tabindex="-1" style="display: block;">
   <div class="modal-dialog">
        <div class="modal-content modal-parent">

            <div class="modal-box h-100 flex-column">
                <form  class="normal-form-div w-100 flex-wrapper"
                     v-on:submit.prevent="save_numerical_data"  id="number_type_form">
                    <div class="custom-modal-box h-100 w-100 flex-column">
                        <p class="select-tracker-text"> Enter Value</p>
                        <div class="flex-wrapper flex-column">
                            <div class="flex-row w-100  h-75 flex-wrapper custom-list">
                                <label class="normal-label align-self-center flex-wrapper w-50" id="number_unit"> {{ tracker_unit_name }}</label>
                                <input class="normal-input flex-wrapper w-50" id="tracker_num_val"
                                       name="tracker_num_val" type="number" required/>


                            </div>
                            <input class="hidden" id="user_trcker_id_num" name="user_trcker_id_num"/>

                            <div class=" flex-row w-100  h-75 flex-wrapper custom-list">


                                <button class=" w-50 neo-button-submit ct_create_btn margin-btn-custom"
                                        id="ct_create_btn" type="submit" @click="save_numerical_data"> Save
                                </button>
                                 <button class="w-50 neo-button-cancel cancel_btn margin-btn-custom"
                                @click.prevent="hideChoicePrompt" type="button"> Cancel
                        </button>

                            </div>

                        </div>
                    </div>

                </form>

            </div>

        </div>
    </div>
      </div>
      <div class="modal-backdrop show"></div>
</template>

<template v-if="showEditorDialog">
  <div id="editTrackerModal" class="modal show " tabindex="-1" style="display: block;">
   <div class="modal-dialog">
        <div class="modal-content modal-parent">
            <input class="hide_class" id="user_tracker_id_e_d"
                   name="user_tracker_id_e_d" />
             <input class="hide_class" id="custom_user_tracker_id_e_d"
                   name="custom_user_tracker_id_e_d" />
            <div v-if="showCustomEditorModal == 1" class="hide_class modal-box h-100 flex-column" id="iden_type_1">
                <p class="select-tracker-text"> Edit/Delete This tracker ?</p>

                <div class="flex-row w-100  h-75 list-parent">
                    <div class=" h-100 flex-column w-50">

                        <button class="neo-button-confirm confirm_btn"
                                id="ct_create_btn" @click="editThisTracker"> Edit
                        </button>
                    </div>
                    <input class="hidden" id="delete_tracker"/>
                    <div class="h-100 flex-column w-50" @click="showDeleteModal">

                        <button class="neo-button-cancel cancel_btn"
                                id="ct_create_btn" type="submit"> Delete
                        </button>
                    </div>
                    <div class="h-100 flex-column w-50" @click="hideChoicePrompt">

                        <button class="neo-button-cancel cancel-faded cancel_btn"
                                id="ct_create_btn" type="submit"> Cancel
                        </button>
                    </div>

                </div>


            </div>


            <div v-if="showCustomEditorModal == 2" class="hide_class modal-box h-100 flex-column" id="iden_type_2">
                <p class="select-tracker-text"> Are you sure you want to delete this ?</p>

                <div class="flex-row w-100  h-75 list-parent">
                    <div class=" h-100 flex-column w-50" @click="hideChoicePrompt">

                        <button class="neo-button-confirm confirm_btn"
                                id="ct_create_btn" type="submit"> Cancel
                        </button>
                    </div>
                    <input class="hidden" id="delete_tracker"/>
                    <div class="h-100 flex-column w-50" @click="deleteThisNow">

                        <button class="neo-button-cancel cancel_btn"
                                id="ct_create_btn" type="submit"> Delete
                        </button>
                    </div>

                </div>


            </div>

        </div>
    </div>
  </div>
   <div class="modal-backdrop show"></div>
  </template>

<template v-if="showEditTrackerDialog">
  <div id="openEditTrackerModal" class="modal show " tabindex="-1" style="display: block;">
  <div class="modal-dialog">
        <div class="modal-content modal-parent">

            <div class="modal-box h-100 flex-column">
                <form  v-on:submit.prevent="submit_edit_custom_form"   class="normal-form-div w-100 flex-wrapper"
                      id="custom_edit_form">
                    <div class="custom-modal-box h-100 w-100 flex-column">
                        <p class="select-tracker-text"> Edit a Tracker</p>
                        <div class="flex-wrapper flex-column">
                            <div class="flex-row w-100  h-75 flex-wrapper custom-list">
                                <label class="normal-label align-self-center flex-wrapper w-25">Tracker Name</label>
                                <input class="normal-input flex-wrapper w-75" id="edit_ct_tracker_name"
                                      v-model="custom_edit_form.edit_ct_tracker_name"  name="edit_ct_tracker_name" type="text" required/>
  <input class="hide_class normal-input flex-wrapper w-100" id="edit_ct_tracker_id"
                                       name="edit_ct_tracker_id" />

                            </div>

                            <div class="flex-row w-100  h-75 flex-wrapper custom-list">

                                <label class="align-self-center flex-wrapper w-25">Icon&nbsp;&nbsp;<a
                                        href="https://fontawesome.com/v5/search" target="_blank">visit</a></label>
                                <input   v-model="custom_edit_form.edit_ct_icon"  class="normal-input flex-wrapper w-75" id="edit_ct_icon" name="edit_ct_icon" type="text"
                                       placeholder="fa fa-plus"/>


                            </div>

                            <div class="flex-row w-100  h-75 flex-wrapper custom-list">

                                <label class="align-self-center flex-wrapper w-25 first-label">Icon&nbsp;Color</label>
                                <input class="flex-wrapper w-25 align-self-center input-color" id="edit_ct_color"
                                        v-model="custom_edit_form.edit_ct_color" name="edit_ct_color"
                                       type="color" value="#f50142"/>


                            </div>
                            <div v-if="showEditUnit" id="edit_unit_div" class="flex-row w-100  h-75 flex-wrapper custom-list">


                                <label class="align-self-center flex-wrapper w-25 second-label">Unit :</label>
                                <select name="edit_ct_unit"  v-model="custom_edit_form.edit_ct_unit" id="edit_ct_unit" class="w-70 normal-input"
                                   :required="showEditUnit ? true : false"      v-on:change="show_hide_custom_unit($event.target.value)">
                                    <option value="celcius">Celcius</option>
                                    <option value="fahrenheit">Fahrenheit</option>
                                    <option value="kelvin">Kelvin</option>
                                    <option value="steps">Steps</option>
                                    <option value="reps">Reps</option>
                                    <option value="gram">Gram</option>
                                    <option value="kilogram">Kilogram</option>
                                    <option value="lbs">lbs</option>
                                    <option value="oz">Oz</option>
                                    <option value="feet">Feet</option>
                                    <option value="cm">cm</option>
                                    <option value="meter">Meter</option>
                                    <option value="km">KM</option>
                                    <option value="mile">Mile</option>
                                    <option value="cal">Cal</option>
                                    <option value="kcal">KCal</option>
                                    <option value="custom">Custom</option>

                                </select>
                            </div>


                            <div v-if="showEditUnit && showCustomUnit" id="edit_custom_unit_div"  class="flex-row w-100  h-75 flex-wrapper custom-list">

                                <label class="align-self-center flex-wrapper w-25">Custom Unit&nbsp;</label>
                                <input class="normal-input flex-wrapper w-75" id="edit_ct_custom_unit" name="edit_ct_custom_unit"
                                    :required="showCustomUnit ? true : false" v-model="custom_edit_form.edit_ct_custom_unit"   type="text" placeholder="Unit Name"/>


                            </div>




                            <div class="flex-row w-100  h-75 flex-wrapper custom-list">

                                <label class="align-self-center flex-wrapper w-100">Description&nbsp;</label>


                            </div>
                            <div class=" flex-row w-100  h-75 flex-wrapper custom-list">


                                <textarea class="normal-input-text-area flex-wrapper w-100" type="text" placeholder=""
                                         v-model="custom_edit_form.edit_ct_desc"  id="edit_ct_desc" name="edit_ct_desc" aria-multiline="true"></textarea>


                            </div>


                            <div class=" flex-row w-100  h-75 flex-wrapper custom-list">


                                <button class="w-50 neo-button-submit ct_create_btn margin-btn-custom"
                                        id="edit_ct_create_btn" type="submit" > Edit
                                </button>
                                   <button class="w-50 neo-button-cancel cancel_btn margin-btn-custom"
                                id="ct_create_btn" type="button" @click="hideChoicePrompt"> Cancel
                        </button>

                            </div>

                        </div>
                    </div>

                </form>

            </div>

        </div>
    </div>
  </div>
     <div class="modal-backdrop show"></div>
  </template>
<template v-if="showTimerDialog">
  <div id="openTimerModal" class="modal show " tabindex="-1" style="display: block;">
     <div class="modal-dialog">
        <div class="modal-content modal-parent">

            <div class="modal-box h-100 flex-column">
                <form v-on:submit.prevent="save_timer_data" class="normal-form-div w-100 flex-wrapper"
                      id="time_type_form">
                    <div class="custom-modal-box h-100 w-100 flex-column">
                        <p class="select-tracker-text"> Enter Time</p>
                        <div class="flex-wrapper flex-column">
                            <div class="flex-row w-100  h-75 flex-wrapper custom-list justify-content-center">

                                <input class="normal-input flex-wrapper w-25" id="tracker_time_hrs"
                                       name="tracker_time_hrs" type="number" step="1" min="0" placeholder="Hours"
                                       required/>
                                <input class="normal-input flex-wrapper w-25" id="tracker_time_mins"
                                       name="tracker_time_mins" type="number" step="1" min="1" max="59"
                                       placeholder="Minutes" required/>
                                <input class="normal-input flex-wrapper w-25" id="tracker_time_secs"
                                       name="tracker_time_secs" type="number" step="1" min="0" max="59"
                                       placeholder="Seconds" required/>

                            </div>
                            <input class="hidden" id="user_trcker_id_time" name="user_trcker_id_time"/>

                            <div class=" flex-row w-100  h-75 flex-wrapper custom-list">


                                <button class="neo-button-submit ct_create_btn margin-btn-custom"
                                        id="ct_create_btn" type="submit" @click="save_timer_data"> Save
                                </button>

                                 <button class="w-50 neo-button-cancel cancel_btn margin-btn-custom"
                                @click.prevent="hideChoicePrompt" type="button"> Cancel
                        </button>

                            </div>

                        </div>
                    </div>

                </form>

            </div>

        </div>
    </div>
      </div>
      <div class="modal-backdrop show"></div>
</template>

<template v-if="showMultiSelectDialog">
  <div id="openMultiSelectModal" class="modal show " tabindex="-1" style="display: block;">
    <div class="modal-dialog">
        <div class="modal-content modal-parent">

            <div class="modal-box h-100 flex-column">
                <form v-on:submit.prevent="save_multi_select_data" class="normal-form-div w-100 flex-wrapper"
                      id="multi_type_form">
                    <div class="custom-modal-box h-100 w-100 flex-column">
                        <p class="select-tracker-text"> Select your option</p>
                        <div class="flex-wrapper flex-column">
                            <div class="flex-row w-100  h-75 flex-wrapper custom-list">

                                <select v-model="multi_select" id="multi_select_val" multiple="multiple" class="normal-input-select-val"
                                        required>
                                    <option v-for="(val,index) in ct_settings_value" :value="val" :key="index">{{ val }} </option>
                                </select>

                            </div>

                            <input class="hidden" id="user_trcker_id_multi_select" name="user_trcker_id_multi_select"/>
                            <div class=" flex-row w-100  h-75 flex-wrapper custom-list">


                                <button class="neo-button-submit ct_create_btn margin-btn-custom"
                                        id="ct_create_btn" type="submit" @click="save_multi_select_data"> Save
                                </button>

                                 <button class="w-50 neo-button-cancel cancel_btn margin-btn-custom"
                                @click.prevent="hideChoicePrompt" type="button"> Cancel
                        </button>
                            </div>

                        </div>
                    </div>

                </form>

            </div>

        </div>
    </div>
      </div>
      <div class="modal-backdrop show"></div>
</template>

<template v-if="showSingleSelectDialog">
  <div id="openSingleSelectModal" class="modal show " tabindex="-1" style="display: block;">
    <div class="modal-dialog">
        <div class="modal-content modal-parent">

            <div class="modal-box h-100 flex-column">
                <form v-on:submit.prevent="save_single_select_data" class="normal-form-div w-100 flex-wrapper"
                      id="single_type_form">
                    <div class="custom-modal-box h-100 w-100 flex-column">
                        <p class="select-tracker-text"> Select your option</p>
                        <div class="flex-wrapper flex-column">
                            <div class="flex-row w-100  h-75 flex-wrapper custom-list">
                                <!-- Build your select: -->
                                <select id="single_select_val" class="normal-input-select-val"
                                        required>
                                      <option v-for="(val,index) in ct_settings_value" :value="val" :key="index">{{ val }} </option>
                                </select>

                            </div>

                            <input class="hidden" id="user_trcker_id_single_select"
                                   name="user_trcker_id_single_select"/>
                            <div class=" flex-row w-100  h-75 flex-wrapper custom-list">


                                <button class="neo-button-submit ct_create_btn margin-btn-custom"
                                        id="ct_create_btn" type="submit" @click="save_single_select_data"> Save
                                </button>

                                 <button class="w-50 neo-button-cancel cancel_btn margin-btn-custom"
                                @click.prevent="hideChoicePrompt" type="button"> Cancel
                        </button>

                            </div>

                        </div>
                    </div>

                </form>

            </div>

        </div>
    </div>
      </div>
      <div class="modal-backdrop show"></div>
</template>
  </div>

</template>

<script>
  import DashboardView from '@/assets/js/dashboardcalls.js';
  export default DashboardView;
  </script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url("https://fonts.googleapis.com/css?family=Quicksand");
@import "@/assets/css/style.css";
@import "@/assets/css/dashboard.css";
@import "@/assets/css/bootstrap.css";
</style>
