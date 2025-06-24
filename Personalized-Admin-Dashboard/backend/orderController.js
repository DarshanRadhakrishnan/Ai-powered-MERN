const Order=require("../model/orderModel");
const Order = require("../model/orderModel");
const getClaudeResponse=require("../config/aiService");

const getDetails = async (req, res) => {
  try {
    const region = req.params.region;

    // Total Orders in the region
    const totalOrders = await Order.countDocuments({ region });

    // Total Revenue (only orders that are not in cart)
    const totalRevenueData = await Order.aggregate([
      { $match: { region, added_to_cart: false } },
      {
        $group: {
          _id: null,
          total: { $sum: "$price" }
        }
      }
    ]);
    const totalRevenue = totalRevenueData[0]?.total || 0;

    // Year-wise orders for the last 5 years
    const currentYear = new Date().getFullYear();
    const fiveYearsAgo = new Date(`${currentYear - 4}-01-01`);

    const yearwiseOrdersRaw = await Order.aggregate([
      {
        $match: {
          region,
          date_of_purchase: { $gte: fiveYearsAgo }
        }
      },
      {
        $group: {
          _id: { $year: "$date_of_purchase" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill missing years with count = 0
    const yearwiseOrders = [];
    for (let y = currentYear - 4; y <= currentYear; y++) {
      const yearData = yearwiseOrdersRaw.find(d => d._id === y);
      yearwiseOrders.push({ year: y, count: yearData?.count || 0 });
    }

    // In-cart orders
    const inCartOrders = await Order.countDocuments({
      region,
      added_to_cart: true
    });

    res.status(200).json({
      totalOrders,
      totalRevenue,
      yearwiseOrders,
      inCartOrders
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Some error has occurred" });
  }
};

const Order = require("../model/orderModel");

const detailsBycategory = async (req, res) => {
  try {
    const category = req.params.category;

    const result = await Order.aggregate([
      { $match: { category: category } }, // filter by category
      {
        $group: {
          _id: "$name", // group by product name
          quantity: { $sum: 1 },
          price:{$first:"$price"},
          category:{$first:"$category"}
        }
      },
      { $sort: { quantity: -1 } } // optional: sort by most frequent
    ]);
    const formatted = result.map(item => ({
      name: item._id,
      quantity: item.quantity,
      price: item.price,
      category: item.category
    }));
    res.status(200).json(formatted);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching product details by category" });
  }
};


const detailsByregioncategory = async (req, res) => {
  try {
    const category = req.params.category;

    const result = await Order.aggregate([
      { $match: { category: category } }, // filter by category
      {
        $group: {
          _id: {
            name: "$name",
            region: "$region"
          }, // group by product name
          quantity: { $sum: 1 },
          price:{$first:"$price"},
          category:{$first:"$category"}
        }
      },
      { $sort: { quantity: -1 } } // optional: sort by most frequent
    ]);
    const formatted = result.map(item => ({
      name: item._id,
      quantity: item.quantity,
      price: item.price,
      category: item.category
    }));
    res.status(200).json(formatted);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching product details by category" });
  }
};
 
const Order = require("../model/orderModel");

const getByname = async (req, res) => {
  const name = req.params.name;

  try {
    const currentYear = new Date().getFullYear();
    const fiveYearsAgo = new Date(`${currentYear - 4}-01-01`);

    // Get one document to extract price and category
    const sampleOrder = await Order.findOne({ name });
    if (!sampleOrder) {
      return res.status(404).json({ message: "No item found with this name" });
    }

    // Count total orders with this name
    const totalOrders = await Order.countDocuments({ name });

    // Count purchased (added_to_cart: false)
    const purchasedOrders = await Order.countDocuments({ name, added_to_cart: false });

    // Count in-cart (added_to_cart: true)
    const inCartOrders = await Order.countDocuments({ name, added_to_cart: true });

    // Total revenue from purchased orders
    const revenueData = await Order.aggregate([
      { $match: { name, added_to_cart: false } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$price" }
        }
      }
    ]);
    const revenue = revenueData[0]?.totalRevenue || 0;

    // Year-wise purchased orders over past 5 years
    const fiveYearRaw = await Order.aggregate([
      {
        $match: {
          name,
          added_to_cart: false,
          date_of_purchase: { $gte: fiveYearsAgo }
        }
      },
      {
        $group: {
          _id: { $year: "$date_of_purchase" },
          quantity: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Ensure all 5 years are present in the report
    const fiveYearSales = [];
    for (let y = currentYear - 4; y <= currentYear; y++) {
      const yearData = fiveYearRaw.find(d => d._id === y);
      fiveYearSales.push({ year: y, quantity: yearData?.quantity || 0 });
    }

    // Final response
    res.status(200).json({
      name,
      price: sampleOrder.price,
      category: sampleOrder.category,
      totalOrders,
      purchasedOrders,
      inCartOrders,
      revenue,
      fiveYearSales
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong while fetching product info" });
  }
};

const Order = require("../model/orderModel");

const deleteBynameByQuanttity = async (req, res) => {
  try {
    const name = req.params.name;
    const qty = parseInt(req.params.quantity); // ensure it's a number

    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ message: "Quantity must be a positive number" });
    }

    // Find matching orders sorted by earliest purchase
    const orders = await Order.find({ name }).sort({ date_of_purchase: 1 }).limit(qty);

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found with this name" });
    }

    // Extract their IDs
    const idsToDelete = orders.map(order => order._id);

    // Delete them
    await Order.deleteMany({ _id: { $in: idsToDelete } });

    res.status(200).json({
      message: `${idsToDelete.length} order(s) deleted for '${name}'`,
      deletedCount: idsToDelete.length
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting orders" });
  }
};


const getAianalysis=async (req,res)=>{

  try{
    const Orders=await Order.find({}).lean();
    //so here we take all the order data and make its as a list thhen give it as a parameter
    const data=Orders.map(order => ({
      name: order.name,
      price: order.price,
      region: order.region,
      category: order.category,
      added_to_cart: order.added_to_cart,
      date_of_purchase: order.date_of_purchase
    }))
    const result=getAianalysis(data);
    res.status(200).json(result);
  }catch(err){
    console.log(err);
    res.status(400).json({message:"Problem getting response with the Claude Ai"})
  }
}
module.exports={
    getDetails,
    detailsBycategory,
    deleteBynameByQuanttity,
    detailsByregioncategory,getByname,
    getAianalysis

}