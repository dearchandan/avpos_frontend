<template>
    <teleport to='body'>

        <div class="modal fade" id="listReleaseDetailModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-dialog-centered modal-w-1260 modal-md">
                <div class="modal-content" v-if="release_version">
                    <div class="modal-header modal-title border-0">
                        <h3 class="mb-0 text-danger">{{ $t("Version") }} {{ release_version.version }}</h3>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal" id="close_btn"></button>
                    </div>
                    <div class="modal-body pt-0">
                        <div class="row">
                            <h6>{{ $t("Release Notes") }}:</h6>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <p>
                                    {{  release_version.highlights  }}
                                </p>
                            </div>
                       </div>
                        <div class="row mt-2">
                            <h6>{{ $t("Description") }}:</h6>
                        </div>
                       <div class="row">
                            <div class="col-12">
                                <p v-html="release_version.description">
                                </p>
                            </div>
                       </div>
                    </div>
                </div>
            </div>
        </div>

    </teleport>
</template>


<script setup>

    function closeModal(){
        $('#releaseDetailModal').modal('hide');
    }

    const { release_version } = defineProps(['release_version']);
    
</script>