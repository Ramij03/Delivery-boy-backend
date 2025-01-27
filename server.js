const express = require('express')
const dotenv=require('dotenv')
const mongoose=require('mongoose')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

const authRouter=require('./routes/authRoute');
const userRouter=require('./routes/userRoute');
const restaurantRouter=require('./routes/restaurantRoute');
const categoryRouter=require('./routes/categoryRoute');
const foodRouter=require('./routes/foodRoute');
const cartRouter=require('./routes/cartRoute');

dotenv.config()

const admin = require('firebase-admin');
const serviceAccount=require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

mongoose.connect(process.env.MONGO_URL).then(()=>console.log("Database Connected")).catch((err)=>console.log(err))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use('/',authRouter);
app.use('/api/users',userRouter);
app.use('/api/restaurant',restaurantRouter);
app.use('/api/category',categoryRouter);
app.use('/api/foods',foodRouter);
app.use('/api/cart',cartRouter);

app.listen(process.env.PORT || port, () => console.log(`Delivery-Boy app listening on port ${process.env.PORT }!`))

