import express from "express";

import {
    getCustomerFunds,
    getCustomerSips,
    getTransactions,
    createSip,
    getNav,
    stopSip,
    createTransaction,
    getCustomerProfile
} from "../controllers/mfController";

import { apiKeyMiddleware }
from "../middleware/apiKeyMiddleware";

const router = express.Router();

router.get(
   "/funds/:customerRef",
   apiKeyMiddleware,
   getCustomerFunds
);
router.get(
    "/sips/:customerRef",apiKeyMiddleware,
    getCustomerSips
);

router.get(
    "/transactions/:customerRef",apiKeyMiddleware,
    getTransactions
);

router.post(
    "/sip",apiKeyMiddleware,
    createSip
);

router.get(
   "/nav/:schemeCode",
   apiKeyMiddleware,
   getNav
);
router.patch(
   "/sip/:id/stop",
   apiKeyMiddleware,
   stopSip
);

router.post(
   "/transaction",
   apiKeyMiddleware,
   createTransaction
);

router.get(
   "/customer/:customerRef",
   apiKeyMiddleware,
   getCustomerProfile
);
export default router;