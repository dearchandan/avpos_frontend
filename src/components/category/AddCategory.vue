<template>
   <div class="modal hide" id="addCategoryModal"  tabindex="-1" aria-labelledby="Add Category" aria-modal="true" role="dialog"  data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" v-if="form.category_slack == ''">{{ $t('Add Category') }}</h5>
                    <h5 class="modal-title" v-else>{{ $t('Update Category') }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal" id="close_btn"></button>
                </div>
                <div class="modal-body">
                    <Form
                        :validation-schema="schema"
                        @submit="saveCategory"
                        enctype="multipart/form-data"
                        :initial-values="form"
                        id="add_category_form" >
                        <div class="">
                            
                            <div class="row">
                                <div class="col-md-6">
                                <VSelectInput
                                    name="parent_category"
                                    :label="parent_placeholder" 
                                    :options="categories"
                                    v-model="form.parent_category"
                                    size="normal"
                                />
                                </div>
                                <div class="col-md-6">
                                    <VTextInput
                                        type="text" 
                                        name="category_name"
                                        v-model="form.category_name"
                                        :label="category_name_placeholder" 
                                        :required="true"
                                    />
                                </div>
                                <!-- <div class="col-md-6">
                                    <VTextInput
                                        type="text" 
                                        name="category_name_ar"
                                        v-model="form.category_name_ar"
                                        :label="category_name_ar_placeholder" 
                                    />
                                </div> -->
                            <!-- </div>

                            <div class="row mt-4"> -->
                                
                                <div class="col-md-6 ">
                                    <div class="form-field">
                                        <label>{{ $t('Upload') }}</label>
                                        <div class="input-group input-file-group">
                                            <input class="form-control form-control-solid" name="category_image" type="file" id="category_image" accept="image/jpg, image/jpeg, image/png" @change="selectCategoryFile">
                                            <label class="btn btn-light-primary min-width-0 mb-0" for="category_image">{{ $t('Upload') }}</label>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-4 pt-4">
                                    <div class="form-field">
                                        <div class="form-check form-switch ">
                                            <input class="form-check-input me-2" type="checkbox" role="switch" id="status" checked v-model="form.status">
                                            <label class="form-check-label" for="status">{{ $t('Active') }}</label>
                                        </div>
                                    </div>
                                </div>
                                
                                
                                
                            <!-- </div>
                            
                            <div class="row mt-4"> -->

                                <!-- <div class="col-4">
                                    <div class="form-field">
                                        <div class="form-check form-switch ">
                                            <input class="form-check-input me-2" type="checkbox" role="switch" id="is_favorite" v-model="form.is_favorite">
                                            <label class="form-check-label" for="is_favorite">{{ $t('Is Favorite') }}</label>
                                        </div>
                                    </div>
                                </div> -->
                                
                                <!-- <div class="col-4" >
                                    <div class="form-field">
                                        <div class="form-check form-switch ">
                                            <input class="form-check-input me-2" type="checkbox" role="switch" id="status" v-model="form.is_tobacco_tax">
                                            <label class="form-check-label" for="status">{{ $t('Tobacco Tax') }}</label>
                                        </div>
                                    </div>
                                </div> -->
                            </div>
                            
                            <input type="hidden" v-model="form.category_slack" />
                        </div>
                        <div class="py-3" v-if="form.server_messages.messages != ''">
                            <ServerMessage  :server_messages="form.server_messages"  />
                        </div>
                        <div class="mt-2 text-end">
                            <button 
                            type="submit"
                            class="btn btn-primary" 
                            :disabled="form.is_submitting"
                            >
                                <clip-loader v-if="form.is_submitting" :color="'white'" :size="'20px'" class="pt-2 pe-2">  </clip-loader>
                                <span class="pt-0" v-if="form.is_submitting">
                                    {{ $t('Saving...') }}
                                </span>
                                <span class="pt-0" v-else>
                                    {{ $t('Save') }} </span> 

                            </button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
   </div>     
</template>


<script setup>
    
    import {ref, reactive, watch, computed, toRef } from 'vue';
    import { Form, Field, ErrorMessage } from 'vee-validate'
    import * as yup from 'yup';
    import VTextInput from '@/components/common/VTextInput.vue' 
    import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
    
    import { useAuthStore } from '@/stores/auth';
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
    import { useI18n } from 'vue-i18n'

    const { t } = useI18n();
    const is_loading = ref(false);

    const initialState = {
      server_messages: {
        type: "",
        messages: "",
      },
      is_submitting: false,
      is_listing: false,

      // form data   
      category_slack: "",
      search_category: "",
      category_name: "",
      parent_category: "",
      category_name_ar: "",
    //   is_favorite: false,
      status: true,
      image: "",
    //   is_tobacco_tax: false,
    };

    const form = reactive({ ...initialState });

    const authStore = useAuthStore();

    const schema = yup.object({
        category_name: yup.string().required(t('name is required', { name: t('Category Name') })).min(3,t('name must be at least n characters', { name: t('Category Name'), number: 3 })).max(20,t("Must be less than 20 characters", {
              name: t("Category Name"),
              number: 20,
            })
        ),
        // is_favorite: yup.bool().label('is favorite'),
        status: yup.bool().label('status'),
    });

    const emit = defineEmits(['closeAddCategoryModal'])

    const props = defineProps({
        // show_add_category_modal: Boolean,
        edit_data: {
            type: [Array,Object],
        },
    });
    const edit_data = toRef(props,'edit_data')
    const parent_placeholder = t('Select Parent');
    const category_name_placeholder = t('Category Name');
    // const category_name_ar_placeholder = t('Category Name (Arabic)');
    function closeModal(){
        document.getElementById("add_category_form").reset();
        resetData();
        emit('closeAddCategoryModal');
        document.getElementById('close_btn').click();
    }
    onMounted(() => {
        refreshData();
    });
    // watch(() => 
    //     props.show_add_category_modal, (value) => {
    //         if(value){
    //             refreshData();
    //         }
    //     },
    // );
    watch(() => 
        props.edit_data,(value) => {
            if(value){
                form.category_name = value.name;
                form.category_name_ar = value.name_ar != null?value.name_ar:"";
                form.status = value.status == 1?true:false;
                form.is_favorite = value.is_favorite == 1?true:false;
                // form.is_tobacco_tax = value.is_tobacco_tax == 1?true:false;
                form.parent_category = value.parent_id != null?value.parent_id:"";
                form.category_slack = value.slack;
                // form.is_tobacco_tax = value.is_tobacco_tax == 1?true:false;
            }
        }
    );

    
    const categories = ref([]);

    async function refreshData(){

        await axios.post('/api/category/add').then( (response) => {
            
            is_loading.value = false;

            if(response.data.status_code == 200) {
                
                categories.value = response.data.data.categories;
                categories.value = [{id:"",name:'None',name_ar:t('None')}].concat(categories.value)
                if(props.edit_data && props.edit_data.parent_id == null){
                    categories.value = categories.value.filter((value)=>{
                        return (props.edit_data.id != value.id)
                    });
                }
                is_loading.value = true;

            }else{
                try{
                    form.server_messages.type = "error";
                    form.server_messages.messages = JSON.parse(response.data.msg);
                }catch(err){
                    form.server_messages.type = "error";
                    form.server_messages.messages = response.data.msg;
                }
                is_loading.value = false;
            }
            
        }).catch((error) => {
            form.server_messages.type = "error";
            form.server_messages.messages = error;
            is_loading.value = false;
            console.log(error);
        });
    
    }
    const filtered_categories = computed(() => {
        if(form.search_category != ''){
            if(edit_data.value)
            {

                return _.filter(categories.value, function(value){
                    return value.name.toLowerCase().includes(form.search_category.toLowerCase()) && value.id != edit_data.value.id;
                });
            }
            return _.filter(categories.value, function(value){
                return value.name.toLowerCase().includes(form.search_category.toLowerCase());
            });
        }else{
            if(edit_data.value)
            {
                if($("input[name='category']").value == edit_data.value.id)
                {
                    $("input[name='category']").attr('checked',true)
                }
               categories.value.filter((el) => el.id != edit_data.value.id)
                return _.filter(categories.value, function(value){
                    return value.id != edit_data.value.id;
                });
            }
            return categories.value;
        }
    })
    async function selectCategoryFile(e){
        form.image = e.target.files[0];
    }

    const close_btn = ref(null);

    async function saveCategory(){

        form.is_submitting = true;

        var form_data = new FormData();
        form_data.append('parent_category',form.parent_category);
        form_data.append('category_name',form.category_name);
        form_data.append('category_name_ar',form.category_name_ar);
        form_data.append('is_favorite',form.is_favorite);
        form_data.append('status',form.status);
        // form_data.append('is_tobacco_tax',form.is_tobacco_tax);
        form_data.append('image',form.image);
        form_data.append('category_slack',form.category_slack);

        var submit_url = (form.category_slack != '')?'/api/category/update':'/api/category/save';

        await axios.post(submit_url, form_data,{
        headers: {
            'Content-Type': 'multipart/form-data'
        },
      }).then( (response) => {
            
            if(response.data.status_code == 200) {

                toast.success(response.data.msg);
                form.is_submitting = false;

                closeModal();

            }else{
                try{
                    form.server_messages.type = "error";
                    form.server_messages.messages = JSON.parse(response.data.msg);
                }catch(err){
                    form.server_messages.type = "error";
                    form.server_messages.messages = response.data.msg;
                }
                form.is_submitting = false;
            }
            
        }).catch((error) => {
            form.server_messages.type = "error";
            form.server_messages.messages = error;
            form.is_submitting = false;
            console.log(error);
        });

    }

    function resetData(){
        Object.assign(form, initialState);
    }

    // const is_tobacco_tax_enabled = computed(() => {
    //     return authStore.user.is_tobacco_tax_enabled;
    // })

</script>