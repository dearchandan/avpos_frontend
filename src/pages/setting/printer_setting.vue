<template>
      <DefaultLayout>

        <template v-slot:subheader>
            <div class="header-nav-wrap">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <div class="header-back-link">
                            <router-link class="text-primary" to="/settings" ><Icon icon="fa6-solid:chevron-left"  /> {{ $t('Settings') }}</router-link>
                        </div>
                    </div>
                    <div class="col-auto">
                        <h5 class="fw-bold">{{ $t('Printer Setting') }}</h5>
                    </div>
                </div>
            </div>
        </template>

        
        <div class="content py-5">

            <div class="py-3" v-if="form.server_messages.messages != ''">
                <ServerMessage :server_messages="form.server_messages"  />
            </div>
            
            <div class="row pt-2">
                <div class="col-md-12 text-center">
                    <h5 class="text-danger">Printer settings are under development</h5>
                </div>
            </div>

        </div>
    </DefaultLayout>
</template>

<script setup>

    const initialState = {
        server_messages: {
            type: "",
            messages: "",
        },
    };

    const form = reactive({ ...initialState });

</script>
