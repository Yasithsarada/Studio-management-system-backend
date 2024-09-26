const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser'); 
require('dotenv').config();
const socketIo = require('socket.io');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); 
app.use(bodyParser.json());
const PORT=5000

const db = require('./config/db.config.js');
db.sequelize.sync();


const { createCustomerRequest, createCustomerRequestOnline } = require('./controller/studioSide/customerManager/customerRequest.js');
const customerManagerRouter=require("./router/stdioSide/customerManager/index.js");
const eventMangerRouter = require('./router/stdioSide/eventManager/eventManager.js')
const employeeManagerRouter = require('./router/stdioSide/employeeManager/employee.js')
const superAdminRouter = require('./router/stdioSide/superAdmin/index.js');
const customerRouter = require('./router/customerSide/index.js');
const userRouter = require('./router/userRouter.js');

const { notFound, errorHandler } = require('./middleware/errorHandler.js');

app.use("/customerManager",customerManagerRouter)
app.use("/eventManager", eventMangerRouter)
app.use("/employeeManager", employeeManagerRouter)
app.use('/superAdmin', superAdminRouter);
app.use('/customer',customerRouter );
app.use('/', userRouter);


// const { notFound, errorHandler } = require('./middleware/errorHandler.js');





const server = app.listen(PORT, () => console.log(`App started on port: ${PORT}`));

// Set up Socket.IO
const io = socketIo(server,{
    pingTimeout: 60000,
    cors: {
     origin: ["http://localhost:3000",'http://localhost:3001']
    }});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('customerRequest',async (req) => {
    // console.log('customer request',req);
    const data=await createCustomerRequestOnline(req)
    console.log(req,data);
    io.emit("customerRequest",data)
  })
});

//error handling middlewares
app.use(notFound)
app.use(errorHandler)
