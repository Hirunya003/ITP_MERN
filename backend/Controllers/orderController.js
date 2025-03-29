import Order from "../Models/orderModel";
// import   Product from "../Models/product

//utility function
function calcPrices(orderItems) {
    const itemsPrice = orderItems.reduce((acc, item)=>acc + item.price * item.quantity, 0);

    const shippingPrice = itemsPrice > 100? 0 : 10;

    const totalPrice = 
        (itemsPrice + shippingPrice).toFixed(2);
    

    return {
        itemsPrice: itemsPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        totalPrice,
    }
    }




const createOrder = async(req, res)=> {
    try {
        const{orderItems, shippingAddress, paymentMethod}=req.body;

        //checking if the order has already been
        if(orderItems && orderItems.length==0){
            res.status(404)
            throw new Error("No order items")
        }
        //id gives to specific order
        const itemsFromDB = await Product.find({
            _id: {
                $in: orderItems.map((x)=>x._id)
            }
        })
        
        const dbOrderItems = orderItems.map((itemFromClient)=> {
            const matchingItemFromDB =itemsFromDB.find((itemFromDB)=>itemFromDB.id.toString()==itemFromClient.id)

            if(!matchingItemFromDB){
                res.status(404)
                throw new Error(`Product not found:${itemFromClient.id}`)
            
            }
            return {
                ...itemFromClient,
                product: itemFromClient.id,
                price: matchingItemFromDB.price,
                _id:undefined,
            };
        });

        const {itemsPrice, shippingPrice, totalPrice} = calcPrices(dbOrderItems);
    
    const order = new Order({
        orderItems: dbOrderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,

    })

    //saving order in db
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);

    }catch(error) {
        res.status(500).json({error:error.message})
    }
};

//getAllOrders method
const getAllOrders = async (req, res)=> {
    try{
        const orders = await Order.find({}).populate('user', "id username")
        res.json(orders);

    }catch(error) {
        res.status(500).json({error:error.message})
    }
};


//getUserOrders method
const getUserOrders = async (req, res)=> {
    try{
        const orders =await Order.find({user: req.user._id});
        res.json(orders);

    }catch(error) {
        res.status(500).json({error:error.message})
    }
};

//countTotalOrders method

const countTotalOrders = async (req, res)=> {
    try{
        const totalOrders = await Order.countDocuments();
        res.json({totalOrders});

    }catch(error) {
        res.status(500).json({error:error.message})
    }
};

//calculateTotalSales
// const calculateTotalSales = async (req, res)=> {
//     try {
//         const orders =await Order.find()
//         const totalSales = orders.reduce((sum, order)=>sum + order.totalPrice, 0);
//         res.json({totalSales});

//     } catch (error) {
//         res.status(500).json({error: error.message});
//     }
// };

//findOrderById 
const findOrderById = async(req, res)=>{
    try{
        
        const order = await Order.findById(req.params.id).populate('user', "username email");

        if(order){
            res.json(order)
        }
        else{
            res.status(404)
            throw new Error("Order not found")
        }
    }catch(error){
            res.status(500).json({error: error.message});
        } 
};

//markOrderAsPaid--------------------------------


export {createOrder, getAllOrders, getUserOrders, countTotalOrders,
    //calculateTotalSales,
    findOrderById,
    //markOrderAsPaid,
};