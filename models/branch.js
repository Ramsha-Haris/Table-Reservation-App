// Core Modules
const fs = require("fs");
const path = require("path");
const rootDir = require("../utils/pathUtil");

module.exports = class Branch {
  constructor(BranchCode, BranchName, location, City) {
    this.BranchCode = BranchCode;
    this.BranchName = BranchName;
    this.location = location;
    this.City = City;
  }

  save() {
    Branch.fetchAll((registeredBranches) => {
        registeredBranches.push(this);
      const homeDataPath = path.join(rootDir, "data", "branch.json");
      fs.writeFile(homeDataPath, JSON.stringify(registeredBranches), (error) => {
        console.log("File Writing Concluded", error);
      });
    });
  }

  static fetchAll(callback) {
    const homeDataPath = path.join(rootDir, "data", "branch.json");
    fs.readFile(homeDataPath, (err, data) => {
      callback(!err ? JSON.parse(data) : []);
    });
  }
};
