const servient = new Wot.Core.Servient();
const httpConfig = {
	allowSelfSigned: true
};
servient.addClientFactory(new Wot.Http.HttpClientFactory(httpConfig));
const helpers = new Wot.Core.Helpers(servient);
const td = {
	"@context": [
	  "https://www.w3.org/2019/wot/td/v1",
	  {
		"htv": "http://www.w3.org/2011/http#",
		"saref": "https://w3id.org/saref#",
		"sosa": "http://www.w3.org/ns/sosa/",
		"iot": "http://iotschema.org/"
	  }
	],
	"@type": [
	  "saref:Sensor",
	  "sosa:Sensor",
	  "iot:Sensor",
	  "saref:Actuator",
	  "sosa:Actuator",
	  "iot:Actuator"
	],
	"title": "Linked LEGO Web of Things demonstrator",
	"securityDefinitions": {
	  "basic_sc": {
		"scheme": "basic"
	  }
	},
	"security": [
	  "basic_sc"
	],
	"actions": {
	  "commissionCarProductionRun": {
		"input": {
		  "type": "object",
		  "description": "describes the type of car to produce",
		  "properties": {
			"color": {
			  "description": "color of the cars in the production run",
			  "type": "string",
			  "enum": [
				"green",
				"red"
			  ]
			},
			"model": {
			  "description": "model of the car in the production run",
			  "type": "string",
			  "enum": [
				"Unibody"
			  ]
			},
			"quantity": {
			  "descirpiton": "number of cars to produce for the production run",
			  "type": "integer",
			  "minimum": 1
			},
			"transmission": {
			  "description": "manual or automatic",
			  "type": "string",
			  "enum": [
				"Manual",
				"Automatic"
			  ]
			}
		  },
		  "required": [
			"color",
			"model",
			"quantity",
			"transmission"
		  ]
		},
		"safe": false,
		"idempotent": false,
		"title": "Commission a car production run",
		"description": "Commission a car production run by specifying color, model and transmission type (limited to one car)",
		"forms": [
		  {
			"href": "https://solid.iis.fraunhofer.de/linkedLEGO/productionRunQueue/",
			"contentType": "application/json",
			"op": [
			  "invokeaction"
			],
			"htv:methodName": "POST"
		  }
		]
	  }
	},
	"id": "urn:uuid:64e0cf85-26e7-46ea-9fe7-7cf60160d194",
	"description": "A LEGO mindstorms factory for car part collection (no assembly obviously).",
	"properties": {
	  "status": {
		"title": "status",
		"observable": false,
		"readOnly": true,
		"description": "the status",
		"type": "string",
		"forms": [
		  {
			"op": [
			  "readproperty"
			],
			"href": "https://solid.iis.fraunhofer.de/linkedLEGO/LastSeen"
		  }
		]
	  }
	}
  }
document.getElementById("fetch").onclick = () => {
	servient.start().then((WoT) => {
		console.log(td);
		WoT.consume(td)
		.then((thing) => {
			thing.readProperty("status")
			.then((status) => {
				status.value()
				.then((value) => window.alert("successfully got value of read property:\n" + value))
				.catch((error) => window.alert("failed to get value of read property\n" + error))
			})
			.catch((error) => window.alert("readProperty\n" + error));
		})
		.catch((error) => window.alert("consume TD\n" + error));
	})
	.catch((error) => window.alert("fetch TD\n" + error));
};