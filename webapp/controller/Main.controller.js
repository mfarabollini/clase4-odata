sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "exaccs/clase4odata/model/models",
    "sap/m/MessageToast",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, models, MessageToast) {
    "use strict";

    return Controller.extend("exaccs.clase4odata.controller.Main", {
      onAfterRendering: function () {
        this.getView().setModel(models.createCounter(), "counterJson");

        var oDataModel = this.getView().getModel("vuelos");

        oDataModel.read("/AerolineaSet/$count", {
          success: function (oResult) {
            // check if the result is a number
            this.getView()
              .getModel("counterJson")
              .setProperty("/Aerolineas", oResult);
          }.bind(this),
          error: function (oErr) {},
        });

        oDataModel.read("/AeropuertoSet/$count", {
          success: function (oResult) {
            // check if the result is a number
            this.getView()
              .getModel("counterJson")
              .setProperty("/Aeropuertos", oResult);
          }.bind(this),
          error: function (oErr) {},
        });

        oDataModel.read("/ClienteSet/$count", {
          success: function (oResult) {
            // check if the result is a number
            this.getView()
              .getModel("counterJson")
              .setProperty("/Clientes", oResult);
          }.bind(this),
          error: function (oErr) {},
        });
      },

      navToAerolineas: function (evt) {
        const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("aerolineas");
      },

      buscar: function (oEvent) {
               
        var cityFrom = this.getView().byId('fromCity').getSelectedKey();
        var cityTo = this.getView().byId('toCity').getSelectedKey();
  
        var filters = new Array(); 
        var filter = new sap.ui.model.Filter("Cityfrom", sap.ui.model.FilterOperator.EQ, cityFrom);
        filters.push(filter);  
        var filter = new sap.ui.model.Filter("Cityto", sap.ui.model.FilterOperator.EQ, cityTo);
        filters.push(filter);  


        var oDataModel = this.getView().getModel("vuelos");
        oDataModel.read("/ItinerarioSet/", {
          filters:  filters,
          success: function (oResult) {
            if(oResult.results.length === 0){
              MessageToast.show("No hay Vuelos para esos destinos")
            }else{
              const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
              oRouter.navTo("itinerarios", {
                cityFrom: cityFrom,
                cityTo: cityTo
              });
            }
          }.bind(this),
          error: function (oErr) {},
        });
      },
    });
  }
);
