<template>
    <div>
        <table class="table table-condensed table-bordered">
            <thead>
                <tr>
                    <th>{{ $t('Row') }}</th>
                    <th>{{ $t('Errors') }}</th>
                    <th>{{ $t('Field') }}</th>
                    <th>{{ $t('Current Value') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="error in import_errors">
                    <td>{{ error.row  }} </td>
                    <td class="text-danger"><span v-for="error_item in error.errors">{{ error_item }} </span> <br> </td>
                    <td>{{ error.attribute  }} </td>
                    <td>{{ error.value  }} </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>

    const { import_errors } = defineProps(['import_errors']);
    
</script>

<style scoped>
div{
    height: auto;
    /* min-height: 100px; */
    max-height: 50vh;
    overflow-y: auto;
}
</style>