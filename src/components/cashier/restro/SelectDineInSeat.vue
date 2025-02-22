<template>

    <div class="modal" id="dineInSeatModal" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-centered modal-sm">
            <div class="modal-content">
                <div class="modal-header modal-title ">
                    <h2 class="mb-0"><span class="table-number">{{  table_name  }}</span> 
                    </h2>
                    <!-- <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal()" ></button> -->
                </div>
                <div class="modal-body">
                    <form>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-field">
                                    <label for="">{{ $t('Enter Seats') }}</label>
                                    <input class="form-control form-control-solid form-control-lg" type="text" :placeholder="enter_seats_placeholder" v-model="table_capacity" />
                                </div>
                            </div>
                        </div>
                        <div class="modal-btns">
                            <a href="#Dine_in" class="btn btn-primary" data-bs-toggle="modal" @click="closeModal()">{{ $t('Continue') }}</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

</template>


<script setup>

    import { toRefs } from 'vue';
    import { useCashierStore } from '@/stores/cashierStore';
    import { useI18n } from 'vue-i18n'

    const { t } = useI18n();
    const enter_seats_placeholder = t("enter seats")
    const cashierStore = useCashierStore();

    const table_capacity = computed({
        get() {
            if(cashierStore.table){
                return cashierStore.table.table_capacity;
            }
        },
        set(newValue) {
            if(newValue <= cashierStore.table.table_capacity){
                cashierStore.setSeats(newValue);
            }else{
                cashierStore.setSeats(cashierStore.table.table_capacity);
            }
        }
    })

    const table_name = computed( () => {
        return (cashierStore.table && cashierStore.table != '') ? cashierStore.table.name : '';
    })

    const emit= defineEmits(["closeDineInSeatModal"])
    
    function closeModal() {
        emit("closeDineInSeatModal");
    }


</script>