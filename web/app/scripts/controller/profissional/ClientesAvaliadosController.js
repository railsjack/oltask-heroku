(function ($, console, doc) {

    window.ClientesAvaliadosModel = kendo.observable({
        reviews: reviewsDoProfissionalDS,
        
        loaded: false,

        noReviews: false,

        error: false,

        reset: function() {
            ClientesAvaliadosModel.set("loaded", false);
            ClientesAvaliadosModel.set("noReviews", false);
            ClientesAvaliadosModel.set("error", false);
        },

        init: function () {
            ClientesAvaliadosModel.reviews.bind("change", function (e) {
                ClientesAvaliadosModel.set("loaded", true);
                ClientesAvaliadosModel.set("error", false);
                ClientesAvaliadosModel.set("noReviews", ClientesAvaliadosModel.reviews.data().length === 0);
                app.hideLoading();
            });
            ClientesAvaliadosModel.reviews.bind("error", function (e) {
                ClientesAvaliadosModel.set("error", true);
                ClientesAvaliadosModel.set("noReviews", false);
                app.hideLoading();

                if (e.xhr.status == 401) {
                    //o token expirou, volta para a tela de login.
                    app.navigate("#LoginView");
                };
            });
        },

        show: function () {
            if (!ClientesAvaliadosModel.loaded) {
                app.showLoading();
                reviewsDoProfissionalDS.read();
            }
            $('.km-content:visible').data('kendoMobileScroller').reset();
        },

    });

})(jQuery, console, document);