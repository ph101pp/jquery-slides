(function($) {
	$(document).ready(function() { 
		console.log($());		
		$(".greenishSlides").greenishSlides();
		
		$(window).resize(function () {
			$.gS.setSlides($(".greenishSlides .gSWrapperTwo"));
		});
		
			
	});
})(jQuery);
