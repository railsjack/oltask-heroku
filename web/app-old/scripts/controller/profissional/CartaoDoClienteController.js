(function($, console, doc) {

    window.CartaoDoClienteModel = kendo.observable({
        customer: null,

        email1: function () {
            if (CartaoDoClienteModel.get('customer') != null) {
                return CartaoDoClienteModel.customer.email.split("@")[0];
            }
            return null;
        },

        email2: function () {
            if (CartaoDoClienteModel.get('customer') != null) {
                return '@' + CartaoDoClienteModel.customer.email.split("@")[1];
            }
            return null;
        },

        averageReview: function () {
            if (CartaoDoClienteModel.get('customer') != null && CartaoDoClienteModel.get('customer').averageReview != null) {
                return (CartaoDoClienteModel.customer.averageReview / 5 * 100) + "%";
            }
            return "0%";
        },

        photo: function () {
            if (CartaoDoClienteModel.get("customer") != null && CartaoDoClienteModel.get("customer.photoUrl") != null) {
                var url = CartaoDoClienteModel.get("customer.photoUrl");
                var publicID = url.substring(url.lastIndexOf("/") + 1);
                return $.cloudinary.url(publicID, {
                    width: 150, height: 150, crop: 'thumb', gravity: 'face'
                });
            }
            return null;
        },

        showCartao: function (taskId) {
            app.showLoading();
            $.ajax({
                url: url + 'api/services/?id=' + taskId,
                type: "GET",
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + access_token },
                success: function (data) {
                    var customerId = data[0].customer_Id;
                    $.ajax({
                        url: url + 'api/account/?id=' + customerId,
                        type: "GET",
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + access_token },
                        success: function (data) {
                            app.hideLoading();
                            CartaoDoClienteModel.set("customer", data);
                            $("#modalview-cartaoDoCliente").kendoMobileModalView("open")
                            ajustaDialogHeight($("#modalview-cartaoDoCliente"));
                        },
                        error: function (msg) {
                            app.hideLoading();
                            navigator.notification.alert("Ocorreu um erro.", null, "Erro", "OK");
                        }
                    });

                },
                error: function (msg) {
                    app.hideLoading();
                    navigator.notification.alert("Ocorreu um erro.", null, "Erro", "OK");
                }
            });
            

            //dados locais de teste
            //CartaoDoProfissionalModel.set("serviceProvider", profissionais[providerId-1]);
            //$("#modalview-cartaoDoProfissional").kendoMobileModalView("open")
            //ajustaDialogHeight($("#modalview-cartaoDoProfissional"));
            //$('.km-loader').hide();
        },

        close: function () {
            $("#modalview-cartaoDoCliente").kendoMobileModalView("close");
        }
    });

})(jQuery, console, document);