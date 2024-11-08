sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Table",
    "sap/m/Button",
    "sap/m/Image",
    "sap/m/HBox"
  ], function (Controller, JSONModel, Table, Button, Image, HBox) {
    "use strict";

    return Controller.extend("gvtracker.controller.BillDetails", {

        onInit: function () {
            var oModel = new JSONModel({
              records: [
                { customerBillNo: "Bill-001", photoPath: "" },
                { customerBillNo: "Bill-002", photoPath: "" },
                { customerBillNo: "Bill-003", photoPath: "" },
                { customerBillNo: "Bill-004", photoPath: "" }
              ],
              images: ["", "", "", ""]
            });
            this.getView().setModel(oModel);
          },
      
          onFileUploadChange: function (oEvent) {
            var oFileUploader = oEvent.getSource();
            var oModel = this.getView().getModel();
          
            // Retrieve the file
            var oFile = oEvent.getParameter("files")[0];
            var reader = new FileReader();
            reader.onload = function (e) {
              // Store the file as an image in the first empty slot
              var aImages = oModel.getProperty("/images");
              for (var i = 0; i < aImages.length; i++) {
                if (!aImages[i]) {
                  aImages[i] = e.target.result;
                  break;
                }
              }
              oModel.setProperty("/images", aImages);
            }.bind(this);
          
            reader.readAsDataURL(oFile);
          },
          
          onDeleteRow: function (oEvent) {
            var oButton = oEvent.getSource();
            var oItem = oButton.getParent();
            var oTable = this.byId("billDetailsTable");
            var oContext = oItem.getBindingContext();
            var sPath = oContext.getPath();
            var oModel = this.getView().getModel();
      
            // Remove the record
            var aRecords = oModel.getProperty("/records");
            var index = aRecords.findIndex(function (record) {
              return record.customerBillNo === oModel.getProperty(sPath).customerBillNo;
            });
      
            // If record is found, delete it
            if (index > -1) {
              aRecords.splice(index, 1);
              oModel.setProperty("/records", aRecords);
            }
          },
      
          onAddRow: function () {
            var oModel = this.getView().getModel();
            var aRecords = oModel.getProperty("/records");
            var newRow = { customerBillNo: "New Bill", photoPath: "" };
            aRecords.push(newRow);
            oModel.setProperty("/records", aRecords);
          }
    });
});
