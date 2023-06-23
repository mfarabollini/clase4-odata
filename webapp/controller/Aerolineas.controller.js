sap.ui.define(
  ["sap/ui/core/mvc/Controller",
  "sap/ui/core/routing/History"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, History) {
    "use strict";

    return Controller.extend("exaccs.clase4odata.controller.Aerolineas", {
      onInit: function () {},
      navToVuelos: function (oEvent) {
        const Aerolinea = oEvent
          .getSource()
          .getBindingContext("vuelos")
          .getObject().Carrid;

        const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("vuelos", {
          aerolinea: Aerolinea,
        });
      },
      onBack: function(oEvent){
        var oHistory = History.getInstance();
        var sPrevia = oHistory.getPreviousHash();

        if(sPrevia !== undefined){
            window.history.go(-1);
        }else{
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteMain");
        }

    }

    });
  }
);
