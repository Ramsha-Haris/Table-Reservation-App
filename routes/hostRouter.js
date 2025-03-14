// External Module
const express = require("express");
const hostRouter = express.Router();

// Local Module
const hostController = require("../controllers/hostController");



// hostRouter.get("/book-table", hostController.getBookTable);
hostRouter.get("/add-table", hostController.getAddTable);
hostRouter.post("/add-table", hostController.postAddTable);

hostRouter.get("/host-table-list", hostController.getHostTables);
// hostRouter.post("/host-table-list", hostController.postHostTables);

hostRouter.get("/add-Branch", hostController.getAddBranch);
hostRouter.post("/add-Branch", hostController.postAddBranch);
hostRouter.get("/branch-list", hostController.getBranchList);


module.exports = hostRouter;
