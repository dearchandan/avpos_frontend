<template>
    <Form :validation-schema="schema" @submit="generateAndPrintBarcode" enctype="multipart/form-data" :initial-values="form"
      v-if="slack == '' || slack == undefined || (slack != '' && is_loaded)">
      <div class="row">
        <AsyncServerMessage class="py-3" v-if="form.server_messages.messages != ''"
                            :server_messages="form.server_messages"/>
        <div class="col-md-12">
          <div class="row">
            <div class="col-md-12">
              <div class="card">
                <div class="row">
                  <div class="col-4 col-md-3 col-lg-2">
                    <VTextInput
                        type="text"
                        name="barcode_value"
                        v-model="form.barcode_value"
                        :label="labels.barcode_value"
                    />
                  </div>
                  <div class="col-4 col-md-3 col-lg-2">
                    <label class="form-label">{{ labels.barcode_format }}</label>
                    <Field name="barcode_format" v-slot="{ field, errorMessage }">
                      <select v-bind="field" v-model="form.barcode_format" class="form-control form-control-solid">
                        <option value="CODE128">CODE128 (alphanumeric)</option>
                        <option value="EAN13">EAN-13 (13 digits)</option>
                        <option value="EAN8">EAN-8 (8 digits)</option>
                        <option value="UPC">UPC (12 digits)</option>
                        <option value="CODE39">CODE39 (alphanumeric)</option>
                      </select>
                      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
                    </Field>
                  </div>
                  <div class="col-4 col-md-3 col-lg-2">
                    <VTextInput
                        type="text"
                        name="product_name"
                        v-model="form.product_name"
                        :label="labels.product_name"
                    />
                  </div>
                </div>
              </div>
            </div>
  
            <div class="col-md-12">
              <div class="card">
                <div class="row">
                  <h5 class="section-title pb-2 text-muted">{{ $t('Barcode Settings') }}:</h5>
                  <div class="col-4 col-md-3 col-lg-2">
                    <VTextInput
                        type="number"
                        name="barcode_height"
                        v-model="form.barcode_height"
                        :label="labels.barcode_height"
                    />
                  </div>
                  <div class="col-4 col-md-3 col-lg-2">
                    <VTextInput
                        type="number"
                        name="line_width"
                        v-model="form.line_width"
                        :label="labels.line_width"
                    />
                  </div>
                  <div class="col-4 col-md-3 col-lg-2">
                    <VTextInput
                        type="number"
                        name="copies"
                        v-model="form.copies"
                        :label="labels.copies"
                    />
                  </div>
                </div>
              </div>
            </div>
  
            <div class="col-md-12" v-show="barcodeGenerated">
              <div class="card">
                <div class="row">
                  <h5 class="section-title pb-2 text-muted">{{ $t('Preview') }}:</h5>
                  <div id="barcode-container" class="barcode-preview" ref="barcodeContainer">
                    <div v-for="n in form.copies" :key="n" class="barcode-item">
                      <div class="product-name" v-if="form.product_name">{{ form.product_name }}</div>
                      <svg class="barcode" ref="barcodeElement"></svg>
                      <div class="barcode-text">{{ form.barcode_value }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
          </div>
        </div>
      </div>
      <div class="text-end">
        <button type="submit" class="btn btn-warning" :disabled="form.is_submitting" @click="submit_type = 0">
          <clip-loader v-if="form.is_submitting" :color="'white'" :size="'20px'" class="pt-2 pe-2"></clip-loader>
          <span class="pt-0" v-if="form.is_submitting">{{ $t('Generating...') }}</span>
          <span class="pt-0" v-else>{{ $t('Generate Barcode') }}</span>
        </button>
        <button type="button" class="btn btn-primary ms-2" :disabled="!barcodeGenerated || form.is_submitting" @click="printBarcode">
          <clip-loader v-if="printing" :color="'white'" :size="'20px'" class="pt-2 pe-2"></clip-loader>
          <span class="pt-0" v-if="printing">{{ $t('Printing...') }}</span>
          <span class="pt-0" v-else>{{ $t('Print Barcode') }}</span>
        </button>
      </div>
    </Form>
    <EditFormSkeleton v-else />
  
    <!-- Hidden div for printing -->
    <div id="print-container" ref="printContainer" style="display: none;"></div>
  </template>
  
  
  <script setup>
  import { Form, Field, ErrorMessage } from 'vee-validate'
  import * as yup from 'yup';
  import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
  import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
  
  import { useAuthStore } from '@/stores/auth';
  import { onMounted, reactive, ref, watch, computed, defineAsyncComponent } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useI18n } from 'vue-i18n'
  import JsBarcode from 'jsbarcode';
  
  const submit_type = ref(0);
  const printing = ref(false);
  const barcodeGenerated = ref(false);
  
  const { t } = useI18n();
  const labels = ref({
    barcode_value: t("Barcode Value"),
    barcode_format: t("Barcode Format"),
    product_name: t("Product Name"),
    barcode_height: t("Height (mm)"),
    line_width: t("Line Width (px)"),
    copies: t("Number of Copies"),
  });
  
  const AsyncServerMessage = defineAsyncComponent(() => import('@/components/common/ServerMessage.vue'));
  
  const route = useRoute();
  const router = useRouter();
  const slack = route.params.slack;
  const auth = useAuthStore();
  
  const initialState = {
    server_messages: {
      type: "",
      messages: "",
    },
    is_submitting: false,
  
    // form data   
    slack: "",
    barcode_value: "",
    barcode_format: "CODE128",
    product_name: "",
    barcode_height: 50,
    line_width: 2,
    copies: 1,
    note: "",
  };
  
  const form = reactive({...initialState});
  
  const schema = yup.object().shape({
    barcode_value: yup.string().required(t('field is required', { name: t('Barcode Value') })),
    barcode_format: yup.string().required(t('field is required', { name: t('Barcode Format') })),
    barcode_height: yup.number().typeError(t('must be a number', { name: t('Height') }))
      .required(t('field is required', { name: t('Height') }))
      .min(10, t('must be at least {min}', { min: 10, name: t('Height') }))
      .max(100, t('must be at most {max}', { max: 100, name: t('Height') })),
    line_width: yup.number().typeError(t('must be a number', { name: t('Line Width') }))
      .required(t('field is required', { name: t('Line Width') }))
      .min(1, t('must be at least {min}', { min: 1, name: t('Line Width') }))
      .max(5, t('must be at most {max}', { max: 5, name: t('Line Width') })),
    copies: yup.number().typeError(t('must be a number', { name: t('Copies') }))
      .required(t('field is required', { name: t('Copies') }))
      .min(1, t('must be at least {min}', { min: 1, name: t('Copies') }))
      .max(100, t('must be at most {max}', { max: 100, name: t('Copies') })),
  });
  
  const is_loaded = ref(false);
  
  // Watch for barcode format changes to validate barcode value
  watch(() => form.barcode_format, (newFormat) => {
    validateBarcodeValue(newFormat, form.barcode_value);
  });
  
  watch(() => form.barcode_value, (newValue) => {
    validateBarcodeValue(form.barcode_format, newValue);
  });
  
  function validateBarcodeValue(format, value) {
    form.server_messages.type = "";
    form.server_messages.messages = "";
    
    if (!value) return;
    
    if (format === 'EAN13' && !/^\d{13}$/.test(value)) {
      form.server_messages.type = "error";
      form.server_messages.messages = t('EAN-13 requires exactly 13 digits');
    } else if (format === 'EAN8' && !/^\d{8}$/.test(value)) {
      form.server_messages.type = "error";
      form.server_messages.messages = t('EAN-8 requires exactly 8 digits');
    } else if (format === 'UPC' && !/^\d{12}$/.test(value)) {
      form.server_messages.type = "error";
      form.server_messages.messages = t('UPC requires exactly 12 digits');
    }
  }
  
  async function generateAndPrintBarcode() {
    try {
      form.is_submitting = true;
      
      // Validate based on barcode format
      validateBarcodeValue(form.barcode_format, form.barcode_value);
      if (form.server_messages.messages !== "") {
        form.is_submitting = false;
        return;
      }
      
      // Clear existing barcodes
      const container = document.getElementById('barcode-container');
      if (container) {
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
      }
      
      // Create barcode items
      for (let i = 0; i < form.copies; i++) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'barcode-item';
        
        if (form.product_name) {
          const nameDiv = document.createElement('div');
          nameDiv.className = 'product-name';
          nameDiv.textContent = form.product_name;
          itemDiv.appendChild(nameDiv);
        }
        
        const svg = document.createElement('svg');
        svg.className = 'barcode';
        itemDiv.appendChild(svg);
        
        const textDiv = document.createElement('div');
        textDiv.className = 'barcode-text';
        textDiv.textContent = form.barcode_value;
        itemDiv.appendChild(textDiv);
        
        container.appendChild(itemDiv);
        
        // Generate barcode in the SVG
        JsBarcode(svg, form.barcode_value, {
          format: form.barcode_format,
          height: form.barcode_height,
          width: form.line_width,
          displayValue: false,
          margin: 10,
          background: '#ffffff'
        });
      }
      
      barcodeGenerated.value = true;
      form.is_submitting = false;
      
      // Optional: Save barcode data to API
      // await saveBarcodeData();
      
    } catch (error) {
      form.server_messages.type = "error";
      form.server_messages.messages = `Error generating barcode: ${error.message}`;
      form.is_submitting = false;
      barcodeGenerated.value = false;
    }
  }
  
  async function printBarcode() {
    if (!barcodeGenerated.value) return;
    
    printing.value = true;
    
    try {
      // Create a new window for printing
      const printContent = document.getElementById('barcode-container').innerHTML;
      const printWindow = window.open('', '_blank');
      
      printWindow.document.write(`
        <html>
        <head>
          <title>${t('Print Barcodes')}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
            }
            .barcode-item {
              display: inline-block;
              margin: 10px;
              padding: 10px;
              border: 1px dashed #ccc;
              text-align: center;
              page-break-inside: avoid;
            }
            .product-name {
              font-weight: bold;
              margin-bottom: 5px;
            }
            .barcode-text {
              margin-top: 5px;
              font-size: 12px;
            }
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              .barcode-item {
                border: none;
              }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Wait for images to load before printing
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
        printing.value = false;
      }, 500);
    } catch (error) {
      form.server_messages.type = "error";
      form.server_messages.messages = `Error printing: ${error.message}`;
      printing.value = false;
    }
  }
  
  // Optional: Save barcode data to API
  async function saveBarcodeData() {
    try {
      var form_data = new FormData();
      form_data.append('slack', form.slack);
      form_data.append('barcode_value', form.barcode_value);
      form_data.append('barcode_format', form.barcode_format);
      form_data.append('product_name', form.product_name);
      form_data.append('barcode_height', form.barcode_height);
      form_data.append('line_width', form.line_width);
      form_data.append('copies', form.copies);
      form_data.append('note', form.note);
      
      var submit_url = '/api/v2/barcode/save';
      await axios.post(submit_url, form_data).then((response) => {
        if (response.data.status_code == 200) {
          toast.success(response.data.msg);
          // Additional logic if needed
        } else {
          try {
            form.server_messages.type = "error";
            form.server_messages.messages = JSON.parse(response.data.msg);
          } catch (err) {
            form.server_messages.type = "error";
            form.server_messages.messages = response.data.msg;
          }
        }
      }).catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
      });
    } catch (error) {
      form.server_messages.type = "error";
      form.server_messages.messages = `API Error: ${error.message}`;
    }
  }
  
  const note_character_count = computed(() => {
    if(form.note =='' || form.note == null){
      return 0+' / 500 Characters';
    }else{
      return form.note.length+' / 500 Characters';
    } 
  });
  </script>
  
  <style scoped>
  .barcode-preview {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 15px;
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    border: 1px solid #ddd;
  }
  
  .barcode-item {
    display: inline-block;
    margin: 10px;
    padding: 10px;
    border: 1px dashed #ccc;
    text-align: center;
  }
  
  .product-name {
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .barcode-text {
    margin-top: 5px;
    font-size: 12px;
  }
  
  .form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  .error {
    color: #d32f2f;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
  </style>