(function () {

    var onDeviceReady = function () {
        access_token = localStorage.getItem("token");
        userName = localStorage.getItem("userName");
        userID = localStorage.getItem("userID");
        userRole = localStorage.getItem("userRole");

        //configura a linguagem para PT-BR
        kendo.culture("pt-BR");

        //configura o cloudinary api
        $.cloudinary.config({ cloud_name: 'dhvm1f7cm', api_key: '627592586564618', protocol: "http://"})

        if(kendo.support.mobileOS === false){
            $('body').addClass('desktop');
            $('.dialog').css('width','500px');
        }else{
            $('body').addClass('mobile');
        }

        //inicia a aplicacao
        app = new kendo.mobile.Application(document.body, {
            skin: "flat", layout: "default-layout", transition: "fade", initial: initialView
        });

        if (access_token != null && userID != null && userName != null && userRole != null) {
            doLogin();
        }
            
        navigator.splashscreen.hide();
 
    };

    document.addEventListener("deviceready", onDeviceReady, 'false');

    document.addEventListener("backbutton", function (e) {
        var viewID = app.view().id;
        
        if (viewID === "choice.html"
            || viewID === "views/cliente/avaliarProfissional.html"
            || viewID === "views/cliente/cadastro.html"
            || viewID === "views/cliente/configuracoes.html"
            || viewID === "views/cliente/novaTarefa.html"
            || viewID === "views/profissional/cadastro.html"
            || viewID === "views/profissional/configuracoes.html"
            || viewID === "views/profissional/avaliarCliente.html") {
            onBack(e);
        } else if (viewID === "#LoginView") {
            navigator.app.exitApp();
        } else {
            e.preventDefault();
        }

    }, false);

    function onBack(e) {
        e.preventDefault();
        setTimeout((function () {
            app.navigate("#:back");
        }), 200);
    };

    function logout() {
        localStorage.clear();
        jso_wipe();

        //reseta os models
        ClienteMainModel.reset();
        ClienteTarefasModel.reset();
        ProfissionaisAvaliadosModel.reset();

        AgendaDeTarefas.reset();
        ProfissionalPropostas.reset();

        app.navigate("#LoginView");
    };

    //publica os metodos para que possam ser chamados por uma tela, ou javascript
    $.extend(window, {
        onBack: onBack,
        logout: logout
    });

    $(function(){
        onDeviceReady();
    });

}());

$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

//substitui a imagem se a mesma estiver quebrada ou nao existir
function imageError(image) {
    image.src = "images/user_icon.png";
    return true;
};

//Ajusta o tamanho do dialog modal
function ajustaDialogHeight(modal) {
    var height = modal.find('div.km-header').outerHeight(true);
    
    $.each(modal.find('div.km-scroll-container > *'), function (index, elem) {
        var jqElem = $(elem);
        if (jqElem.is(":visible")) {
            height += jqElem.outerHeight(true);
        }
    });
   
    modal.height(height);
    modal.parent().parent().height(height);
}

function findQuoteById(array, id) {
    for (i = 0; i < array.length; i++) {
        if (array[i].quote_Id === id) {
            return array[i];
        }
    }
    return null;
};

function findQhoteByIdOrFirstCanceled(array, id) {
    if (id == null) {
        for (i = 0; i < array.length; i++) {
            if (array[i].status === QUOTE_CANCELADO) {
                return array[i];
            }
        }
    } else {
        for (i = 0; i < array.length; i++) {
            if (array[i].quote_Id === id) {
                return array[i];
            }
        }
    }
    return null;
};

function findScheduleById(array, id) {
    for (i = 0; i < array.length; i++) {
        if (array[i].schedule_Id === id) {
            return array[i];
        }
    }
    return null;
};