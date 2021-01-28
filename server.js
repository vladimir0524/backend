let express = require('express');
let mongoose = require('mongoose');
let cors = require('cors');
let bodyParser = require('body-parser');
let dbConfig = require('./database/db');
const passport = require("passport");


const userRoute = require('./router/userRouter')
const adminRoute = require('./router/adminRouter')

//connecting mongoDB Database

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
    useUnifiedTopology : true,
    useNewUrlParser: true
}).then(() => {
    console.log("database successfully connected")
},
error => {
    console.log('could not connect to database:' + error)
}
)

const app = express();

require("./database/passport")(passport);
app.use(express.static(__dirname + '/uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(cors());
app.use(passport.initialize());
app.use('/userControl', userRoute)
app.use('/adminControl', adminRoute)

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
console.log('connect to port'+port)
})

app.use((req, res, next) =>{
    next(createError(404));
});

app.use(function (err, req, res, next) {
    console.error(err.message);
    if(!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});