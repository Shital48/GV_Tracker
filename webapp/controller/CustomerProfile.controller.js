sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/Router"
], function (Controller, Router) {
    "use strict";

    return Controller.extend("gvtracker.controller.CustomerProfile",   
    {
    onInit: function () {

    
       
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
        custProfileView.byId("CustName").setValue("");
        custProfileView.byId("CustEmail").setValue("");
        custProfileView.byId("CountryCode").setValue("");
        
           
    },
    onCountryCodeValueHelp: function (oEvent) {
        var oInput = oEvent.getSource();
    
        // Create a new instance of the SelectDialog each time the function is called
        var oValueHelpDialog = new sap.m.SelectDialog({
            title: "Select Country Code",
            items: {
                path: "/countryCodeData", // Ensure this path matches the data structure in your model
                template: new sap.m.StandardListItem({
                    title: "{LAND1} - {TELEFTO}",
                    description: "{LAND1}",
                    info: "{TELEFTO}"
                })
            },
            search: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter1 = new sap.ui.model.Filter("LAND1", sap.ui.model.FilterOperator.Contains, sValue);
                var oFilter2 = new sap.ui.model.Filter("TELEFTO", sap.ui.model.FilterOperator.Contains, sValue);
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([oFilter1, oFilter2]);
            },
            confirm: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                if (oSelectedItem) {
                    oInput.setValue(oSelectedItem.getInfo());
                }
                // Close and destroy dialog after selection
                oValueHelpDialog.close();
                oValueHelpDialog.destroy(); // Free up memory
            },
            cancel: function () {
                // Close and destroy dialog on cancel
                oValueHelpDialog.close();
                oValueHelpDialog.destroy(); // Free up memory
            }
        });
    
        // Add the dialog to the current view to manage its lifecycle
        this.getView().addDependent(oValueHelpDialog);
    
        // Open the dialog
        oValueHelpDialog.open();
    }
    


});
    
});