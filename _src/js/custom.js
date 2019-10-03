// JavaScript Document
var wow, each_bar_width;
$(document).ready(function () {
    "use strict";

    // menu
    var navTrigger = document.getElementsByClassName('nav-trigger')[0],
        body = document.getElementsByTagName('body')[0];

    navTrigger.addEventListener('click', toggleNavigation);

    function toggleNavigation(event) {
        event.preventDefault();
        body.classList.toggle('nav-open');
    }

    // scroll
    $.scrollIt({
        upKey: 38, // key code to navigate to the next section
        downKey: 40, // key code to navigate to the previous section
        easing: 'linear', // the easing function for animation
        scrollTime: 900, // how long (in ms) the animation takes
        activeClass: 'active-link', // class given to the active nav element
        onPageChange: null, // function(pageIndex) that is called when page is changed
        topOffset: -30 // offste (in px) for fixed top navigation
    });


    // Pro slider
    $('#my-slider').sliderPro({
        forceSize: 'fullWindow',
        autoplay: true,
        arrows: true,
        buttons: false,
        fade: true,
        touchSwipe: true,
        imageScaleMode: 'cover',
        autoplayDelay: 5000,
        slideAnimationDuration: 1000
    });

    $('#clients-slider').sliderPro({
        autoplay: true,
        width: '80%',
        autoHeight: true
    });
    $('#inner-slider').sliderPro({
        width: '100%',
        autoHeight: true,
        arrows: false,
        buttons: true,
        waitForLayers: true,
        autoplay: true,
        autoScaleLayers: false
    });


    // wow
    wow = new WOW({
        mobile: false, // default
    })
    wow.init();


    // light box
    $('a[data-rel^=lightcase]').lightcase();



    // progress-bar
    var progress = $('.progress-bar');
    progress.appear();


    $(function () {
        $('[data-toggle="tooltip"]').tooltip({
            trigger: 'manual'
        }).tooltip('show');
    });

    $(this).on('appear', function () {


        $(".progress-bar").each(function () {
            each_bar_width = $(this).attr('aria-valuenow');
            $(this).width(each_bar_width + '%');
        });

    });



    // input 
    $(".mat-input").focus(function () {
        $(this).parent().addClass("is-active is-completed");
    });

    $(".mat-input").focusout(function () {
        if ($(this).val() === "")
            $(this).parent().removeClass("is-completed");
        $(this).parent().removeClass("is-active");
    })


    // Contact Form 	

    $("#contact_form #submit_btn").click(function () {
        //get input field values
        var user_name = $('#contact_form input[name=name]').val();
        var user_email = $('#contact_form input[name=email]').val();
        var user_message = $('#contact_form textarea[name=message]').val();

        //simple validation at client's end
        //we simply change border color to red if empty field using .css()
        var proceed = true;
        if (user_name == "") {
			$('#contact_form input[name=name]').addClass('error');
            proceed = false;
        }else{
		$('#contact_form input[name=name]').removeClass('error');
		}
        
        if (user_email == "") {
			$('#contact_form input[name=email]').addClass('error');
            proceed = false;
        }else{
		$('#contact_form input[name=email]').removeClass('error');
		}

        // if(user_phone=="") {    
        //     $('input[name=phone]').css('border-color','red'); 
        //     proceed = false;
        // }
        if (user_message == "") {
			$('#contact_form textarea[name=message]').addClass('error');
            proceed = false;
        }else{
		$('#contact_form textarea[name=message]').removeClass('error');
		}


        //everything looks good! proceed...
        if (proceed) {
            //data to be sent to server
            var post_data = {
                'userName': user_name,
                'userEmail': user_email,
                'userMessage': user_message
            };
            var output;
            //Ajax post data to server
            $.post('contact_me.php', post_data, function (response) {

                //load json data from server and output message     
                if (response.type == 'error') {
                    output = '<div class="error">' + response.text + '</div>';
                } else {
                    output = '<div class="success">' + response.text + '</div>';

                    //reset values in all input fields
                    $('#contact_form input').val('');
                    $('#contact_form textarea').val('');
                }

                $("#result").hide().html(output).slideDown();
            }, 'json');

        }
    });

    //reset previously set border colors and hide all message on .keyup()
    $("#contact_form input, #contact_form textarea").keyup(function () {
        $("#contact_form input, #contact_form textarea").css('border-color', '');
        $("#result").slideUp();
    });


    // start a timer when on appear
    var count = $('.count');
    count.appear();
    count.each(function () {
        $(this).on('appear', function () {
            var $this = $(this);
            if (!$this.hasClass('counter-loaded')) {
                $('.count').countTo({
                    speed: 2000,
                    formatter: function (value, options) {
                        return value.toFixed(options.decimals);
                    },

                });
                $this.addClass('counter-loaded');
            }
        });
    });



});


   
$(window).load(function () { // makes sure the whole site is loaded
		
		// preloader
        $('#status').fadeOut(); // will first fade out the loading animation
        $('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
        $('body').delay(350).css({
            'overflow': 'visible'
        });
		
		
	    // isotope 
        // initialize Portfolio isotope
        var $container = $('.portfolio_container');
        $container.isotope({
            filter: '*',
        });

        $('.portfolio_filter a').click(function () {
            $('.portfolio_filter .active').removeClass('active');
            $(this).addClass('active');

            var selector = $(this).attr('data-filter');
            $container.isotope({
                filter: selector,
                animationOptions: {
                    duration: 500,
                    animationEngine: "jquery"
                }
            });
            return false;
        });



        // initialize Blog isotope
        var $container_blog = $('.blog_container');
        $container_blog.isotope({
            filter: '*',
        });	
		
		
})
