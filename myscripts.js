//default function to run when document is ready
$(document).ready(function(){
	var events = [];
	var pagination = 0;
	var venue = null;
	var lat = 0;
	var lng = 0;
	var currentLocation = true;

//get request for events around current location
	function showPosition(position) {
    	lat =  position.coords.latitude
    	lng = position.coords.longitude	
		$.get("https://www.eventbriteapi.com/v3/events/search/",
				{'popular':'on',
				'location.latitude': lat,
				'location.longitude': lng,
				'location.within':"50mi",
				'start_date.keyword':'this_weekend',
				'token':"6VMARHH2OSFVUIRK26OJ" },
				function(data, status, xhr) {
					events = data.events
					display()
					console.log(window.width)
					window.resizeTo(window.height, 700);
					console.log(window.width)
					$("#table").show()
					$("#fwdBck").children().show()
					$("#open").hide()
					$("#open").children().hide()
		});
	}
//display table with 5 events per page
	function display() {
		var children = $("#table").children("tbody").children("tr");
		console.log(children.length)
		for(i = 0; i<children.length - 1; i++) {
			var child = children.eq(i+1)
			var grandChildren = child.children()
			var date = events[pagination + i].start.local
			var dates = new Date(date)
			var dateTime = date.split('T')
			var splitDate = dateTime[0].split('-')
			var splitTime = dateTime[1].split(':')
			amPm = "AM "
			console.log(parseInt(splitTime[0])/12)
			if (parseInt(splitTime[0])/12 >= 1) {
				amPM = "PM "
			}
			grandChildren.eq(0).text(events[pagination + i].name.text)
			grandChildren.eq(1).text(dates.toDateString())//splitDate[1]+"/"+splitDate[2]+"/"+splitDate[0])
			grandChildren.eq(2).text(dates.toLocaleTimeString())//parseInt(splitTime[0])%12+":"+splitTime[1]+ amPm)
				
			console.log(events[pagination+i].name.text)				
		}
	}
//get venue to display location of event in details page
	function getVenue(id) {
		var sFormat = "https://www.eventbriteapi.com/v3/venues/{0}/";
		var result = bob.string.formatString(sFormat, id);
		$.get(result,
			{'token':"6VMARHH2OSFVUIRK26OJ" },
			function(data, status, xhr) {
				console.log("Yellow")
				venue = data
		});
	}
//toggle between current location and form
	$("#otherLocation").click(function(){
		if(currentLocation) {		
			$("#form").show();
			$(this).text("Use Current Location")
			currentLocation = false;
		} else {
			$("#form").hide();
			$(this).text("Use Current Location")
			currentLocation = true;
		}

		
	});
//initiate query for events
    $("#checkPage").click(function(){
		pagination = 0;
		var address = $("#address").val()+" "+$("#city").val()+' '+$("#state").val()
		console.log(address)
		if(currentLocation) {
			if (navigator.geolocation) {
        		navigator.geolocation.getCurrentPosition(showPosition);
    		} else { 
				x.innerHTML = "Geolocation is not supported by this browser.";
			}
		} else  {
        $.get("https://www.eventbriteapi.com/v3/events/search/",
			{'popular':'on',
			'location.address': address,
			'location.within':"50mi",
			'start_date.keyword':'this_weekend',
			'token':"6VMARHH2OSFVUIRK26OJ" },
			function(data, status, xhr) {
				events = data.events
				display()
				console.log(window.width)
				window.resizeTo(window.height, 700);
				console.log(window.width)
				$("#table").show()
				$("#fwdBck").children().show()
				$("#open").hide()
				$("#open").children().hide()
			 });
		}
	});

//function for getting details on a specific event
	$(".clickable").click(function(){
		$("#table").hide()
		$("#fwdBck").children().hide()
		var id = $(this).attr('id')
		var sFormat = "https://www.eventbriteapi.com/v3/venues/{0}/";
		var result = bob.string.formatString(sFormat, events[pagination + parseInt(id)-1].venue_id);
		$.get(result,
			{'token':"6VMARHH2OSFVUIRK26OJ" },
			function(data, status, xhr) {
				console.log(data)
				venue = data
				$("#open").show()
				$("#open").children().show()
				$("#navigation").show()
				var fString = bob.string.formatString("{0} <br> {1}, {2}", venue.address.address_1, venue.address.city, venue.address.region);
				console.log(fString);
				$("#location").empty();
				$("#location").append(fString);
				$("#url").attr("href", events[pagination + parseInt(id)-1].url);
				console.log(events[pagination + parseInt(id)-1].url)
				$("#description").empty();
				$("#description").append(events[pagination + parseInt(id)-1].description.html);
				
				
		});
	});

//function to go back into table view
	$("#exitDescription").click(function(){
		$("#table").show()
		$("#fwdBck").children().show()
		$("#open").hide()
	});

//button to advance to the next set of 5 results
	$("#nextButton").click(function(){
		if (pagination <= events.length - 5) {
			pagination = pagination + 5
			display()
		}
	});

//button to go to the previous set of results
	$("#backButton").click(function(){
		if (pagination >= 5) {
			pagination = pagination - 5
			display()
		}
	});

//method to keep the rangeBox linked to the slider
	$("#slider").change(function(){
		if($("#rangeBox").val()!=$(this).val()) {
			$("#rangeBox").val($(this).val())
		}
	});


//method to keep the slider linked to the rangeBox
	$("#rangeBox").change(function(){
		if($("#slider").val()!=$(this).val()) {
			$("#slider").val($(this).val())
		}
	
	});

});

