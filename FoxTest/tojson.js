var fs = require('fs')

//read the original html file
fs.readFile(__dirname + '/test.html', 'utf8', function(err, html){
	if (err) throw err;
	//then we can work on the parsing

	//First we declare all the Regex needed to parse each part of the html

	//productDetails selects the table where we can find the information about
	// the journey (dep. and arrival time, dep. and arrival station, 
	//train number, train type, journeytype)
	var productDetails=/product-details(.*?)table>/g
	var typeOfTrip = /Aller|Retour/g
	var trainTimeParser = /\d{2}h\d{2}/g
	var stations=/((([A-Z]{2,}\s){1,}){1,})?([A-Z]{2,})/g
	var trainNumber = /\d{4}(?=\s)/g

	//dateParser selects the date on the page
	var dateParser = /\d{2}\/\d{2}\/\d{4}/g

	//for the PNR, we first select the block where the PNR is
	var pnrRefBlock = /pnr-ref(.*?)td>/g
	//and then the proper PNR only
	var pnrRef = /[A-Z]{6}/g

	//we do the same for the name associated with the PNR
	var pnrNameBlock = /pnr-name(.*?)td>/g
	var nameRef = /[a-z]{1,}(?=\s<)/g

	//this regex selects all the prices on the page
	var price=/\d{1,},\d{1,}(?=\s€)/g

	//this regex selects all the passengers for one trip
	var passengerPerTrip = /passengers(.*?)table>/g

	//this selects the age of the passengers
	var passengersAge = /\(\d{1,2}\sà\s\d{1,2}\sans\)/g

	//this selects the type of the ticket
	var fare = /Billet\séchangeable/g
	

	//prices is an array with all the prices on the page
	var prices = html.match(price)
	//the amount paid is the last one
	//we parse it to get a number
	var totalprice = parseFloat(prices[prices.length-1].replace(',', '.'))

	//datesNoFormat is an array with the dates of each trip and the booking date
	var datesNoFormat = html.match(dateParser)

	//we do a format transformation to get the date with the proper format
	//we also apply an offset to get the proper time to avoid timezone issues
	var dates = datesNoFormat.map((el)=>{
		var jour = el.slice(0,2)
		var mois = el.slice(3,5)
		var rest = el.slice(5,el.length)
		var changeFormat = mois+'/'+jour+rest

		var tzoffset = new Date(changeFormat).getTimezoneOffset()*60000
		
		return new Date(new Date(changeFormat)-tzoffset).toISOString().replace('T',' ')
	})
	//the first date is actually the date of the booking so we don't need it
	dates.shift()

	//this is an array with all the blocks where a PNR is
	var pnrListBlock=html.match(pnrRefBlock)
	//we now get the proper PNR
	var pnrList = pnrListBlock.map(el=>el.match(pnrRef))

	//same with the name of the booking
	var nameListBlock=html.match(pnrNameBlock)
	var nameList = nameListBlock.map(el=>el.match(nameRef))

	//this is an array with all the passengers for each trip
	var passengersBlocks = html.match(passengerPerTrip)

	//this is an array with the passengers and their fare type for each trip
	var passengersList = passengersBlocks.map(el=>{
		return {"age": el.match(passengersAge),"type":el.match(fare)}
	})

	//we then need to format it 
	var passengersJsonArray=[]
	for (var i = 0; i < passengersList.length; i++) {
		var temp = []
		for (var j = 0; j < passengersList[i].age.length; j++) {
			if(passengersList[i].type){
				temp.push({
					"type":passengersList[i].type[j].match(/échangeable/),
					"age":passengersList[i].age[j]
				})
			}
			
		}
		passengersJsonArray.push(temp)
	}

	//this is an array with all the blocks filled with the details of each trip
	var productList = html.match(productDetails)

	//we can now create the roundTrips array with all the trip details 
	var roundTrips = productList.map((el,i)=>{
		var obj = 
		{
			"type":el.match(typeOfTrip)[0],
			"date":dates[i],
			"trains": [
				{
					"departureTime": el.match(trainTimeParser)[0].replace('h',':'),
					"departureStation": el.match(stations)[0],
					"arrivalTime": el.match(trainTimeParser)[1].replace('h',':'),
					"arrivalStation": el.match(stations)[el.match(stations).length-1],
					"type":el.match(stations)[1],
					"number": el.match(trainNumber)[0],
					"passengers": passengersJsonArray[i]
				}
			]
		}
		return obj
	})

	//we now create the final object with general data such as PNR and name of the booking
	var obj = {
		"status": "ok",
		"result": {
		  "trips": [
			{
				"code": pnrList[pnrList.length-1][0],
				"name": nameList[nameList.length-1][0],
				"details":{
					"price": totalprice,
					"roundTrips":roundTrips
				}
			}
		  ],
		  "custom": {
			"prices": []
		  }
		}
	}

	//the last part is to fill the custom prices section
	//we already have the total amount paid so we delete the last 2 prices on the list
	prices = prices.slice(0,prices.length-2)

	obj['result']["custom"]["prices"] = prices.map(el=>{
		return {"value": parseFloat(el.replace(',', '.'))}
	})
	console.log(obj)

	//we add the proper format for the json 
	json = JSON.stringify(obj, null, 2)

	//and then we create the final json file
	fs.writeFile('result.json', json, 'utf8');
	console.log(json)
})
