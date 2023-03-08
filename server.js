const { Servient, Helpers } = require("@node-wot/core");
const { HttpServer } = require("@node-wot/binding-http");
const httpConfig = {
	//serverKey: "server.key",
	//serverCert: "server.cert",
	security: {
		scheme: "basic", // (username & password)
	},
	port: 8082,
}

let thingDescriptionObject = {
	id: "urn:uuid:8b82d730-44af-4305-ba01-c487ff5af1a0",
	title: "some thing",
	description: "a description of the thing",
	securityDefinitions: {
		"basic_sc": {
			scheme: "basic", //nosec
		},
	},
	security: "basic_sc",
	properties: {
		"status": {
			"type": "string",
			"readOnly": true
		}
	},
	actions: {
		"testaction": {
			"title": "this will need to be POST",
			"description": "this is a test action"
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
const WoTHelpersServer = new Helpers(servient)

servient.start()
.then( async (WoT) => {
	const thing = await WoT.produce(thingDescriptionObject)
	thing.setPropertyReadHandler("status", async () => "testing")
	thing.setActionHandler("testaction", (params, options) => console.log("testaction called successfully"))
	await thing.expose()
	console.info(`${thing.getThingDescription().title} ready`)
})
.catch((err) => {
	console.log(err);
})