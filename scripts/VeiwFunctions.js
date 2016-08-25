function showVeiw() {
	$("#veiwLogin").hide();
	$("#veiwRegister").hide();
	$("#veiwNewPost").hide();
	
}


function showHideMenuLinks() {
	$('#linkHome').show();
	if (sessionStorage.getItem('authToken')== null){
		$("#linkLogin").show();
		$("#linkRegister").show();
		$("#linkNewPost").hide();
		$("#linkLogout").hide();

	}
	else{
		$("#linkLogin").hide();
		$("#linkRegister").hide();
		$("#linkNewPost").hide();
		$("#linkLogout").show();
	}
}




$(function (){
	showHideMenuLinks();
	showVeiw()
	$("#linkHome").click(function(){$("#veiwHome").show();
									$("#veiwRegister").hide();
									$("#veiwNewPost").hide();
									$("#veiwLogin").hide();
	});
	$("#linkLogin").click(function(){$("#veiwLogin").show();
									$("#veiwHome").hide();
									$("#veiwRegister").hide();
									$("#veiwNewPost").hide();
	});
	$("#linkRegister").click(function(){$("#veiwRegister").show();
									$("#veiwHome").hide();
									$("#veiwLogin").hide();
									$("#veiwNewPost").hide();
	});
	$("#linkNewPost").click(function(){$("#veiwNewPost").show();
									$("#veiwHome").hide();
	});
	$("#linkLogout").click(function(){$("#veiwHome").show();
									$("#veiwNewPost").hide();
	});
	$("#linkLogin2").click(function(){$("#veiwLogin").show();
									$("#veiwHome").hide();
									$("#veiwRegister").hide();
									$("#veiwNewPost").hide();
	});
	$("#linkRegister2").click(function(){$("#veiwRegister").show();
									$("#veiwHome").hide();
									$("#veiwLogin").hide();
									$("#veiwNewPost").hide();
	});

})
