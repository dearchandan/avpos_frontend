<template>
    <teleport to="body" >
        <div class="modal hide modal-sm cashier-layout-modal" id="ProfileModal" tabindex="5" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
					<div class="modal-header">
						<div class="modal-title">
							<h2 class="mb-0">{{ $t('Profile') }}</h2>
						</div>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
                        <ul class="model_links">
                            <!-- <li v-if="register"><a role="button" @click="closeRegister()">
                              <Icon class="pe-1 pb-1 align-middle top-0 fsize-14" icon="charm:notes-cross"/>
                              {{ $t('Close Register') }}</a></li> -->
                            <!-- <li><a class="dropdown-item" href="#" @click="switchTerminal()">Switch Terminal</a></li> -->
                            <li><a href="/cashier_setting">
                              <Icon class="pe-1 pb-1 align-middle top-0 fsize-16" icon="mdi:cash-register"/>
                              {{ $t('Cashier Settings') }}</a></li>
                            <li><a href="/orders">
                              <Icon class="pe-1 pb-1 align-middle top-0 fsize-16" icon="mdi:cash-refund"/>
                              {{ $t('Exit Cashier') }}</a></li>
                            <li><a class="text-danger" href="#" @click="signOut">
                              <Icon class="pe-1 pb-1 align-middle top-0 fsize-16" icon="fluent:sign-out-20-filled"/>
                              {{ $t('Sign Out') }}</a></li>
                          </ul>
					</div>
				</div>
			</div>
        </div>
        </teleport>
</template>
