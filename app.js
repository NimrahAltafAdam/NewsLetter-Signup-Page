//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const client = require("@mailchimp/mailchimp_marketing");

const app = express();

app.use(express.static("public")); // To link Static files like styles.css to the server
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req,res) {
  res.sendFile(__dirname + "/signup.html");
})

client.setConfig({
  apiKey: "bbc03c1542173a37d4a7be944211732b-us1",
  server: "us1",
});

app.post("/", function(req,res) {

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  console.log(firstName, lastName, email);
 //*

  const listId = "fe3597e854";

  const subscribingUser = {
  firstName: firstName,
  lastName: lastName,
  email: email
  };

  //Uploading the data to the server
  const run = async () => {
    try {
      const response = await client.lists.addListMember("fe3597e854", {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName
        }
      });
      console.log(response); // (optional)
      res.sendFile(__dirname + "/success.html");
    }catch (err) {
      console.log("====== ERROR ======");
      console.log(JSON.parse(err.response.error.text).detail);
      res.sendFile(__dirname + "/failure.html");
    }
  };
  run();
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});
//TEST LOCALLY AND DEPLOY TO HEROKU
app.listen(process.env.PORT || 3000, function(){
  console.log("The server is running on port 3000");
});


//   const data = {
//     member: [
//       {
//         email_address: email,
//         status: "subscribed",
//         merge_feilds: {
//           FNAME: firstName,
//           LNAME: lastName,
//         }
//       }
//     ]
//   };
//
//   const jsonData = JSON.stringify(data)
//
//   const url = 'https://us1.api.mailchimp.com/3.0/lists/fe3597e854'
//
//   const options = {
//     method: "POST",
//     auth: "Nimrah:bbc03c1542173a37d4a7be944211732b-us1 " //MAKE SURE YOUR REGION 'US1' MATCHES WITH THE ONE IN THE URL
//   }
//
//   const request = https.request(url,options, function(response) {
//
//     if (response.statusCode === 200) {
//       res.send("Successfully submitted")
//     } else {
//       res.send("There was an error with signing up, please try again later!")
//     }
//     response.on("data", function(data){
//       console.log(JSON.parse(data));
//     })
//   })
//
//   request.write(jsonData);
//   request.end();
// });

//-d '{"name":"","contact":{"company":"","address1":"","address2":"","city":"","state":"","zip":"","country":"","phone":""},"permission_reminder":"","use_archive_bar":false,"campaign_defaults":{"from_name":"","from_email":"","subject":"","language":""},"notify_on_subscribe":"","notify_on_unsubscribe":"","email_type_option":false,"visibility":"pub","double_optin":false,"marketing_permissions":false}'


//API Key
//bbc03c1542173a37d4a7be944211732b-us1
//fe3597e854

//NOTES
//*-console.log(firstName, lastName, email); always use console log to check whether the server is receiving the data that we input on the website
//Previuosly in weather API We used https to get data from the external resource but in this case we want to post data to an external resource
//COMMAND TO RUN IN ORDER TO LAUNCH THE APP
