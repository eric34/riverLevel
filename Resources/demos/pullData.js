// This sample is to show how to use hyrdoData.js and how the data is being returned

var getData = require('./hydroData').getData;

exports.create = function (win) {
    var button = Ti.UI.createButton({
    	title: 'BOOM',
    	top: 20,
    	layout: 'vertical',
    	color: 'black'
    });

    button.addEventListener('click', function() {
    	getData(function(data) {
            var textArea = Ti.UI.createTextArea({
            	borderRadius: 5,
            	borderWidth: 2,
            	borderColor: '#999',
            	backgroundColor: '#111',
            	color: 'yellow',
            	bottom: 40,
            	left: 10,
            	right: 10,
            	height: '85%',
            	font: {
            		fontFamily: 'courier',
            		fontSize: 15
            	},
                value: JSON.stringify(data, null, 4)
            });
            win.add(textArea);
    	});
    });

    win.add(button);
}

exports.initialize = function (chartsModule) {};
exports.cleanup = function() {};