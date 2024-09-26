const express =require('express');
const { create } = require('../stdioSide/customerManager/tutorial');
const { getEventCode } = require('../../controller/customerSide');
const router = express.Router();


//customerRequests
router.get("/events/:eventcode",getEventCode );



module.exports =router ;