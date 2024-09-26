const asyncHandler = require("express-async-handler");
const db = require("../../../config/db.config");
const {
  findAll,
} = require("../../../router/stdioSide/customerManager/tutorial");
const { Op, Sequelize } = require("sequelize");
const moment = require("moment");
const CustomerPayment = db.customerPayments;
const Customer = db.customers;
const Events = db.events;
const Services=db.services
exports.createPayment = asyncHandler(async (req, res) => {
  const {
    description,
    customerName,
    customerMobilePhone,
    eventId,
    payment,
    offers,
    amount,
    type,
    status,
  } = req.body;

  try {
    const pay = {
      description,
      customerName,
      customerMobilePhone,
      eventId,
      payment,
      offers,
      amount,
      type: type || "offline",
      status: status || "full",
    };
    console.log(pay);
    const data = await CustomerPayment.create(pay);

    console.log("create payment", data);
    res.status(200).json(data);
  } catch (error) {
    res.status(400);
    console.log("error", error, "error");
    throw new Error(
      error.message || "Some error occurred while creating the Customer"
    );
  }
});

exports.getCustomerPayment = asyncHandler(async (req, res) => {
  const page = req.params.page;
  let limit = 4;
  let offset = limit * (page - 1);
  console.log("lmit", limit, offset);
  try {
    const data = await CustomerPayment.findAndCountAll({
      limit: limit,
      offset: offset,
    });
    // console.log(data.count)
    res.status(200).json(data);
  } catch (error) {
    res.status(400);
    throw new Error(error.message || "can't get Customer");
  }
});


exports.getPayment = asyncHandler(async (req, res) => {
  try {
    // Get today's date in YYYY-MM-DD format
    const todayStart = moment().startOf('day').toDate();
    const todayEnd = moment().endOf('day').toDate();

    console.log(todayStart, todayEnd);

    // Find all customer payments for today
    const data = await CustomerPayment.findAndCountAll({
      where: {
        createdAt: {
          [Op.between]: [todayStart, todayEnd],
        },
      },
    });

    // Calculate the total payment
    const totalPayment = data.rows.reduce(
      (total, payment) => total + payment.payment,
      0
    );
    // Get unique customers
    const uniqueCustomers = new Set(
      data.rows.map((payment) => payment.customerMobilePhone)
    );

    // Count of unique customers
    const uniqueCustomerCount = uniqueCustomers.size;

    console.log(data.rows);
    res.status(200).json({ totalPayment, uniqueCustomerCount });
  } catch (error) {
    res.status(400);
    throw new Error(error.message || "can't get Customer payments");
  }
});


exports.getCustomerPaymentDetails = asyncHandler(async (req, res) => {
  const id = req.params.id;
  console.log(id);

  try {
    const data = await CustomerPayment.findOne({
      where: { id: id },
      include: [
        {
          model: Events,
          include: [
            {
              model: Services,
            },
          ],
        },
      ],
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(400);
    throw new Error(error.message || "can't get Customer");
}
})

exports.getSearchPayment=asyncHandler(async(req,res)=>{
    const query=req.query.search;
    const page = req.query.page;
    let limit=4;
    let offset=limit*(page-1)
   console.log(req.query,query,page)
  // const date = moment(new Date("2024-02-02T09:16:22.103Z"), 'MM-DD-YYYY')
   // const parsedDate = moment(req.query.date, 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    // console.log(req.query.date,date)
    try {
        const data =await CustomerPayment.findAndCountAll({
            attributes: ['id', 'amount','payment','createdAt','status'],
            include: [
              {
                model: Customer,
                attributes: ['id','firstname', 'mobilePhone','email'],
                where: {

                    [Op.or]: [
                        { mobilePhone: query },
                        { email: query },
                       
                      ]

                    // [Op.and]:[{
                    // [Op.or]: [
                    //     { mobilePhone: query },
                    //     { email: query },
                       
                    //   ]},{
                    //   createdAt: date && {
                    //     $gt: date.toDate(),
                    //     $lt: date.add(1, 'days').toDate()
                    //   }
                    // }
                    // ]
                    
                  
                }
              }
            ],
            limit: limit,
            offset: offset,
          })
          console.log(data.createdAt)
          res.status(200).json(data)  
    } catch (error) {
        res.status(400)
    throw new Error(error.message || "can't find Customer") 
    }

})


exports.paymentByEvent=asyncHandler(async(req,res)=>{
  const id = req.params.id;
  console.log(id);

  try {
    const data = await CustomerPayment.findAndCountAll({
      where: { eventId: id }
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400);
    throw new Error(error.message || "can't get Customer");
}
})

