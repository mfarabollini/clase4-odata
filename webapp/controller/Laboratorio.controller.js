sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, History, Fragment, MessageToast) {
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

      //Open Dialogo para crear el Integrante
      createIntegrante: function (evt) {
        const oTblIntegrantes = this.getView().byId("tblIntegrantes");
        const oCliente = oTblIntegrantes.getBindingContext("vuelos").getPath();

        //Cargamos el Dialogo
        var oView = this.getView();
        if (!this.byId("formIntegrantes")) {
          Fragment.load({
            id: this.oView.getId(),
            name: "exaccs.clase4odata.view.IntegranteForm",
            controller: this,
          }).then(function (oDialog) {
            oView.addDependent(oDialog);
            oDialog.bindElement({
              path: oCliente,
              model: "vuelos",
            });
            oDialog.open();
          });
        }
      },

      //Destroy del Dialogo cuando se cierra (se ejecuta el Close)
      inClose: function (evt) {
        evt.getSource().destroy();
        //this.byId("formIntegrantes").destroy();
      },

      //Formtatter para calcular la Edad desde la Fecha Nacimiento
      calcDate: function (fecnac) { 
        var today = new Date();
        var diff = today - fecnac;
        return Math.ceil(diff / (1000 * 60 * 60 * 24) / 365);
      },

      //Evento desde Boton cerrar desde el Dialogo
      closeDialog: function () {
        this.byId("formIntegrantes").close();
      },

      //Crea el Integrante en el BackEnd desde boton crear en Dialogo
      crearIntegrante: function (evt) {
        this.byId("formIntegrantes").setBusy(true);

        var oIntegrante = {
          Id: this.getView().byId("id").getText(),
          //Id_Inte, sepuede calcularaca o en el back end
          Nombre: this.getView().byId("name_int").getValue(),
          Relacion: this.getView().byId("relacion").getSelectedItem().getText(),
          FecNac: this.getView().byId("fec_nac").getDateValue(),
          Sexo: this.getView().byId("sexo").getSelectedItem().getText(),
        };
        this.getView()
          .getModel("vuelos")
          .create("/IntegrantesSet", oIntegrante, {
            success: function (oResult, oResp) {
              // oResp info sobre la REST (status code 201 ok)

              //Vuelve sin error (oResult tiene la entidad creada)
              MessageToast.show("Se creo el Integrante " + oResult.IdInte);
              this.byId("formIntegrantes").close();
            }.bind(this),
            error: function (oErr) {
              //Vuelve con error (oErr tiene el error)
              var response = JSON.parse(oErr.responseText);
              MessageToast.show(response.error.message.value);
              this.byId("formIntegrantes").setBusy(false);
            }.bind(this),
          });
      },

      //Borra el integrante en BackEnd desde delete en la tabla Integrantes
      onDelIntegrante: function (oEvent) {
        const oListItem = oEvent.getParameter("listItem");
        const sPathInteg = oListItem.getBindingContext("vuelos").getPath();
        oListItem.setHighlight("Error");

        this.getView()
          .getModel("vuelos")
          .remove(sPathInteg, {
            method: "DELETE",
            success: function (oResult, oResp) {
              // oResult devulve la entidad  que en el delete no la devuelve,
              // oResp info sobre la REST (status code 204 ok, pero sin respuesta)
              MessageToast.show("Se borro el Integrante");
              //sap.ui.getCore().byId("tblIntegrantes").getBinding("items").refresh();
            }.bind(this),
            error: function (oErr) {
              var response = JSON.parse(oErr.responseText);
              MessageToast.show(response.error.message.value);
              oListItem.setHighlight("None");
            }.bind(this),
          });
      },

      // Navega a pantalla de detalle de Cliente
      navToDetalle: function (oEvent) {
        const sCliente = oEvent
          .getSource()
          .getBindingContext("vuelos")
          .getObject().Id;

        const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("clienteDetail", {
          id: sCliente,
        });
      },

      //Formateo campo Tipo de Cliente
      formatTipoCliente: function (custType) {
        
       if ((custType == "P")) {
          return "Particular";
        } else if ((custType == "B")) {
          return "Empresa";
        } else {
          return "Desconocido";
        }
      },

      //Formateo campo Descuento
      formatDescuento: function (descuento) {
        if (descuento === "000") {
          return "0%";
        } else {
          let sDesc = parseInt(descuento);
          return sDesc + "%";
        }
      },
    });
  }
);
