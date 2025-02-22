

$(window).on('load', function() {
     $('.onload_modal').modal('show');
});

$(document).on('click','.submenu-open',function() {
     $(".menu-parent").removeClass('submenu_active')
     $('.submenu li.child').removeClass('active');
     $(this).parent().parent().toggleClass('submenu_active');
});

$(document).on('click','.submenu li.child',function() {
     $('.submenu li.child').removeClass('active');
     jQuery(this).parent().parent().parent().addClass('submenu_active');
     $(this).addClass('active');
});
$(document).ready(function(){
     jQuery(".form-select").select2();

     jQuery(".dark-light-toggle").click(function(){
          jQuery("body").toggleClass("dark-active");
     });
     
	jQuery('.submenu-open').click(function() {
		jQuery(this).parent().parent().toggleClass('submenu_active');
	});
     
});

document.querySelectorAll('[data-bs-toggle="tooltip"]')
.forEach(tooltip => {
  new bootstrap.Tooltip(tooltip)
})
