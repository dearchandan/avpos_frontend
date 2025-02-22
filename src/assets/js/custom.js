
$(document).ready(function(){
     jQuery(".form-select").select2();

//     jQuery(".navbar-toggle").click(function(){
//          jQuery("body").toggleClass("sidebar-collapsein");
//     });
    jQuery(".sidebar-toggle").click(function(){
         jQuery("body").toggleClass("sidebar-collapsein");
    });
//     jQuery(".menu-sidebar").mouseenter(function(){
//          jQuery("body").addClass("sidebar-collapsein");
//     });
//     jQuery(".menu-sidebar").mouseleave(function(){
//          jQuery("body").removeClass("sidebar-collapsein");
//     });

     jQuery(".dark-light-toggle").click(function(){
          jQuery("body").toggleClass("dark-active");
     });

});

$(document).on('click',".navbar-toggle",function(){
     $("body").toggleClass("sidebar-collapsein");
});

$(document).on('click',"ul.menu-navigation > li a",function(){
     $("body").toggleClass("sidebar-collapsein");
});


$(document).on('click',".menubar-overlay",function(){
     $("body").removeClass("sidebar-collapsein");
});

$(document).on('click',".categorietoggle",function(){
     $("body").toggleClass("ct-sidebar-collapsein");
});

$(document).on('click',".sidebarclose",function(){
     $("body").toggleClass("ct-sidebar-collapsein");
});

$(document).on('click',".cart_sidebar_toggle",function(){
     $("body").toggleClass("cartsidebar-show");
});
$(document).on('click',".cartsidebarclose",function(){
     $("body").toggleClass("cartsidebar-show");
});


// $(function () {
//      $('[data-bs-toggle="tooltip"]').tooltip()


//  })

// $(document).on('ready',function(){
//      // Initialize tooltips
//      var tooltips = $('[data-bs-toggle="tooltip"]');
//      tooltips.tooltip();
   
//      // When clicking on a tooltip trigger
//      tooltips.on('click', function(){
//        // Hide all tooltips
//        tooltips.tooltip('hide');
       
//        // Show the clicked tooltip
//        $(this).tooltip('show');
//      });
//    });
