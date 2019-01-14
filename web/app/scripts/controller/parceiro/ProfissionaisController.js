(function ($, console, doc) {

    window.ParceiroProfissionaisModel = kendo.observable({
        data: parceiroProfissionaissDS,

        loaded: false,

        noData: false,

        error: false,

        reset: function() {
            ParceiroProfissionaisModel.set("loaded", false);
            ParceiroProfissionaisModel.set("noData", false);
            ParceiroProfissionaisModel.set("error", false);
        },

        init: function() {
            parceiroProfissionaissDS.bind("change", function (e) {
                ParceiroProfissionaisModel.set("loaded", true);
                ParceiroProfissionaisModel.set("error", false);
                ParceiroProfissionaisModel.set("noData", parceiroProfissionaissDS.data().length === 0);
                app.hideLoading();
            });
            parceiroProfissionaissDS.bind("error", function (e) {
                ParceiroProfissionaisModel.set("error", true);
                ParceiroProfissionaisModel.set("noData", false);
                app.hideLoading();
                if (e.xhr.status == 401) {
                    //o token expirou, volta para a tela de login.
                    app.navigate("#LoginView");
                };
            });
        },

        show: function() {
            if (ParceiroProfissionaisModel.loaded === false) {
                app.showLoading();
                parceiroProfissionaissDS.read();
            };
        },

        openDialog: function () {
            $("#modalview-adicionarProfissionalFavorito").kendoMobileModalView("open");
            var modal = $("#modalview-adicionarProfissionalFavorito");
            ajustaDialogHeight(modal);

            ParceiroProfissionaisModel.set("email", null);
        },

        closeDialog: function () {
            $("#modalview-adicionarProfissionalFavorito").kendoMobileModalView("close");
        },

        adicionaProfissional: function () {
            if (this.email == null) {
                navigator.notification.alert("Insira um email.", null, "Aviso", "OK");
                return;
            }
            app.showLoading();
            $.ajax({
                url: url + 'api/account/?email=' + this.email,
                type: "GET",
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + access_token },
                success: function (data) {
                    var profissional = {
                        name: data.name,
                    }
                    parceiroProfissionaissDS.add(profissional);
                    app.hideLoading();
                    ParceiroProfissionaisModel.closeDialog();
                },
                error: function (msg) {
                    if (msg.status == 404) {
                        navigator.notification.alert("Usuário não encontrado.", null, "Aviso", "OK");
                    } else {
                        navigator.notification.alert("Ocorreu um Erro.", null, "Erro", "OK");
                    }
                    app.hideLoading();
                }
            });
        }

    });

})(jQuery, console, document);