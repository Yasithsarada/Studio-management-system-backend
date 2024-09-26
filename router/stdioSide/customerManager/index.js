const express = require('express');
const router = express.Router();
const {
  getCustomers,
  createCustomers,
  deleteCustomer,
  getSearchCustomerEvents,
  updateCustomer,
  getSearchCustomer,
} = require('../../../controller/studioSide/customerManager/customer');
const {} = require('./tutorial');
const {
  createPayment,
  getCustomerPayment,
  getCustomerPaymentDetails,
  getSearchAllPayment,
  paymentByEvent,
  getPayment,
  getTopPaymentsToday,
} = require('../../../controller/studioSide/customerManager/payment');
const {
  getAllCustomerRequests,
  updateCustomerRequest,
} = require('../../../controller/studioSide/customerManager/customerRequest');
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  updateServiceInput,
  updateServiceSelect,
  updateServiceOptions,
} = require('../../../controller/studioSide/customerManager/service');
const {
  createEventRequest,
  getAllEventRequests,
  getEventRequest,
} = require('../../../controller/studioSide/customerManager/eventRequest');

// customer
router.put('/customer/:id', updateCustomer);
router.post('/customer', createCustomers);
router.delete('/customer/:id', deleteCustomer);
router.get('/customer', getCustomers);
router.get('/customerEvents/:mobilePhone', getSearchCustomerEvents);

//payments
router.get('/payment', getCustomerPayment); // getcustomers
router.post('/payment', createPayment);
router.get('/paymentByEvent/:id', paymentByEvent); // wait for date format ,time range
router.get('/payment/:id', getCustomerPaymentDetails);
router.get('/paymentAmount', getPayment);

//customerRequests
router.get('/customerRequest'); // socket.io
router.put('/customerRequest/:id', updateCustomerRequest);
router.post('/customerRequest', getAllCustomerRequests);
router.get('/customerRequest/?search');
// router.post("/customerRequest/confirm", );
router.post('/eventRequestService', createEventRequest);
router.get('/eventRequest', getAllEventRequests);
router.get('/eventRequest/:id', getEventRequest);
//customerServices
router.get('/Service', getServices);
router.get('/Service/:id', getService);
router.post('/Service', createService);
router.put('/service/service/:id', updateService);
router.put('/service/input/:id', updateServiceInput);
router.put('/service/select/:id', updateServiceSelect);
router.put('/service/option/:id', updateServiceOptions);
router.delete('/Service/:id', deleteService);
//router.get("/customerEvents/:mobilePhone",getSearchCustomerEvents);

module.exports = router;
