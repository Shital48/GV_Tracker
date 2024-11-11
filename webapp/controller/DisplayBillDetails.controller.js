sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/Router"
], function (Controller, Router) {
    "use strict";

    return Controller.extend("gvtracker.controller.DisplayBillDetails",   
    {
    onInit: function () {
       
    } ,
    onCancelPress1: function() {
        // Discard any changes or perform necessary cleanup
        // this.clearScreen();

        // Navigate back to the previous page
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("Gvr_display"); // Adjust the route name as needed
    
        // Show success message
        sap.m.MessageToast.show("The Customer profile creation has been discarded");
    }

    });
});