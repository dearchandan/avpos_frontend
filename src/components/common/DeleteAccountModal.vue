<template>
    <teleport to='body'>

        <div class="modal fade" id="deleteAccountModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-dialog-centered modal-w-1260 modal-md">
                <div class="modal-content">
                    <div class="modal-header modal-title border-0">
                        <h3 class="mb-0 text-danger"> {{ $t('Deleting Account') }}</h3>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal" id="close_btn"></button>
                    </div>
                    <div class="modal-body pt-0">
                        <div class="row">
                            <div class="col-12">
                                <p class="text-danger fw-bold">
                                Deleting an account will remove all the data from the system and you wont be able to recover it back so please be careful about it and think twice before doing it.
                                </p>
                            </div>
                            <div class="col-12 mt-4">
                                <a href="#"><u>Please tell us why you are deleting your account?</u></a>
                            </div>
                        </div>
                        <div class="row mt-4">
                            <div class="col-6">
                                <button class="btn btn-success w-100" @click="closeModal()" :disabled="is_deleting"> Cancel</button>
                            </div>
                            <div class="col-6">
                                <button type="submit" class="btn btn-danger w-100" @click="deleteAccount()" :disabled="is_deleting">
                                    <clip-loader v-if="is_deleting" :color="'white'" :size="'15px'" class="pt-2 pe-2">  </clip-loader> 
                                    <span class="pt-0" v-if="is_deleting">{{ $t('Deleting...') }}</span>
                                    <span v-else> <Icon icon="material-symbols:dangerous" class="fs-3" />  {{ $t('Delete Anyway') }}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </teleport>
</template>


<script setup>

    import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
    import { useAuthStore } from "@/stores/auth";

    const authStore = useAuthStore();

    function closeModal(){
        $('#deleteAccountModal').modal('hide');
    }

    const is_deleting = ref(false);
    
    async function deleteAccount(){
        
        is_deleting.value = true;

        await axios.post('/api/other/delete_account').then( (response) => {
            
            if(response.data.status_code == 200) 
            {

                is_deleting.value = false;

                toast.success(response.data.msg);
                authStore.resetState();
                setInterval(() => {

                    window.location.href = '/register';
                    
                }, 2000);
            
            
            }
            
        }).catch((error) => {
         console.log(error)
        });

    }


</script>