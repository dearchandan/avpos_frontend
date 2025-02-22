<template>
  <div :class="[has_subheader ? 'with-subheader' : 'without-subheader']">
    <!-- Sidebar or Main Menu Bar -->
    <Sidebar />

    <header>
      <!-- Header or Sub Navbar-->
      <Header />

      <!-- Subheader -->
      <slot name="subheader"></slot>
    </header>

    <!-- Content -->
    <slot />
  </div>
</template>

<script setup>

const props = defineProps({
  has_subheader: {
    type: Boolean,
    default: true,
  },
});

</script>

<style scoped>
.with-subheader {
  padding-top: 99px;
  padding-left: var(--sidebar-width);
}

.without-subheader {
  padding-top: 56px;
  padding-left: var(--sidebar-width);
}
[dir="rtl"] .with-subheader,
[dir="rtl"] .without-subheader {
  padding-left: 0;
  padding-right: var(--sidebar-width);
}

@media (min-width: 768px) and (max-width: 991px) {
  .with-subheader {
    padding-left: 54px;
  }
  [dir="rtl"] .with-subheader {
    padding-left: 0;
    padding-right: 54px;
  }
}

@media (max-width: 767px) {
  .with-subheader {
    padding-top: 76px;
    padding-left: 0;
  }
  .without-subheader {
    padding-top: 38px;
    padding-left: 0;
  }
  [dir="rtl"] .with-subheader,
  [dir="rtl"] .without-subheader {
    padding-right: 0;
  }
}
</style>
