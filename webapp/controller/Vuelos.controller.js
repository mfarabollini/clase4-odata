sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, History) {
        "use strict";

        function _onObjectMatch(oEvent){

            this.getView().bindElement({
                path: "vuelos>/AerolineaSet('" + oEvent.getParameter("arguments").aerolinea + "')",
                //path: "Orders(10643)",
                //model: "nw" 
            });
        };

        return Controller.extend("exaccs.clase4odata.controller.Vuelos", {
            onInit: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("vuelos").attachPatternMatched(_onObjectMatch, this);
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
    });
