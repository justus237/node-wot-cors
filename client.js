const servient = new Wot.Core.Servient();
const httpConfig = {
	allowSelfSigned: true
};
servient.addClientFactory(new Wot.Http.HttpClientFactory(httpConfig));
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
						.then((value) => {
							window.alert("successfully got value of read property:\n" + value)
							testActionWithWrongMethod()
							thing.invokeAction("testaction")
							.then(() => {
								thing.observeProperty("status", 
								(data) => data.value().then((value) => {console.log("property observation",value)}),
								(error) => console.log(error))
								thing.subscribeEvent("testevent", 
								(data) => data.value().then((value) => {console.log("event sub",value)}),
								(error) => console.log(error))
							})
						})
						.catch((error) => window.alert("failed to get value of read property\n" + error))
					})
					.catch((error) => window.alert("readProperty\n" + error));
				})
				.catch((error) => window.alert("consume TD\n" + error));
			})
			.catch((error) => window.alert("fetch TD\n" + error));
	});
	function testActionWithWrongMethod() {
		//code from https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#requests_with_credentials
		//simulate using a wrong HTTP method on an interaction affordance
		const invocation = new XMLHttpRequest();
		const url = document.getElementById("td_addr").value+"/actions/testaction";
		invocation.open("GET", url, true, "username", "password");
		invocation.setRequestHeader("Authorization", "Basic " + btoa("username:password"));
		console.log(invocation)
		//below line results in no preflight
		invocation.withCredentials = true;
		invocation.onreadystatechange = (ev) => console.log(ev);
		invocation.send();
	}
};