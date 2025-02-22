<template>
    <div class="filter-item-field">
        <label>{{ $t('Show') }}</label>
        <div>
            <select class="form-control form-control-sm form-control-solid" v-model="paginate_limit">
                <option v-for="(option,option_index) in options" :key="option_index" :selected="paginate_limit
                 == option" :value="option">{{ option }}</option>
            </select>
        </div>
        <label v-if="pagination != null" class="me-0 ms-2">{{ $t('Entries') }}</label>
        <label v-if="pagination != null" class="ms-4 me-0">{{ $t('Showing') }} {{ pagination.from }} {{ $t('to') }} {{ pagination.to  }} {{ $t('of') }} {{ pagination.total }} {{ $t('entries') }}</label>
    </div>
</template>


<script setup>
    
    import { watch, ref } from 'vue';

    import { useAuthStore } from '@/stores/auth';

    const authStore = useAuthStore()

    const paginate_limit = ref(authStore.paginate_limit);
    
    const emit = defineEmits(['paginate_limit_update'])

    watch(paginate_limit, (value) => {
        emit('paginate_limit_update',value);
    })

    const props = defineProps({
        pagination: {
            type: Object,
            required: false,
        },
    });

    const options = [
        2,25,50,100
    ]

</script>