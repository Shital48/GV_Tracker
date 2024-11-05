sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel", 
    "sap/m/MessageToast"
],
function (Controller, JSONModel,MessageToast) {
    "use strict";

    return Controller.extend("gvtracker.controller.Main", {
        onInit: function () {
             // Initialize the model
             const oModel = new JSONModel({
                inputEnabled: false, // Create radio button is selected by default
                selectedView: "Gvr_display" // Default to View A
            });
            this.getView().setModel(oModel);

             // Sample JSON data
             var oData = {
                values: ["123", "1235", "890"] // Replace with your actual data
            };

            // Create a JSON model and set it to the view
            var oModel1 = new JSONModel(oData);
            this.getView().setModel(oModel1, "dataModel");
        
        },
        onSelect: function (oEvent) {
            const selectedButton = oEvent.getSource().getText();
            const oModel = this.getView().getModel();

            // Enable or disable the input field based on selected radio button
            if (selectedButton === "DISPLAY") {
                oModel.setProperty("/inputEnabled", true);
            } else {
                this.getView().byId("gvrInput").setValue("");
                oModel.setProperty("/inputEnabled", false);
            }
            // Update selected view based on radio button text
           // oModel.setProperty("/selectedView", selectedText === "EXECUTE" ? "Gvr_display" : "Gvr_issue");
        }, 
        onNavigate: function () {
            const oView = this.getView();
            const radioViewA = oView.byId("radioViewA");
            const radioViewB = oView.byId("radioViewB");

            

            // Check which radio button is selected
            if (radioViewA.getSelected()) {
                this._navigateTo("Gvr_issue");
            } else if (radioViewB.getSelected()) {

                  // Get the input value
            var sInputValue = this.getView().byId("gvrInput").getValue();
            
            // Get the JSON model
            var oModel = this.getView().getModel("dataModel");
            var aValues = oModel.getProperty("/values");

            // Check if the input value exists in the JSON data
            if (aValues.includes(sInputValue)) {
                // Navigate to another view (e.g., "AnotherView")
                this.getOwnerComponent().getRouter().navTo("Gvr_display");
            } else {
                // Show message if the value is not found
                MessageToast.show("Value not found in data!");
            }

               // this._navigateTo("Gvr_display");
            }
            else {
                MessageToast.show("Please select a view to navigate.");
            }
        },

        _navigateTo: function (viewName) {
            // Use the router to navigate
            const oRouter = this.getOwnerComponent().getRouter(); // Correct way to get the router
            oRouter.navTo(viewName);
        },

        
    });
});
