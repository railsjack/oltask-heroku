navigator.notification = {
	alert: function(message){
		alert(message);
	},

	confirm: function(message, callback ) {
		if(confirm(message)) callback(1);
	}

};

navigator.splashscreen = {
	show: function(){},
	hide: function(){}
};

