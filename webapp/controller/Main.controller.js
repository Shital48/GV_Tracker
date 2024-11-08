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
                inputEnabled: true, // Create radio button is selected by default 
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

        onRadioButtonSelect: function (oEvent) {
            var oModel = this.getView().getModel();
            var iSelectedIndex = oEvent.getParameter("selectedIndex");
        
            // Set input field's editability based on selected radio button
            oModel.setProperty("/inputEditable", iSelectedIndex === 1); // Editable if "Display" is selected
        
             // If "Create" is selected, clear the input field
            if (iSelectedIndex === 0) {
                this.getView().byId("inputField").setValue("");  // Clear the input field if "Create" is selected
            }
        },
        onExecutePress: function() {
            // Get the selected radio button index
            var oRadioGroup = this.getView().byId("radioGroup");
            var iSelectedIndex = oRadioGroup.getSelectedIndex();
        
            // Navigation logic based on selected radio button
            var oRouter1 = sap.ui.core.UIComponent.getRouterFor(this);
            
            if (iSelectedIndex === 0) { // "Create" is selected 
                oRouter1.navTo("Gvr_issue"); 
            } else if (iSelectedIndex === 1) {  

                // Get the input value
                var sInputValue = this.getView().byId("inputField").getValue();
                
                // Get the JSON model
                var oModel = this.getView().getModel("dataModel");
                var aValues = oModel.getProperty("/values");

                // Check if the input value exists in the JSON data
                if (aValues.includes(sInputValue)) {
                    this.getView().byId("inputField").setValue("");
                    oRouter1.navTo("Gvr_display");
                } else { 
                    MessageToast.show("Value not found in data!");
                }


                  
            }
        }
 
    });
});
