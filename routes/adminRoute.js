const express = require("express");
const router = express.Router();
const multer = require('multer');
const {
    adminLogin,
    createAdminAgent, 
    getAdminAgentDetails, 
    blockAdminAgent, 
    unblockAdminAgent, 
    getAllAdminAgents, 
    addAgent, 
    getAgents, 
    searchAgentByUsername, 
    blockAgent, 
    unblockAgent, 
    getUserCount, 
    getAdminAgentCount, 
    getAgentCount,
    adminAccountAdd
} = require("../controller/adminController");
const upload = multer({ storage: multer.memoryStorage() });

router.post("/admin-login", adminLogin);
router.post("/admin-agent", createAdminAgent);
router.get("/all-admin-agent", getAllAdminAgents);
router.get("/admin-agent/:userName", getAdminAgentDetails);
router.put("/admin-agent/block/:userName", blockAdminAgent);
router.put("/admin-agent/unblock/:userName", unblockAdminAgent);
router.post("/add-agent", addAgent);
router.get("/all-agent", getAgents);
router.get("/agent/:userName", searchAgentByUsername);
router.put("/block-agent/:userName", blockAgent);
router.put("/unblock-agent/:userName", unblockAgent);
router.get("/total-user", getUserCount);
router.get("/total-admin-agent", getAdminAgentCount);
router.get("/total-agent", getAgentCount);
router.get("/add-account", upload.single('qr'), adminAccountAdd);
module.exports = router;