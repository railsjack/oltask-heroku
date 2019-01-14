﻿(function ($, console, doc) {

    window.LoginModel = kendo.observable({
        resetaCampos: function() {
            LoginModel.set("username", null);
            LoginModel.set("password", null);
        },

        login: function () {
            var validator = $("#loginForm").data("kendoValidator");

            if (!validator.validate()) {
                navigator.notification.alert("Preencha o Login e a Senha.", null, "Aviso", "OK");
                return false;
            }
            obtainAccessToken("password", this.username, this.password, true);
        },
        criarConta: function () {
            CadastroModel.reset();
            app.navigate("choice.html");
        }
    });

    //obtem o access token atraves do login e senha
    function obtainAccessToken(grantType, user, password, showError) {
        app.showLoading();
        $.ajax({
            url: url + 'token',
            type: "POST",
            data: 'grant_type=' + grantType + '&username=' + user + '&password=' + password,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            success: function (data) {
                access_token = data.access_token;
                userName = user;
                localStorage.setItem("token", access_token);
                localStorage.setItem("userName", user);
                localStorage.setItem("provider", "password");
                doLogin();
            },

            error: function (msg) {
                app.hideLoading();
                if (showError) {
                    navigator.notification.alert("Login ou Senha inválida.", null, "Aviso", "OK");
                } else {
                    app.navigate("#LoginView");
                }
            }
        });
    };

    //obtem o access token atraves de um provider externo
    function externalLogin(token, provider, data) {
        app.showLoading();
        $.ajax({
            url: url + 'api/account/ObtainLocalAccessToken',
            type: "GET",
            data: 'externalAccessToken=' + token + '&provider=' + provider,
            success: function (data) {
                access_token = data.access_token;
                userName = data.userName;
                localStorage.setItem("token", access_token);
                localStorage.setItem("userName", userName);
                localStorage.setItem("provider", provider);
                doLogin();
            },
            error: function (response) {
                app.hideLoading();
                if (JSON.parse(response.responseText).message === "External user is not registered") {
                    CadastroModel.set("externalProvider", provider);
                    CadastroModel.set("externalAccessToken", token);
                    if (provider === "Facebook") {
                        CadastroModel.set("externalName", data.first_name + " " + data.last_name);
                        CadastroModel.set("externalGender", data.gender);
                    } else if (provider === "Google") {
                        CadastroModel.set("externalName", data.name);
                    }
                    CadastroModel.set("externalEmail", data.email);
                    app.navigate("choice.html");
                } else {
                    navigator.notification.alert(JSON.parse(response.responseText).message, null, "Erro", "OK");
                    jso_wipe();
                }
            }

        });
    };

    //busca as informacoes do usuario através do username e realiza o login
    function doLogin() {
        //app.showLoading();
        $.ajax({
            url: url + 'api/account/?username=' + userName,
            type: "GET",
            headers: { 'Authorization': 'Bearer ' + access_token },
            success: function (data) {
                account = data;
                userID = data.id;
                userRole = data.aspNetRoleId;
                localStorage.setItem("userData", JSON.stringify(account));
                localStorage.setItem("userID", userID);
                localStorage.setItem("userRole", userRole);
                app.hideLoading();
                if (userRole === ROLE_CLIENTE) {
                    //$('body').addClass('cliente');
                    //$('body').removeClass('profissional');
                    app.navigate('views/cliente/main.html');
                } else if (userRole === ROLE_PROFISSIONAL) {
                    //$('body').removeClass('cliente');
                    //$('body').addClass('profissional');
                    app.navigate('views/profissional/agendaDeTarefas.html');
                } else if (userRole === ROLE_PARCEIRO) {
                    app.navigate('views/parceiro/main.html');
                } else if (userRole === ROLE_PROFISSIONAL_AGUARDANDO) {
                    app.navigate('views/profissional/cadastroComSucesso.html');
                }
            },
            error: function () {
                app.hideLoading();
                logout();
            }
        });
    }

    //publica os metodos para que possam ser chamados por uma tela, ou javascript
    $.extend(window, {
        obtainAccessToken: obtainAccessToken,
        externalLogin: externalLogin,
        doLogin: doLogin,
    });


})(jQuery, console, document);