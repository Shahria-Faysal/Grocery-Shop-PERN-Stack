import express from "express";
import { getAuditLogs, getLogsByRecord } from "../controllers/audit.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";

const auditRouter = express.Router();

// Only admin should be able to view audit logs
auditRouter.get("/", protect, authorize("admin"), getAuditLogs);
auditRouter.get("/:table/:id", protect, authorize("admin"), getLogsByRecord);

export default auditRouter;
