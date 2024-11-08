sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/Router",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/SelectDialog",
    "sap/m/StandardListItem"
], function (Controller, Router, JSONModel, MessageToast, SelectDialog, StandardListItem) {
    "use strict";

    return Controller.extend("gvtracker.controller.CustomerProfile", 
    {
    onInit: function () {

    // Load the country code data
    var oModel = new JSONModel();
    oModel.loadData("model/countryCodeData.json");
    oModel.attachRequestCompleted(function() {
        console.log("Country codes loaded:", oModel.getData());
        console.log("Country codes array:", oModel.getProperty("/countryCodes"));
      });
      
      oModel.attachRequestFailed(function() {
        console.error("Failed to load country codes.");
      });
    this.getView().setModel(oModel, "countryModel");
  
       
    },
    onCancelPress: function() {
        // Discard any changes or perform necessary cleanup
        this.clearScreen();

        // Navigate back to the previous page
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("Gvr_issue"); // Adjust the route name as needed
    
        // Show success message
        sap.m.MessageToast.show("The Customer profile creation has been discarded");
    },
    clearScreen: function () {
        const custProfileView = this.getView();
        custProfileView.byId("CustNo").setValue("");
        custProfileView.byId("CustTitle").setValue("");
        custProfileView.byId("customerNameInput").setValue("");
        custProfileView.byId("customerEmailInput").setValue(""); 
        this.getView().byId("countryCodeInput").setSelectedKey(""); 

        
           
    },
    onCountryCodeHelp: function (oEvent) {
        var oView = this.getView();
        var oCountryModel = oView.getModel("countryModel");
        
        // Ensure the model is loaded
        if (!oCountryModel || !oCountryModel.getProperty("/countryCodes")) {
            MessageToast.show("Country codes data not loaded.");
            return;
        }

        if (!this._oDialog) {
          this._oDialog = new SelectDialog({
            title: "Select Country Code",
            items: {
              path: "countryModel>/countryCodes",
              template: new StandardListItem({
                title: "{countryModel>LAND1}",
                description: "{countryModel>TELEFTO}"
              })
            },
            search: function (oEvt) {
              var sValue = oEvt.getParameter("value");
              var oFilter = new sap.ui.model.Filter(
                "LAND1",
                sap.ui.model.FilterOperator.Contains,
                sValue
              );
              oEvt.getSource().getBinding("items").filter([oFilter]);
            },
            confirm: this.onCountryCodeConfirm.bind(this),
            cancel: function() {
                // Reset to "None" (empty key) on cancel
                this.getView().byId("countryCodeInput").setSelectedKey("");  // or use "" to reset
            }.bind(this)
          });
          
          oView.addDependent(this._oDialog);
        }

        this._oDialog.open();
      },

      onCountryCodeConfirm: function (oEvt) {
        var oSelectedItem = oEvt.getParameter("selectedItem");
        if (oSelectedItem) {
            // Remove "+" sign from TELEFTO if present
            var sTelephoneCode = oSelectedItem.getDescription().replace("+", "");
            
            // Set the cleaned value in the input
            this.getView().byId("countryCodeInput").setValue(sTelephoneCode);
        }
    },

      onCountryCodeChange: function (oEvent) {
        var sValue = oEvent.getParameter("value");
        var oInput = oEvent.getSource();
        
        // Validate numeric-only input
        if (isNaN(sValue)) {
          oInput.setValueState("Error");
          oInput.setValueStateText("Please enter a valid numeric country code.");
        } else {
          oInput.setValueState("None");
        }
      },
      // Handle Customer Name Validation
      onCustomerNameChange: function (oEvent) {
        var sValue = oEvent.getParameter("newValue");
        var oInput = oEvent.getSource();
        
        // Allow only alphabetic characters and spaces (Regular Expression)
        var regex = /^[A-Za-z\s]+$/;

        // Validate input value
        if (!regex.test(sValue) && sValue !== "") {
            oInput.setValueState("Error");
            oInput.setValueStateText("Maintain a valid Customer Name");
        } else {
            oInput.setValueState("None");
        }
    },

    // Handle Customer Email Validation
    onCustomerEmailChange: function (oEvent) {
        var sValue = oEvent.getParameter("newValue");
        var oInput = oEvent.getSource();
        
        // Regular Expression for email format validation
        var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // Validate input value
        if (!regex.test(sValue) && sValue !== "") {
            oInput.setValueState("Error");
            oInput.setValueStateText("Maintain a valid Email ID");
        } else {
            oInput.setValueState("None");
        }
    },
    // Handle Customer Mobile Validation
    onCustomerMobileChange: function (oEvent) {
        var sValue = oEvent.getParameter("newValue");
        var oInput = oEvent.getSource();
        
        // Allow only numeric characters (Regular Expression for numbers)
        var regex = /^[0-9]+$/;

        // Validate input value
        if (!regex.test(sValue) && sValue !== "") {
            oInput.setValueState("Error");
            oInput.setValueStateText("Maintain a valid Mobile number");
        } else if (sValue.length !== 10) {  // For example, 10-digit mobile numbers
            oInput.setValueState("Error");
            oInput.setValueStateText("Mobile number should be 10 digits");
        } else {
            oInput.setValueState("None");
        }
    }
});
    
});