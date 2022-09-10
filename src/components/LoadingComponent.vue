<!-- loading modal -->
<template>
<div>
<div id="loadingModal" class="modal show " tabindex="-1" style="display: block;text-align:center">
    <div class="modal-dialog-centered" style="margin-left: auto;
margin-right: auto;" >
       
  <img src="@/assets/image/loading.gif" width="200px" height="auto" style="margin-left: auto;
margin-right: auto;"/>

    </div>
</div>
<div class="modal-backdrop show"></div>
</div>
</template>

<script>
export default {
  name: 'LoadingComponent',

}
</script>
