var win = Ti.UI.createWindow({backgroundColor: "white"});

var data = [];

var url = 'http://rss.cnn.com/services/podcasting/newscast/rss.xml';

var xhr = Titanium.Network.createHTTPClient();
	
xhr.onload = function()
	{
		// Twitter does not offer an XML API any more.
		// This test has been modified to use, and display attributes from, a different XML file.

		//Ti.API.info('www.w3schools.com/xml/note.xml ' + this.responseXML + ' text ' + this.responseText);
		Ti.API.info('http://water.weather.gov/ahps2/hydrograph_to_xml.php?gage=gsjc1&output=xml'+ this.responseXML + ' text ' + this.responseText);

		var doc = this.responseXML.documentElement,
			elements = doc.getElementsByTagName("primary"),
			primary = elements.item(0);
		Ti.API.info("primary = " + primary.nodeValue);
		
		var primaryLabel = Ti.UI.createLabel({
			textAlign:'center',
			height:'auto',
			width:'auto',
			top:20,
			text:primary.textContent
		});
		win.add(primaryLabel);		

		var textarea = Ti.UI.createTextArea({borderRadius:5,borderWidth:2,borderColor:'#999',backgroundColor:'#111',color:'yellow',bottom:10,left:10,right:10,height:300,font:{fontFamily:'courier',fontSize:10}});
		textarea.value = this.responseText;
		win.add(textarea);
	};

	xhr.onerror = function(e) {
		Ti.API.info('error:'+e.error);
	};
	
	// open the client
	xhr.open('GET', 'http://water.weather.gov/ahps2/hydrograph_to_xml.php?gage=gsjc1&output=xml');
	
	// send the data
	xhr.send();
	
win.open();
