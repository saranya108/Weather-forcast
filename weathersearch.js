var tempunit = '';
var speedunit = '';

function requestValidName(counter) { //Function to fire URL and retrive XML data about place search and weather report
	var woeid = '';
	var query = 'select * from geo.places where text="'+ $('#city' + counter).val() + '"'; //YQL to find place according to given text
	jQuery.ajax({ // Ajax call to Yahoo
				url : 'http://query.yahooapis.com/v1/public/yql?',
				data : {
					'format' : 'xml',	// Requesting XML response
					'q' : query
				},
				dataType : 'XML',
				success : function(data) {
					var html1 = '<ul>';
					$(data).find("place").each( //data is XML object and traversal of its nodes gives search results data
									function() {
										var place = $(this);
										var name = place.find('name').text();
										woeid = place.find('woeid').text();
										var admin1 = place.find('admin1')
												.text();
										var admin2 = place.find('admin2')
												.text();
												var placename = '';
										if (place.find('admin3').text() != null) {
											var admin3 = place.find('admin3')
													.text();
											placename = name + ' ' + admin3
													+ ' ' + admin2 + ' ' + admin1;
										}else{
										placename = name + ' ' + admin2
												+ ' ' + admin1 ;
										}
												
										html1 = html1 //html is created with the data and appended to existing html page
												+ '<li><a class="places" href="#" rel="'
												+ woeid
												+ '" rev="'
												+ name
												+ '" title="Click for to see a weather report">'
												+ placename + '</a></li>';
									});
					html1 = html1 + '</ul>';
					$("#cityname" + counter).empty();
					$('#cityname' + counter).append(html1);
					requestforecast(counter); // Weather forecast is requested upon click on hyperlink
				},
				error : function(errorThrown) {
					alert('error');
					console.log(errorThrown);
				}
			});
}
function createwoeiddiv(name, woeid, counter) {
	if (document.getElementById('CityDiv' + counter) != null) {
		$("#CityDiv" + counter).remove();
	}
	if (document.getElementById('CityDivHidden' + counter) != null) {
		$("#CityDivHidden" + counter).remove();
	}
	var newCityDiv = $(document.createElement('div')).attr("id",
			'CityDiv' + counter);
	newCityDiv.append('<label>' + counter + '. Enter city :</label>'
			+ '<input type="text" name="city' + counter + '" id="city'
			+ counter + '" value="' + name + '" ></div>');
	newCityDiv.appendTo("#CityGroup");

	var hiddenCityDiv = $(document.createElement('div')).attr("id",
			'CityDivHidden' + counter);
	hiddenCityDiv.append('<input type="hidden" name="hidden' + counter
			+ '" id="hidden' + counter + '" value="' + woeid + '" >');
	hiddenCityDiv.appendTo("#CityGroup");
}

function requestforecast(counter) {
	$("a.places").unbind('click');
	$("a.places").click(function(e) { //detects click of the hyperlink of place
						e.preventDefault();
						$("#cityname" + counter).empty();
						
						var woeidfinal = $(this).attr('rel');//based on click final woeid is got
						var address = $(this).attr('rev');
						if (counter > 0) {
							createwoeiddiv(address, woeidfinal, counter);
						}
						var query = 'select item.title,item.yweather:forecast,yweather:location,yweather:units,yweather:wind,item.yweather:condition from weather.forecast where woeid="'
								+ woeidfinal + '"';
						jQuery
								.ajax({// ajax request is sent to request weather forecast
									url : 'http://query.yahooapis.com/v1/public/yql?crossproduct=optimized&',
									data : {
										'format' : 'xml',// XML data is requested
										'q' : query
									},
									dataType : 'XML',
									success : function(forecast) {
										var i = 0;
										var html2 = '';
										var cname = '';
										var dir = '';
										var windspeed = '';
										var code = '';
										var date = '';
										var temp = '';
										var text = '';
										var dirstr = '';
										
										var code3 = '';
										var date3 = '';
										var day3 = '';
										var high3 = '';
										var low3 = '';
										var text3 = '';
										
										$(forecast).find("channel").each(function() {//forecast has all the weather data in it which is read and displayed
															i = i + 1;
															$("#forecast" + counter).empty();
															if (i == 2) {
																cname = $(this)
																		.find("yweather\\:location")
																		.attr("city");

																tempunit = $(this).find("yweather\\:units").attr("temperature");
																speedunit = $(this).find("yweather\\:units").attr("speed");
																dir = $(this).find("yweather\\:wind").attr("direction");
																windspeed = $(this).find("yweather\\:wind").attr("speed");

																code = $(this).find("yweather\\:condition").attr("code");
																date = $(this)
																		.find("yweather\\:condition").attr("date");
																temp = $(this).find("yweather\\:condition").attr("temp");
																text = $(this).find("yweather\\:condition").attr("text");
																
																
																code3 = $(this).find("yweather\\:forecast")
																		.attr("code");
																date3 = $(this).find("yweather\\:forecast")
																		.attr("date");
																day3 = $(this).find("yweather\\:forecast")
																		.attr("day");
																high3 = $(this).find("yweather\\:forecast")
																		.attr("high");
																low3 = $(this).find("yweather\\:forecast")
																		.attr("low");
																text3 = $(this).find("yweather\\:forecast")
																		.attr("text");

																if (dir > 0
																		&& dir < 90) {
																	dirstr = "NE";
																} else if (dir > 90
																		&& dir < 180) {
																	dirstr = "NW";
																} else if (dir > 180
																		&& dir < 270) {
																	dirstr = "SW";
																} else if (dir > 270
																		&& dir < 360) {
																	dirstr = "SE";
																} else if (dir == 0
																		|| dir == 360) {
																	dirstr = "E";
																} else if (dir == 90) {
																	dirstr = "N";
																} else if (dir == 180) {
																	dirstr = "W";
																} else if (dir == 270) {
																	dirstr = "S";
																}
															}
														});
										html2 = '<tr><td width="150px" align="right" style="background-image: url(http://l.yimg.com/a/i/us/nws/weather/gr/'
												+ code
												+ 'd.png);" 20px"; width="150px"; background-position:right 0px; background-repeat:no-repeat;"><div style="z-index: 2; position: relative; width: 200px; height: 150px;" id="today"><span style="font-size: 15px;"> <b>'
												+ cname
												+ '</b></span> <br /> <span style="font-size: 12px; color: #3a3c41">'
												+ date
												+ '</span> <br /> <span style="font-size: 12px">'
												+ text
												+ '</span><table><tr><td><span style="font-size: 30px"> <b>'
												+ temp
												+ '&deg;'
												+ tempunit
												+ ' </b></span><br/><span style="font-size: 12px; color: #62656d">WIND: </br>'
												+ dirstr
												+ ' at '
												+ windspeed
												+ ' '
												+ speedunit
												+ '</span></td></tr></table></div></div></td></tr>'
												+'<tr><td width="150px" align="right" style="background-image:url(http://l.yimg.com/a/i/us/nws/weather/gr/'
												+ code3
												+ 'd.png); height="20px"; width="150px"; background-position:right 0px; background-repeat:no-repeat;"><div style="z-index: 2; position: relative; width: 200px; height: 150px;" id="tomorrow"><span style="font-size: 15px;"> <b>Tomorrow</b></span> <br /> <span style="font-size: 12px; color: #3a3c41">'
												+ day3
												+ ', '
												+ date3
												+ '</span> <br /> <span style="font-size: 12px">'
												+ text3
												+ '</span><table><tr><td><span style="font-size: 18px"> <b>'
												+ high3
												+ '&deg;'
												+ tempunit
												+ ' </b></span> <span style="font-size: 12px">'
												+ low3
												+ '&deg;'
												+ tempunit
												+ ' </span></td></tr></table></div></div></td></tr>';
										$('#forecast' + counter).append(html2);
									},
									error : function(errorThrown) {
										alert('Error');
										console.log(errorThrown);
									}
								});
					});
}
function getdetailedforecast(fivelocwoeid) {
	$("#detailedforecasts").empty();
	var query = 'select item.yweather:forecast,yweather:location,item.yweather:condition,yweather:wind from weather.forecast where woeid in ('
			+ fivelocwoeid + ')';
	jQuery.ajax({// similar to earlier ajax calls this call requests weather data for multiple cities in one go
				url : 'http://query.yahooapis.com/v1/public/yql?crossproduct=optimized&',
				data : {
					'format' : 'xml',
					'q' : query
				},
				dataType : 'XML',
				success : function(detailedforecast) {
					var html3 = '';
					var cname = '';
					var dir = '';
					var windspeed = '';
					var dirstr = '';

					var code0 = '';
					var date0 = '';
					var day0 = '';
					var low0 = '';
					var high0 = '';
					var text0 = '';
					
					var code = '';
					var date = '';
					var high = '';
					var text = '';

					$(detailedforecast).find("channel:odd").each(
							function() {
									cname = $(this).find("yweather\\:location")
											.attr("city");
									dir = $(this).find("yweather\\:wind").attr(
											"direction");
									windspeed = $(this).find("yweather\\:wind")
											.attr("speed");
								
								code0 = $(this).find("yweather\\:forecast")
										.attr("code");
								date0 = $(this).find("yweather\\:forecast")
										.attr("date");
								day0 = $(this).find("yweather\\:forecast")
										.attr("day");
								high0 = $(this).find("yweather\\:forecast")
										.attr("high");
								low0 = $(this).find("yweather\\:forecast")
										.attr("low");
								text0 = $(this).find("yweather\\:forecast")
										.attr("text");
										
								code = $(this).find("yweather\\:condition")
										.attr("code");
								date = $(this).find("yweather\\:condition")
										.attr("date");
								temp = $(this).find("yweather\\:condition")
										.attr("temp");
								text = $(this).find("yweather\\:condition")
										.attr("text");



								if (dir > 0 && dir < 90) {
									dirstr = "NE";
								} else if (dir > 90 && dir < 180) {
									dirstr = "NW";
								} else if (dir > 180 && dir < 270) {
									dirstr = "SW";
								} else if (dir > 270 && dir < 360) {
									dirstr = "SE";
								} else if (dir == 0 || dir == 360) {
									dirstr = "E";
								} else if (dir == 90) {
									dirstr = "N";
								} else if (dir == 180) {
									dirstr = "W";
								} else if (dir == 270) {
									dirstr = "S";
								}
										html3 = '<table><tr style="margin-left: 200px"><td><b> Weather for '
												+ cname
												+ ' </b></td></tr><tr><td width="150px" align="right" style="background-image: url(http://l.yimg.com/a/i/us/nws/weather/gr/'
												+ code
												+ 'd.png);" 20px"; width="150px"; background-position:right 0px; background-repeat:no-repeat;"><div style="z-index: 2; position: relative; width: 200px; height: 150px;" id="today"><span style="font-size: 15px;"> <b>Today</b></span> <br /> <span	style="font-size: 12px; color: #3a3c41">'
												+ date
												+ '</span> <br /> <span style="font-size: 12px">'
												+ text
												+ '</span><table><tr>	<td><span style="font-size: 18px"> <b>'
												+ temp
												+ '&deg;'
												+ tempunit
												+ ' </b></span></td></tr></table></div></div></td>&nbsp;&nbsp;<td>&nbsp;&nbsp;</td>&nbsp;&nbsp;<td>&nbsp;&nbsp;</td>&nbsp;&nbsp;&nbsp;<td>&nbsp;&nbsp;&nbsp;</td>&nbsp;&nbsp;&nbsp;<td width="150px" align="right" style="background-image:url(http://l.yimg.com/a/i/us/nws/weather/gr/'
												+ code0
												+ 'd.png); height="20px"; width="150px"; background-position:right 0px; background-repeat:no-repeat;"><div style="z-index: 2; position: relative; width: 200px; height: 150px;" id="tomorrow"><span style="font-size: 15px;"> <b>Tomorrow</b></span> <br /> <span style="font-size: 12px; color: #3a3c41">'
												+ day0
												+ ', '
												+ date0
												+ '</span> <br /> <span style="font-size: 12px">'
												+ text0
												+ '</span><table><tr><td><span style="font-size: 18px"> <b>'
												+ high0
												+ '&deg;'
												+ tempunit
												+ ' </b></span> <span style="font-size: 12px">'
												+ low0
												+ '&deg;'
												+ tempunit
												+ ' </span></td></tr></table></div></div></td>';
										var newDetailedForecastDiv = $(document.createElement('div')).attr({"id":'detailedForecastDiv',"align":'center'});
										newDetailedForecastDiv.append(html3);
										newDetailedForecastDiv.appendTo("#detailedforecasts");
					
							});
				},
				error : function(errorThrown) {
					alert('Error');
					console.log(errorThrown);
				}
			});
}
