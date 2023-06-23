sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, History, MessageToast) {
    "use strict";

    function _onObjectMatch(oEvent) {
      var cityFrom = oEvent.getParameter("arguments").cityFrom;
      var cityTo = oEvent.getParameter("arguments").cityTo;

      var filters = new Array();
      var filter = new sap.ui.model.Filter(
        "Cityfrom",
        sap.ui.model.FilterOperator.EQ,
        cityFrom
      );
      filters.push(filter);
      var filter = new sap.ui.model.Filter(
        "Cityto",
        sap.ui.model.FilterOperator.EQ,
        cityTo
      );
      filters.push(filter);

      var oTable = this.getView().byId("itinerarios");

      oTable.getBinding("items").filter(filters);
    }

    return Controller.extend("exaccs.clase4odata.controller.Itinerarios", {
      onInit: function () {
        var vuelosTable = this.getView().byId("vuelos");
        vuelosTable.destroyItems();

        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter
          .getRoute("itinerarios")
          .attachPatternMatched(_onObjectMatch, this);
      },
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
      showVuelos: function (oEvent) {
        var vuelosTable = this.getView().byId("vuelos");
        vuelosTable.destroyItems();

        //Recupero los vuelos para el Itinerario
        var vuelos = oEvent
          .getSource()
          .getBindingContext("vuelos")
          .getObject({ expand: "VuelosSet" });

        var vuelosItems = [];

        //Creamos Format
        var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
          pattern: "dd/MM/yyyy",
          strictParsing: true,
          UTC: true,
        });

        //Armamos e array de los Vuelos
        for (var i in vuelos.VuelosSet) {
          var dateFormated = dateFormat.format(vuelos.VuelosSet[i].Fldate);
          var sLibres =
            vuelos.VuelosSet[i].Seatsmax - vuelos.VuelosSet[i].Seatsocc;
          vuelosItems.push(
            new sap.m.ColumnListItem({
              cells: [
                new sap.m.Label({ text: dateFormated }),
                new sap.m.Label({ text: vuelos.VuelosSet[i].Price }),
                new sap.m.Label({ text: vuelos.VuelosSet[i].Currency }),
                new sap.m.Label({ text: sLibres }),
              ],
              type: "Navigation",
              press: [this.createReserva, this],
            })
          );
        }

        //Definimos la tabla con las columnas
        var oTable = new sap.m.Table({
          id: "tablaVuelos",
          width: "auto",
          columns: [
            new sap.m.Column({
              header: new sap.m.Label({ text: "{i18n>Fldate}" }),
            }),
            new sap.m.Column({
              header: new sap.m.Label({ text: "{i18n>Price}" }),
            }),
            new sap.m.Column({
              header: new sap.m.Label({ text: "{i18n>Currency}" }),
            }),
            new sap.m.Column({
              header: new sap.m.Label({ text: "{i18n>SeatEmpty}" }),
            }),
          ],
          items: vuelosItems,
        }).addStyleClass("sapUiSmallMargin");

        //Asociamos la tabla al Hbox
        vuelosTable.addItem(oTable);
      },

      createReserva: function (oEvent) {
        var body = {
          Carrid: "AA",
          Connid: "0017",
        };

        this.getView()
          .getModel("vuelos")
          .create("/ReservasSet", body, {
            success: function (oResult) {
              MessageToast.show("Se creo la reserva " + oResult.Bookid);
              this.getView().byId("tablaVuelos").getBinding("items").refresh();
            }.bind(this),
            error: function (oErr) {
              MessageToast.show(oErr);
            }.bind(this),
          });
      },
    });
  }
);
