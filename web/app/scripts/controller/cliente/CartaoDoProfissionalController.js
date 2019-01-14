(function($, console, doc) {

    window.CartaoDoProfissionalModel = kendo.observable({
        serviceProvider: null,

        email1: function () {
            if (CartaoDoProfissionalModel.get('serviceProvider') != null) {
                return CartaoDoProfissionalModel.serviceProvider.email.split("@")[0];
            }
            return null;
        },

        email2: function () {
            if (CartaoDoProfissionalModel.get('serviceProvider') != null) {
                return '@' + CartaoDoProfissionalModel.serviceProvider.email.split("@")[1];
            }
            return null;
        },

        averageReview: function () {
            if (CartaoDoProfissionalModel.get('serviceProvider') != null && CartaoDoProfissionalModel.get('serviceProvider').averageReview != null) {
                return (CartaoDoProfissionalModel.serviceProvider.averageReview / 5 * 100) + "%";
            }
            return "0%";
        },

        photo: function () {
            if (CartaoDoProfissionalModel.get("serviceProvider") != null && CartaoDoProfissionalModel.get("serviceProvider.photoUrl") != null) {
                var url = CartaoDoProfissionalModel.get("serviceProvider.photoUrl");
                var publicID = url.substring(url.lastIndexOf("/") + 1);
                return $.cloudinary.url(publicID, {
                    width: 150, height: 150, crop: 'thumb', gravity: 'face'
                });
            }
            return null;
        },

        showCartao: function (providerId) {
            app.showLoading();
            $.ajax({
                url: url + 'api/account/?id=' + providerId,
                type: "GET",
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + access_token },
                success: function (data) {
                    app.hideLoading();
                    CartaoDoProfissionalModel.set("serviceProvider", data);
                    $("#modalview-cartaoDoProfissional").kendoMobileModalView("open")
                    ajustaDialogHeight($("#modalview-cartaoDoProfissional"));
                },
                error: function (msg) {
                    app.hideLoading();
                }
            });

            //dados locais de teste
            //CartaoDoProfissionalModel.set("serviceProvider", profissionais[providerId-1]);
            //$("#modalview-cartaoDoProfissional").kendoMobileModalView("open")
            //ajustaDialogHeight($("#modalview-cartaoDoProfissional"));
            //$('.km-loader').hide();
        },
    });

})(jQuery, console, document);