(function($, console, doc) {

    window.AvaliarClienteModel = kendo.observable({
        customerId: {},
        propostaSelecionada: null,

        date: function () {
            if (AvaliarClienteModel.get('propostaSelecionada') != null) {
                return AvaliarClienteModel.propostaSelecionada.schedule.replace("between", "-").replace("and", "às");
            }
            return "";
        },

        visitValue: function () {
            if (AvaliarClienteModel.get('propostaSelecionada') != null) {
                var teste = kendo.toString(AvaliarClienteModel.propostaSelecionada.visitValue, "0.00");
                return "R$ " + teste;
            }
            return "";
        },

        photo: function () {
            if (AvaliarClienteModel.get("propostaSelecionada") != null && AvaliarClienteModel.get("propostaSelecionada.photoURL") != null) {
                var url = AvaliarClienteModel.get("propostaSelecionada.photoURL");
                var publicID = url.substring(url.lastIndexOf("/") + 1);
                return $.cloudinary.url(publicID, {
                    width: 30, height: 30, crop: 'thumb', gravity: 'face'
                });
            }
            return null;
        },

        init: function () {

        },
        show: function (args) {
            var uid = args.view.params.uid;

            AvaliarClienteModel.set("propostaSelecionada", agendaProfissionalDS.getByUid(uid));

            if (AvaliarClienteModel.propostaSelecionada == null) {
                app.navigate("#:back");
            } else {
                $("#avaliarClienteView #cliente-nota").rating('update', 0);
            }
        },

        enviar: function () {
            var total = Number($("#avaliarClienteView #cliente-nota").val());

            enviaReview(AvaliarClienteModel.propostaSelecionada, total);
        }
    });

    window.ProfissionalAvaliacao = kendo.observable({
        reviewsDoProfissional: reviewsDoProfissionalDS,
    });



    function enviaReview(proposta, nota) {
        app.showLoading();
        $.ajax({
            url: url + 'api/services/'+proposta.service_Id,
            type: "GET",
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + access_token },
            success: function (data) {
                $.ajax({
                    url: url + 'api/reviews/',
                    type: "POST",
                    data: "{\"service_Id\":" + proposta.service_Id + ",\"customer_Id\":" + data[0].customer_Id + ",\"serviceProvider_Id\":" + userID + ",\"dimension\":" + 1 + ",\"score\":" + nota + ",\"type\":0}",
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + access_token },
                    success: function (data) {
                        app.hideLoading();
                        app.navigate("#:back");
                    },
                    error: function (msg) {
                        navigator.notification.alert("Ocorreu um Erro.", null, "Erro", "OK");
                        app.hideLoading();
                        return false;
                    }
                });

            },
            error: function (msg) {
                navigator.notification.alert("Ocorreu um Erro.", null, "Erro", "OK");
                app.hideLoading();
            }
        });
        
    }

})(jQuery, console, document);