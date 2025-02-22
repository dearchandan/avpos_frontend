<template>
    <div class="modal hide" id="returnInvoiceModal"  tabindex="-1" aria-labelledby="Add Category" aria-modal="true" role="dialog"  data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-xl modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title text-primary">{{ $t('Returning Items') }} - Invoice #<span v-if="invoice != ''">{{ invoice.invoice_number }}</span> </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal" id="close_btn"></button>
                    </div>
                    <div class="modal-body">
                        
                        <div v-if="form.is_listing">
                        
                            <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2"></beat-loader>
                        
                        </div>

                        <div v-else>

                          <Form :validation-schema="schema" @submit="submitReturn" enctype="multipart/form-data">
                            <div class="row">
                                <div class="col-6">
                                    <div class="form-field">
                                        <div class="form-check form-switch ">
                                            <label class="form-check-label">
                                            <input type="checkbox" class="form-check-input me-2" role="switch" name="is_checked_returning_entire_invoice" id="is_checked_returning_entire_invoice" :unchecked-value="false" v-model="form.is_checked_returning_entire_invoice" @change="calculate()" />
                                            {{ $t('Return Entire Invoice') }}</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <p class="text-end text-primary">Invoice Amount: {{ invoice.grand_product_amount }} {{ currency_symbol  }}</p>
                                </div>
                            </div>
                            
                            <div class="table-responsive mt-3">
                                <table class="table table-hover table-bordered mb-3 table-responsive-data">
                                    <thead class="bg-light">
                                        <tr>
                                          <th class="text-center" width="5%">{{ $t('Refund')  }}</th>
                                          <th width="10%">{{ $t('Update Inventory') }}</th>
                                          <th width="30%">{{ $t('Product') }}</th>
                                          <!-- <th class="text-end">{{ $t('Invoice Amount') }}</th> -->
                                          <th width="10%">{{ $t('Qty Left') }}</th>
                                          <th width="20%">{{ $t('Qty to Return') }}</th>
                                          <!-- <th class="text-end">{{ $t('Returning Amount') }}</th> -->
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(product,index) in form.items">
                                          <td class="text-center"> <input type="checkbox" v-model="product.is_returning" @change="calculate()" v-if="form.items[index].available_quantity>0"> <span v-else>--</span> </td>
                                          <td class="text-center">
                                            <div class="form-switch" v-if="form.items[index].available_quantity>0 && form.items[index].product_type == 1">
                                              <input type="checkbox" class="form-check-input me-2" role="switch" name="return_to_stock" id="return_to_stock" :unchecked-value="false" v-model="form.items[index].return_to_stock" />
                                            </div>
                                            <div v-else>--</div>
                                          </td>
                                          <td>
                                            {{ form.items[index].product_name  }}
                                            <span v-if="form.items[index].product_name_ar != '' && form.items[index].product_type == 1">
                                                    {{  form.items[index].product_name_ar  }}
                                            </span>
                                          </td>
                                          <!-- <td class="text-end">{{ form.items[index].product_amount  }} {{ currency_symbol }} </td> -->
                                          <td>{{ form.items[index].available_quantity  }}</td>
                                          <td v-if="form.items[index].available_quantity>0">

                                            <VTextInput
                                                type="number"
                                                :name="'items['+index+'].quantity'"
                                                v-model="form.items[index].returning_quantity"
                                                :max="form.items[index].available_quantity"
                                                min="0"
                                                :islabel=false
                                                :class="'mt-0'"
                                                @input="debounce_calculate()"
                                            />
                                            <!-- <input type="number" class="form-control form-control-solid text-primary w-100 h-100" 
                                            v-model="form.items[index].returning_quantity"  
                                            :max="form.items[index].available_quantity" > -->
                                            <!-- <span v-else>--</span> -->
                                          </td>
                                          <td v-else>-- </td>
                                          <!-- <td class="text-primary text-end">{{ form.items[index].returning_amount  }} {{ currency_symbol }} </td> -->
                                        </tr>
                                    </tbody>
                                    <!-- <tfoot>
                                        <tr v-if="grand_total.additional_discount > 0" class="text-muted fsize-10">
                                            <td class="text-end" colspan="5">{{ $t("Additional Discount")  }}</td>
                                            <td class="text-end">{{ grand_total.additional_discount }} {{  currency_symbol  }}</td>
                                        </tr>
                                        
                                        <tr v-if="grand_total.tax > 0" class="text-muted fsize-10">
                                            <td class="text-end" colspan="5">{{ $t("Tax")  }} <span v-if="invoice.tax_type == 1">(Incl. of Amount)</span> <span v-else>(Excl. of Amount)</span></td>
                                            <td class="text-end">{{ grand_total.tax }} {{  currency_symbol  }}</td>
                                        </tr>
                                        <tr class="text-primary fw-bold fs-5">
                                            <td class="text-end" colspan="5">Returned Amount</td>
                                            <td class="text-end">{{ grand_total.amount }} {{  currency_symbol  }}</td>
                                        </tr>
                                    </tfoot> -->
                                </table>
                            </div>

                            <div class="row pt-3">
                              <div class="col-4">
                                <VMultiSelect
                                  name="payment_method"
                                  mode="single"
                                  text="name"
                                  value="id"
                                  :label="'Payment Method'"
                                  v-model="form.payment_method_id"
                                  :options="payment_methods"
                                  required
                                />
                              </div>
                              <div class="col-4">
                                  <VMultiSelect
                                      name="reason"
                                      mode="single"
                                      :label="'Returned Reason'"
                                      v-model="form.reason"
                                      :options="order_returned_reasons"
                                      required
                                  />
                              </div>
                              <div class="col-md-4" v-if="form.reason == 'Other'">
                                <VTextInput
                                    type="text"
                                    name="other_reason"
                                    v-model="form.other_reason"
                                    :label="labels.other_reason"
                                    :placeholder="labels.other_reason_placeholder"
                                />
                              </div>
                            </div>

                            <div class="row pt-2">
                                <div class="col-12 text-end">
                                    <button type="submit" class="btn btn-primary" :disabled="form.is_submitting || grand_total.grand_amount <= 0">
                                      <clip-loader v-if="form.is_submitting" :color="'white'" :size="'20px'" class="pt-2 pe-2">  </clip-loader>
                                      <span class="pt-0" v-if="form.is_submitting">
                                          Submitting...
                                      </span>
                                      <span class="pt-0" v-else>
                                          Submit
                                      </span> 

                                    </button>
                                    <!-- <button class="btn btn-primary "></button> -->
                                </div>
                            </div>

                          </Form>
                        </div>
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
    import useGlobal from '@/composables/global.js';

    import { useAuthStore } from '@/stores/auth';
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
    import { useI18n } from 'vue-i18n'
    const { t } = useI18n();
    const auth = useAuthStore();

    const currency_symbol = computed(() => {
        return auth.user.currency.symbol;
    })

    const labels = ref({
      other_reason: t("Other Reason"),
      other_reason_placeholder: t("Enter returned reason..."),
    });

    const initialState = {
        server_messages: {
            type: "",
            messages: "",
        },
      is_checked_returning_entire_invoice: false,
        is_listing: false,
        is_submitting: false,
        items: [],
        reason: '',
        other_reason: '',
        payment_method_id: "",
    };

    const { order_returned_reasons } = useGlobal();

    const form = reactive({ ...initialState });

    const schema = yup.object({
      items: yup.array(yup.object({
          quantity:yup.string().test({
            name: 'max',
            exclusive: false,
            params: { },
            test: function (value,context) {
                var max = $('[name="'+context.path+'"]').attr("max");
                if(isNaN(parseFloat(value)) || value == ''){
                  return context.createError({path:`${context.path}`, message:t('must be a positive number or 0',{ name:t('Quantity') }) });
                }else if(value <= parseFloat(max)){
                  return true;
                }else{
                  return context.createError({path:`${context.path}`, message:t('must be less than or equal to n',{ name:t('Quantity'), number:max }) });
                }
            },
          }),
        })),
        reason: yup.string().required(t('name is required', { name: t('Reason') })),
    });

    function closeModal(){
        $('#returnInvoiceModal').modal('hide');
    }

    defineExpose({
        getInvoiceDetail,
    });

    const invoice = ref('');
    async function getInvoiceDetail(slack){
        resetData();
        form.is_listing = true;
        await axios.get('/api/invoice/'+slack).then((response) => {
            invoice.value = response.data.data;
            form.items = invoice.value.invoice_products.map( (item)  =>  {
              var available_qty = item.product_quantity - item.returned_quantity;
              return {
                product_type : item.type,
                return_to_stock : 1,
                is_refundable : item.is_refundable,
                product_name : item.product_name,
                product_name_ar : item.product_name_ar,
                product_amount : item.product_amount,
                /* additional parameters */
                invoice_product_slack: item.slack,
                is_returning: false,
                product_quantity : item.product_quantity,
                available_quantity : available_qty.toFixed(2),
                returning_quantity : 0,
                returning_amount : 0 ,
                product_price : item.product_price,
                product_price_without_tax : item.product_price_without_tax,
                subtotal_after_product_quantity : item.subtotal_after_product_quantity,
                product_discount : item.product_discount,
                subtotal_after_product_discount : item.subtotal_after_product_discount,
                invoice_discount_amount : item.invoice_discount_amount,
                additional_fee_amount : item.additional_fee_amount,
                tobacco_tax_amount : item.tobacco_tax_amount,
                subtotal_after_product_other_taxes_and_fee : item.subtotal_after_product_other_taxes_and_fee,
                product_tax : item.product_tax,
              }

            });
            form.items = _.filter( form.items, (item) => item.is_refundable );

            form.is_listing = false;

        }).catch((error) => {
            form.server_messages.type = "error";
            form.server_messages.messages = error; 
            console.log(error);
        });

        // getPaymentMethods();
        
    }
 
    const emits = defineEmits(['refreshInvoices']);
     
    async function submitReturn(){

        form.is_submitting = true;
        let formData = new FormData();
        formData.append('invoice_slack',invoice.value.slack);
        formData.append('items',JSON.stringify(_.filter(form.items, (item) =>  item.is_returning )));
        formData.append('reason', form.reason == 'Other' ? form.other_reason : form.reason );
        formData.append("payment_method_id", form.payment_method_id);

        await axios.post('/api/return_invoice/save',formData).then((response) => {

            if(response.data.status_code == 200) {
                toast.success(response.data.msg);
                form.is_submitting = false;
                emits('refreshInvoices');
                $('#returnInvoiceModal').modal('hide');
              window.open(
                  response.data.receipt_link,
                  '_blank' // <- This is what makes it open in a new window.
              );

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
            console.log(error);
        });
    }

    watch(() => form.is_checked_returning_entire_invoice, (value) => {

      if(value){
        form.items = _.forEach(form.items, (item) => {
          item.returning_quantity = item.available_quantity;
          item.is_returning = true;
        })
      }else{
        form.items = _.forEach(form.items, (item) => {
          item.returning_quantity = 0;
          item.is_returning = false;
        })
      }
      calculate();

    })

    const debounce_calculate = _.debounce(function () {
      calculate();
    }, 700)

    function calculate(){
      var tax_inclusive_pricing = useAuthStore().user.login_branch.tax_inclusive_pricing;
      _.forEach(form.items, (item) => {
        if( item.returning_quantity  <= 0 || !item.is_returning ){
          item.returning_amount = 0;
        }else{
          item.returning_product_price = item.product_price;
          item.returning_product_price_without_tax = item.product_price_without_tax;
          item.returning_subtotal_after_product_quantity = (item.subtotal_after_product_quantity > 0) ? ( parseFloat(item.subtotal_after_product_quantity)  / parseFloat(item.product_quantity) ) * parseFloat(item.returning_quantity) : 0;
          item.returning_discount_amount = (item.product_discount > 0) ? ( parseFloat(item.product_discount)  / parseFloat(item.product_quantity) ) * parseFloat(item.returning_quantity) : 0;
          item.returning_subtotal_after_product_discount = (item.subtotal_after_product_discount > 0) ? ( parseFloat(item.subtotal_after_product_discount)  / parseFloat(item.product_quantity) ) * parseFloat(item.returning_quantity) : 0;
          item.returning_invoice_discount_amount = (item.invoice_discount_amount > 0) ? ( parseFloat(item.invoice_discount_amount)  / parseFloat(item.product_quantity) ) * parseFloat(item.returning_quantity) : 0;
          item.returning_additional_fee_amount = (item.additional_fee_amount > 0) ? ( parseFloat(item.additional_fee_amount)  / parseFloat(item.product_quantity) ) * parseFloat(item.returning_quantity) : 0;
          item.returning_tobacco_tax_amount = (item.tobacco_tax_amount > 0) ? ( parseFloat(item.tobacco_tax_amount)  / parseFloat(item.product_quantity) ) * parseFloat(item.returning_quantity) : 0;
          item.returning_subtotal_after_product_other_taxes_and_fee = (item.subtotal_after_product_other_taxes_and_fee > 0) ? ( parseFloat(item.subtotal_after_product_other_taxes_and_fee)  / parseFloat(item.product_quantity) ) * parseFloat(item.returning_quantity) : 0;
          item.returning_tax_amount = (item.product_tax > 0) ? ( parseFloat(item.product_tax)  / parseFloat(item.product_quantity) ) * parseFloat(item.returning_quantity) : 0;
          item.returning_amount = ( parseFloat(item.product_amount)  / parseFloat(item.product_quantity) ) * parseFloat(item.returning_quantity);
        }

      })

      calculate_grand_total();

    }

    const grand_total = reactive({
      grand_discount_amount : 0,
      subtotal_after_grand_discount : 0,
      other_taxes_and_fee : 0,
      subtotal_after_other_taxes_and_fee : 0,
      tax : 0,
      subtotal_after_tax : 0,
      grand_amount : 0,
    });

    function calculate_grand_total(){

      if(invoice.value.invoice_discount > 0){

        var subtotal_after_product_quantity = 0;
        var item_returning_amount_total = 0;

        _.forEach(form.items, function(item) {
          subtotal_after_product_quantity += parseFloat(item.subtotal_after_product_quantity);
          item_returning_amount_total += parseFloat(item.returning_amount);
        })

        if(item_returning_amount_total > 0){
          let temp_discount = ( parseFloat(invoice.value.invoice_discount) / parseFloat(subtotal_after_product_quantity) ) * parseFloat(item_returning_amount_total) ;
          grand_total.grand_discount_amount = parseFloat(temp_discount).toFixed(2);
        }else{
          grand_total.grand_discount_amount = 0;
        }

      }

      let temp_grand_total = _.reduce(form.items, function(sum, item) {
        return parseFloat(sum) + parseFloat(item.returning_amount);
      }, 0)

      grand_total.grand_amount = ( parseFloat(temp_grand_total) - parseFloat(grand_total.grand_discount_amount) ).toFixed(2);

      let temp_tax = _.reduce(form.items, function(sum, item) {
        if(item.is_returning){
          return parseFloat(sum) + parseFloat(item.returning_tax_amount);
        }else{
          return parseFloat(sum) + 0;
        }
      }, 0)

      grand_total.tax = parseFloat(temp_tax).toFixed(2);

    }

    function resetData(){
      Object.assign(form, initialState);
    }

    const payment_methods = ref([]);
    getPaymentMethods();
    async function getPaymentMethods() {
      let data = await axios.get("api/payment_methods/all");
      payment_methods.value = data.data.data;
    }

 </script>

<style scoped>
.active-payment-method{
  border: 1px solid rgb(51, 52, 50,0.2);
  font-weight: bold !important;
  color: #1E40AF !important;
}
</style>