sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("exaccs.clase4odata.controller.Main", {
            onInit: function () {

            },
            navToVuelos: function (oEvent) {
                const Aerolinea = oEvent.getSource().getBindingContext("vuelos").getObject().Carrid;
                
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("vuelos",{
                    aerolinea: Aerolinea 
                });
            },
        });
    });
