<template>
    <DefaultLayout>

        <template v-slot:subheader>
            <div class="header-nav-wrap">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <div class="header-back-link">
                            <router-link class="text-primary" to="/support_tickets" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Support Tickets') }}</router-link>
                        </div>
                    </div>
                    <!-- <div class="col-auto">
                        <h5 class="fw-bold">{{ support_ticket.name  }} </h5>
                    </div> -->
                </div>
            </div>
        </template>

        <div class="content">
            <div class="page-heading">
                <div class="py-3" v-if="form.server_messages.messages != ''">
                    <ServerMessage :server_messages="form.server_messages"  />
                </div>
            </div>

            <div class="row">
                <!--<div class="col-2">
                    <div class="card">
                        <div v-if="support_ticket == ''">
                            <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">  </beat-loader>
                        </div>
                        <div v-else class="text-center">
                            <img :src="support_ticket.logo">
                        </div>
                    </div>
                </div>-->
                <div class="col-md-12">
                    <div class="card">
                        <div v-if="support_ticket == ''">
                            <beat-loader color="gray" :size="'15px'" class="pt-2 pe-2">  </beat-loader>
                        </div>
                        <div v-else>
                            <div class="row">
                                
                                <div class="col-md-4">
                                    <div class="data-view-box mb-3">
                                        <div class="item">
                                            <b>{{ $t('Merchant Name') }}:</b>
                                            {{ support_ticket.merchant_name }}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="data-view-box mb-3">
                                        <div class="item">
                                            <b>{{ $t('Ticket Type') }}:</b>
                                            {{ support_ticket.ticket_type }}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="data-view-box mb-3">
                                        <div class="item">
                                            <b>{{ $t('Priority') }}:</b>
                                            {{ support_ticket.priority }}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="data-view-box mb-3">
                                        <div class="item">
                                            <b>{{ $t('Title') }}:</b>
                                            {{ support_ticket.title }}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-8">
                                    <div class="data-view-box mb-3">
                                        <div class="item">
                                            <b>{{ $t('Description') }}:</b>
                                            {{ support_ticket.description }}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="data-view-box mb-3">
                                        <div class="item">
                                          <b>{{ $t('User') }}:</b>
                                          {{ support_ticket.user_name }}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="data-view-box mb-3">
                                        <div class="item">
                                            <b>{{ $t('Email') }}:</b>
                                            {{ support_ticket.email }}
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-4">
                                    <div class="data-view-box mb-3">
                                      <div class="item">
                                          <b>{{ $t('Reporting Platform') }}:</b>
                                          {{ support_ticket.reporting_platform }}
                                      </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="data-view-box mb-3">
                                      <div class="item">
                                          <b>{{ $t('Reporting Date') }}:</b>
                                          {{ support_ticket.reporting_date }}
                                      </div>
                                    </div>
                                </div>
                              
                                <div class="col-md-4">
                                    <div class="data-view-box mb-3">
                                        <div class="item">
                                        <b>{{ $t('Created Date') }}:</b>
                                        {{ support_ticket.created_at_label }}
                                        </div>
                                    </div>
                                    </div>
                                <div class="col-md-4" v-if="support_ticket.created_by">
                                    <div class="data-view-box mb-3">
                                    <div class="item">
                                        <b>{{ $t('Created By') }}:</b>
                                        {{ support_ticket.created_by.name }}
                                    </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="data-view-box mb-3">
                                        <div class="item">
                                        <b>{{ $t('Updated Date') }}:</b>
                                        {{ support_ticket.updated_at_label }}
                                        </div>
                                    </div>
                                    </div>
                                <div class="col-md-4" v-if="support_ticket.updated_by">
                                    <div class="data-view-box mb-3">
                                    <div class="item">
                                        <b>{{ $t('Updated By') }}:</b>
                                        {{ support_ticket.updated_by.name }}
                                    </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="data-view-box mb-3">
                                    <div class="item">
                                        <b>{{ $t('Status') }}:</b>
                                        <span v-if="support_ticket.status==0" class="badge badge-primary">{{ $t('Open') }}</span>
                                        <span v-if="support_ticket.status==1" class="badge badge-success">{{ $t('Under Processing') }}</span>
                                        <span v-if="support_ticket.status==2" class="badge badge-warning">{{ $t('Closed') }}</span>
                                    </div>
                                    </div>
                                </div>
                                <div class="col-md-4" v-if="support_ticket.attachment_link != ''">
                                    <div class="data-view-box mb-3">
                                        <a :href="support_ticket.attachment_link" download class="btn btn-primary btn-sm" target="_blank">
                                            <!-- <Icon icon="material-symbols:view" class="fs-4"></Icon>  -->
                                            {{ $t('View Attachment') }} 
                                        </a> 
                                        <!-- <a :href="support_ticket.attachment_link"
                                        v-text="$t('Download Attachment')"
                                        @click.prevent="downloadItem(support_ticket.attachment_link, 'Download Attachment')" />  -->                                     
                                    </div>
                                </div>
                              
                            </div>                            
                        </div>
                    </div>
                </div>
                
            </div>

        </div>

     </DefaultLayout>
</template>

<script setup>

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import {ref, reactive, onMounted } from 'vue';
import { Form } from 'vee-validate'
import * as yup from 'yup';
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

import {useRoute} from "vue-router";
import { useI18n } from 'vue-i18n'

const { t } = useI18n();
const route = useRoute();
const ticket_id = route.params.ticket_id;

const is_loading = ref(false);
const support_ticket = ref([]);

const initialState = {
      server_messages: {
        type: "",
        messages: "",
      },
};

const form = reactive({ ...initialState });

onMounted(() => {
    getSupportTicket();
});


async function getSupportTicket(){
    is_loading.value = true;
    await axios.post('/api/support_ticket', { ticket_id : ticket_id }).then( (response) => {
    
        support_ticket.value = response.data.data;
        is_loading.value = false;
        
    }).catch((error) => {
        form.server_messages.type = "error";
        form.server_messages.messages = error;
        is_loading.value = false;
        console.log(error);
    });

}

 function downloadItem ( url, label) {
    // window.open(url, 'Download');
    // axios.get(url, { responseType: 'blob' })
    //   .then(response => {
    //     const blob = new Blob([response.data], { type: 'application/pdf' })
    //     const link = document.createElement('a')
    //     link.href = URL.createObjectURL(blob)
    //     link.download = label
    //     link.click()
    //     URL.revokeObjectURL(link.href)
    //   }).catch(console.error)
}


</script>