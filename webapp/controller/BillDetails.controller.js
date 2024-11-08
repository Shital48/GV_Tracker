   sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/Image"
], function (Controller, MessageToast, Image) {
    "use strict";

    return Controller.extend("gvtracker.controller.BillDetails", {

       // Handle file selection and display the image
       onFileChange: function (oEvent) {
        var oFiles = oEvent.getParameter("files");

        // Process each selected file
        for (var i = 0; i < oFiles.length; i++) {
            var oFile = oFiles[i];

            // Only process image files
            if (oFile && oFile.type.startsWith("image/")) {
                var oReader = new FileReader();
                oReader.onload = function (e) {
                    // Create a new Image control for each uploaded image
                    var oImage = new Image({
                        src: e.target.result,
                        width: "100px",
                        height: "100px" 
                    });
                     // Apply the CSS class to the image control
                    oImage.addStyleClass("photoThumbnail");
                    // Add the image to the photo display lane (HBox)
                    this.getView().byId("photoDisplayLane").addItem(oImage);
                }.bind(this);

                // Read the image file as a data URL
                oReader.readAsDataURL(oFile);
            } else {
                MessageToast.show("Please select a valid image file.");
            }
        }

        // Clear the FileUploader after use
        this.getView().byId("fileUploader").clear();
    }
    });
});
