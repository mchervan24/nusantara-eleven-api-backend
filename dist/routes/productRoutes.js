"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/productRoutes.ts
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const router = (0, express_1.Router)();
router.route('/')
    .get(productController_1.getProducts)
    .post(productController_1.createProduct);
router.route('/:id')
    .get(productController_1.getProductById)
    .put(productController_1.updateProduct)
    .delete(productController_1.deleteProduct);
exports.default = router;
