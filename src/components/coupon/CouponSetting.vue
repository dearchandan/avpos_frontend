<template>
    
    <div class="row" >


        <div class="col-4"></div>
        <div class="col-4">
            <div class="card">
                <div class="row">
                    <div class="col-12">
                        <h4>{{ $t('Applicable Branches') }}</h4>  
                    </div>
                </div>
                <div class="row">

                    <div class="col-12 pt-3">

                        <div class="form-field">
                            <label v-for="(option,index) in apply_on_options" class="label me-3 mb-2">
                                <Field class="form-check-input mx-2" name="applies_to_all_branch" type="radio" :id="index" :value="option.value" v-model="form.coupon.applies_to_all_branch" @change="selectBranch" /> 
                                {{ option.name }}
                            </label>
                            <ErrorMessage name="applies_to_all_branch" as="div" class="error"></ErrorMessage>
                        </div>

                    </div>

                </div>

                <div class="row" v-if="form.coupon.applies_to_all_branch == 0">
                    <div class="col-12">
                        <select class="form-control w-100" v-model="selected_branch" @change="addBranch" >
                            <option value="">--{{ $t('Select Branch') }}--</option>
                            <option v-for="(branch,index) in form.branches" :value="branch.slack"> {{  branch.name  }} </option>
                        </select>
                    </div>
                    <div class="col-12 py-3">
                        <table class="table table-condensed">
                            <tbody>
                                <tr v-if="form.coupon != '' && form.coupon.branches != ''" v-for="(coupon_branch,index) in form.coupon.branches" :key="index">
                                    <td>{{  coupon_branch.branch.name }}</td>
                                    <td class="text-end">
                                        <a class="dropdown-item text-danger" href="#" @click="removeBranch(coupon_branch.slack)">{{ $t('Remove') }}</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        
    </div>

</template>

<script setup>

    import { Form, Field, ErrorMessage } from 'vee-validate';
    import BeatLoader from 'vue-spinner/src/BeatLoader.vue'

    const multiselect = defineComponent(
        Multiselect
    )

    const apply_on_options = [
        {
            name : "All Branches",
            value: 1
        },
        {
            name :  "Specific Branches",
            value: 0
        }
    ];

    const props = defineProps(['form']);
    
    const data = toRef(props, 'form'); 
    const form = reactive(data.value);
    
    const emit = defineEmits(['refreshCoupon']);

    function refreshCoupon(){
        emit('refreshCoupon');
    }

    const selected_branch = ref('');

    async function addBranch(){

        if(selected_branch.value != ''){
            
            var form_data = new FormData();
            form_data.append('coupon_slack',form.coupon.slack);
            form_data.append('branch_slack',selected_branch.value);

            await axios.post('/api/coupon/branch/add',form_data).then( (response) => {

                toast.success(response.data.msg);
                refreshCoupon();
                
            }).catch((error) => {
                form.server_messages.type = "error";
                form.server_messages.messages = error;
                console.log(error);
            });

        }

    }
    

    async function removeBranch(slack){

        var is_confirmed = false;

        await Swal.fire({
            title: 'Do you want to remove coupon from this branch?',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete',
            confirmButtonColor: '#d33',
            }).then( (result) => {
            if(result.isConfirmed){
                is_confirmed = true;        
            }
        });

        if(is_confirmed){

        await axios.post('/api/coupon/branch/remove',{
            slack : slack
        }).then( (response) => {
            
        if(response.data.status_code == 200) {

            toast.success(response.data.msg);
            refreshCoupon();

        }else{
                try{
                    form.server_messages.type = "error";
                    form.server_messages.messages = JSON.parse(response.data.msg);
                }catch(err){
                    form.server_messages.type = "error";
                    form.server_messages.messages = response.data.msg;
                }
            }

            }).catch((error) => {
                form.server_messages.type = "error";
                form.server_messages.messages = error;
                console.log(error);
            });
        }

    }

    async function selectBranch(){
    
            var form_data = new FormData();
            form_data.append('coupon_slack',form.coupon.slack);
            form_data.append('applies_to_all_branch',form.coupon.applies_to_all_branch);
    
            await axios.post('/api/coupon/branch/apply_to_all_branch',form_data).then( (response) => {
                toast.success(response.data.msg);
            }).catch((error) => {
                form.server_messages.type = "error";
                form.server_messages.messages = error;
                console.log(error);
            });

    }

</script>