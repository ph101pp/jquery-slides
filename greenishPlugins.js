(function($){
////////////////////////////////////////////////////////////////////////////////
	var event = function (event, ui, options){
		switch($(ui.newHeader).attr("id")) {
			case "example1" : 
			default: 
			break;
			case "example2":
				options={
					vertical:true,
					events: {
						activate:"click",
						deactivate:"click"
					}
				};
			break;
			case "example3":
				options={
					limits: {
						min:30,
					}
				};
			break;
			case "example4":
				options={
					limits: {
						min:10,
						0: {
							min:180
						},
						2: {
							min:180
						},
						4: {
							min:180
						},
						"-1": {
							min:180
						}
					}
				};
			break;
			case "example5":
				options={
					active:0,	
					stayOpen:true,
					keyEvents:true,
					limits: {
						max:400,
					}
				};
			break;
			case "example6":
				options={	
					stayOpen:true,
					events: {
						activate:"click",
						deactivate:"click"
					},
					limits: {
						0: {
							min:30,
							max:30
						}
					}
				};
			break;
		}
		$(".myElement").greenishSlides($.extend(true, {}, $.gS.defaults, {
			limits : {
				min:false,
				max:false,
				0:false,
				1:false,
				2:false,
				3:false,
				4:false,
				5:false,
				6:false,
				"-1":false,
				"-2":false,
				"-3":false,
				"-4":false,
				"-5":false,
				"-6":false,
				"-7":false
			}
		}, options||{}));

	}
////////////////////////////////////////////////////////////////////////////////
	$(document).ready(function() { 
		$(".examples").accordion({
			header:".handle",
			autoHeight:false,
			create: event,
			change: event
		});
	});
////////////////////////////////////////////////////////////////////////////////
})(jQuery);
