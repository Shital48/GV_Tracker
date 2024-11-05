sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/Router",
     "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, Router,MessageToast) {
    "use strict";

    return Controller.extend("gvtracker.controller.Gvr",   
    {onSubmit: function () {
        const oView = this.getView();
        const name = oView.byId("nameInput").getValue();
        const email = oView.byId("emailInput").getValue();
        const phone = oView.byId("phoneInput").getValue();

    },
    onInit: function () {

        this._isOtpSent = false; // Variable to track OTP status


        const oData = new sap.ui.model.json.JSONModel({
            customerMobiles: [
                {  mobileNumber: "1234567890" },
                {  mobileNumber: "0987654321" }
                // Additional customers can be added here
            ]
        });
         
        this.getView().setModel(oData);
    },
    onBackPress: function () {
        // Check if the dialog is already created
        if (!this._oBackDialog) {
            // Create a new dialog with the appropriate header setup
            this._oBackDialog = new sap.m.Dialog({
                title: "Confirm Action",
                content: new sap.m.Text({ text: "Are you sure you want to go back?" }),
                beginButton: new sap.m.Button({
                    text: "SUBMIT",
                    press: function () {
                        if (this.validateMandatoryFields()) {
                            this.createGVRDocument();
                            this._oBackDialog.close();
                        } else {
                            MessageToast.show("Maintain the required entries.");
                        }
                    }.bind(this)
                }),
                endButton: new sap.m.Button({
                    text: "DISCARD",
                    press: function () {
                        this.clearScreen();
                        //sap.ui.core.UIComponent.getRouterFor(this).navTo("Main");
                        this._navigateTo("Main");
                        this._oBackDialog.close();
                    }.bind(this)
                }),
                customHeader: new sap.m.Bar({
                    contentRight: new sap.m.Button({
                        icon: "sap-icon://decline",
                        press: function () {
                            this._oBackDialog.close();
                        }.bind(this)
                    })
                }),
                afterClose: function () {
                    this._oBackDialog.destroy();
                    this._oBackDialog = null;
                }.bind(this)
            });
        }
        // Open the dialog
        this._oBackDialog.open();
    },
    onBackPress: function () {

        this._navigateTo("Main");
 
    },


    onValueHelpRequest: function () {
        this.byId("customerMobileDialog").open();
    },
    onCloseDialog: function () {
        this.byId("customerMobileDialog").close();
    },

    onSelectMobile: function (oEvent) {
        const oSelectedItem = oEvent.getSource();
        const oContext = oSelectedItem.getBindingContext();
        const sMobileNumber = oContext.getProperty("mobileNumber");

        // Set the selected mobile number to the input field
        this.byId("inputCustomerMobile").setValue(sMobileNumber);
         

        // Close the dialog after selection
        this.byId("customerMobileDialog").close();
    },
    onSendOtp: function () {
        // Logic to send OTP goes here
    
        this._isOtpSent = true; // Mark OTP as sent
        sap.m.MessageToast.show("OTP has been sent.");
    },
    
    onVerifyOtp: function () {
        if (!this._isOtpSent) {
            sap.m.MessageToast.show("Please send OTP first.");
            return; // Prevent verification if OTP hasn't been sent
        }
    },

    onNavigate1: function () {  
            this._navigateTo("Cust_profile"); 
    },

    _navigateTo: function (viewName) {
        // Use the router to navigate
        const oRouter = this.getOwnerComponent().getRouter(); // Correct way to get the router
        oRouter.navTo(viewName);
    },

    onNavigate2: function () {  
        this._navigateTo("Bill_details"); 
       
    },
    onNavigate3: function () {  
        this._navigateTo("Billdetails_display"); 
       
    }

    });
});