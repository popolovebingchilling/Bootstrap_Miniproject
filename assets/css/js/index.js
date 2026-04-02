        // Current Year
        var year = new Date().getFullYear();
        document.getElementById('displayYear').textContent = year;
        document.getElementById('displayYear2').textContent = year;

        // Owl Carousel - Clients
        $(document).ready(function () {
            $(".client_owl-carousel").owlCarousel({
                loop: true,
                margin: 0,
                dots: false,
                nav: true,
                autoplay: true,
                autoplayHoverPause: true,
                navText: [
                    '<i class="fa fa-angle-left"></i>',
                    '<i class="fa fa-angle-right"></i>'
                ],
                responsive: {
                    0: { items: 1 },
                    768: { items: 2 },
                    1000: { items: 2 }
                }
            });
        });

        // Menu Filter
        $(document).ready(function () {
            $('.filters_menu li').on('click', function () {
                $('.filters_menu li').removeClass('active');
                $(this).addClass('active');

                var filter = $(this).data('filter');
                if (filter === 'all') {
                    $('.food-item').show();
                } else {
                    $('.food-item').hide();
                    $('.food-item.' + filter).show();
                }
            });
        });
