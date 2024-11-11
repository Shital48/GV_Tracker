sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
  "use strict";

  return Controller.extend("gvtracker.controller.BillDetails", {

      onInit: function () {
          var oData = {
              records: [
                  { SlNo: 1, BillNo: "1000010101", BillValue: 500, TakePhoto: "Camera", UploadPhoto: "" },
                  { SlNo: 2, BillNo: "1000010102", BillValue: 1000, TakePhoto: "Camera", UploadPhoto: "" },
                  { SlNo: 3, BillNo: "4002222222", BillValue: 5000, TakePhoto: "Camera", UploadPhoto: "" }
              ]
          };
          var oModel = new JSONModel(oData);
          this.getView().setModel(oModel);
          this._selectedIndex = -1;  // Initialize with no row selected
      },

      // Add Row logic
      onAddRow: function () {
          var oModel = this.getView().getModel();
          var oData = oModel.getData();
          var newRow = {
              SlNo: oData.records.length + 1, // Calculate new SlNo
              BillNo: "", // Empty fields for new row
              BillValue: "",
              TakePhoto: "Camera",
              UploadPhoto: ""
          };
          oData.records.push(newRow); // Add new row to the records array
          oModel.setData(oData); // Update the model with new data
          console.log("New row added:", newRow);
      },

      // Row Selection logic (via selectionChange)
      onRowSelect: function (oEvent) {
          var oTable = oEvent.getSource();
          var oSelectedItem = oEvent.getParameter("listItem");
          var iIndex = oTable.indexOfItem(oSelectedItem); // Get index of selected row

          console.log("Row selected:", iIndex);  // Log the selected row index
          this._selectedIndex = iIndex;  // Store selected row index
      },

      // Delete Row logic
      onDeleteRow: function () {
          console.log("Attempting to delete row. Selected index:", this._selectedIndex);

          if (this._selectedIndex === -1) {
              MessageToast.show("Please select a row to delete.");
              console.log("No row selected for deletion.");
              return;
          }

          var oTable = this.byId("billDetailsTable");
          var oModel = this.getView().getModel();
          var oData = oModel.getData();

          console.log("Before deletion, records:", oData.records); // Log data before deletion

          // Remove the selected row from the model data
          oData.records.splice(this._selectedIndex, 1);

          console.log("After deletion, records:", oData.records);  // Log data after deletion

          // Update the model with modified data
          oModel.setData(oData);

          // Reset the selection index
          this._selectedIndex = -1;

          // Show a success message
          MessageToast.show("Row deleted successfully.");
      },

      // Cancel logic
      onCancelCreateBill: function() {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("Gvr_issue"); // Adjust the route name as needed

          // Show success message
          MessageToast.show("The Customer profile creation has been discarded");
      }
  });
});
