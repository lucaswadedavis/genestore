
// These two lines are required to initialize Express in Cloud Code.
var express = require('express');

var creds = require('cloud/creds');
var fauxPoe = require('cloud/faux-poe.js');
var Mandrill = require('mandrill');
Mandrill.initialize(creds.mandrill );


var app = express();

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body

// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/hello', function(req, res) {
  res.render('hello', { message: 'Congrats, you just set up your app!' });
});


var app = express();
app.use(express.bodyParser());
app.post('/test', express.basicAuth(creds.parseUsername, creds.parsePassword), function(req, res) {
  res.json({ message: req.body.message });  // Send a JSON response
});

app.get('/test', 
  express.basicAuth('fauxUser', 'fauxPass'), 
  function(req, res) {
    var manyPoems=[];
    for (var i=0;i<100;i++){
      manyPoems.push(fauxPoe() );
    }
    
    Mandrill.sendEmail({
      message: {
        text: manyPoems.join("\n\n"),
        subject: "Faux Poe",
        from_email: "parse@cloudcode.com",
        from_name: "Faux Poe",
        to: [
          {
            email: "lucaswadedavis@gmail.com",
            name: "Luke"
          }
        ]
      },
      async: true
    },{
      success: function(httpResponse) {
        console.log(httpResponse);
        response.success("Email sent!");
      },
      error: function(httpResponse) {
        console.error(httpResponse);
        response.error("Uh oh, something went wrong");
      }
    });

  res.send("success"); // Send a JSON response
});

/* 
app.get('/cburl', function(req, res){
  res.send(200);
});
*/

app.listen();

// // Example reading from the request query string of an HTTP get request.
// app.get('/test', function(req, res) {
//   // GET http://example.parseapp.com/test?message=hello
//   res.send(req.query.message);
// });

// // Example reading from the request body of an HTTP post request.
// app.post('/test', function(req, res) {
//   // POST http://example.parseapp.com/test (with request body "message=hello")
//   res.send(req.body.message);
// });

// Attach the Express app to Cloud Code.
app.listen();
