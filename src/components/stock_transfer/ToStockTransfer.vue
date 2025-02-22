<template>
  <div class="row">
    <div class="col-md-12">

      <div class="card">
        <div class="row">
          <h5 class="section-title pb-3 text-muted">{{ $t('Products Details') }}:</h5>
          <Form
              @submit="update"
              :validation-schema="schema"
              :initial-values="form"
          >
            <div class="col-12 py-3">
              <table class="table table-condensed">
                <thead>
                <tr>
<!--                  <th width="5%" v-if="props.stock_transfer.status!=2 && props.stock_transfer.status!=4"><input type="checkbox" class="form-check-input me-1" v-model="selectAll" @change="selectAllItems" /></th>-->
                  <th width="20%">{{ $t('Product') }}</th>
                  <th width="5%">{{ $t('UPC') }}</th>
                  <th width="5%">{{ $t('SKU') }}</th>
                  <th width="7%">{{ $t('Sale Price') }}</th>
                  <th width="5%">{{ $t('Total Qty.') }}</th>
                  <th width="7%" v-if="props.stock_transfer.status==2 || props.stock_transfer.status==3">{{ $t('Accepted Qty.') }}</th>
                  <th width="7%" v-if="props.stock_transfer.status < 2">{{ $t('Enter Accept Qty.') }}</th>
                  <th width="7%" v-if="props.stock_transfer.status==2 || props.stock_transfer.status==3">{{ $t('Rejected Qty.') }}</th>
                  <th width="7%" v-if="props.stock_transfer.status < 2">{{ $t('Enter Reject Qty.') }}</th>
                  <th width="10%">{{ $t('Reject Reason') }}</th>
                  <th width="7%">{{ $t('Accepted Status') }}</th>
                  <th width="7%">{{ $t('Accepted At') }}</th>
                </tr>
                </thead>
                <tbody>

                <tr v-if="form.stock_transfer_products.length>0" v-for="(stock_transfer_product,index) in form.stock_transfer_products" :key="index">
<!--                  <td v-show="props.stock_transfer.status!==2 && props.stock_transfer.status!==4"><input type="checkbox" class="form-check-input me-1" :value="stock_transfer_product.st_product_slack" v-model="selectedItems" :id="index" v-if="stock_transfer_product.pending_quantity>0"/>
                  </td>-->
                  <td><strong>{{ stock_transfer_product.product_name }}</strong></td>
                  <td>{{ stock_transfer_product.upc }}</td>
                  <td>{{ stock_transfer_product.sku }}</td>
                  <td>{{ stock_transfer_product.sale_price }}</td>
                  <td>{{ stock_transfer_product.quantity }}</td>
                  <td v-if="stock_transfer_product.pending_quantity>0">
                    <VTextInput
                        type="number"
                        :name="'stock_transfer_products['+index+'].accept_quantity'"
                        v-model="stock_transfer_product.accept_quantity"
                        min="0"
                        :class="'pt-3'"
                        :max="stock_transfer_product.pending_quantity"
                        :islabel=false
                        @change="checkQuantity"
                    />
                  </td>
                  <td v-else class="text-center">
                    <VTextInput
                        type="text"
                        :name="'stock_transfer_products['+index+'].accept_quantity'"
                        v-model="stock_transfer_product.accepted_quantity"
                        :class="'pt-3'"
                        :max="stock_transfer_product.accepted_quantity"
                        :islabel=false
                        :disabled="true"
                    />
                   </td>
                  <td v-if="stock_transfer_product.pending_quantity>0">
                    <VTextInput
                        type="number"
                        :name="'stock_transfer_products['+index+'].reject_quantity'"
                        v-model="stock_transfer_product.reject_quantity"
                        min="0"
                        :class="'pt-3'"
                        :max="stock_transfer_product.pending_quantity"
                        :islabel=false
                         @change="checkQuantity"
                    />
                  </td>
                  <td v-else class="text-center">{{ stock_transfer_product.rejected_quantity }}</td>
                  <td class="text-center">
                    <VSelect
                          :name="'stock_transfer_products['+index+'].rejected_reason'"
                          v-model="stock_transfer_product.rejected_reason"
                          :options="rejection_options"
                          :class="'pt-3'"
                          :islabel=false
                          :disabled="stock_transfer_product.reject_quantity <= 0"
                      />
                      <input type="text"
                          :name="'stock_transfer_products['+index+'].other_reason'"
                          v-model="stock_transfer_product.other_reason"
                          v-if="stock_transfer_product.rejected_reason == 4"
                          class="form-control form-control-solid mt-2"
                          placeholder="Enter Reason"
                          :title="stock_transfer_product.other_reason"
                      />
                  </td>
                  <td>
                    <span class="badge badge-primary" v-if="stock_transfer_product.status==0">{{ $t('Pending') }}</span>
                    <span class="badge badge-success" v-else>{{ $t('Accepted') }}</span>
                  </td>
                  <td>{{ stock_transfer_product.accepted_at!=null?stock_transfer_product.accepted_at:'-' }}</td>
                </tr>
                <tr v-else>
                  <td colspan="10" class="text-center">{{ $t('No Product Available') }}</td>
                </tr>
                </tbody>
              </table>
            </div>
            <div class="col-12 py-3" v-if="form.server_messages.messages != ''">
              <ServerMessage  :server_messages="form.server_messages"  />
            </div>
            <div class="col-12 mt-2 text-end" v-if="form.stock_transfer_products!=null">
              <button
                  type="submit"
                  class="btn btn-primary"
                  @click="submitForm('Selected')"
                  :disabled="form.is_submitting"
                  v-if="selectedItems.length>0 && props.stock_transfer.status!=2 && props.stock_transfer.status!=4"
              >
                <clip-loader v-if="form.is_submitting" :color="'white'" :size="'20px'" class="pt-2 pe-2">  </clip-loader>
                <span class="pt-0" v-if="form.is_submitting">{{ $t('Saving...') }}</span>
                <span class="pt-0" v-else>{{ $t('Accept Selected') }}</span>

              </button>
              <button
                  type="submit"
                  class="btn btn-primary ms-2"
                  @click="submitForm('All')"
                  :disabled="form.is_disabled"
                  v-if="selectedItems.length<1 && props.stock_transfer.status!=2 && props.stock_transfer.status!=4"
              >
                <clip-loader v-if="form.is_submitting" :color="'white'" :size="'20px'" class="pt-2 pe-2">  </clip-loader>
                <span class="pt-0" v-if="form.is_submitting">{{ $t('Saving...') }}</span>
                <span class="pt-0" v-else>{{ $t('Submit') }}</span>

              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>

    import { Form, Field, ErrorMessage } from 'vee-validate'
    import * as yup from 'yup';
    import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
    import { useAuthStore } from '@/stores/auth';
    import {onMounted, reactive, ref, watch} from "vue";
    import { useI18n } from 'vue-i18n'

    const { t } = useI18n();
    const initialState = {
      server_messages: {
        type: "",
        messages: "",
      },
      is_disabled: true,
      stock_transfer_products: []
    };
    const form = reactive({ ...initialState });

    const schema = yup.object({
      stock_transfer_products: yup.array(yup.object().shape({
        accept_quantity:yup.string()
          .typeError(t('must be a number',{ name: t('Quantity') }))
          .required(t('name is required', { name: t('Quantity') }))
          .min(0, t('must be greater than or equal to n',{ name:t('Value'), number:0 }))
          .test({
            // name: 'max',
            // exclusive: false,
            // params: { },
            //message: t('must be greater than or equal to n',{ name:t('Quantity'), number:$('[name="'+`${context.path}+'"]').attr("max")}),
            test: function (value,context) {
              var max = $('[name="'+context.path+'"]').attr("max");
              return value <= parseFloat(max) ?true: context.createError({path:`${context.path}`, message:t('must be less than or equal to n',{ name:t('Quantity'), number:max }) });

            },
          }),
        rejected_reason:yup.string().nullable().when('reject_quantity', {
          is: (val) => val > 0,
          then: (schema) => schema.required(t('name is required', { name: t('Reject Reason') })),
          otherwise:(schema) => schema.nullable()
        }),
      },['reject_quantity','rejected_reason']))
    });

    const rejection_options = ref([
        {
            key: 1, 
            value: 'Wastage/Damaged', 
        },{
            key: 2, 
            value: 'Undelivered', 
        },
        {
            key: 3, 
            value: 'No Reason', 
        },
        {
            key: 4, 
            value: 'Other', 
        }
    ]);

    const props = defineProps(['stock_transfer']);
    const is_loading = ref(false);
    const allItems = ref([]);
    const selectedItems = ref([]);
    const selectAll = ref(false);
    const button_name = ref('all');

    onMounted(() => {
      loadTableData();
    });
    function checkQuantity(){
        form.is_disabled = true;
        var i = 0;
       _.forEach(form.stock_transfer_products, (value) => {
          if(value.accept_quantity > 0 || value.reject_quantity > 0)
          {
            i = i + 1;
          }
       })
       if(i > 0){
        form.is_disabled = false;
       }
       else{
          form.is_disabled = true;
       }
    }

    function submitForm(mode){
      if(mode=='Selected'){
        button_name.value = 'selected';
      }
    }

    function loadTableData(){
      _.forEach(props.stock_transfer.stock_transfer_products, (value) => {
        let status=parseFloat(value.accepted_quantity) + parseFloat(value.rejected_quantity) == value.quantity?1:0;
        let accepted_quantity = !isNaN(value.accepted_quantity)?value.accepted_quantity:0;
        let rejected_quantity = !isNaN(value.rejected_quantity)?value.rejected_quantity:0;
        let pending_quntity = parseFloat(value.quantity) - (parseFloat(accepted_quantity) + parseFloat(rejected_quantity));
        //console.log(pending_quntity)

        let product_template = {
          st_product_slack : value.slack,
          product_name : value.product.name,
          sku : value.sku,
          upc : value.product.upc,
          sale_price : value.sale_price,
          quantity : value.quantity,
          accept_quantity : 0,
          reject_quantity: 0,
          rejected_reason: value.rejected_reason,
          other_reason: value.other_reason,
          pending_quantity : pending_quntity,
          status : status,
          accepted_at : value.accepted_at_label,
          rejected_quantity : value.rejected_quantity,
          accepted_quantity : value.accepted_quantity,
        };
        form.stock_transfer_products.push(product_template);
        allItems.value.push(value.slack);
      })
    }

    const selectAllItems =()=> {
      selectedItems.value = [];
      if (selectAll.value) {
        for (let i = 0; i < form.stock_transfer_products.length; i++) {
          if(form.stock_transfer_products[i].pending_quantity>0){
            selectedItems.value.push(form.stock_transfer_products[i].st_product_slack);
          }
        }
      }
    };

    watch(() => selectedItems.value, () => {
          let total_product = 0;
          for (let i = 0; i < form.stock_transfer_products.length; i++) {
            if(form.stock_transfer_products[i].pending_quantity>0){
              total_product = parseInt(total_product) + 1;
            }
          }
          selectAll.value = selectedItems.value.length === total_product;
        },
    );

    //Accept the product
    async function update(){
      form.is_disabled = true;
      form.is_submitting = true;

      var form_data = new FormData();
      form_data.append('stock_transfer_slack',props.stock_transfer.slack);
      form_data.append('all_products',JSON.stringify(allItems.value));
      form_data.append('all_selected_products',JSON.stringify(selectedItems.value));
      form_data.append('products',JSON.stringify(form.stock_transfer_products));
      form_data.append('mode',button_name.value);

      await axios.post('/api/stock_transfer/product/accept', form_data).then( (response) => {
        // form.is_submitting = false;
        if(response.data.status_code == 200) {
          toast.success(response.data.msg);
          setTimeout(() => {
            router.push('/stock_transfers');
          }, 2000);
        }else{
          try{
            form.server_messages.type = "error";
            form.server_messages.messages = JSON.parse(response.data.msg);
          }catch(err){
            form.server_messages.type = "error";
            form.server_messages.messages = response.data.msg;
          }
          form.is_submitting = false;
          form.is_disabled = false;
        }
      }).catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
        form.is_submitting = false;
        form.is_disabled = false;
        console.log(error);
      });
    }
</script>