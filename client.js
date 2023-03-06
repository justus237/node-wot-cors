const servient = new Wot.Core.Servient();
const httpConfig = {
	allowSelfSigned: true
};
servient.addClientFactory(new Wot.Http.HttpsClientFactory(httpConfig));
servient.addCredentials({
	"urn:uuid:8b82d730-44af-4305-ba01-c487ff5af1a0": {
		username: "username",
		password: "password",
	},
});
const helpers = new Wot.Core.Helpers(servient);
document.getElementById("fetch").onclick = () => {
	servient.start().then((WoT) => {
		helpers.fetch(document.getElementById("td_addr").value)
			.then((td) => {
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
	});
};