const { Servient, Helpers } = require("@node-wot/core");
const { HttpsClientFactory, HttpClientFactory } = require("@node-wot/binding-http");

const servient = new Servient();

servient.addClientFactory(new HttpClientFactory());
const WoTHelpers = new Helpers(servient);



servient.start()
.then(async (WoT) => {
	//http://192.168.1.122:8082/some-other-thing
	//http://192.168.1.197:8080/sensors/sensor3/index
	const tdFetch = await WoTHelpers.fetch("http://192.168.1.122:8082/some-other-thing");
	const thing = await WoT.consume(tdFetch);//td)
	console.log(thing);
	//console.log(await (await thing.readProperty("currentProductionRun")).value())

	//console.log(await thing.invokeAction("commissionCarProductionRun", newProd));
	let sub;
	let counter = 0;
	sub = await thing.observeProperty("status", (data) => data.value().then((value) => {
		console.log(value)
		counter++;
		if (counter === 4) {
			console.log("-----stopping-----")
			sub.stop()
		}
	}), (error) => console.log(error))
	//sub.stop()
})
.catch((err) => {
	console.error("WoT init error:", err);
});