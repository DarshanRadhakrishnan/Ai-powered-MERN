const express=require("express")
const connectDb=require("../backend/config/dbconnect")
const route=require("../backend/routes/orderRoutes")
const app=express();
connectDb()
const PORT=process.env.PORT||5000
app.use(express.json())
app.use("/order",route)
app.listen(PORT,()=>{
    cpnsole.log(`listening to port ${PORT}`)
})