const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({

    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User", //reference to the user model
    },
    OrderItems:[
        {
        name:{
            type: String,
            required: true
        },
        quantity:{
            type: Number,
            required: true
        },
        image:{
            type: String,
            required: true
        },
        price:{
            type: Number,
            required: true
        },
        product:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref:"Product", //reference to the product model
        },
    },
],

shippingAddress:{
    address:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    postalcode:{
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },
},
paymentMethod:{
    type: String,
    required: true
},

paymentResult:{
    id:{type: String,required: true},
    status:{type: String,required: true},
    update_time:{type: String,required: true },
    email_address:{type: String,required: true}           
},
itemPrice:{
    type: Number,
    required: true,
    defaultValue:0.00,
    },

shippingPrice:{
    type: Number,
    required: true,
    defaultValue:0.00,
    },

totalPrice:{
    type: Number,
    required: true,
},

isPaid:{
    type: Boolean,
    required: true,
    default: false,
},

paidAt:{
    type: Date,

},

isDelivered:{
    type: Boolean,
    required: true,
    default: false,
},

deliveredAt:{
    type: Date,
},

},

{ timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;