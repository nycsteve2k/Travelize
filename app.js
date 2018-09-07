var express         = require("express"),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    mongoose        = require("mongoose");

mongoose.connect("mongodb://localhost/travelize");

//SCHEMA SETUP
var locationSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    price: String
});

//LOCATION MODEL - DB
var Location = mongoose.model("Location", locationSchema);

// Location.create(
//     {
//         name: "Croatia",
//         image: "https://images.pexels.com/photos/286758/pexels-photo-286758.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
//         description: "Small Island Paradise lorem ipsum goes here",
//         price: "399.99"
//     }, function(err, location){
//         if(err){
//             console.log(err);
//         } else {
//             console.log("Newly created location: ");
//             console.log(location);
//         }
//     }
// );

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));


//============================
//     ROUTES
//============================

//GET - LANDING PAGE
app.get("/", function(req, res){
    res.render("index");
});

//INDEX -- GET - ALL LOCATIONS PAGE
app.get("/locations", function(req,res){
    //get ALL locations from DB
    Location.find({}, function(err, allLocations){
        if(err){
            console.log(err);
        } else {
            //render page
            res.render("locations", {locations: allLocations});
        }
    });
});

//CREATE -- POST - ADD LOCATION TO DB
app.post("/locations", function(req,res){
    //get data from form and add location(data) to DB
    var newLocation = req.body.location;
        //Create a new Campground and Save to DB
    Location.create(newLocation, function(err,newlyCreated){
        if (err){
            console.log(err);
        } else {
            res.redirect("/locations");
        }
    });
});

//NEW -- GET - LOCATION FORM
app.get("/locations/new", function(req,res){
   res.render("new"); 
});

//SHOW -- GET - SHOW LOCATION PAGE: ID
app.get("/locations/:id", function(req,res){
    //find info for one record using ID
    Location.findById(req.params.id, function(err, foundLocation){
        if(err){
            console.log(err);
        } else {
            res.render("show", {location: foundLocation})
        }
    });
});

//EDIT -- GET
app.get("/locations/:id/edit", function(req,res){
   //find info for one record using ID
   Location.findById(req.params.id, function(err,foundLocation){
       if(err){
           console.log(err);
       } else {
           //show edit form 
           res.render("edit", {location: foundLocation});
       }
   });
});

//UPDATE --PUT
app.put("/locations/:id", function(req,res){
    //Find post and update with new data
    Location.findByIdAndUpdate(req.params.id, req.body.location, function(err, updatedLocation){
        if(err){
            res.redirect("/locations");
        } else {
            res.redirect("/locations/" + req.params.id);
        }
    });
});

//DESTROY --DELETE
app.delete("/locations/:id", function(req,res){
    //Destroy location
    Location.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/locations");
        } else {
            res.redirect("/locations");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server ON: Travelizing");
});