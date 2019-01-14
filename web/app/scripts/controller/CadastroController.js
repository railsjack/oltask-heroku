(function ($, console, doc) {

    window.CadastroModel = kendo.observable({
        externalProvider: null,
        externalAccessToken: null,
        externalName: null,
        externalEmail: null,
        externalGender: null,
        novoUsuario: {},

        photo: function () {
            if (CadastroModel.get("novoUsuario") != null && CadastroModel.get("novoUsuario.photoUrl") != null) {
                var url = CadastroModel.get("novoUsuario.photoUrl");
                var publicID = url.substring(url.lastIndexOf("/") + 1);
                var photo = $.cloudinary.url(publicID, {
                    width: 150, height: 150, crop: 'thumb', gravity: 'face'
                });
                return photo;
            }
            return null;
        },

        uploadFile: function() {
            // For mobile website.
            cloudinary.openUploadWidget(
                { 
                    upload_preset: 's7ca5iyd', 
                    cloud_name: 'dhvm1f7cm', multiple: false, 
                    sources: ['local', 'camera'], theme: 'minimal', show_powered_by: false, 
                    button_caption: "Selecione o Arquivo" 
                },
                function (error, results) {
                  if (results != null) {
                      alteraFoto(results[0].url);
                  }
                }
            );

            return;
            // For mobile devices
            navigator.camera.getPicture(
                uploadPhoto,
                function(message) {
                    navigator.notification.alert("Falha na recuperação do arquivo.", null, "Aviso", "OK");
                }, {
                    quality         : 50,
                    destinationType : navigator.camera.DestinationType.FILE_URI,
                    sourceType      : navigator.camera.PictureSourceType.PHOTOLIBRARY
                });
		
            function uploadPhoto(fileURI) { 
                var ft = new FileTransfer();
                var options = new FileUploadOptions();
                var params = {
                    upload_preset : "s7ca5iyd"
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
                app.hideLoading();
                var response = JSON.parse(r.response);
                CadastroModel.set("novoUsuario.photoUrl", response.url);
            };
 
            function fail(error) {
                app.hideLoading();
                navigator.notification.alert("Ocorreu um erro no upload da imagem.", null, "Erro", "OK");

            };
        },

        removePhoto: function() {
            CadastroModel.set("novoUsuario.photoUrl", null);
        },

        reset: function() {
            this.set("externalProvider", null);
            this.set("externalAccessToken", null);
            this.set("externalName", null);
            this.set("externalEmail", null);
            //this.set("externalGender", null);
            this.set("emailConfirmacao", null);
            this.set("novoUsuario", {});

            var estados = $("#cadastroClienteEstados").data("kendoDropDownList");
            if (estados != null)
                estados.select(0);

            estados = $("#cadastroProfissionalEstados").data("kendoDropDownList");
            if (estados != null)
                estados.select(0);
        },

        show: function () {
            if (CadastroModel.externalProvider != null) {
                CadastroModel.set("novoUsuario.Name", CadastroModel.externalName);
                CadastroModel.set("novoUsuario.Email", CadastroModel.externalEmail);
            }

            if(kendo.support.mobileOS === false){

                $("input[type=date]").kendoDatePicker({format: "dd/MM/yyyy"});
                $("input[type=time]").kendoTimePicker({format: 'HH:mm'});

            }

        },

        initCadastroCliente: function () {
            CadastroModel.set("novoUsuario", {});

            var estados = $('#cadastroClienteForm #cadastroClienteEstados').kendoDropDownList({
                optionLabel: "Selecione o estado...",
                dataTextField: "state1",
                dataValueField: "state_Id",
                dataSource: estadosDS,

            }).data("kendoDropDownList");

            var cidades = $('#cadastroClienteForm #cadastroClienteCidades').kendoDropDownList({
                optionLabel: "Selecione a cidade...",
                autoBind: false,
                cascadeFrom: "cadastroClienteEstados",
                dataTextField: "city1",
                dataValueField: "city_Id",
                dataSource: cidadesDS,
            }).data("kendoDropDownList");

            /*var bairros = $('#cadastroClienteForm #cadastroClienteBairros').kendoDropDownList({
                optionLabel: "Selecione o bairro...",
                autoBind: false,
                cascadeFrom: "cadastroClienteCidades",
                dataTextField: "neighborhood1",
                dataValueField: "neighborhood_Id",
                dataSource: bairrosDS,
            }).data("kendoDropDownList");*/
        },

        cadastraCliente: function (e) {
            var validator = $("#cadastroClienteForm").kendoValidator({
                rules: {
                    requiredIfNotExternalProvider: function (input) {
                        if (input.is("[data-required-if-notexternalprovider]")) {
                            var dropDown = input.data("kendoDropDownList");
                            if (dropDown != null && dropDown.select() == 0 && CadastroModel.externalProvider == null) {
                                return false;
                            } else if ((input.val() === "" || input.val() === null) && CadastroModel.externalProvider == null) {
                                return false;
                            }
                        }
                        return true;
                    }
                }
            }).data("kendoValidator");
            if (validator.validate()) {
                if (!$("#cadastroClienteForm #checkboxTermosDeUso").is(":checked")) {
                    navigator.notification.alert("Aceite os termos de uso.", null, "Aviso", "OK");
                    return;
                }

                this.novoUsuario.set("username", this.novoUsuario.Email);
                this.novoUsuario.set("Role", ROLE_CLIENTE);

                if (this.externalProvider == null) {
                    doCadastro(this.novoUsuario, ROLE_CLIENTE);
                } else {
                    doCadastroExterno(this.novoUsuario, ROLE_CLIENTE, this.externalProvider, this.externalAccessToken);
                }
            } else {
                navigator.notification.alert("Preencha todos os campos.", null, "Aviso", "OK");
            }
        },

        categorias: categoriasProfissionalDS,

        initCadastroProfissional: function () {
            CadastroModel.set("novoUsuario", {});

            var estados = $('#cadastroProfissionalForm #cadastroProfissionalEstados').kendoDropDownList({
                optionLabel: "Selecione o estado...",
                dataTextField: "state1",
                dataValueField: "state_Id",
                dataSource: estadosDS,
            }).data("kendoDropDownList");

            var cidades = $('#cadastroProfissionalForm #cadastroProfissionalCidades').kendoDropDownList({
                optionLabel: "Selecione a cidade...",
                autoBind: false,
                cascadeFrom: "cadastroProfissionalEstados",
                dataTextField: "city1",
                dataValueField: "city_Id",
                dataSource: cidadesDS,
            }).data("kendoDropDownList");

            /*var bairros = $('#cadastroProfissionalForm #cadastroProfissionalBairros').kendoDropDownList({
                optionLabel: "Selecione o bairro...",
                autoBind: false,
                cascadeFrom: "cadastroProfissionalCidades",
                dataTextField: "neighborhood1",
                dataValueField: "neighborhood_Id",
                dataSource: bairrosDS,
            }).data("kendoDropDownList");*/
        },

        cadastraProfissional: function (e) {
            var validator = $("#cadastroProfissionalForm").kendoValidator({
                rules: {
                    requiredIfNotExternalProvider: function (input) {
                        if (input.is("[data-required-if-notexternalprovider]")) {
                            var dropDown = input.data("kendoDropDownList");
                            if (dropDown != null && dropDown.select() == 0 && CadastroModel.externalProvider == null) {
                                return false;
                            } else if ((input.val() === "" || input.val() === null) && CadastroModel.externalProvider == null) {
                                return false;
                            }
                        }
                        return true;
                    }
                }
            }).data("kendoValidator");
            if (validator.validate()) {
                if (!$("#cadastroProfissionalForm #checkboxTermosDeUso").is(":checked")) {
                    navigator.notification.alert("Aceite os termos de uso.", null, "Aviso", "OK");
                    return;
                }
                CadastroModel.novoUsuario.set("username", CadastroModel.novoUsuario.Email);
                CadastroModel.novoUsuario.set("Role", ROLE_PROFISSIONAL_AGUARDANDO);

                var categories = [];
                $("#cadastro-profissional-categorias input:checked").each(function () {
                    var category = {};
                    category.categoryId = $(this).val();
                    categories.push(category);
                });
                CadastroModel.novoUsuario.set("Categories", categories);

                if (this.externalProvider == null) {
                    doCadastro(this.novoUsuario, ROLE_PROFISSIONAL);
                } else {
                    doCadastroExterno(this.novoUsuario, ROLE_PROFISSIONAL, this.externalProvider, this.externalAccessToken);
                }
            } else {
                navigator.notification.alert("Preencha todos os campos.", null, "Aviso", "OK");
            }
        },

        initCadastroParceiro: function () {
            CadastroModel.set("novoUsuario", {});

            var categorias = $('#cadastroParceiroForm #cadastroParceiroCategorias').kendoDropDownList({
                optionLabel: "Selecione a categoria...",
                dataTextField: "categorie",
                dataValueField: "categorie_Id",
                dataSource: categoriasDeTarefaDS
            }).data("kendoDropDownList");

            var estados = $('#cadastroParceiroForm #cadastroParceiroEstados').kendoDropDownList({
                optionLabel: "Selecione o estado...",
                dataTextField: "state1",
                dataValueField: "state_Id",
                dataSource: estadosDS,
            }).data("kendoDropDownList");

            var cidades = $('#cadastroParceiroForm #cadastroParceiroCidades').kendoDropDownList({
                optionLabel: "Selecione a cidade...",
                autoBind: false,
                cascadeFrom: "cadastroParceiroEstados",
                dataTextField: "city1",
                dataValueField: "city_Id",
                dataSource: cidadesDS,
            }).data("kendoDropDownList");

            var bairros = $('#cadastroParceiroForm #cadastroParceiroBairros').kendoDropDownList({
                optionLabel: "Selecione o bairro...",
                autoBind: false,
                cascadeFrom: "cadastroParceiroCidades",
                dataTextField: "neighborhood1",
                dataValueField: "neighborhood_Id",
                dataSource: bairrosDS,
            }).data("kendoDropDownList");
        },

        cadastraParceiro: function() {
            var validator = $("#cadastroParceiroForm").kendoValidator({
                rules: {
                    requiredIfNotExternalProvider: function (input) {
                        if (input.is("[data-required-if-notexternalprovider]")) {
                            var dropDown = input.data("kendoDropDownList");
                            if (dropDown != null && dropDown.select() == 0 && CadastroModel.externalProvider == null) {
                                return false;
                            } else if ((input.val() === "" || input.val() === null) && CadastroModel.externalProvider == null) {
                                return false;
                            }
                        }
                        return true;
                    }
                }
            }).data("kendoValidator");
            if (validator.validate()) {
                if (!$("#cadastroParceiroForm #checkboxTermosDeUso").is(":checked")) {
                    navigator.notification.alert("Aceite os termos de uso.", null, "Aviso", "OK");
                    return;
                }

                this.novoUsuario.set("username", this.novoUsuario.Email);
                this.novoUsuario.set("Role", ROLE_PARCEIRO);
                var categoria = $('#cadastroParceiroForm #cadastroParceiroCategorias').data("kendoDropDownList").value();
                this.novoUsuario.set("Categories", [{ "CategoryId": categoria }]);

                if (this.externalProvider == null) {
                    doCadastro(this.novoUsuario, ROLE_PARCEIRO);
                } else {
                    doCadastroExterno(this.novoUsuario, ROLE_PARCEIRO, this.externalProvider, this.externalAccessToken);
                }
            } else {
                navigator.notification.alert("Preencha todos os campos.", null, "Aviso", "OK");
            }
        },

        logar: function () {
            if (this.externalProvider == null) {
                obtainAccessToken("password", this.novoUsuario.username, this.novoUsuario.password, false);
            } else {
                externalLogin(this.externalAccessToken, this.externalProvider, null);
            }
        }

    });

    function doCadastro(user, role) {
        //alert(JSON.stringify(user));
        //return;
        app.showLoading();
        $.ajax({
            url: url + '/api/account/register',
            type: "POST",
            data: JSON.stringify(user),
            headers: { 'Content-Type': 'application/json' },
            success: function (data) {
                app.hideLoading();
                if (role === ROLE_CLIENTE) {
                    app.navigate("views/cliente/cadastroComSucesso.html");
                } else if (role === ROLE_PROFISSIONAL) {
                    app.navigate("views/profissional/cadastroComSucesso.html");
                } else if (role === ROLE_PARCEIRO) {
                    app.navigate("views/parceiro/cadastroComSucesso.html");
                }
            },
            error: function (msg) {
                app.hideLoading();

                if (msg.responseText != null) {
                    if (msg.responseText.indexOf("is already taken") != -1) {
                        navigator.notification.alert("Este email ja está em uso.", null, "Erro", "OK");
                        return;
                    } else if (msg.responseText.indexOf("Password must be at least 6 characters") != -1) {
                        navigator.notification.alert("A senha precisa ter 6 ou mais digitos.", null, "Erro", "OK");
                        return;
                    }
                } 
                navigator.notification.alert("Opss ocorreu um erro :(", null, "Erro", "OK");
            }
        });
    };

    function doCadastroExterno(user, role, provider, externalToken) {
        user.Provider = provider;
        user.externalAccessToken = externalToken;
        //alert(JSON.stringify(user));
        //return;
        app.showLoading();
        $.ajax({
            url: url + '/api/account/registerexternal',
            type: "POST",
            data: JSON.stringify(user),
            headers: { 'Content-Type': 'application/json' },
            success: function (data) {
                app.hideLoading();
                if (role === ROLE_CLIENTE) {
                    app.navigate("views/cliente/cadastroComSucesso.html");
                } else if (role === ROLE_PROFISSIONAL) {
                    app.navigate("views/profissional/cadastroComSucesso.html");
                } else if (role === ROLE_PARCEIRO) {
                    app.navigate("views/parceiro/cadastroComSucesso.html");
                }
                return false;
            },
            error: function (msg) {
                app.hideLoading();
                //navigator.notification.alert("Opss ocorreu um erro :(", null, "Erro", "OK");
                navigator.notification.alert(JSON.stringify(msg), null, "Aviso", "OK");
                return false;
            }
        });
    }

})(jQuery, console, document);