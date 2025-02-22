<template>
    <DefaultLayout>
        
        <template v-slot:subheader>
            <RestaurantMenu />
        </template>

        <div class="content">
         
            <div class="page-heading">
                <div class="row align-items-center justify-content-between">
                    <div class="col-auto">
                        <div class="row align-items-center">
                            <div class="col-auto">
                                <a v-if="permissions.write" href="#" class="btn btn-sm btn-light-primary2 me-2" data-bs-toggle="modal" @click="openAddAreaModal()" data-bs-target="#addAreaModal">+ {{ $t('New Area') }}</a>
                                <a v-if="permissions.write" href="#" class="btn btn-sm btn-light-primary2 " @click="openAddTableModal()" >+ {{ $t('New Table') }}</a>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
            
            <div class="row" v-if="isAuthorized('A_READ_TABLE')">
                
                <div class="col-md-4">
                    <div class="card">
                        <AsyncDineinAreaList />
                    </div>
                </div>
                
                <div class="col-md-8">
                    <div class="card">
                        <AsyncTableList :dinein_areas="dinein_areas" />
                    </div>
                </div>
                
            </div>

            <UnauthorizedAccess v-else />

        </div>
        
        <!-- <AddTableForm  :show_add_table_modal="show_add_table_modal" @closeAddTableModal="closeAddTableModal" :dinein_areas="dinein_areas" />
        <AddAreaForm  :show_add_table_modal="show_add_area_modal" @closeAddAreaModal="closeAddAreaModal"   /> -->

    </DefaultLayout>
</template>

<script setup>

import useGlobalFunctions from '@/composables/global_functions.js';
import { onMounted } from 'vue';

const AddTableForm = defineAsyncComponent( () => import('@/components/table/AddTableForm.vue') );
const AddAreaForm = defineAsyncComponent( () => import('@/components/table/AddAreaForm.vue') );
const AsyncTableList = defineAsyncComponent( () => import('@/components/table/TableList.vue') );
const AsyncDineinAreaList = defineAsyncComponent( () => import('@/components/table/DineinAreaList.vue') );

const show_add_table_modal = ref(false);
const show_add_area_modal = ref(false);
const dinein_areas = ref([]);

function openAddTableModal(){
    show_add_table_modal.value = true; 
    getDineinAreas();
    $("#addTableModal").modal('show');
}
function closeAddTableModal(){
    show_add_table_modal.value = false;
}

function openAddAreaModal(){
    show_add_area_modal.value = true; 
}
function closeAddAreaModal(){
    show_add_area_modal.value = false;
}

const { isAuthorized } = useGlobalFunctions();

onMounted(() => {
    checkPermissions();
    getDineinAreas();
});


/* Checking permissions */
const permissions = ref({
    write : false,
    delete : false,
});

function checkPermissions(){
    permissions.value  = {
        write : isAuthorized('A_WRITE_TABLE'),
        delete : isAuthorized('A_DELETE_TABLE'),
    };
}

async function getDineinAreas(){
    let response = await axios.get('api/v2/table/dinein_areas');
    dinein_areas.value = [];
    _.forEach(response.data.data.dinein_areas, (item) => {
        let template = {
            'id': item.slack,
            'name': item.name,
        };
        dinein_areas.value.push(template);
    })
}

</script>