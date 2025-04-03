<template>
    <SimpleLayout>
  
      <template v-slot:subheader>
          <div class="header-nav-wrap">
              <div class="row align-items-center">
                  <div class="col-auto">
                      <div class="header-back-link">
                          <router-link class="text-primary" to="/settings" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Settings') }}</router-link>
                      </div>
                  </div>
                  <div class="col-auto">
                      <h5 class="fw-bold">{{ $t('Data Migrate') }}</h5>
                  </div>
              </div>
          </div>
      </template>
  
      <div class="content py-5">
        <div class="py-3" v-if="form.server_messages.messages != ''">
          <ServerMessage :server_messages="form.server_messages" />
        </div>
        
        <div class="row">
          <div class="col-2"></div>
          <div class="col-6">
            <h4 class="fw-bold text-dark">{{ $t('Data Migration') }}</h4>
            <p class="fw-bold text-muted">{{ $t('You Get 2 Step Solution To Move Your Existing Data To Our New System') }}</p>
          </div>
          <div class="col-2 text-end pb-3">
            <router-link to="/"><img :src="logo" class="logo" alt=""></router-link>
          </div>
          
        </div>
        <hr>
        <div class="row pt-5">
          <div class="col-2"></div>
          <div class="col-4">
            <div class="card">

              <div class="pb-4 ">
                <h4 class="text-primary">1. {{  $t('Connect') }}</h4>
                <p class="text-muted fw-bold">{{ $t("You can enter your registered email and password with avinyadev.com here and start restoring the data")  }} </p>
              </div>
              
              <Form enctype="multipart/form-data" :initial-values="form" @submit="connect">
            
            
              <div class="form-field">
                <div class="col-12">
                  <label class="label" for="">{{ $t("Email") }}</label>
                  <input
                    type="text"
                    class="form-control form-control-solid"
                    v-model="form.email"
                  />
                </div>
              </div>

              <div class="form-field">
                <div class="col-12">
                  <label class="label" for="">{{ $t("Password") }}</label>
                  <input
                    type="password"
                    class="form-control form-control-solid"
                    v-model="form.password"
                  />
                </div>
              </div>

  
              <div class="form-field pt-4">
                <div class="col-12 text-end">
                  <button
                    type="submit"
                    class="btn"
                    :class="[ connection_data.connected ? 'btn-success' : 'btn-primary' ]"
                    :disabled="form.is_connecting || connection_data.connected"
                >
                  <clip-loader v-if="form.is_connecting" :color="'white'" :size="'20px'" class="pt-2 pe-2">  </clip-loader>
                  <span class="pt-0" v-if="form.is_connecting">{{ $t('Connecting...') }}</span>
                  <span class="pt-0" v-else>
                      <span v-if="connection_data.connected">{{ $t('Connected') }}</span>
                      <span v-else>{{ $t('Connect') }}</span>
                  </span>
                </button>
                
                </div>
              </div>
              
            </Form>
  
            </div>
          </div>

          <div class="col-4" v-if="connection_data.connected">
            
            <div class="card">

              <div class="pb-4 ">
                <h4 class="text-primary">2. {{  $t('Import') }}</h4>
                <p class="text-muted fw-bold">{{ $t("Start importing all the data from your old system to new system except sales data")  }} </p>
              </div>
              
              <div class="row">
                <div class="col-12">
                  <table class="table table-striped table-bordered table-responsive">
                  <thead>
                      <tr>
                          <th width="70%">{{  $t("Module")  }}</th>
                          <th>{{  $t("Records Found")  }}</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td>{{  $t("Branches")  }}</td>
                          <td class="fw-bold text-primary">{{  connection_data.total_branches  }}</td>
                      </tr>
                      <tr>
                          <td>{{  $t("Users")  }}</td>
                          <td class="fw-bold text-primary">{{  connection_data.total_users  }}</td>
                      </tr>
                      <tr>
                          <td>{{  $t("Roles")  }}</td>
                          <td class="fw-bold text-primary">{{  connection_data.total_roles  }}</td>
                      </tr>
                      <tr>
                          <td>{{  $t("Products")  }}</td>
                          <td class="fw-bold text-primary">{{  connection_data.total_products  }}</td>
                      </tr>
                      <tr>
                          <td>{{  $t("Categories")  }}</td>
                          <td class="fw-bold text-primary">{{  connection_data.total_categories  }}</td>
                      </tr>
                      <tr>
                          <td>{{  $t("Terminals")  }}</td>
                          <td class="fw-bold text-primary">{{  connection_data.total_terminals  }}</td>
                      </tr>
                      <tr>
                          <td>{{  $t("Business Accounts")  }}</td>
                          <td class="fw-bold text-primary">{{  connection_data.total_accounts  }}</td>
                      </tr>
                   
                      <tr>
                          <td>{{  $t("Suppliers")  }}</td>
                          <td class="fw-bold text-primary">{{  connection_data.total_suppliers  }}</td>
                      </tr>
                      <tr>
                          <td>{{  $t("Modifiers")  }}</td>
                          <td class="fw-bold text-primary">{{  connection_data.total_modifiers  }}</td>
                      </tr>
                      <tr>
                          <td>{{  $t("Customers")  }}</td>
                          <td class="fw-bold text-primary">{{  connection_data.total_customers  }}</td>
                      </tr>
                      <tr>
                          <td>{{  $t("Dining Tables")  }}</td>
                          <td class="fw-bold text-primary">{{  connection_data.total_dining_tables  }}</td>
                      </tr>
                      
                  </tbody>
  
                  
                </table>
              
                </div>
                <div class="col-12 mt-5 text-end">
                  <div class="form-field">
                  <button
                      type="submit"
                      class="btn"
                      :class="'btn-primary'"
                      :disabled="form.is_importing"
                      @click="import_data"
                  >
                    <clip-loader v-if="form.is_importing" :color="'white'" :size="'20px'" class="pt-2 pe-2">  </clip-loader>
                    <span class="pt-0" v-if="form.is_importing">{{ $t('Importing...') }}</span>
                    <span class="pt-0" v-else>{{ $t('Start Importing') }}</span>
                  </button>
                </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </SimpleLayout>
  </template>
  
  <script setup>
  import { Form } from 'vee-validate'
  
  import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
  import logo from '@/assets/images/logo.png'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n();
  
  const initialState = {
    server_messages: {
      type: "",
      messages: "",
    },
    email: "",
    password: "",
    is_connecting: false,
    is_importing: false,
  };
  
  const form = reactive({ ...initialState });

  const connection_data = ref([]);
  
  async function connect() {
    
    form.is_connecting = true;

    var form_data = new FormData();
    form_data.append("email", form.email);
    form_data.append("password", form.password);
  
    await axios
      .post("/api/data_migrate/connect", form_data)
      .then((response) => {
        
        if (response.data.status_code == 200 && response.data.data.connected) {
          
          connection_data.value = response.data.data;
          toast.success(response.data.msg);
          
        }else{
          
          Swal.fire({
            icon: "error",
            title: response.data.msg,
          });
          
        }

        form.is_connecting = false;
        
      })
      .catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
        console.log(error);
    });
    
  }

  async function import_data() {
    
    form.is_importing = true;

    var form_data = new FormData();
    form_data.append("merchant_dbname", connection_data.value.merchant_dbname);
  
    await axios
      .post("/api/data_migrate/import", form_data)
      .then((response) => {

        if (response.data.status_code == 200) {
          
          let timerInterval;
          
          Swal.fire({
              icon: "success",
              title: response.data.msg,
              html: t('You will be redirecting to sign in page in <strong></strong> seconds.'),
              timer: 6000,
              timerProgressBar: true,
              showConfirmButton: false,
              didOpen: () => {
                const timer = Swal.getPopup().querySelector("strong");
                timerInterval = setInterval(() => {
                  let time_left = Swal.getTimerLeft() / 1000;
                  timer.textContent = `${ Math.ceil(time_left) }`;
                }, 1000);
              },
              willClose: () => {
                clearInterval(timerInterval);
              }
          }).then((result) => {
              window.location.href = '/';
          });
        
        }

        form.is_importing = false;
  
      })
      .catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
        console.log(error);
    });
    
  }
  
  
  </script>

<style scoped>

.logo{
  width: 120px;
}

</style>
  