sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, JSONModel, History, MessageToast) {
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

      onBack: function () {
        var oHistory = History.getInstance();
        var sPrevia = oHistory.getPreviousHash();

        if (sPrevia !== undefined) {
          window.history.go(-1);
        } else {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("RouteMain");
        }
      },

      handleEditPress: function (oEvent) {
        this.getView().getModel("viewModel").setProperty("/editmode", true);
      },
      handleCancelPress: function (oEvent) {
        this.getView().getModel("viewModel").setProperty("/editmode", false);
      },

      handleSavePress: function (oEvent) {
        const oContext = oEvent.getSource().getBindingContext("vuelos");
        var oClientePath = oContext.getPath();

        var body = {
          Id: this.getView().byId("id").getText(),
          Name: this.getView().byId("name").getText(),
          Street: this.getView().byId("street").getValue(),
          City: this.getView().byId("city").getValue(),
          Country: this.getView().byId("country").getValue(),
          Telephone: this.getView().byId("telephone").getValue(),
          Custtype: this.getView().byId("tipo").getSelectedItem().getKey(),
          Discount: this.getView().byId("discount").getValue().toString(),
          Email: this.getView().byId("email").getValue(),
          Webuser: this.getView().byId("web").getValue(),
        };

        //Modificamos el Cliente
        this.getView()
          .getModel("vuelos")
          .update(oClientePath, body, {
            success: function (oData, oResp) {
              // oResult devulve la entidad que en el update no la devuelve,
              // oResp info sobre la REST (status code 204 ok, pero sin respuesta)

              //Vuelve sin error (oResult tiene la entidad creada)
              MessageToast.show("Cliente Editado Correctamnete");
              this.handleCancelPress();
              this.onBack();
            }.bind(this),
            error: function (oErr) {
              //Vuelve con error (oErr tiene el error)
              var response = JSON.parse(oErr.responseText);
              MessageToast.show(response.error.message.value);
            }.bind(this),
          });
      },
    });
  }
);
