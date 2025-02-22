<template>
    <div class="row flex-nowrap gx-2 text-end">
        <div class="col-auto" v-if="edit">
            <a v-if="permissions && permissions.write" class="btn btn-icon btn-xs btn-light" href="#" @click="$emit('edit', slack)" v-tippy="t('Edit')">
                <Icon icon="fa6-solid:pen"  />
            </a>
        </div>
        <div class="col-auto" v-if="edit_modal">
            <a v-if="permissions && permissions.write && edit_modal_target" class="btn btn-icon btn-xs btn-light" href="#" data-bs-toggle="modal" :data-bs-target="edit_modal_target" @click="$emit('editModal', edit_modal_data)" v-tippy="t('Edit')">
                <Icon icon="fa6-solid:pen"  />
            </a>
            <a v-else-if="permissions && permissions.write" class="btn btn-icon btn-xs btn-light" href="#" data-bs-toggle="modal" :data-bs-target="edit_modal_target" @click="$emit('editModal', edit_modal_data)" v-tippy="t('Edit')">
                <Icon icon="fa6-solid:pen"  />
            </a>
        </div>
        <div class="col-auto" v-if="clone">
            <a v-if="permissions && permissions.write" class="btn btn-icon btn-xs btn-light-primary" href="#" @click="$emit('clone', slack)" v-tippy="t('Clone')">
                <Icon icon="fa6-regular:copy"  />
            </a>
        </div>
        <div class="col-auto" v-if="del">
            <a v-if="permissions && permissions.delete" class="btn btn-icon btn-xs btn-light-danger" href="#" @click="$emit('delete', slack)" v-tippy="t('Delete')">
                <Icon icon="fa6-regular:trash-can" />
            </a>
        </div>
    </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n'
import { directive as VTippy } from 'vue-tippy'

const { t } = useI18n();
const props = defineProps(['permissions','slack','edit_modal_data','edit_modal_target','onClone','onEdit','onDelete','onEditModal']);
const { permissions,slack,edit_modal_data,edit_modal_target,onClone,onDelete,onEdit,onEditModal } = toRefs(props);
const clone = (onClone.value)?true:false;
const del = (onDelete.value)?true:false;
const edit = (onEdit.value)?true:false;
const edit_modal = (onEditModal.value)?true:false;
</script>