const express = require("express");
const router = express.Router();
const {adminLogin, createAdminAgent, getAdminAgentDetails, blockAdminAgent, unblockAdminAgent, getAllAdminAgents  } = require("../controller/adminController");


router.post("/admin-login", adminLogin);
router.post("/admin-agent", createAdminAgent);
router.get("/all-admin-agent", getAllAdminAgents);
router.get("/admin-agent/:username", getAdminAgentDetails);
router.put("/admin-agent/block/:username", blockAdminAgent);
router.put("/admin-agent/unblock/:username", unblockAdminAgent);

module.exports = router;