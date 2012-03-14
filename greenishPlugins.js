(function($){
	$(document).ready(function() { 
		$(".myElement").greenishSlides({
			events: {
				activate:"mouseover",
				deactivate:"mouseout"
			},
			limits: {
				min:30
			}
		});	
		
		$(".examples").accordion({
			active:1,
			header:".handle",
			change: function (event, ui){
				console.log("hange")
			}
		});
	});
})(jQuery);
