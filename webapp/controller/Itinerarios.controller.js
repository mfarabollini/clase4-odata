sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller, History, MessageToast, JSONModel, Fragment) {
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
        //Borramos los items que pueda tener cargado el HBox
        var boxTbl1 = this.getView().byId("box1");
        var boxTbl2 = this.getView().byId("box2");
        boxTbl1.destroyItems();
        boxTbl2.destroyItems();

        //Declaramos Modelo local para travajar con la vista
        const oViewModel = new JSONModel({
          state: true,
        });
        this.getView().setModel(oViewModel, "viewModel");

        //Recuperamos los argumentos y cargamos el binding
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter
          .getRoute("itinerarios")
          .attachPatternMatched(_onObjectMatch, this);
      },

      //Volver
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

      //Muestra los vuelos al seleccionar Itinerario
      showVuelos: function (oEvent) {
        var boxSwitch = this.getView().byId("switch");
        boxSwitch.setVisible(true);

        var boxTbl1 = this.getView().byId("box1");
        var boxTbl2 = this.getView().byId("box2");
        boxTbl1.destroyItems();
        boxTbl2.destroyItems();

        //Recupero los vuelos para el Itinerario seleccionado
        var oContext = oEvent.getSource().getBindingContext("vuelos");
        var vuelos = oContext.getObject({ expand: "VuelosSet" });

        //  Declaramos array de items vacio
        var vuelosItems = [];

        //Creamos Format
        var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
          pattern: "dd/MM/yyyy",
          strictParsing: true,
          UTC: true,
        });

        //Declaramos primera tabla sin Binding
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
              type: "Active",
              press: [this.createReserva, this],
            })
          );
        }

        //Definimos la tabla con las columnas
        var oTable = new sap.m.Table("tablaVuelos", {
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

        boxTbl1.addItem(oTable);

        ///Segunda tabla con Binding
        var oTableNew = new sap.m.Table("tblVuelos", {});
        oTableNew.addStyleClass("sapUiSmallMargin");

        //Column List Item
        var oColumn = new sap.m.ColumnListItem({
          press: [this.createReserva, this],
        });
        oColumn.setType("Inactive");

        //Columnas
        var columnDate = new sap.m.Column();
        var labelDate = new sap.m.Label();
        labelDate.bindProperty("text", "i18n>Fldate");
        columnDate.setHeader(labelDate);
        oTableNew.addColumn(columnDate);

        var columnPrice = new sap.m.Column();
        var labelPrice = new sap.m.Label();
        labelPrice.bindProperty("text", "i18n>Price");
        columnPrice.setHeader(labelPrice);
        oTableNew.addColumn(columnPrice);

        var columnCurr = new sap.m.Column();
        var labelCurr = new sap.m.Label();
        labelCurr.bindProperty("text", "i18n>Currency");
        columnCurr.setHeader(labelCurr);
        oTableNew.addColumn(columnCurr);

        var columnFree = new sap.m.Column();
        var labelFree = new sap.m.Label();
        labelFree.bindProperty("text", "i18n>SeatEmpty");
        columnFree.setHeader(labelFree);
        oTableNew.addColumn(columnFree);

        var columnReserva = new sap.m.Column();
        columnReserva.setWidth("3rem");
        oTableNew.addColumn(columnReserva);

        var columnReserva = new sap.m.Column();
        columnReserva.setWidth("3rem");
        oTableNew.addColumn(columnReserva);

        var columnReserva = new sap.m.Column();
        columnReserva.setWidth("3rem");
        oTableNew.addColumn(columnReserva);

        //Delcaramos celdas (rows)
        var cellDate = new sap.m.Label();
        cellDate.bindProperty("text", {
          path: "vuelos>Fldate",
          type: "sap.ui.model.type.Date",
          formatOptions: {
            pattern: "dd/MM/yyyy",
            strictParsing: true,
            UTC: true,
          },
        });
        oColumn.addCell(cellDate);

        var cellPrice = new sap.m.Label();
        cellPrice.bindProperty("text", "vuelos>Price");
        oColumn.addCell(cellPrice);

        var cellCurr = new sap.m.Label();
        cellCurr.bindProperty("text", "vuelos>Currency");
        oColumn.addCell(cellCurr);

        var cellFree = new sap.m.Label();
        cellFree.bindProperty("text", {
          parts: [{ path: "vuelos>Seatsmax" }, { path: "vuelos>Seatsocc" }],
          formatter: function (Seatsmax, Seatsocc) {
            return Seatsmax - Seatsocc;
          },
        });

        oColumn.addCell(cellFree);

        var cellReserva = new sap.ui.core.Icon({
          src: "sap-icon://travel-itinerary",
          tooltip: "Crear Reserva",
          hoverColor: "blue",
          press: [this.createReserva, this],
        });
        oColumn.addCell(cellReserva);

        var cellUpdate = new sap.ui.core.Icon({
          src: "sap-icon://edit",
          tooltip: "Modificar Vuelo",
          hoverColor: "blue",
          press: [this.modificarVuelo, this],
        });
        oColumn.addCell(cellUpdate);

        var cellDelete = new sap.ui.core.Icon({
          src: "sap-icon://delete",
          tooltip: "Borrar Vuelo",
          hoverColor: "red",
          press: [this.borrarVuelo, this],
        });
        oColumn.addCell(cellDelete);

        var oSorter = new sap.ui.model.Sorter("Fldate");
        var oBindingInfo = {
          model: "vuelos",
          path: "VuelosSet",
          template: oColumn,
          sorter: oSorter,
        };

        oTableNew.bindAggregation("items", oBindingInfo);
        oTableNew.bindElement("vuelos>" + oContext.getPath());

        boxTbl2.addItem(oTableNew);
      },

      createReserva: function (oEvent) {
        //Identifico la tabla
        var oVueloSelected = oEvent
          .getSource()
          .getBindingContext("vuelos")
          .getObject();

        //Definimos el Body, que es la informacion de la entidad de reservas que se va a crear

        var body = {
          Carrid: oVueloSelected.Carrid,
          Connid: oVueloSelected.Connid,
          Fldate: oVueloSelected.Fldate,
        };

        //Creamos la Reserva haciendo el POST
        this.getView()
          .getModel("vuelos")
          .create("/ReservasSet", body, {
            success: function (oResult, oResp) {
             // oResult devulve la entidad creada  
             // oResp info sobre la REST (status code 201 ok) 

              //Vuelve sin error (oResult tiene la entidad creada)
              MessageToast.show("Se creo la reserva " + oResult.Bookid);
              sap.ui.getCore().byId("tblVuelos").getBinding("items").refresh();
            }.bind(this),
            error: function (oErr) {
              //Vuelve con error (oErr tiene el error)
              var response = JSON.parse(oErr.responseText);
              MessageToast.show(response.error.message.value);
            }.bind(this),
          });
      },

      borrarVuelo: function (oEvent) {
        //Identifico la tabla
        var oVueloSelected = oEvent
          .getSource()
          .getBindingContext("vuelos")
          .getPath();

        this.getView()
          .getModel("vuelos")
          .remove(oVueloSelected, {
            method: "DELETE",
            success: function (oResult, oResp)  {
             // oResult devulve la entidad  que en el delete no la devuelve, 
             // oResp info sobre la REST (status code 204 ok, pero sin respuesta) 
              debugger;
              MessageToast.show("Se borro el vuelo");
              sap.ui.getCore().byId("tblVuelos").getBinding("items").refresh();
            }.bind(this),
            error: function (oErr) {
              var response = JSON.parse(oErr.responseText);
              MessageToast.show(response.error.message.value);
            }.bind(this),
          });
      },
      modificarVuelo: function (oEvent) {

        var oVueloSelected = oEvent
        .getSource()
        .getBindingContext("vuelos")
        .getPath();
        var oView = this.getView();
        if (!this.byId("openDialog")) {
          Fragment.load({
            id: this.oView.getId(),
            name: "exaccs.clase4odata.view.VueloForm",
            controller: this,
          }).then(function (oDialog) {
            oView.addDependent(oDialog);
            oDialog.bindElement({
              path: oVueloSelected,
              model: "vuelos",
            });
            oDialog.open();
          });
        }
      },
      agregarVuelo: function () {},

      closeDialog: function () {
        this.byId("openDialog").destroy();
      },

      updateDialog: function (oEvent) {
        var oVueloPath = oEvent
        .getSource()
        .getBindingContext("vuelos")
        .getPath();

      //Definimos el Body, que es la informacion de la entidad de reservas que se va a crear
      var oVuelo = oEvent
      .getSource()
      .getBindingContext("vuelos")
      .getObject();

       var body = {
        Price: this.getView().byId("price").getValue()
      };

      //CModificamos el Vuelo
      this.getView()
        .getModel("vuelos")
        .update(oVueloPath, body, {
          success: function (oData, oResp) {
             // oResult devulve la entidad que en el update no la devuelve, 
             // oResp info sobre la REST (status code 204 ok, pero sin respuesta) 

            //Vuelve sin error (oResult tiene la entidad creada)
            MessageToast.show("Vuelo modificado");
            sap.ui.getCore().byId("tblVuelos").getBinding("items").refresh();
          }.bind(this),
          error: function (oErr) {
            //Vuelve con error (oErr tiene el error)
            var response = JSON.parse(oErr.responseText);
            MessageToast.show(response.error.message.value);
          }.bind(this),
        });

        this.byId("openDialog").destroy();
      }
    });
  }
);
