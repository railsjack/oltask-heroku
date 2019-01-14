(function ($, console, doc) {

    window.ParceiroMainModel = kendo.observable({
        data: parceiroPromocoesDS,

        promocaoSelecionada:  null,

        loaded: false,

        noTasks: false,

        error: false,

        reset: function() {
            ParceiroMainModel.set("loaded", false);
            ParceiroMainModel.set("noTasks", false);
            ParceiroMainModel.set("error", false);
        },

        init: function() {
            parceiroPromocoesDS.bind("change", function (e) {
                ParceiroMainModel.set("loaded", true);
                ParceiroMainModel.set("error", false);
                ParceiroMainModel.set("noTasks", parceiroPromocoesDS.data().length === 0);
                app.hideLoading();
            });
            parceiroPromocoesDS.bind("error", function (e) {
                ParceiroMainModel.set("error", true);
                ParceiroMainModel.set("noTasks", false);
                app.hideLoading();
                if (e.xhr.status == 401) {
                    //o token expirou, volta para a tela de login.
                    app.navigate("#LoginView");
                };
            });
        },

        show: function() {
            if (ParceiroMainModel.loaded === false) {
                app.showLoading();
                parceiroPromocoesDS.read();
            };
        },

        cancela: function(elem) {
            selecionaPromocao(elem);
            //nao Utilizar cancelaTarefaSelecionadaLocal em producao utilizar cancelaTarefaSelecionada
            navigator.notification.confirm("Deseja realmente cancelar a promocao " + ParceiroMainModel.promocaoSelecionada.title, cancelaPromocaoSelecionada, "Atenção", ["Sim", "Não"])
        }

    });

    function selecionaPromocao(elem) {
        var lv = $(elem).parents('ul:first').data('kendoMobileListView');
        var dataSource = lv.dataSource;

        var li = $(elem).parents('li:first');
        var uid = li.data('uid');
        ParceiroMainModel.set("promocaoSelecionada", dataSource.getByUid(uid));
    };

    function cancelaPromocaoSelecionada(number) {
        if (number === 1) {
            var promocao = ParceiroMainModel.promocaoSelecionada;
            parceiroPromocoesDS.remove(promocao);
            ParceiroMainModel.set("promocaoSelecionada", null);
        }
    };

    //publica os metodos para que possam ser chamados por uma tela, ou javascript
    $.extend(window, {
        cancelaPromocao: ParceiroMainModel.cancela,
    });

})(jQuery, console, document);