<template>

    <VMultiSelect 
        name="selected_category" 
        :text="'name'" 
        :value="'id'" 
        :options="categories"
        mode="single"
        v-model="selected_category_id"
        :selected="selected_category_id"
        :placeholder="'All Categories'"
        :no_class="true"
        :height_sm="true"
    />
    
</template>

<script setup>

    import { useCashierStore } from '@/stores/cashierStore';
    
    onMounted(() => {
        fetchCategories();
    });
    
    const cashierStore = useCashierStore();
    const categories = ref([]);

    const selected_category_id = ref('');
	
    watch(() => selected_category_id.value, (value) => {
        searchProducts(value);
    })

    async function fetchCategories(){
		var response = await axios.get('api/cashier/categories');
        categories.value = response.data.categories;
    }
    
    function searchProducts(category_id = ""){
        cashierStore.setCategory(category_id);
    }

</script>
