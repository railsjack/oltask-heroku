(function ($, console, doc) {

    window.NovaPromocaoModel = kendo.observable({

        novaPromocao: {
        },

        show: function () {
            NovaPromocaoModel.set("novaPromocao", {});
        },

        publicar: function () {
            var validator = $("#novaTarefaForm").kendoValidator().data("kendoValidator");
            if (validator.validate()) {
                parceiroPromocoesDS.add(NovaPromocaoModel.novaPromocao);
                app.navigate('#:back');
            } else {
                navigator.notification.alert("Preencha todos os campos.", null, "Aviso", "OK");
            }
        }

    });

})(jQuery, console, document);