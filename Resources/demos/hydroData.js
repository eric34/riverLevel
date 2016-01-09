exports.getData = getData;

function getData(cb) {
    var url = 'http://water.weather.gov/ahps2/hydrograph_to_xml.php?gage=gsjc1&output=xml';
    var hyrdoData = {
        sigstages: {},
        observed: [],
        forecast: []
    };

    var client = Ti.Network.createHTTPClient({
        onload: function(e) {
            var nodes = this.responseXML.getChildNodes();
            for(var i = 0; i < nodes.getLength(); i++) {
                var node = nodes.item(i); // parent nodes
                var childNodes = node.getChildNodes(); // children nodes of the parents

                switch(node.getNodeName()) {
                    case 'sigstages':
                        for(var sigstagesIndex = 0; sigstagesIndex < (childNodes.getLength() - 1); sigstagesIndex++) {
                            var someVal = childNodes.item(sigstagesIndex).getChildNodes().item(0);

                            // need to check because there are empty nodes in sigstages
                            if(someVal) {
                                switch(sigstagesIndex) {
                                    // action value
                                    case 1:
                                        hyrdoData.sigstages.action = someVal.getTextContent();
                                    break;

                                    // bankfull value
                                    case 2:
                                        hyrdoData.sigstages.bankfull = someVal.getTextContent();
                                    break;

                                    // flood value
                                    case 3:
                                        hyrdoData.sigstages.flood = someVal.getTextContent();
                                    break;
                                }
                            }
                        }
                    break;

                    case 'observed':
                        // oldest data is at the end of the array, so need to walk backwards
                        for(var observedIndex = (childNodes.getLength() - 1); observedIndex >= 0; observedIndex--) {
                            var datum = childNodes.item(observedIndex);
                            var vals = datum.getChildNodes(); // values of the <datum> node in the <observed> node
                            var observedData = {
                                time: '',
                                primary: '',
                                secondary: ''
                            };

                            for(var valIndex = 0; valIndex < vals.getLength(); valIndex++) {
                                var valNode = vals.item(valIndex),
                                    valName = valNode.getNodeName(),
                                    valText = valNode.getTextContent(); // the actual value between the tags

                                switch(valName) {
                                    // this is actually the time
                                    case 'valid':
                                        observedData.time = new Date(valText).toString();
                                    break;

                                    case 'primary':
                                        observedData.primary = valText;
                                    break;

                                    case 'secondary':
                                        observedData.secondary = valText;
                                    break;

                                }
                            }
                            hyrdoData.observed.push(observedData);
                        }
                    break;

                    case 'forecast':
                        // at index 0, data starts the next day and onwards. so, just need to walk the data starting at index 0
                        for(var forecastIndex = 0; forecastIndex < (childNodes.getLength() - 1); forecastIndex++) {
                            var datum = childNodes.item(forecastIndex);
                            var vals = datum.getChildNodes(); // values of the <datum> node in the <observed> node
                            var forecastData = {
                                time: '',
                                primary: '',
                                secondary: ''
                            };

                            for(var valIndex = 0; valIndex < vals.getLength(); valIndex++) {
                                var valNode = vals.item(valIndex),
                                    valName = valNode.getNodeName(),
                                    valText = valNode.getTextContent(); // the actual value between the tags

                                switch(valName) {
                                    // this is actually the time
                                    case 'valid':
                                        forecastData.time = new Date(valText).toString();
                                    break;

                                    case 'primary':
                                        forecastData.primary = valText;
                                    break;

                                    case 'secondary':
                                        forecastData.secondary = valText;
                                    break;

                                }
                            }
                            hyrdoData.forecast.push(forecastData);
                        }
                    break;
                }
            }

            // return the data back to the callback
            cb(hyrdoData);
        },

        onerror: function(e) {
            alert('Error making request: ' + e.error);
        },

        timeout: 5000 // in milliseconds
    });

    client.open("GET", url);
    client.send();
}