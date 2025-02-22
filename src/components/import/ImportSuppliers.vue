<template>
<div class="row align-items-center justify-content-between">
        <div class="col-auto">
            <h3>{{ $t('Suppliers') }}</h3>
        </div>
        <div class="col-auto">
            <a :href="export_supplier_template" class="btn btn-link" download>
                {{ $t('Download Import Template') }}
                <svg class="ms-2 me-0" width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.666667 14.5002C0.298667 14.5002 0 14.2015 0 13.8335V10.5002C0 10.1322 0.298667 9.8335 0.666667 9.8335C1.03467 9.8335 1.33333 10.1322 1.33333 10.5002V13.8335C1.33333 14.2015 1.03467 14.5002 0.666667 14.5002Z" fill="currentColor"/>
                <path d="M2.66667 16.4998C1.19633 16.4998 0 15.3035 0 13.8332C0 13.4652 0.298667 13.1665 0.666667 13.1665C1.03467 13.1665 1.33333 13.4652 1.33333 13.8332C1.33333 14.5685 1.93133 15.1665 2.66667 15.1665C3.03467 15.1665 3.33333 15.4652 3.33333 15.8332C3.33333 16.2012 3.03467 16.4998 2.66667 16.4998Z" fill="currentColor"/>
                <path d="M15.3337 14.5002C14.9657 14.5002 14.667 14.2015 14.667 13.8335V10.5002C14.667 10.1322 14.9657 9.8335 15.3337 9.8335C15.7017 9.8335 16.0003 10.1322 16.0003 10.5002V13.8335C16.0003 14.2015 15.7017 14.5002 15.3337 14.5002Z" fill="currentColor"/>
                <path d="M13.3333 16.4998H2.66667C2.29867 16.4998 2 16.2012 2 15.8332C2 15.4652 2.29867 15.1665 2.66667 15.1665H13.3333C13.7013 15.1665 14 15.4652 14 15.8332C14 16.2012 13.7013 16.4998 13.3333 16.4998Z" fill="currentColor"/>
                <path d="M13.3337 16.4998C12.9657 16.4998 12.667 16.2012 12.667 15.8332C12.667 15.4652 12.9657 15.1665 13.3337 15.1665C14.069 15.1665 14.667 14.5685 14.667 13.8332C14.667 13.4652 14.9657 13.1665 15.3337 13.1665C15.7017 13.1665 16.0003 13.4652 16.0003 13.8332C16.0003 15.3035 14.804 16.4998 13.3337 16.4998Z" fill="currentColor"/>
                <path d="M7.99967 12.5C7.63167 12.5 7.33301 12.2013 7.33301 11.8333V1.16667C7.33301 0.798667 7.63167 0.5 7.99967 0.5C8.36767 0.5 8.66634 0.798667 8.66634 1.16667V11.8333C8.66634 12.2013 8.36767 12.5 7.99967 12.5Z" fill="currentColor"/>
                <path d="M7.99993 12.5002C7.82926 12.5002 7.65859 12.4352 7.52859 12.3049L3.75726 8.53391C3.49693 8.27358 3.49693 7.85158 3.75726 7.59125C4.01726 7.33091 4.43993 7.33091 4.69993 7.59125L8.47093 11.3622C8.73126 11.6226 8.73126 12.0446 8.47093 12.3049C8.34126 12.4352 8.17059 12.5002 7.99993 12.5002Z" fill="currentColor"/>
                <path d="M7.99959 12.5002C7.82892 12.5002 7.65826 12.4352 7.52826 12.3049C7.26792 12.0446 7.26792 11.6226 7.52826 11.3622L11.2993 7.59125C11.5593 7.33091 11.9819 7.33091 12.2419 7.59125C12.5023 7.85158 12.5023 8.27358 12.2419 8.53391L8.47093 12.3049C8.34093 12.4352 8.17026 12.5002 7.99959 12.5002Z" fill="currentColor"/>
                </svg>
            </a>
        </div>
    </div>
    <div class="card">
        <form @submit="submit" enctype="multipart/form-data">
            <div class="row align-items-center justify-content-between flex-column">
                <div class="col-md-6">
                    <div class="bimportbox">
                        <input type="file" @change="selectFile" accept=".xlsx"  >
                        <div class="icon">
                            <svg width="59" height="42" viewBox="0 0 59 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M45.7411 42H36.4117H33.8995H33.3569V29.4861H37.4496C38.4875 29.4861 39.1008 28.3067 38.4875 27.4575L30.5263 16.4414C30.0191 15.7338 28.9694 15.7338 28.4622 16.4414L20.501 27.4575C19.8877 28.3067 20.4892 29.4861 21.5389 29.4861H25.6316V42H25.089H22.5768H11.7613C5.56924 41.658 0.63916 35.8669 0.63916 29.5922C0.63916 25.2637 2.98625 21.4895 6.46561 19.449C6.14716 18.588 5.98204 17.6681 5.98204 16.7009C5.98204 12.278 9.55576 8.7043 13.9787 8.7043C14.934 8.7043 15.854 8.86942 16.715 9.18787C19.2744 3.76243 24.7942 0 31.2103 0C39.5136 0.0117944 46.3544 6.369 47.1328 14.4718C53.5136 15.5687 58.3611 21.4777 58.3611 28.1651C58.3611 35.3126 52.7942 41.5046 45.7411 42Z" fill="#CFD5E8"/>
                            </svg>
                        </div>
                        <h5>{{ $t("Drag and drop files here") }}</h5>
                        <h6>{{ $t("Browse Files") }}</h6>
                        <p class="text-warning pt-2">{{ form.file_name }}</p>
                    </div>
                </div>
                <div class="col-md-6 text-center mt-3">
                    <button 
                    type="button"
                    class="btn btn-primary" 
                    @click="submit"
                    :disabled="form.is_processing || form.file == '' "
                    >
                        <clip-loader v-if="form.is_processing" loading="loading" :color="'white'" :size="'10px'" class="pt-1 pe-1">  </clip-loader>
                        <span class="pt-0" v-if="form.is_processing">
                            {{ $t('Uploading...') }}
                        </span>
                        <span class="pt-0" v-else>
                            {{ $t('Upload') }}
                        </span> 
                    </button>
                </div>
            </div>
        </form>
        <div class="alert mt-3" :class="'alert-'+form.custom_message.type" v-if="form.custom_message.type != 'error' && form.custom_message.msg != ''">
            <!-- <Icon icon="material-symbols:check-circle-outline" class="fs-5" />  -->
            {{ form.custom_message.msg }} 
        </div>
        <AsyncServerMessage class="py-3 mt-3" v-if="form.server_messages.messages != ''" :server_messages="form.server_messages"  />
        <AsyncImportErrors v-if="form.import_errors.length" :import_errors="form.import_errors" />
    </div>

</template>

<script setup>

import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import useSupplierExportTemplate from '@/composables/export_suppliers_template.js';

const { export_supplier_template } = useSupplierExportTemplate();

const initialState = {
    server_messages: {
        type: "",
        messages: "",
    },
    is_processing: false,
    custom_message: {
        type : 'success',
        msg : '',
    },
    import_errors: [],

    // form data   
    file: "",
    file_name:""
};
const form = reactive({ ...initialState });

async function selectFile(e){
    form.file = e.target.files[0];
    form.file_name = form.file.name;
}

async function submit(e){

    var is_confirmed = false;

    await Swal.fire({
        
        title: 'Warning!',
        text: 'Are you sure about import the suppliers?',
        icon: 'warning',
        confirmButtonText: 'Proceed',
        cancelButtonText: 'Cancel',
        showCancelButton: true,
    }).then( (result) => {
        if(result.isConfirmed){
            is_confirmed = true;        
        }
    });

    if(is_confirmed){

        form.is_processing = true;
        
        var form_data = new FormData();
        form_data.append('file',form.file);

        await axios.post('/api/import/suppliers',form_data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        }).then( (response) => {
          form.file = "";
          form.file_name = "";
          document.querySelector('input[type="file"]').value = '';
          if(response.data.status_code == 200) {

            form.is_processing = false;
            form.custom_message.type ='success';
            form.custom_message.msg = response.data.msg;
            form.server_messages.type = "";
            form.server_messages.messages = "";
                
            }else if(response.data.status_code == 199){
              /*const url = window.URL.createObjectURL(new Blob([response.data.data.error_file]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', 'error_file.xlsx');
              document.body.appendChild(link);
              link.click();*/

              const link = document.createElement('a');
              link.href = response.data.data.error_file;
              document.body.appendChild(link);
              link.click();

              form.is_processing = false;
              form.custom_message.type = 'warning';
              form.custom_message.msg = response.data.msg;
              form.server_messages.type = "";
              form.server_messages.messages = "";
              form.import_errors = response.data.data;

            }else{
              form.custom_message.type ='error';
              form.custom_message.messages ='';
                try{
                    form.server_messages.type = "error";
                    form.server_messages.messages = JSON.parse(response.data.msg);
                }catch(err){
                    form.server_messages.type = "error";
                    form.server_messages.messages = response.data.msg;
                }
                form.is_processing = false;
            }
            
        }).catch((error) => {
            form.server_messages.type = "error";
            form.server_messages.messages = error;
            form.is_processing = false;
            console.log(error);
        });
        
    }

}

const AsyncServerMessage = defineAsyncComponent( () => import('@/components/common/ServerMessage.vue') );
const AsyncImportErrors = defineAsyncComponent( () => import('@/components/common/ImportErrors.vue') );

</script>