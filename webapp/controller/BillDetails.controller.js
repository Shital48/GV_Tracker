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

           // Create and add VBox dynamically to the view
        var newVBox = new sap.m.VBox({
           // id: "imageVBox" + 1,
            // class: "imageBox vboxBorder",
            alignItems: "Center",
            justifyContent: "Center",
            width: "140px",
            height: "156.5px",
            visible: true
        });
        // Add the border CSS class
        newVBox.addStyleClass("vboxBorder");
    
    
        var text = new sap.m.Text({
           // id: "srNo" + 1,
            text: 1
            // class: "srNoText"
        });
    
        var image = new sap.m.Image({
          //  id: "image" + 1,
            src: "",
            width: "140px",
            height: "140px",
            visible: true,
            press: this.onImagePress.bind(this)
        });
    
        newVBox.addItem(text);
        newVBox.addItem(image);
    
        // Append the new VBox to the existing container
        this.byId("imageContainer").addItem(newVBox); 
        console.log("Available VBox IDs:", this.byId("imageContainer").getItems().map(function(item) { return item.getId(); }));


          var oModel = new JSONModel(oData);
          this.getView().setModel(oModel);
          
      },
      

      onAddRow: function () {


        var oModel = this.getView().getModel();
        var oData = oModel.getData();
    
        if(oData.records.length<8)
        {
        // Calculate next SlNo based on the length of the records array
        var newSlNo = oData.records.length + 1;
    
        var newRow = {
            SlNo: newSlNo, 
            billNo: "",
            billValue: "",
            photoPath: ""
        };
        
        // Add new row to the records array
        oData.records.push(newRow);
        oModel.setData(oData); // Update the model with new data
    
        // Create and add VBox dynamically to the view
        var newVBox = new sap.m.VBox({
          //  id: "imageVBox" + newSlNo,
            // class: "imageBox vboxBorder",
            alignItems: "Center",
            justifyContent: "Center",
            width: "140px",
            height: "156.5px",
            visible: true
        });

        // Add the border CSS class
        newVBox.addStyleClass("vboxBorder");
    
        var text = new sap.m.Text({
           // id: "srNo" + newSlNo,
            text: newSlNo
            // class: "srNoText"
        });
    
        var image = new sap.m.Image({
           // id: "image" + newSlNo,
            src: "",
            width: "140px",
            height: "140px",
            visible: true,
            press: this.onImagePress.bind(this)
        });
    
        newVBox.addItem(text);
        newVBox.addItem(image);
    
        // Append the new VBox to the existing container
        this.byId("imageContainer").addItem(newVBox);
        console.log("New row added with SlNo:", newSlNo);
       // console.log("texttt:","imageVBox" + newSlNo);
    }
    else{
        sap.m.MessageToast.show("You can not add more Bill Details");
    }
    },
    

      // Row Selection logic (via selectionChange)
      onRowSelect: function (oEvent) {
        var oTable = this.byId("billDetailsTable");
        var aSelectedItems = oTable.getSelectedItems();
     },

     onDeleteRow: function () {
        var oTable = this.byId("billDetailsTable");
        var aSelectedItems = oTable.getSelectedItems();
    
        if (aSelectedItems.length === 0) {
            MessageToast.show("Please select rows to delete.");
            return;
        }
    
        var oModel = this.getView().getModel();
        var aData = oModel.getProperty("/records");
    
         // Collect indexes of selected items, then sort in descending order
    var aIndexes = aSelectedItems.map(function (oItem) {
        var oContext = oItem.getBindingContext();
        var oRowData = oContext.getObject();
        return aData.findIndex(function (item) {
            return item.SlNo === oRowData.SlNo;
        });
    }).sort(function (a, b) { return b - a; }); // Sort in reverse order

    // Remove selected rows and corresponding VBoxes
    aIndexes.forEach(function (iIndex) {
        if (iIndex !== -1) {
            // Remove corresponding VBox from view
            var oVBox = this.byId("imageContainer").getItems()[iIndex];
            if (oVBox) {
                oVBox.destroy();
            }

            // Remove the row from the data model
            aData.splice(iIndex, 1);
        }
    }, this);
    
        // Recalculate SlNo for all remaining rows and update the text of the VBoxes
        aData.forEach(function (oRow, index) {
            oRow.SlNo = index + 1;
             // Update text inside corresponding VBox in imageContainer
        var oVBox = this.byId("imageContainer").getItems()[index];
        if (oVBox) {
 
            var oTextItems = oVBox.getItems(); // Get items inside VBox
            oTextItems.forEach(function(item) {
                if (item.isA("sap.m.Text")) { // Check if the item is a Text control
                    item.setText(oRow.SlNo); // Update the text with the new SlNo value
                }
            });

        }
            // var oText = this.byId("srNo" + (index + 1));
            // console.log("oText:"+oText);
            // if (oText) {
            //     oText.setText(oRow.SlNo); // Update Text inside the VBox
            // }
            
        }, this);
    
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
        snapShotCanvas.width = 300;
        snapShotCanvas.height = 300;
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
        //var oVBox = this.byId("imageVBox" + (this.currentRow-1));
        var oVBox = this.byId("imageContainer").getItems()[this.currentRow-1];
        console.log("oVBox before update:", oVBox);
        console.log("After oVBox Available VBox IDs:", this.byId("imageContainer").getItems().map(function(item) { return item.getId(); }));

        console.log("VBox for row", this.currentRow, ":", oVBox);
       // oVBox.setVisible(true);
    if (oVBox) {
        // Clear previous images and add the new image
        oVBox.removeAllItems();
        oVBox.addItem(new sap.m.Text({ text: this.currentRow }));
        oVBox.addItem(new sap.m.Image({
            src: sBase64,
            width: "140px",
            height: "140px",
            press: this.onImagePress.bind(this)
        }));
        
    }else {
        console.error("VBox not found for currentRow:", this.currentRow);
        
    }
    },

    onImagePress: function (oEvent) {
        var oImageSrc = oEvent.getSource().getSrc();
       // var oVBoxId = oEvent.getSource().getParent().getId();
       // var oSrNoText = this.byId(oVBoxId).getItems()[0].getText();
    
        if (!this._oImageDialog) {
            this._oImageDialog = new sap.m.Dialog({
                title: "Image View",
                contentWidth: "25vw",
                contentHeight: "25vw",
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
           // this._oImageDialog.getContent()[1].setText("Uploaded from " + oSrNoText); // Update row number
        }
    
        this._oImageDialog.open();
    }

      
  });
});
