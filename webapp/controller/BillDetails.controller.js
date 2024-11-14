sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast",
  "sap/m/Dialog"
], function (Controller, JSONModel, MessageToast) {
  "use strict";

  return Controller.extend("gvtracker.controller.BillDetails", {

      onInit: function () {
          var oData = {
              records: [
                {
                    SlNo: 1,
                    billNo: "12345",
                        billValue: "1000.00",
                        photoPath: "",
                        imageData: ""   // Property to store image data
                }
                   ]
          };
          var oModel = new JSONModel(oData);
          this.getView().setModel(oModel);
          
      },
      

      // Add Row logic
      onAddRow: function () {
          var oModel = this.getView().getModel();
          var oData = oModel.getData();

        // Calculate next SlNo based on the length of the records array
        var newSlNo = oData.records.length + 1;

          var newRow = {
              SlNo: newSlNo, // Calculate new SlNo
              billNo: "",  // Empty fields for new row
              billValue: "",
              photoPath: ""
          };
          oData.records.push(newRow); // Add new row to the records array
          oModel.setData(oData); // Update the model with new data
          console.log("New row added:", newRow);
      },

      // Row Selection logic (via selectionChange)
      onRowSelect: function (oEvent) {
        var oTable = this.byId("billDetailsTable");
        var aSelectedItems = oTable.getSelectedItems();
     },

      // Delete Row logic
      onDeleteRow: function () { 
        var oTable = this.byId("billDetailsTable");
        var aSelectedItems = oTable.getSelectedItems();
  
        if (aSelectedItems.length === 0) {
          MessageToast.show("Please select rows to delete.");
          return;
          }
        
          var oModel = this.getView().getModel();
          var aData = oModel.getProperty("/records");
          var that = this;  // Capture 'this' context outside the loop
          // Log selected items to check their context
    console.log("Selected Items: ", aSelectedItems);
        
          // Delete the selected rows from the data model
      aSelectedItems.forEach(function (oItem) {
        var oContext = oItem.getBindingContext();
        if (!oContext) {
            console.error("No binding context found for this row!");
            return; // Skip this item if no context is found
        }
        var oRowData = oContext.getObject();
        if (!oRowData) {
            console.error("No row data found in context.");
            return; // Skip if row data is missing
        }
         // Ensure the row data has SlNo before accessing it
         console.log("Row Data:", oRowData);
        var iIndex = aData.findIndex(function (item) {
          return item.SlNo === oRowData.SlNo;
        });

        if (iIndex !== -1) {
            console.log("imageVBox" + (iIndex+1));
            var oVBox = that.byId("imageVBox" + (iIndex + 1));
            if (oVBox) {
                oVBox.setVisible(false);
            }
          aData.splice(iIndex, 1); // Remove the item from the arrayy
          
        } 
        else {
            console.error("Row with SlNo not found in data.");
        }
    },this);

     // Recalculate SlNo for all remaining rows
     aData.forEach(function (oRow, index) {
        oRow.SlNo = index + 1;  // Update SlNo to reflect the new sequence
    });
    // Update the model with the modified data
    oModel.setProperty("/records", aData);

    // Deselect all rows after deletion
    oTable.removeSelections(true);

    MessageToast.show("Selected rows deleted.");
      },

      // Cancel logic
      onCancelCreateBill: function() {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("Gvr_issue"); // Adjust the route name as needed

          // Show success message
          MessageToast.show("The Customer profile creation has been discarded");
      },
       // Open the dialog for the correct row
       onOpenDialogPress: function (rowNumber) {
        this.currentRow = rowNumber;
        var oDialog = this.byId("uploadDialog");
        oDialog.open();
    },

    onDialogClose: function () {
        var oDialog = this.byId("uploadDialog");
        oDialog.close();
    },

    // Display uploaded image in correct VBox
    onFileChange: function (oEvent) {
        var aFiles = oEvent.getParameter("files");
        var oFile = aFiles && aFiles[0];
    
        if (oFile) {
            var oReader = new FileReader();
            oReader.onload = function (e) {
                var sBase64 = e.target.result;
                this._updateVBoxImage(sBase64);
                this.onDialogClose();
                this.byId("dialogFileUploader").clear();
                sap.m.MessageToast.show("Image loaded successfully!");
            }.bind(this);
            oReader.readAsDataURL(oFile);
        } else {
            sap.m.MessageToast.show("No file selected.");
        }
    },

    // Capture and display photo in correct VBox
    capturePic: function (oEvent) {
         // Get the customData for the button (SlNo value)
            var slNo = oEvent.getSource().getCustomData()[0].getValue();
            console.log("Camera button clicked for SlNo: " + slNo);
            this.currentRow = slNo; // Store current row for later use
        var that = this;
        var stream = null;

        this.cameraDialog = new sap.m.Dialog({
            title: "Take a photo",
            beginButton: new sap.m.Button({
                text: "Capture",
                press: function () {
                    that.imageValue = document.getElementById("player");
                    console.log("Capture button clicked, attempting to capture image.");
                    if (that.imageValue) {
                        that._captureImageFromVideo();
                        that.cameraDialog.close();
                    } else {
                        sap.m.MessageToast.show("Failed to capture image.");
                    }
                }
            }),
            content: [
                new sap.ui.core.HTML({
                    content: "<video id='player' autoplay></video>"
                })
            ],
            endButton: new sap.m.Button({
                text: "Cancel",
                press: function () {
                    that.cameraDialog.close();
                }
            }),
            afterClose: function () {
                if (stream) {
                    stream.getTracks().forEach(function(track) {
                        track.stop();
                    });
                }
            }
        });

        this.getView().addDependent(this.cameraDialog);
        this.cameraDialog.open();

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function (mediaStream) {
                    stream = mediaStream;
                    var player = document.getElementById('player');
                    
                    if (player) {
                        player.srcObject = stream;
                    } else {
                        console.error("Video element not found for the media stream.");
                    }
                })
                .catch(function (error) {
                    sap.m.MessageToast.show("Error accessing camera: " + error.message);
                });
        }
    },

    // Capture image from video and set in VBox
    _captureImageFromVideo: function () {
        var snapShotCanvas = document.createElement('canvas');
        snapShotCanvas.width = 140;
        snapShotCanvas.height = 140;
        var oContext = snapShotCanvas.getContext('2d');
        var player = document.getElementById("player");

         // Ensure player video element is valid
    if (player) {
        oContext.drawImage(player, 0, 0, snapShotCanvas.width, snapShotCanvas.height);

        // Convert to base64 and update VBox
        var sBase64Image = snapShotCanvas.toDataURL();
        this._updateVBoxImage(sBase64Image);
        console.log("Image captured and set in VBox.");
    } else {
        console.error("Player video element not found.");
    }
    },

    // Update the image in the specified VBox
    _updateVBoxImage: function (sBase64) {
        console.log("Current Row:", this.currentRow);
        var oVBox = this.byId("imageVBox" + this.currentRow);
        console.log("VBox:", "imageVBox" + this.currentRow);

    if (!oVBox) {
        console.error("VBox not found for currentRow:", this.currentRow);
        return;
    }
        // Clear previous images and add the new image
        oVBox.removeAllItems();
        oVBox.addItem(new sap.m.Text({ text: this.currentRow }));
        oVBox.addItem(new sap.m.Image({
            src: sBase64,
            width: "140px",
            height: "140px",
            press: this.onImagePress.bind(this)
        }));
        oVBox.setVisible(true);
    },

    onImagePress: function (oEvent) {
        var oImageSrc = oEvent.getSource().getSrc();
        var oVBoxId = oEvent.getSource().getParent().getId();
        var oSrNoText = this.byId(oVBoxId).getItems()[0].getText();
    
        if (!this._oImageDialog) {
            this._oImageDialog = new sap.m.Dialog({
                title: "Image View",
                contentWidth: "70%",
                contentHeight: "70%",
                content: [
                    new sap.m.Image({ src: oImageSrc, width: "100%", height: "100%" }),
                ],
                endButton: new sap.m.Button({
                    text: "Close",
                    press: function () {
                        this._oImageDialog.close();
                    }.bind(this)
                })
            });
        } else {
            this._oImageDialog.getContent()[0].setSrc(oImageSrc);  // Update image source
            this._oImageDialog.getContent()[1].setText("Uploaded from " + oSrNoText); // Update row number
        }
    
        this._oImageDialog.open();
    }

      
  });
});
