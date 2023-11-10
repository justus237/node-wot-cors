const { Servient, Helpers } = require("@node-wot/core");
const Mutex = require('async-mutex').Mutex;
const { HttpServer } = require("@node-wot/binding-http");
const httpConfig = {
	//serverKey: "server.key",
	//serverCert: "server.cert",
	/*security: {
		scheme: "basic", // (username & password)
	},*/
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
			"readOnly": false,
			"writeOnly":false,
			"observable": true
		}
	},
	actions: {
		"testaction": {
			"title": "this will need to be POST",
			"description": "this is a test action"
		},
		"testaction2": {
			"title": "blabla"
		}
	},
	events: {
		"testevent": {
			"type": "string"
		}
	}
}

const servient = new Servient();
/*servient.addCredentials({
	"urn:uuid:8b82d730-44af-4305-ba01-c487ff5af1a0": {
		username: "username",
		password: "password",
	},
})*/

servient.addServer(new HttpServer(httpConfig))
const WoTHelpersServer = new Helpers(servient)

servient.start()
.then( async (WoT) => {
	const thing = await WoT.produce(thingDescriptionObject)
	const mutex = new Mutex();
	thing.setPropertyReadHandler("status", async () => "testing")
	thing.setPropertyWriteHandler("status", (value) => {
		console.log("received write")}
		)
	thing.setActionHandler("testaction", async (params, options) => {
		await mutex.runExclusive(async () => {
			console.log("testaction called successfully")
			await new Promise(r => setTimeout(r, 5000));
		})
	})
	thing.setActionHandler("testaction2", async (params, options) => {
		await mutex.runExclusive(async () => {
			console.log("testaction2 called successfully")
			await new Promise(r => setTimeout(r, 5000));
		})
	})
	thing.setEventSubscribeHandler("testevent", () => "test success")
	await thing.expose()
	console.info(`${thing.getThingDescription().title} ready`)
	setInterval(() => thing.emitEvent("testevent", "test success"), 2000)
	setInterval(() => thing.emitPropertyChange("status"), 2000)
	while (true) {
		console.log("stuff")
	}
})
.catch((err) => {
	console.log(err);
})