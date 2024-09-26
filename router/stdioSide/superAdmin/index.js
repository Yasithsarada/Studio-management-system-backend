const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const { verifyAuth } = require('../../../middleware/auth');
const authorize = require('../../../middleware/authorize');
const {
  getAdmin,
  updateAdmin,
  createAdmin,
  deleteAdmin,
  getAdminById
} = require('../../../controller/studioSide/superAdmin/admin');
const { getCurruntAdmin, login } = require('../../../controller/auth');
const {
  getDepartment,
  updateDepartment,
  createDepartment,
  deleteDepartment,
  getDepartmentByid,
} = require('../../../controller/studioSide/superAdmin/department');

// admin

//auth
router.get('/admin/auth', verifyAuth, getCurruntAdmin);
router.post(
  '/admin/auth',
  [
    check('email', 'Enter Valid Email required').exists().isEmail(),
    check('password', 'Password is required').exists(),
  ],
  login
);

router.post('/admin',
  //  authorize(['super_admin']), 
   createAdmin);
router.get('/admin',
  //  authorize(['super_admin']), 
   getAdmin);
router.put('/admin/:id',
  //  authorize(['super_admin']), 
   updateAdmin);
router.delete('/admin/:id',
  //  authorize(['super_admin']),
    deleteAdmin);
router.get('/admin/:id', 
  // authorize(['super_admin']),
   getAdminById);

//department
router.get('/department', getDepartment);
router.put('/department/:id', updateDepartment);
router.post('/department', createDepartment);
router.delete('/departmentd/:id', deleteDepartment);
router.get('/departmentId/:id', getDepartmentByid);
router.get('/department/?search');

// payments
router.get('/payments/:page');
router.get('/payment');
router.get('/payment/:id');

router.get('/sales/:id');
router.get('/customer/:id');
router.get('/event/:id');
router.get('/order/:id');

module.exports = router;
