const express=require("express")
const router=express.Router();
const {
    getDetails,
    detailsBycategory,
    deleteBynameByQuanttity,
    detailsByregioncategory,getByname,
    getAianalysis

}=require("../controllers/orderController")
router.get("/details/:region",getDetails())
router.get("/details/category/:category/:region",detailsByregioncategory())//for regional
router.get("/details/category/:category",detailsBycategory())//for all
router.get("/details",allProducts())//for all
router.get("/detail/product/:name",getByname())//for all
router.post("/delete/product/:name/:quantity",deleteBynameByQuanttity)
router.get("/aiinfo",getAianalysis())

module.exports=router