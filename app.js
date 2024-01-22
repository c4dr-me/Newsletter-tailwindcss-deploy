const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
require("dotenv").config();
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("assets"));
//providing path for static files in this case stylesheet for tailwindcss

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000");
});

const apiKey = process.env.API_KEY;
const listID = process.env.LIST_ID;

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});


app.post("/", function (req, res) {
  const fname = req.body.firstName;
  const lname = req.body.lastName;
  var mail = req.body.email;
  console.log("Form Data:", { fname, lname, mail });

  const data = {
    members: [
      {
        email_address: mail,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname,
        },
      },
    ],
  };

  console.log(mail);
    const jsonData = JSON.stringify(data);
    // console.log("JSON Payload:", jsonData);

  const url = "https://us21.api.mailchimp.com/3.0/lists/" + listID;

  const options = {
    method: "POST",
    auth: "c4dr:" + apiKey,
  };

  const request = https.request(url, options, function (response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(data);
    });
  });
  console.log(request);
  request.write(jsonData);
  request.end();

  app.post("/failure", function(req, res){
    res.redirect("/");
  });
});
