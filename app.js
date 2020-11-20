const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const app = express();
const _=require('lodash');
const { Logger } = require('mongodb');
const alert=require('alert');


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://admin-Taran:test123@cluster0.mkfwt.mongodb.net/bankDB',{useNewUrlParser:true,useUnifiedTopology:true});


const userSchema={
    customer_id:Number,
    name:String,
    email:String,
    balance:Number,
}
const transactionsSchema = {
    customer_id1: Number,
    name1: String,
    customer_id2: Number,
    name2: String,
    debit: Number,
    Status: String,
    Time: String
};
const User=mongoose.model('User',userSchema);
const Transaction=mongoose.model('Transaction',transactionsSchema);

const person1=new User({
    customer_id:1,
    name:"Tarandeep Singh",
    email:"sardaarji0015@gmail.com",
    balance:99900
});

const person2=new User({
    customer_id:2,
    name:"Gurtej Singh",
    email:"guri@gmail.com",
    balance:75000
});


const person3=new User({
    customer_id:3,
    name:"Damanjeet Singh",
    email:"djsingh1747@gmail.com",
    balance:7800
});


const person4=new User({
    customer_id:4,
    name:"Manpreet Singh",
    email:"mani@gmail.com",
    balance:9800
});


const person5=new User({
    customer_id:5,
    name:"Bikramjeet Singh",
    email:"bikram@gmail.com",
    balance:8500
});


const person6=new User({
    customer_id:6,
    name:"Simran Kaur",
    email:"sim@gmail.com",
    balance:330
});


const person7=new User({
    customer_id:7,
    name:"Gurnoor kaur",
    email:"gurnoor@gmail.com",
    balance:1250
});


const person8=new User({
    customer_id:8,
    name:"Diljit Dosanjh",
    email:"thisisdosanjh@gmail.com",
    balance:4500
});


const person9=new User({
    customer_id:9,
    name:"Jasmeet Kaur",
    email:"jassi@gmail.com",
    balance:7800
});


const person10=new User({
    customer_id:10,
    name:"Haleen Kaur",
    email:"Harleen@gmail.com",
    balance:9800
});

let defaultUsers = [person1, person2, person3, person4, person5, person6, person7, person8, person9, person10];


app.get('/',function(req,res){
    res.render('index');
});


app.get('/customers',function(req,res){
    User.find({},function(err,foundUsers){
        if(foundUsers.length===0){
            User.insertMany(defaultUsers,function(err){
                if (err)
                console.log(err);
            else
                console.log("Success");
        });
        res.redirect('customers');
    }
    else{
        res.render('customers',{fullList:foundUsers});
    }

});

});
app.use("/payment/:write_any_name_here", async function(req,res){
    try{
    const new1=req.params.write_any_name_here;
     console.log(new1);

     const userWhoWantToPay = await User.findOne({customer_id:new1})
     const users = await User.find({"customer_id":{$ne:new1}});

res.render("payment",{userWhoWantToPay:userWhoWantToPay,fullList:users});
    }
    catch(error){
        
        console.log(error);
    }
});

app.post('/transaction/:toid/:fromid', async function(req,res){
try{
    let fromUser = await User.findOne({customer_id: req.params.fromid})
    if(parseInt(req.body.amount) <= parseInt(fromUser.balance)){
        fromUser.balance = parseInt(fromUser.balance) - parseInt(req.body.amount);
        const updatedFromUser = await fromUser.save()
        let toUser = await User.findOne({customer_id: req.params.toid})
        toUser.balance = parseInt(toUser.balance) + parseInt(req.body.amount)
        var d = new Date();
        var time2 = d.toUTCString();
        var time = new Date(time2 + " UTC-5:30");
        var time3 = time.toUTCString().replace("GMT", "IST");
        console.log(time3);
        const updatedToUser =  await toUser.save()
        let newTransaction = new Transaction({
            customer_id1: req.params.fromid,
            name1:fromUser.name,
            customer_id2: req.params.toid,
            name2: toUser.name,
            debit: req.body.amount,
            Status: "Successful",
            Time: time3
})

const savedTransaction = await newTransaction.save();
alert('Payment Successful');
res.redirect('/customers');
    }
    else{
        let toUser = await User.findOne({customer_id: req.params.toid})
        var d = new Date();
        var time2 = d.toUTCString();
        var time = new Date(time2 + " UTC-5:30");
        var time3 = time.toUTCString().replace("GMT", "IST");
        let newTransaction = new Transaction({
            customer_id1: req.params.fromid,
            name1:fromUser.name,
            customer_id2: req.params.toid,
            name2: toUser.name,
            debit: req.body.amount,
            Status: "Failed,Not Sufficient Balance",
            Time: time3
})

const savedTransaction = await newTransaction.save();
        alert("Transaction Failed,Not Enough Balance");
        console.log("Transaction Not Possible ");
        res.redirect('/customers');
    }
}
catch(error){
    console.log(error);
}
});
app.get('/transaction',function (req,res){
    Transaction.find({},function(err,foundUsers){
        res.render('transaction',{fullList:foundUsers})
    });
});
app.get('/contact',function(req,res){
    res.render('contact');
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
    console.log("Server started ");
  });
  



  