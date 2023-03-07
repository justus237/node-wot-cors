# node-wot-cors
Testing the CORS implementation of ```node-wot```:
  - Start the server ```server.js``` on a separate network host
  - Open ```index.html``` on the main host in a browser, enter the TD location (i.e. https://other_host_name:8082/some-thing)
  - If CORS were implemented correctly and allowed for, e.g., localhost, the request would not fail
