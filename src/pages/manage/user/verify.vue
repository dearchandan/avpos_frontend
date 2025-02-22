<template>
    <SimpleLayout>
        <div class="container py-5 my-5 text-center">
            <h1>{{ $t('Verification Page') }}</h1>
            <AsyncServerMessage v-if="server_messages.messages != ''" />
        </div>
    </SimpleLayout>
</template>

<script setup>

    import {useRoute} from "vue-router";
import router from "../../../router";
    const route = useRoute();
    const token = route.params.token;
    const server_messages = reactive({
        type : "",
        messages : "",
    });

    const AsyncServerMessage = defineAsyncComponent( () => import('@/components/common/ServerMessage.vue') );

    onMounted(() => {
        verify();
    });

    async function verify(){

        var form_data = new FormData();
        form_data.append('token',token);

        await axios.post('/api/user/verify', form_data).then( (response) => {
            
            if(response.data.status_code == 200) {

                toast.success(response.data.msg);
                
                router.push('/');
                
                
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
            
        })
    
    }
    

</script>