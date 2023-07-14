sap.ui.define(
  ["sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/routing/History",],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller,JSONModel, History) {
    "use strict";


    function _onObjectMatch(oEvent) {
      var idCliente = oEvent.getParameter("arguments").id;
      this.getView().bindElement({
        path: "vuelos>/ClienteSet('" + idCliente + "')",
    });
    }

    return Controller.extend("exaccs.clase4odata.controller.ClienteDetail", {
      onInit: function () {
        //Recuperamos los argumentos y cargamos el binding
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter
          .getRoute("clienteDetail")
          .attachPatternMatched(_onObjectMatch, this);


                  //Declaramos Modelo local para trabajar con la vista
        const oViewModel = new JSONModel({
          editmode: false,
        });
        this.getView().setModel(oViewModel, "viewModel");
      },
      convToInt: function (dsc) {
        return parseInt(dsc);
      },

      onBack: function(){
        var oHistory = History.getInstance();
        var sPrevia = oHistory.getPreviousHash();

        if (sPrevia !== undefined) {
          window.history.go(-1);
        } else {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("RouteMain");
        }
      }, 
      handleEditPress: function(oEvent){
        this.getView().getModel("viewModel").setProperty("/editmode", true)
      },
      handleCancelPress: function(oEvent){
        this.getView().getModel("viewModel").setProperty("/editmode", false)
      },
    });
  }
);
