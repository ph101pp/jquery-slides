////////////////////////////////////////////////////////////////////////////////
	timer :{},
	timing : function (key, comment, hide) {
	//	return;
		var timer,time;
		comment=comment||"";
		timer = new Date();
		$.gS.timer[key] = $.gS.timer[key]|| new Date();
				
		time = timer - $.gS.timer[key];
		
		$.gS.timer[key]=timer;
		if(true && !hide) {
			console.log(key+":"+comment+"////////////////////");
			console.log("Time: "+time+"ms");
		}
	},
