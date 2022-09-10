<template>
  <div>
    <div class="main dashboard flex-row">
      <div class="flex-column side-bar h-100">
        <div class="icon-space flex-column h-100">
          <div>
            <a href="dashboard" title="dashboard"
              ><i class="fa fa-home icon-css" aria-hidden="true"></i><br
            /></a>
            <a href="#" title="view history"
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
          <div class="h-25 flex-row w-100 header-wrapper">
            <div class="w-100">
              <div class="flex-wrapper">
                <p class="xl-large-text-bold w-75 user-name">Tracker History</p>
                <img src="@/assets/image/qs_logo.svg" class="logo-wrapper" />
              </div>
            </div>
          </div>

          <div class="scrollable">
            <div class="h-100 flex-column card-wrapper-list">
              <div class="flex-column w-100 cards">
                <div
                  v-for="data in datas"
                  :key="data.id"
                  class="neo-card-list h-75 w-75"
                >
                  <div class="list-wrapper w-100">
                    <div class="flex-column">
                      <div class="flex-row datetime-wrapper">
                        <p class="time-text">
                          {{ data.created_at.split(" ")[1].split(".")[0] }}
                        </p>
                        <p class="date-text">
                          {{ data.created_at.split(" ")[0] }}
                        </p>
                      </div>
                      <div class="flex-column">
                        <div class="flex-row datetime-wrapper">
                          <p class="qty-text">
                            <i
                              v-bind:class="
                                data.user_tracker_id.tracker_id != `None`
                                  ? data.user_tracker_id.tracker_id.tracker_icon
                                  : data.user_tracker_id.custom_tracker_id
                                      .tracker_icon
                              "
                              v-bind:style="
                                data.user_tracker_id.tracker_id != `None`
                                  ? 'color:' +
                                    data.user_tracker_id.tracker_id
                                      .tracker_color
                                  : 'color:' +
                                    data.user_tracker_id.custom_tracker_id
                                      .tracker_color
                              "
                              aria-hidden="true"
                            ></i>
                          </p>
                        </div>
                        <p
                          class="qty-text-desc"
                          v-if="data.user_tracker_id.tracker_id != 'None'"
                        >
                          {{ data.user_tracker_id.tracker_id.name }}
                        </p>
                        <p class="qty-text-desc" v-else>
                          {{ data.user_tracker_id.custom_tracker_id.name }}
                        </p>
                      </div>
                    </div>

                    <div class="flex-column">
                      <div class="flex-row h-100 center-wrapper">
                        <p class="center-text">
                          {{ data.value }}
                          <span
                            class="center-unit"
                            v-if="
                              data.user_tracker_id.tracker_id != 'None' &&
                              data.user_tracker_id.tracker_id.tracker_type_id ==
                                '5'
                            "
                          >
                            {{
                              data.user_tracker_id.tracker_id.tracker_unit_id
                                .unit
                            }}
                          </span>
                          <span
                            class="center-unit"
                            v-if="
                              data.user_tracker_id.custom_tracker_id !=
                                'None' &&
                              data.user_tracker_id.custom_tracker_id
                                .custom_unit != 'None'
                            "
                          >
                            {{
                              data.user_tracker_id.custom_tracker_id.custom_unit
                            }}
                          </span>
                          <span
                            class="center-unit"
                            v-if="
                              data.user_tracker_id.custom_tracker_id !=
                                'None' &&
                              data.user_tracker_id.custom_tracker_id
                                .tracker_type_id == '5'
                            "
                          >
                            {{
                              data.user_tracker_id.custom_tracker_id
                                .tracker_type_id
                            }}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div class="flex-column list-icon-wrapper">
                      <div
                        @click="openNoteModal(data)"
                      >
                        <i class="fa fa-edit list-icon" aria-hidden="true"></i>
                      </div>
                      <a v-bind:href="'charts?id='+ data.user_tracker_id.id">
                        <i
                          class="fa fa-chart-line list-icon"
                          aria-hidden="true"
                        ></i>
                      </a>
                      <div @click="deletePrompt(data.id)">
                        <i
                          class="fa fa-trash list-icon-delete"
                          aria-hidden="true"
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <FooterComponent  />
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
<!-- delete modal -->
<template v-if="showDeleteDialog">
<div id="deleteModal" class="modal show " tabindex="-1" style="display: block;">
    <div class="modal-dialog">
        <div class="modal-content modal-parent">

            <div class="modal-box h-100 flex-column">
                <p class="select-tracker-text"> Are you sure you want to delete this ?</p>

                <div class="flex-row w-100  h-75 list-parent">
                    <div class=" h-100 flex-column w-50" @click="hideDeletePrompt">

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
<!-- note modal -->
<template v-if="showNoteDialog">
<div id="noteModal" class="modal show " tabindex="-1" style="display: block;">
    <div class="modal-dialog">
        <div class="modal-content modal-parent">
            <input class="hidden" id="tracker_data_id" name="tracker_data_id"/>
            <input class="hidden" id="tracker_data_type" name="tracker_data_type"/>
            <div class="modal-box h-100 flex-column">
                <form v-on:submit.prevent="patchThisLog"  class="normal-form-div w-100 flex-wrapper"
                      id="edit_tracker_data">
                    <div class="custom-modal-box h-100 w-100 flex-column">
                        <p class="select-tracker-text"> Edit a Log</p>
                        <div class="flex-wrapper flex-column">
                            <div class="flex-row w-100  h-75 flex-wrapper custom-list">

                                <label v-if="show_value_label" class="normal-label align-self-center flex-wrapper w-25"
                                       id="tracker_value_label">Value :</label>


                            </div>
                            <div class="flex-row w-100  h-75 flex-wrapper custom-list">

                                <input v-if="show_num_value" v-bind:required="show_num_value ? true : false" class="normal-input flex-wrapper w-100" id="tracker_num_val"
                                       name="tracker_num_val" type="number" :value="num_value"/>

                                <input  v-if="show_time_value" v-bind:required="show_time_value ? true : false" class="normal-input flex-wrapper w-25" id="tracker_time_hrs"
                                       name="tracker_time_hrs" type="number" step="1" min="0" placeholder="Hours" :value="hour_value" 
                                />
                                <input v-if="show_time_value"  v-bind:required="show_time_value ? true : false" class="normal-input flex-wrapper w-25" id="tracker_time_mins"
                                       name="tracker_time_mins" type="number" step="1" min="1" max="59" 
                                       placeholder="Minutes" :value="min_value"/>
                                <input v-if="show_time_value"  v-bind:required="show_time_value ? true : false"  class="normal-input flex-wrapper w-25" id="tracker_time_secs"
                                       name="tracker_time_secs" type="number" step="1" min="0" max="59"
                                       placeholder="Seconds" :value="sec_value"/>


                                <select v-model="curr_list_value"  v-if="show_single_select_value" id="single_select_val" class="normal-input-select-val"
                                >
                                    <option v-for="(list_val,key) in lists" 
                                        :key="key" 
                                        :value="key">{{ list_val }}
                                </option>
                                </select>

                                <select v-model="curr_multilist_value" v-if="show_multi_select_value" id="multi_select_val" multiple="multiple"
                                        class="normal-input-select-val"
                                >
                                      <option  v-for="(list_val,key) in lists" 
                                        :key="key" 
                                        :value="key">{{ list_val }}
                                </option>
                                </select>

                            </div>


                            <div class="flex-row w-100  h-75 flex-wrapper custom-list">

                                <label class="align-self-center flex-wrapper w-100">Note : </label>


                            </div>
                            <div class=" flex-row w-100  h-75 flex-wrapper custom-list">


                                <textarea v-model="note" class="normal-input-text-area flex-wrapper w-100" type="text" placeholder=""
                                          id="tracker_note" name="tracker_note" aria-multiline="true"></textarea>


                            </div>



                <div class="flex-row w-100  h-75 list-parent">
                    <div class=" h-100 flex-column w-50" @click="hideNotePrompt">

                  <button class="neo-button-cancel cancel_btn"
                                id="ct_create_btn" > Cancel
                        </button>
                    </div>
                    <input class="hidden" />
                    <div class="h-100 flex-column w-50" >
                        <button class="neo-button-confirm confirm_btn"
                                id="ct_create_btn" > Save
                        </button>
                        
                    </div>

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
import LogsView from '@/assets/js/logcalls.js';
export default LogsView;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->


<style scoped>
@import url("https://fonts.googleapis.com/css?family=Quicksand");
@import "@/assets/css/style.css";
@import "@/assets/css/logs.css";
@import "@/assets/css/bootstrap.css";
</style>
