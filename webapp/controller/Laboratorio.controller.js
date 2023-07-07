sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History"],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, History) {
    "use strict";

    return Controller.extend("exaccs.clase4odata.controller.Laboratorio", {
      onInit: function () {},

      onBack: function (oEvent) {
        var oHistory = History.getInstance();
        var sPrevia = oHistory.getPreviousHash();

        if (sPrevia !== undefined) {
          window.history.go(-1);
        } else {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("RouteMain");
        }
      },
      navToIntegrantes: function (evt) {
        //Seteamos como Visible el Panel
        const oPnlIntegrantes = this.getView().byId("pnlInteg");
        oPnlIntegrantes.setVisible(true);

        //Obtenemos la Tabla y le aociamos el como contexto el Cliente, para obtener los integrantes
        const oTblIntegrantes = this.getView().byId("tblIntegrantes");
        oTblIntegrantes.bindElement(
          "vuelos>" + evt.getSource().getBindingContextPath()
        );

        //Ejemplos de info que podemos obtener aqui
        //evt.getSource().getBindingContext("vuelos").getObject({ expand: "IntegrantesSet"}).IntegrantesSet.length
        //evt.getSource().getBindingContext("vuelos").getPath()
        //evt.getSource().getBindingContextPath()       
        
      },
      createIntegrante: function (evt) {

        const oTblIntegrantes = this.getView().byId("tblIntegrantes");
        oTblIntegrantes.getBindingContext("vuelos").getObject().Id;
      },

      calcDate: function (fecnac) {
        var today = new Date();
        var diff = today - fecnac;
        return Math.ceil(diff / (1000 * 60 * 60 * 24) / 365);
      },
    });
  }
);
