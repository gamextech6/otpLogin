const express = require("express");
const router = express.Router();
const {adminLogin, createAdminAgent, getAdminAgentDetails, blockAdminAgent, unblockAdminAgent, getAllAdminAgents  } = require("../controller/adminController");


router.post("/admin-login", adminLogin);
router.post("/admin-agent", createAdminAgent);
router.get("/all-admin-agent", getAllAdminAgents);
router.get("/admin-agent/:userName", getAdminAgentDetails);
router.put("/admin-agent/block/:userName", blockAdminAgent);
router.put("/admin-agent/unblock/:userName", unblockAdminAgent);

module.exports = router;