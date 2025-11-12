import express from 'express'
import {addProduct, listProduct, singleProduct, removeProduct} from '../controllers/productController.js'
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js'


const productRouter = express.Router()
productRouter.post('/add', auth({ admin: true }), upload.fields([{name:'image1', maxCount:1}, {name:'image2', maxCount:1}, {name:'image3', maxCount:1}, {name:'image4', maxCount:1}]), addProduct)
productRouter.post('/remove', auth({ admin: true }), removeProduct)
productRouter.post('/single', singleProduct)
productRouter.get('/list', listProduct)


export default productRouter;



