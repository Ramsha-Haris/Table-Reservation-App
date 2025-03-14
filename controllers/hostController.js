const Bookings = require("../models/booking");
const setupTable=require("../models/table")
const setupBranch=require("../models/branch");


exports.getAddTable = (req, res, next) => {
  console.log('get add table')
    res.render("host/add-table", {
      pageTitle: "Add Table",
      currentPage: "addTable",
      isLoggedIn:  req.session.isLoggedIn,
    })
  
};

exports.postAddTable = (req, res, next) => {
  const { tableCode, tablecapacity, Location, selectbranch } = req.body;
  console.log(req.body);
  const newsetuptable = new setupTable({
    tableCode, tablecapacity, Location, selectbranch
  });

  newsetuptable
    .save()
    .then((savedTables) => {
      console.log(savedTables);
      // After saving, fetch all bookings to display in the view
      setupTable.find()
        .then((registeredTables) => {
          res.render("host/host-table-list", {
            registeredTables: registeredTables,
            pageTitle: "Host Table List",
            currentPage: "host-Tables",
          });
        })
        .catch((findError) => {
          // Handle errors during the find operation
          console.error("Error fetching Tables:", findError);
          res.status(500).send("Error fetching Tables"); // Send an error response
        });
    })
    .catch((saveError) => {
      // Handle errors during the save operation
      console.error("Error saving booking:", saveError);
      res.status(500).send("Error saving booking"); // Send an error response
    });
};


exports.getHostTables = (req, res, next) => {
  setupTable.find().then((registeredTables)=>{
    res.render("host/host-table-list", {
      registeredTables: registeredTables,
      pageTitle: "Host Table List",
      currentPage: "host-Tables",
      isLoggedIn:  req.session.isLoggedIn,
    })
  });
};

exports.getAddBranch = (req, res, next) => {
  res.render("host/add-branch", {
    pageTitle: "Add Branch",
    currentPage: "addBranch",
    isLoggedIn:  req.session.isLoggedIn,
  })

};

exports.postAddBranch = (req, res, next) => {
  
  const { BranchCode, BranchName, location, City } = req.body;
  const setupbranch = new setupBranch(BranchCode, BranchName, location, City);
  console.log(setupbranch)
  setupbranch.save();
  
  setupBranch.fetchAll((registeredBranches) =>{
    console.log(registeredBranches);
    res.render("host/branch-list", {
      registeredBranches: registeredBranches,
      pageTitle: "Branch List",
      currentPage: "branch-list",
      isLoggedIn:  req.session.isLoggedIn,
    })}
  );
};

exports.getBranchList = (req, res, next) => {
  setupBranch.fetchAll((registeredBranches) =>
    res.render("host/branch-list", {
      registeredBranches: registeredBranches,
      pageTitle: "Branch List",
      currentPage: "branch-list",
      isLoggedIn:  req.session.isLoggedIn,
    })
  );
};
