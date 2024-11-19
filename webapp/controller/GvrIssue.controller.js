sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/comp/valuehelpdialog/ValueHelpDialog",
    "sap/ui/model/json/JSONModel",
    "sap/m/StandardListItem",
    "sap/m/List",
    "sap/m/MessageToast",
    "sap/ui/core/format/DateFormat"
], function (Controller, ValueHelpDialog, JSONModel, DateFormat, StandardListItem, List, MessageToast) {
    "use strict";

    return Controller.extend("gvtracker.controller.GvrIssue", {

        onInit: function () {

           

            // Set current date in 'yyyy-MM-dd' format
            const oDate = new Date();
            const sCurrentDate = oDate.toISOString().split("T")[0]; // Format date as 'yyyy-MM-dd'

            // Create and set model with the current date
            const oDateModel = new sap.ui.model.json.JSONModel({
                currentDate: sCurrentDate
            });
            
            // Attach the model to the view
            this.getView().setModel(oDateModel, "viewModel"); 




            var sDataPath = sap.ui.require.toUrl("gvtracker/model/data.json");
            var oTableModel = new sap.ui.model.json.JSONModel();
        
            // Load data using fetch API
            fetch(sDataPath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Data loaded:", data); // Check the loaded data
                    data.selectedTotalValue = 0; // Initial total value
                    oTableModel.setData(data);
                    this.calculateTotalValue();  // Initial calculation
                    sap.m.MessageToast.show("Data loaded successfully.");
                    this.getView().setModel(oTableModel); // Attach the model here, after loading data
                    
                })
                .catch(error => {
                    console.error("There has been a problem with fetching the data:", error);
                    sap.m.MessageToast.show("Failed to load data from data.json");
                });


            


            // Simulated values for the system user and role
            const sSysUser = "exampleUser"; // Replace with actual user retrieval logic
            const sUserRole = "CX"; // Simulate user role, e.g. "C1", "C2", etc.

            // Fetch Plant Code based on User Role
            this._getPlantCode(sSysUser, sUserRole)
                .then((sPlantCode) => {
                    // Fetch Plant Description using the Plant Code
                    return this._getPlantDescription(sPlantCode);
                })
                .then((sPlantDescription) => {
                    // Format the result as "PlantCode - PlantDescription"
                    const sResult = `${sPlantDescription.plantCode} - ${sPlantDescription.plantName}`;
                    
                    // Create a model to hold the shopping mall value
                    const oModel = new JSONModel({
                        shoppingMall: sResult
                    });
                    this.getView().setModel(oModel);
                })
                .catch((error) => {
                    console.error("Error fetching shopping mall information:", error);
                }); 



        },

        _getPlantCode: function (sysUser, userRole) {
            // Implement your logic to get the plant code
            return new Promise((resolve, reject) => {
                // Simulated asynchronous call to fetch the plant code
                // Replace this with actual service call
                if (userRole === "CX") {
                    resolve("1000"); // Simulated plant code
                } else {
                    reject("Invalid User Role");
                }
            });
        },

        _getPlantDescription: function (plantCode) {
            // Implement your logic to get the plant description
            return new Promise((resolve) => {
                // Simulated asynchronous call to fetch the plant description
                // Replace this with actual service call
                const plantDescription = {
                    plantCode: plantCode,
                    plantName: "Prestige Mall" // Simulated plant name
                };
                resolve(plantDescription);
            });
        },

            // Function to calculate the total value of selected items
            calculateTotalValue: function () {
                var oTotalModel = this.getView().getModel();
                var aData = oTotalModel.getProperty("/data") || [];
                
                // Calculate the sum of the 'Value' field for items with 'Sel' set to true
                var iTotalValue = aData.reduce(function (acc, item) {
                    return item.Sel ? acc + (item.IssueQty * item.Value) : acc;
                }, 0);

                // Update the selectedTotalValue directly in the same model
                oTotalModel.setProperty("/selectedTotalValue", iTotalValue);
            },

            // Event handler for checkbox selection change
            onSelectionChange: function (oEvent) {
                // Retrieve the current state of the checkbox using the "selected" parameter
                var bSelected = oEvent.getParameter("selected");

                // Example logic based on whether the checkbox is selected or not
                if (bSelected) {
                    console.log("Checkbox is selected");
                } else {
                    console.log("Checkbox is deselected");
                }

                // Call a function to update the total if needed
                this.calculateTotalValue(); // Recalculate total whenever selection changes

            },
           
        
            onCustomerMobileValueHelp: function (oEvent) {
                var oInput = oEvent.getSource();

                // Create a new JSONModel instance and load the data
                var oModel = new JSONModel();
                var sPath = sap.ui.require.toUrl("gvtracker/model/customers.json");

                console.log("Loading data from:", sPath);
                oModel.loadData(sPath);

                // Create the ValueHelpDialog
                var oValueHelpDialog = new ValueHelpDialog({
                    title: "Select Customer Mobile",
                    supportMultiselect: false,
                    supportRanges: false,
                    ok: function (oControlEvent) {
                    // Do not use setSelectedItems, instead get the selected item directly
                    var aSelectedItems = oValueHelpDialog.getItems();
                    if (aSelectedItems.length > 0) {
                        // Assuming you want the first item (as it's single selection)
                        var sSelectedMobile = aSelectedItems[0].getTitle();
                        oInput.setValue(sSelectedMobile); // Set the value to the input field
                    }
                        oValueHelpDialog.close();
                    },
                    cancel: function () {
                        oValueHelpDialog.close();
                    }
                });

                // Attach completed request handler
                oModel.attachRequestCompleted(function () {
                    // Set the model to the dialog
                    oValueHelpDialog.setModel(oModel);

                    // Clear existing content (if any)
                    oValueHelpDialog.removeAllContent();

                    // Create the list for the ValueHelpDialog
                    var oList = new sap.m.List({
                        items: {
                            path: "/customers",
                            template: new sap.m.StandardListItem({
                                title: "{mobile}",
                                type: "Active",
                                press: function (oEvent) {
                                    var oSelectedItem = oEvent.getSource();
                                    var sSelectedMobile = oSelectedItem.getTitle();
                                    oInput.setValue(sSelectedMobile); // Set the value to the input field
                                    oValueHelpDialog.close(); // Close the dialog
                                }
                            })
                        }
                    });

                    // Add the list to the dialog's content aggregation
                    oValueHelpDialog.addContent(oList);

                    // Open the dialog
                    oValueHelpDialog.open();
                });

                // Error handling for failed data load
                oModel.attachRequestFailed(function (oEvent) {
                    var sErrorMessage = oEvent.getParameter("responseText");
                    console.error("Failed to load data:", sErrorMessage);
                    MessageToast.show("Failed to load customer data. Please try again.");
                });
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

                    // New method for Campaign Value Help
        onCampaignValueHelp: function (oEvent) {
            var oInput = oEvent.getSource();

            // Create a new JSONModel instance and load the data
            var oModel = new JSONModel();
            var sPath = sap.ui.require.toUrl("gvtracker/model/campaigns.json");

            console.log("Loading campaign data from:", sPath);
            oModel.loadData(sPath);

            // Create the ValueHelpDialog for Campaign
            var oCampaignDialog = new ValueHelpDialog({
                title: "Select Campaign",
                supportMultiselect: false,
                supportRanges: false,
                ok: function () {
                    // This method won't be used, as we handle selection in the item press event
                },
                cancel: function () {
                    oCampaignDialog.close();
                }
            });

            // Attach completed request handler
            oModel.attachRequestCompleted(function () {
                // Set the model to the dialog
                oCampaignDialog.setModel(oModel);
                oCampaignDialog.removeAllContent();

                // Create the list for the Campaign ValueHelpDialog
                var oList = new sap.m.List({
                    items: {
                        path: "/campaigns",
                        template: new sap.m.StandardListItem({
                            title: "{name}", // Assuming campaigns have a 'name' property
                            type: "Active",
                            press: function (oEvent) {
                                var oSelectedItem = oEvent.getSource();
                                var sSelectedCampaign = oSelectedItem.getTitle();
                                oInput.setValue(sSelectedCampaign); // Set the value to the input field
                                oCampaignDialog.close(); // Close the dialog
                            }
                        })
                    }
                });

                // Add the list to the dialog's content aggregation
                oCampaignDialog.addContent(oList);

                // Open the dialog
                oCampaignDialog.open();
            });

            // Error handling for failed data load
            oModel.attachRequestFailed(function (oEvent) {
                var sErrorMessage = oEvent.getParameter("responseText");
                console.error("Failed to load campaign data:", sErrorMessage);
                MessageToast.show("Failed to load campaign data. Please try again.");
            });
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

        validateMandatoryFields: function () {
            const oView = this.getView();
            const sMobile = oView.byId("CustomerMobile12").getValue();
            // const sOTP = oView.byId("otp").getValue();
            // const sBillInfo = oView.byId("onNavigate2").getValue(); 

            // Check if all mandatory fields are filled
            // if (!sMobile || !sOTP || !sBillInfo || !sIssueQty) {
            //     return false;
            // }

            if(!sMobile)
                return false;
            return true;
        },

        createGVRDocument: function () {
            // Placeholder code for GVR document creation
            MessageToast.show("GVR Document created successfully.");
        },

        clearScreen: function () {
            const oView = this.getView();
            oView.byId("CustomerMobile12").setValue("");
            // oView.byId("otp").setValue("");
            // oView.byId("onNavigate2").setValue(""); 
        },


        onIssueQtyChange: function (oEvent) {

            var oInput = oEvent.getSource();
            var sValue = oInput.getValue();
            var oContext = oInput.getBindingContext();
            var iStockQty = oContext.getProperty("StockQty");

            // Validate that the Issue Quantity is numeric
            if (isNaN(sValue) || sValue.trim() === "") {
            oInput.setValueState("Error");
            oInput.setValueStateText("Maintain a valid Quantity value");
            return;
            }

            // Validate that Issue Quantity is not greater than Stock Quantity
            if (parseInt(sValue) > iStockQty) {
            oInput.setValueState("Error");
            oInput.setValueStateText("The issue qty should not be more than the stock quantity");
            } else {
            oInput.setValueState("None");
            }
            
                // Optionally, recalculate total value if needed
                this.calculateTotalValue();
            },
             // Event handler for the liveChange of the Issue Quantity field
             onLiveChange: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oInput = oEvent.getSource();
                
                //revert
                // Check if the value contains any non-numeric characters
                if (isNaN(sValue)&& sValue !== "") {
                oInput.setValueState("Error");
                oInput.setValueStateText("Maintain a valid Quantity value");
                } else {
                oInput.setValueState("None");
                }
            }
        

        
        
    });
});
