<template>
    <div class="menu-sidebar" data-simplebar>
        <div class="sidebarclose d-xl-none">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 1L1 11" stroke="black" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M1 1L11 11" stroke="black" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
        <ul>
            <li :class="{ 'active' : selected_category_id == '' && !show_combos }" @click="searchProducts()" v-if="is_categories_listed">
                <a href="#">
                    <span class="icon">
                        <img src="/src/assets/images/all-product.svg" alt="">
                    </span>
                    <span class="text">{{ $t('All Products') }}</span>
                </a>
            </li>
            <!-- <li :class="{ 'active' : show_combos }" @click="getCombos()">
                <a href="#">
                    <span class="icon">
                        <img src="/src/assets/images/combo_icon.svg" alt="">
                    </span>
                    <span class="text">Combos</span>
                </a>
            </li> -->
            <li  :class="{ 'active' : category.id == selected_category_id && !show_combos , 'menu-parent' : category.subcategories && category.subcategories.length }" v-if="is_categories_listed" v-for="(category,index) in categories" >
                <a href="#" @click="searchProducts(category.id)">
                    <span class="icon">
                        <img src="/src/assets/images/burger.svg" alt="">
                    </span>
                    <span class="text">{{ category.name }}  <span class="favorite-item">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.93772 0.584987L6.30191 3.30455C6.32373 3.34892 6.36736 3.38041 6.41826 3.38756L9.46807 3.82412C9.59459 3.84273 9.6455 3.99446 9.55387 4.0832L7.34615 6.19873C7.30979 6.23308 7.29379 6.28318 7.30252 6.33328L7.82318 9.32193C7.845 9.44645 7.71265 9.53949 7.59921 9.48224L4.87227 8.07093C4.82719 8.04803 4.77338 8.04803 4.72829 8.07093L2.00136 9.48224C1.88792 9.54092 1.75557 9.44645 1.77739 9.32193L2.29805 6.33328C2.30678 6.28461 2.29078 6.23451 2.25442 6.19873L0.0466956 4.08177C-0.0449293 3.99445 0.00597346 3.8413 0.132503 3.82269L3.1823 3.38613C3.23175 3.37898 3.27538 3.34749 3.29865 3.30311L4.66285 0.583556C4.71811 0.471911 4.881 0.471911 4.93772 0.584987Z" fill="#A1A5B7"/>
                        </svg>
                    </span></span>
                   
                    <span class="submenu-open" v-if="category.subcategories && category.subcategories.length">
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 5L5 1L1 5" stroke="#4B5B73" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </span>
                </a>
                <div class="submenu" v-if="category.subcategories && category.subcategories.length">
                    <ul>
                        <li v-for="(subcategory,index) in category.subcategories" :class="'child'" >
                            <a href="#" @click="searchProducts(subcategory.id)"> 
                                <span class="icon">
                                    <img src="/src/assets/images/burger.svg" alt="">
                                </span>
                                {{ subcategory.name }} 
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
            <CashierCategoryListSkeleton v-else />
        </ul>

        
    </div>
</template>

<script setup>

    import { useCashierStore } from '@/stores/cashierStore';
    
    onMounted(() => {
        fetchCategories();
    });
    
    const cashierStore = useCashierStore();
    const categories = ref([]);

    const show_combos = computed(() => {
        return cashierStore.show_combos;
    })

    function getCombos(){
        cashierStore.setCombo();
    }

    const selected_category_id = computed({
      get: () => cashierStore.category_id,
      set: (value) => cashierStore.setCategory(value),
    });
	
    const is_categories_listed = ref(false); 
    async function fetchCategories(){
		var response = await axios.get('api/cashier/categories');
        categories.value = response.data.categories;
        is_categories_listed.value = true;
    }
    
    function searchProducts(category_id = ""){
        cashierStore.setCategory(category_id);
    }

</script>