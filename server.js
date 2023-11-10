const { Servient, Helpers } = require("@node-wot/core");
const { HttpServer, MqttBrokerServer } = require("@node-wot/binding-http");
const httpConfig = {
	serverKey: "server.key",
	serverCert: "server.cert",
	security: {
		scheme: "basic", // (username & password)
	},
	port: 8082,
	//baseUri: "https://solid.iis.fraunhofer.de/linkedLEGO",
}

const httpConfigTwo = {
	port: 8083,
}

let thingDescriptionObject = {
	id: "urn:uuid:8b82d730-44af-4305-ba01-c487ff5af1a0",
	title: "some thing",
	description: "a description of the thing",
	base: "http://solid.iis.fraunhofer.de/linkedLEGO",
	securityDefinitions: {
		"basic_sc": {
			scheme: "basic", //nosec
		},
	},
	security: "basic_sc",
	properties: {
		"status": {
			"type": "string",
			"readOnly": false,
			"writeOnly":false,
			"observable": true
		}
	},
	actions: {
		"testaction": {
			"title": "this will need to be POST",
			"description": "this is a test action"
		}
	},
	events: {
		"testevent": {
			"type": "string"
		}
	}
}

const servient = new Servient();
servient.addCredentials({
	"urn:uuid:8b82d730-44af-4305-ba01-c487ff5af1a0": {
		username: "username",
		password: "password",
	},
})

servient.addServer(new HttpServer(httpConfig))
servient.addServer(new HttpServer(httpConfigTwo))
const WoTHelpersServer = new Helpers(servient)

servient.start()
.then( async (WoT) => {
	const thing = await WoT.produce(thingDescriptionObject)
	thing.setPropertyReadHandler("status", async () => "testing")
	thing.setPropertyWriteHandler("status", (value) => console.log("received write"))
	thing.setActionHandler("testaction", (params, options) => console.log("testaction called successfully"))
	thing.setEventHandler("testevent", () => "test success")
	Helpers.setStaticAddress("solid.iis.fraunhofer.de")
	console.log(servient.getServers())
	await thing.expose()
	console.info(`${thing.getThingDescription().title} ready`)
	setInterval(() => thing.emitEvent("testevent", "test success"), 2000)
	setInterval(() => thing.emitPropertyChange("status"), 2000)
})
.catch((err) => {
	console.log(err);
})