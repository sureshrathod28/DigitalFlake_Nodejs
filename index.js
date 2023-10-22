const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const bodyParser = require('body-parser')
let cors = require('cors')
const app = express()
const userRoute=require('./router/userRouter')
const categoryRoute=require('./router/categoryRouter')
const productRoute=require("./router/newProductRouter")
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log(`Data base connected successfully`)
}).catch(err => console.log(err))
app.use(cors())
// app.use('/userpost', postapp);
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }))
app.use(bodyParser.json())
app.use('/', userRoute)
app.use('/',categoryRoute)
app.use('/',productRoute)
// app.use('/', postRouter)
// app.get('/', (req, res) => {
//     res.send(`Hello from server!!!`)
// })

app.listen(process.env.port, () => {
    console.log('Server is running')
})


/*"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MzM1OGFlZThmNDAyNDI5MTdiOTExYyIsImVtYWlsIjoic3VyZXNoNTQzMjFAZ21haWwuY29tIiwiaWF0IjoxNjk3ODYzODc0fQ.ZMnIw-4ryXtj3WKDtjKGayAMxxYL0Pv1IHh6GniJ_k4" */