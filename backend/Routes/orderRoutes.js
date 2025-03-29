import express from 'express';
import { 
    createOrder,
    getAllOrders,
    getUserOrders,
    countTotalOrders,
    //calculateTotalSales,
    findOrderById,
 } 
    from '../Controllers/orderController';
//import{authenticate, authorizeAdmin} from '../Middlewares/middleware.js;
const router = express.router();

const order =require("../Models/orderModel");
 
router
  .route("/")
  .post(authenticate,createOrder);
  //------------------------after admin side part come apply this ->.get(authenticate, authorizeAdmin, getAllOrders);----------------------------------------------------------------
  
//specific user order
  router.route('/mine').get(authenticate, getUserOrders)

  //total user orders
  router.route('/total-orders').get(countTotalOrders);

  /*total sales
  router.route('/total-sales').get(calculateTotalSales) */

  //calculateTotalSalesByDate can include here

  router.route('/:id').get(authenticate, findOrderById)

  //mark order as paid can include here
  //mark order as delivered can include here

  export default router;