(function ($, console, doc) {

    window.ClienteConfiguracoesModel = kendo.observable({

        account: {},

        password: null,

        newPassword: null,

        confirmNewPassword: null,

        configActive: false,

        infoActive: false,

        editingAccount: false,

        photo: function() {
            if (ClienteConfiguracoesModel.get("account") != null && ClienteConfiguracoesModel.get("account.photoUrl") != null) {
                var url = ClienteConfiguracoesModel.get("account.photoUrl");
                var publicID = url.substring(url.lastIndexOf("/") + 1);
                return $.cloudinary.url(publicID, {
                    width: 50, height: 50, crop: 'thumb', gravity: 'face'
                });
            }
            return null;
        },

        uploadFile: function () {
            navigator.camera.getPicture(
                uploadPhoto,
                function (message) {
                    navigator.notification.alert("Falha na recuperação do arquivo.", null, "Aviso", "OK");
                }, {
                    quality: 50,
                    destinationType: navigator.camera.DestinationType.FILE_URI,
                    sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
                });

            function uploadPhoto(fileURI) {
                var ft = new FileTransfer();
                var options = new FileUploadOptions();
                var params = {
                    upload_preset: "s7ca5iyd"
                };
                options.params = params;
                options.fileKey = "file";
                options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
                options.mimeType = "image/" + fileURI.substr(fileURI.lastIndexOf('.') + 1);
                options.chunkedMode = false;
                options.headers = {
                };

                app.showLoading();
                ft.upload(fileURI, encodeURI("https://api.cloudinary.com/v1_1/dhvm1f7cm/upload"), win, fail, options);
            };

            function win(r) {
                var response = JSON.parse(r.response);
                alteraFoto(response.url);
            };

            function fail(error) {
                app.hideLoading();
                navigator.notification.alert("Ocorreu um erro no upload da imagem.", null, "Erro", "OK");

            };
        },

        toggleConfig: function() {
            ClienteConfiguracoesModel.set("configActive", !ClienteConfiguracoesModel.configActive);
        },

        toggleInfo: function() {
            ClienteConfiguracoesModel.set("infoActive", !ClienteConfiguracoesModel.infoActive);
        },

        formattedBirthday: function () {
            if (ClienteConfiguracoesModel.get("account") != null && ClienteConfiguracoesModel.get("account.birthday") != null) {
                return kendo.toString(kendo.parseDate(ClienteConfiguracoesModel.get("account.birthday")), "D");
            }
            return "";
        },

        reseta: function () {
            ClienteConfiguracoesModel.set("password", null);
            ClienteConfiguracoesModel.set("newPassword", null);
            ClienteConfiguracoesModel.set("confirmNewPassword", null);
        },

        init: function () {
            ClienteConfiguracoesModel.set("account", account);
            if (userRole == ROLE_CLIENTE) {
                initClienteConfig();
            } else if (userRole == ROLE_PROFISSIONAL) {
                initProfissionalConfig();
            } else if (userRole == ROLE_PARCEIRO) {
                initParceiroConfig();
            }
        },

        show: function () {
            ClienteConfiguracoesModel.set("account", account);
            ClienteConfiguracoesModel.set("configActive", false);
            ClienteConfiguracoesModel.set("infogActive", false);

            if (userRole == ROLE_PROFISSIONAL) {
                var list = $("#profissionalConfiguracaoView #selectedCategories").data("kendoMobileListView");;
                list.setDataSource(ClienteConfiguracoesModel.get("account.categories"));
                list.refresh();
            }
        },

        editarAccount: function () {
            ClienteConfiguracoesModel.set("editingAccount", true);
            if (userRole == ROLE_CLIENTE) {
                editarClienteAccount();
            } else if (userRole == ROLE_PROFISSIONAL) {
                editarProfissionalAccount();
            } else if (userRole == ROLE_PARCEIRO) {
                editarParceiroAccount();
            } 
        },

        cancelar: function() {
            ClienteConfiguracoesModel.set("editingAccount", false);
        },

        showConfirmDialog: function () {
            ClienteConfiguracoesModel.reseta();
            var modal = $("#modalview-alterarDadosConfirmacao");
            modal.kendoMobileModalView("open");
            ajustaDialogHeight(modal);
        },

        closeConfirmDialog: function() {
            var modal = $("#modalview-alterarDadosConfirmacao");
            modal.kendoMobileModalView("close");
        },

        salvarAccount: function() {
            if (userRole == ROLE_CLIENTE) {
                salvaClienteAccount();
            } else if (userRole == ROLE_PROFISSIONAL) {
                salvaProfissionalAccount();
            } else if (userRole == ROLE_PARCEIRO) {
                salvaParceiroAccount();
            }
        },

        showAlterarSenhaDialog: function () {
            ClienteConfiguracoesModel.reseta();
            var modal = $("#modalview-alterarSenha");
            modal.kendoMobileModalView("open");
            ajustaDialogHeight(modal);
        },

        closeAlterarSenhaDialog: function () {
            var modal = $("#modalview-alterarSenha");
            modal.kendoMobileModalView("close");
        },

        alterarSenha: function () {
            var validator = $("#alterarSenhaForm").kendoValidator({
                rules: {
                    equal: function (input) {
                        if (input.is("[data-equal-msg]") && input.val() != null) {
                            var value = input.val(),
                                        otherValue = $("#alterarSenhaForm [name='" + input.data("equal-field") + "']").val();
                            
                            return otherValue != null && value === otherValue;
                        }
                        return true;
                    }
                }
            }).data("kendoValidator");

            if (validator.validate()) {
                atualizaSenha();
            } else if (ClienteConfiguracoesModel.newPassword.length < 6) {
                navigator.notification.alert("A senha precisa ter 6 ou mais digitos.", null, "Aviso", "OK");
            } else {
                navigator.notification.alert("A confirmação da senha não confere.", null, "Aviso", "OK");
            }
        }
    });

    function initClienteConfig() {
        /*var estados = $('#clienteConfiguracoesView [name=estado]').kendoDropDownList({
            optionLabel: "Selecione o estado...",
            dataTextField: "state1",
            dataValueField: "state_Id",
            dataSource: estadosDS,
        }).data("kendoDropDownList");

        var cidades = $('#clienteConfiguracoesView [name=cidade]').kendoDropDownList({
            optionLabel: "Selecione a cidade...",
            autoBind: false,
            cascadeFrom: "clienteConfigEstados",
            dataTextField: "city1",
            dataValueField: "city_Id",
            dataSource: cidadesDS,
        }).data("kendoDropDownList");

        var bairros = $('#clienteConfiguracoesView [name=bairro]').kendoDropDownList({
            optionLabel: "Selecione o bairro...",
            autoBind: false,
            cascadeFrom: "clienteConfigCidades",
            dataTextField: "neighborhood1",
            dataValueField: "neighborhood_Id",
            dataSource: bairrosDS,
        }).data("kendoDropDownList");*/

        /*$('#clienteConfiguracoesView #imageUpload').append($.cloudinary.unsigned_upload_tag("s7ca5iyd", { cloud_name: 'dhvm1f7cm' })
            .bind('fileuploadstart', function () {
                app.showLoading();
            })
            .bind('fileuploadfail', function () {
                app.hideLoading();
                alert("Ocorreu um erro durante o envio.")
            })
            .bind('cloudinarydone', function (e, data) {
                alteraFoto(data.result.url);
            })
        );*/
    }

    function initProfissionalConfig() {
        /*var estados = $('#profissionalConfiguracaoView [name=estado]').kendoDropDownList({
            optionLabel: "Selecione o estado...",
            dataTextField: "state1",
            dataValueField: "state_Id",
            dataSource: estadosDS,
        }).data("kendoDropDownList");

        var cidades = $('#profissionalConfiguracaoView [name=cidade]').kendoDropDownList({
            optionLabel: "Selecione a cidade...",
            autoBind: false,
            cascadeFrom: "profissionalConfigEstados",
            dataTextField: "city1",
            dataValueField: "city_Id",
            dataSource: cidadesDS,
        }).data("kendoDropDownList");

        var bairros = $('#profissionalConfiguracaoView [name=bairro]').kendoDropDownList({
            optionLabel: "Selecione o bairro...",
            autoBind: false,
            cascadeFrom: "profissionalConfigCidades",
            dataTextField: "neighborhood1",
            dataValueField: "neighborhood_Id",
            dataSource: bairrosDS,
        }).data("kendoDropDownList");*/

        $("#profissionalConfiguracaoView #selectedCategories").kendoMobileListView({ dataSource: ClienteConfiguracoesModel.get("account.categories"), template: "${category}", });

        $("#profissionalConfiguracaoView #allCategories").kendoMobileListView({ dataSource: categoriasProfissionalDS, template: $("#categorias-profissional-template").text() });

        /*$('#profissionalConfiguracaoView #imageUpload').append($.cloudinary.unsigned_upload_tag("s7ca5iyd", { cloud_name: 'dhvm1f7cm' })
            .bind('fileuploadstart', function () {
                app.showLoading();
            })
            .bind('fileuploadfail', function () {
                app.hideLoading();
                alert("Ocorreu um erro durante o envio.")
            })
            .bind('cloudinarydone', function (e, data) {
                alteraFoto(data.result.url);
            })
        );*/
    }

    function initParceiroConfig() {
        /*var estados = $('#parceiroConfiguracaoView [name=estado]').kendoDropDownList({
            optionLabel: "Selecione o estado...",
            dataTextField: "state1",
            dataValueField: "state_Id",
            dataSource: estadosDS,
        }).data("kendoDropDownList");

        var cidades = $('#parceiroConfiguracaoView [name=cidade]').kendoDropDownList({
            optionLabel: "Selecione a cidade...",
            autoBind: false,
            cascadeFrom: "parceiroConfigEstados",
            dataTextField: "city1",
            dataValueField: "city_Id",
            dataSource: cidadesDS,
        }).data("kendoDropDownList");

        var bairros = $('#parceiroConfiguracaoView [name=bairro]').kendoDropDownList({
            optionLabel: "Selecione o bairro...",
            autoBind: false,
            cascadeFrom: "parceiroConfigCidades",
            dataTextField: "neighborhood1",
            dataValueField: "neighborhood_Id",
            dataSource: bairrosDS,
        }).data("kendoDropDownList");*/
    }

    function editarClienteAccount() {
        /*$('#clienteConfiguracoesView [name=estado]').data("kendoDropDownList").select(function (dataItem) {
            return dataItem.state_Id === ClienteConfiguracoesModel.account.state_Id;
        });
        $('#clienteConfiguracoesView [name=cidade]').data("kendoDropDownList").select(function (dataItem) {
            return dataItem.city_Id === ClienteConfiguracoesModel.account.city_Id;
        });
        $('#clienteConfiguracoesView [name=bairro]').data("kendoDropDownList").select(function (dataItem) {
            return dataItem.neighborhood_Id === ClienteConfiguracoesModel.account.neighborhood_Id;
        });

        $("#clienteConfiguracoesView [name=cep]").val(ClienteConfiguracoesModel.account.cep);
        $("#clienteConfiguracoesView [name=rua]").val(ClienteConfiguracoesModel.account.street);
        $("#clienteConfiguracoesView [name=numero]").val(ClienteConfiguracoesModel.account.number);
        $("#clienteConfiguracoesView [name=complemento]").val(ClienteConfiguracoesModel.account.complement);*/

        $("#clienteConfiguracoesView [name=name]").val(ClienteConfiguracoesModel.account.name);
        $("#clienteConfiguracoesView [name=cel]").val(ClienteConfiguracoesModel.account.celular);
        $("#clienteConfiguracoesView [name=phone]").val(ClienteConfiguracoesModel.account.phone);
    }

    function editarProfissionalAccount() {
        /*$('#profissionalConfiguracaoView [name=estado]').data("kendoDropDownList").select(function (dataItem) {
            return dataItem.state_Id === ClienteConfiguracoesModel.account.state_Id;
        });
        $('#profissionalConfiguracaoView [name=cidade]').data("kendoDropDownList").select(function (dataItem) {
            return dataItem.city_Id === ClienteConfiguracoesModel.account.city_Id;
        });
        $('#profissionalConfiguracaoView [name=bairro]').data("kendoDropDownList").select(function (dataItem) {
            return dataItem.neighborhood_Id === ClienteConfiguracoesModel.account.neighborhood_Id;
        });

        $("#profissionalConfiguracaoView [name=cep]").val(ClienteConfiguracoesModel.account.cep);
        $("#profissionalConfiguracaoView [name=rua]").val(ClienteConfiguracoesModel.account.street);
        $("#profissionalConfiguracaoView [name=numero]").val(ClienteConfiguracoesModel.account.number);
        $("#profissionalConfiguracaoView [name=complemento]").val(ClienteConfiguracoesModel.account.complement);*/

        $("#profissionalConfiguracaoView [name=name]").val(ClienteConfiguracoesModel.account.name);
        $("#profissionalConfiguracaoView [name=cel]").val(ClienteConfiguracoesModel.account.celular);
        $("#profissionalConfiguracaoView [name=phone]").val(ClienteConfiguracoesModel.account.phone);

        $("#profissionalConfiguracaoView #allCategories input").each(function() {
            var id = $(this).val();
            $(this).prop("checked", false);

            if (ClienteConfiguracoesModel.account.categories != null) {
                for (i = 0 ; i < ClienteConfiguracoesModel.account.categories.length; i++) {

                    if (id == ClienteConfiguracoesModel.account.categories[i].categoryId) {
                        $(this).prop("checked", true);
                       
                    }
                }
            }
        });
    }

    function editarParceiroAccount() {
        /*$('#parceiroConfiguracaoView [name=estado]').data("kendoDropDownList").select(function (dataItem) {
            return dataItem.state_Id === ClienteConfiguracoesModel.account.state_Id;
        });
        $('#parceiroConfiguracaoView [name=cidade]').data("kendoDropDownList").select(function (dataItem) {
            return dataItem.city_Id === ClienteConfiguracoesModel.account.city_Id;
        });
        $('#parceiroConfiguracaoView [name=bairro]').data("kendoDropDownList").select(function (dataItem) {
            return dataItem.neighborhood_Id === ClienteConfiguracoesModel.account.neighborhood_Id;
        });

        $("#parceiroConfiguracaoView [name=cep]").val(ClienteConfiguracoesModel.account.cep);
        $("#parceiroConfiguracaoView [name=rua]").val(ClienteConfiguracoesModel.account.street);
        $("#parceiroConfiguracaoView [name=numero]").val(ClienteConfiguracoesModel.account.number);
        $("#parceiroConfiguracaoView [name=complemento]").val(ClienteConfiguracoesModel.account.complement);*/

        $("#parceiroConfiguracaoView [name=name]").val(ClienteConfiguracoesModel.account.name);
        $("#parceiroConfiguracaoView [name=cel]").val(ClienteConfiguracoesModel.account.celular);
        $("#parceiroConfiguracaoView [name=phone]").val(ClienteConfiguracoesModel.account.phone);
    }

    function salvaClienteAccount() {
        /*var estadoDropDownList = $('#clienteConfiguracoesView [name=estado]').data("kendoDropDownList");
        if (estadoDropDownList.dataItem() != null) {
            ClienteConfiguracoesModel.set("account.state_Id", estadoDropDownList.dataItem().state_Id);
            ClienteConfiguracoesModel.set("account.state_name", estadoDropDownList.dataItem().state1);
        }

        var cidadeDropDownList = $('#clienteConfiguracoesView [name=cidade]').data("kendoDropDownList");
        if (cidadeDropDownList.dataItem() != null) {
            ClienteConfiguracoesModel.set("account.city_Id", cidadeDropDownList.dataItem().city_Id);
            ClienteConfiguracoesModel.set("account.city_name", cidadeDropDownList.dataItem().city1);
        }

        var bairroDropDownList = $('#clienteConfiguracoesView [name=bairro]').data("kendoDropDownList");
        if (bairroDropDownList.dataItem() != null) {
            ClienteConfiguracoesModel.set("account.neighborhood_Id", bairroDropDownList.dataItem().neighborhood_Id);
            ClienteConfiguracoesModel.set("account.neighborhood_name", bairroDropDownList.dataItem().neighborhood1);
        }

        ClienteConfiguracoesModel.set("account.cep", $("#clienteConfiguracoesView [name=cep]").val());
        ClienteConfiguracoesModel.set("account.street", $("#clienteConfiguracoesView [name=rua]").val());
        ClienteConfiguracoesModel.set("account.number", $("#clienteConfiguracoesView [name=numero]").val());
        ClienteConfiguracoesModel.set("account.complement", $("#clienteConfiguracoesView [name=complemento]").val());*/

        var validator = $("#clienteConfiguracoesView #accountForm").kendoValidator().data("kendoValidator");

        if (validator.validate()) {
            var data = {
                Name : $("#clienteConfiguracoesView [name=name]").val(),
                Phone : $("#clienteConfiguracoesView [name=cel]").val(),
                Celular: $("#clienteConfiguracoesView [name=phone]").val(),
                PhotoUrl: account.photoUrl
            }

            app.showLoading();
            $.ajax({
                url: url + 'api/CustomerAccount/UpdateByUserName?username=' + userName,
                type: "PUT",
                data: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + access_token },
                success: function (response) {
                    account.name = data.Name;
                    account.phone = data.Phone;
                    account.celular = data.Celular;
                    ClienteConfiguracoesModel.set("account", account);
                    app.hideLoading();
                    ClienteConfiguracoesModel.cancelar();
                },
                error: function (response) {
                    navigator.notification.alert("Ocorreu um erro.", null, "Erro", "OK");
                    app.hideLoading();
                }
            });
 
        }
    }

    function salvaProfissionalAccount() {
        /*var estadoDropDownList = $('#profissionalConfiguracaoView [name=estado]').data("kendoDropDownList");
        if (estadoDropDownList.dataItem() != null) {
            ClienteConfiguracoesModel.set("account.state_Id", estadoDropDownList.dataItem().state_Id);
            ClienteConfiguracoesModel.set("account.state_name", estadoDropDownList.dataItem().state1);
        }

        var cidadeDropDownList = $('#profissionalConfiguracaoView [name=cidade]').data("kendoDropDownList");
        if (cidadeDropDownList.dataItem() != null) {
            ClienteConfiguracoesModel.set("account.city_Id", cidadeDropDownList.dataItem().city_Id);
            ClienteConfiguracoesModel.set("account.city_name", cidadeDropDownList.dataItem().city1);
        }

        var bairroDropDownList = $('#profissionalConfiguracaoView [name=bairro]').data("kendoDropDownList");
        if (bairroDropDownList.dataItem() != null) {
            ClienteConfiguracoesModel.set("account.neighborhood_Id", bairroDropDownList.dataItem().neighborhood_Id);
            ClienteConfiguracoesModel.set("account.neighborhood_name", bairroDropDownList.dataItem().neighborhood1);
        }

        ClienteConfiguracoesModel.set("account.cep", $("#profissionalConfiguracaoView [name=cep]").val());
        ClienteConfiguracoesModel.set("account.street", $("#profissionalConfiguracaoView [name=rua]").val());
        ClienteConfiguracoesModel.set("account.number", $("#profissionalConfiguracaoView [name=numero]").val());
        ClienteConfiguracoesModel.set("account.complement", $("#profissionalConfiguracaoView [name=complemento]").val());*/

        var validator = $("#profissionalConfiguracaoView #accountForm").kendoValidator().data("kendoValidator");

        if (validator.validate()) {
            var categoriesToServer = [];
            var categories = [];
            $("#profissionalConfiguracaoView #allCategories input:checked").each(function () {
                var category = {};
                category.categoryId = $(this).val();
                category.category = $(this)[0].nextSibling.nodeValue;
                categories.push(category);
                categoriesToServer.push($(this).val());
            });

            var data = {
                Name: $("#profissionalConfiguracaoView [name=name]").val(),
                Phone: $("#profissionalConfiguracaoView [name=cel]").val(),
                Celular: $("#profissionalConfiguracaoView [name=phone]").val(),
                PhotoUrl: account.photoUrl,
                Categories: categoriesToServer,
            }

            app.showLoading();
            $.ajax({
                url: url + 'api/ServiceProviderAccount/UpdateByUserName?username=' + userName,
                type: "PUT",
                data: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + access_token },
                success: function (response) {
                    account.name = data.Name;
                    account.phone = data.Phone;
                    account.celular = data.Celular;
                    account.categories = categories;
                    ClienteConfiguracoesModel.set("account", account);
                    var list = $("#profissionalConfiguracaoView #selectedCategories").data("kendoMobileListView");;
                    list.setDataSource(categories);
                    list.refresh();
                    app.hideLoading();
                    ClienteConfiguracoesModel.cancelar();
                },
                error: function (response) {
                    navigator.notification.alert("Ocorreu um erro.", null, "Erro", "OK");
                    app.hideLoading();
                }
            });

        }
    }

    function salvaParceiroAccount() {
        /*var estadoDropDownList = $('#parceiroConfiguracaoView [name=estado]').data("kendoDropDownList");
        if (estadoDropDownList.dataItem() != null) {
            ClienteConfiguracoesModel.set("account.state_Id", estadoDropDownList.dataItem().state_Id);
            ClienteConfiguracoesModel.set("account.state_name", estadoDropDownList.dataItem().state1);
        }

        var cidadeDropDownList = $('#parceiroConfiguracaoView [name=cidade]').data("kendoDropDownList");
        if (cidadeDropDownList.dataItem() != null) {
            ClienteConfiguracoesModel.set("account.city_Id", cidadeDropDownList.dataItem().city_Id);
            ClienteConfiguracoesModel.set("account.city_name", cidadeDropDownList.dataItem().city1);
        }

        var bairroDropDownList = $('#parceiroConfiguracaoView [name=bairro]').data("kendoDropDownList");
        if (bairroDropDownList.dataItem() != null) {
            ClienteConfiguracoesModel.set("account.neighborhood_Id", bairroDropDownList.dataItem().neighborhood_Id);
            ClienteConfiguracoesModel.set("account.neighborhood_name", bairroDropDownList.dataItem().neighborhood1);
        }

        ClienteConfiguracoesModel.set("account.cep", $("#parceiroConfiguracaoView [name=cep]").val());
        ClienteConfiguracoesModel.set("account.street", $("#parceiroConfiguracaoView [name=rua]").val());
        ClienteConfiguracoesModel.set("account.number", $("#parceiroConfiguracaoView [name=numero]").val());
        ClienteConfiguracoesModel.set("account.complement", $("#parceiroConfiguracaoView [name=complemento]").val());*/
       
        ClienteConfiguracoesModel.set("account.name", $("#parceiroConfiguracaoView [name=name]").val());
        ClienteConfiguracoesModel.set("account.celular", $("#parceiroConfiguracaoView [name=cel]").val());
        ClienteConfiguracoesModel.set("account.phone", $("#parceiroConfiguracaoView [name=numero]").val());

        atualizaAccount();
    }

    function atualizaSenha() {
        var changePasswordJson = {
            UserName : ClienteConfiguracoesModel.account.userName,
            OldPassword : ClienteConfiguracoesModel.password,
            NewPassword : ClienteConfiguracoesModel.newPassword,
            ConfirmPassword : ClienteConfiguracoesModel.confirmNewPassword
        }

        app.showLoading();
        $.ajax({
            url: url + '/api/account/ChangePassword',
            type: "POST",
            data: JSON.stringify(changePasswordJson),
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + access_token },
            success: function (data) {
                navigator.notification.alert("Sua senha foi alterada com sucesso.", null, "Aviso", "OK");
                ClienteConfiguracoesModel.closeAlterarSenhaDialog();
                app.hideLoading();
            },
            error: function (response) {
                navigator.notification.alert("A senha está está incorreta", null, "Erro", "OK");
                app.hideLoading();
            }
        });
    }

    function alteraFoto(photoUrl) {
        var data = {
            userid: account.user_Id,
            url: photoUrl
        }
        app.showLoading();
        $.ajax({
            url: url + '/api/account/SetPhotoUrl ',
            type: "POST",
            data: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + access_token },
            success: function (data) {
                account.photoUrl = photoUrl;
                ClienteConfiguracoesModel.set("account.photoUrl", photoUrl);
                app.hideLoading();
            },
            error: function (response) {
                navigator.notification.alert("Ocorreu um erro durante o envio.", null, "Erro", "OK");
                app.hideLoading();
            }
        });
    }

})(jQuery, console, document);
