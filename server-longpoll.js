const { Servient, Helpers } = require("@node-wot/core");
const { HttpServer } = require("@node-wot/binding-http");
const httpConfig = {
	port: 8082,
}


let thingDescriptionObject = {
	id: "urn:uuid:8b82d730-44af-4305-ba01-c487ff5af1a1",
	title: "some other thing",
	description: "a description of the thing",
	securityDefinitions: {
		"nosec_sc": {
			scheme: "nosec", //nosec
		},
	},
	security: "nosec_sc",
	properties: {
		"status": {
			"type": "string",
			"readOnly": true,
			"observable": true
		}
	}
}

const servient = new Servient();


servient.addServer(new HttpServer(httpConfig))
const WoTHelpersServer = new Helpers(servient)

servient.start()
.then( async (WoT) => {
	const thing = await WoT.produce(thingDescriptionObject)
	thing.setPropertyReadHandler("status", async () => "testing")
	thing.setPropertyObserveHandler("status", async () => console.log("observing"))
	await thing.expose()
	console.info(`${thing.getThingDescription().title} ready`)
	setInterval(() => thing.emitPropertyChange("status"), 2000)
})
.catch((err) => {
	console.log(err);
})