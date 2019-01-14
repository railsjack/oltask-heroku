(function ($, console, doc) {

    window.NovaTarefaModel = kendo.observable({

        enderecos: enderecosDoClienteDS,

        estados: estadosDS,

        cidades: cidadesDS,

        bairros: bairrosDS,

        categoriasDeTarefas: categoriasDeTarefaDS,

        usarEnderecoNovo: false,

        novoEndereco: function () {
            this.resetAddress();
            NovaTarefaModel.set("usarEnderecoNovo", true);
        },

        selecionarEndereco: function () {
            this.resetAddress();
            NovaTarefaModel.set("usarEnderecoNovo", false);
        },

        novaTarefa: null,

        init: function () {
            var enderecos = $('#novaTarefaForm #enderecos').kendoDropDownList({
                optionLabel: "Selecione o endereco...",
                dataTextField: "state",
                dataValueField: "address_Id",

                valueTemplate: '#if (data.address_Id != "") {#<span class="selected-value">#: data.street #, #: data.number #, #: data.neighborhood #, #: data.city # - #: data.state #</span>#} else {# <span class="selected-value">#:data.state#</span> #}#',
                template: '<span class="k-state-default">#: data.street #, #: data.number #, #: data.neighborhood #, #: data.city # - #: data.state #</span>',
                dataSource: enderecosDoClienteDS,
            }).data("kendoDropDownList");

            var estados = $('#novaTarefaForm #estados').kendoDropDownList({
                optionLabel: "Selecione o estado...",
                dataTextField: "state1",
                dataValueField: "state_Id",
                dataSource: NovaTarefaModel.estados,
            }).data("kendoDropDownList");

            var cidades = $('#novaTarefaForm #cidades').kendoDropDownList({
                optionLabel: "Selecione a cidade...",
                autoBind: false,
                cascadeFrom: "estados",
                dataTextField: "city1",
                dataValueField: "city_Id",
                dataSource: NovaTarefaModel.cidades,
            }).data("kendoDropDownList");

            var bairros = $('#novaTarefaForm #bairros').kendoDropDownList({
                optionLabel: "Selecione o bairro...",
                autoBind: false,
                cascadeFrom: "cidades",
                dataTextField: "neighborhood1",
                dataValueField: "neighborhood_Id",
                dataSource: NovaTarefaModel.bairros,
            }).data("kendoDropDownList");
            
            var categorias = $('#novaTarefaForm #categorias').kendoDropDownList({
                optionLabel: "Selecione a categoria...",
                dataTextField: "categorie",
                dataValueField: "categorie_Id",
                dataSource: NovaTarefaModel.categoriasDeTarefas,
            });
        },

        resetAddress: function () {
            NovaTarefaModel.set("novaTarefa.Address", {});
            var enderecos = $("#novaTarefaForm #enderecos").data("kendoDropDownList");
            enderecos.select(0);
            var estados = $("#novaTarefaForm #estados").data("kendoDropDownList");
            estados.select(0);
        },

        show: function () {
            enderecosDoClienteDS.read();

            NovaTarefaModel.set("usarEnderecoNovo", false);

            NovaTarefaModel.set("novaTarefa", {
                Service: {
                    urgent: false
                },
                Schedules: [{}, {}],
                Address: {}
            });

            var enderecos = $("#novaTarefaForm #enderecos").data("kendoDropDownList");
            enderecos.select(0);
            var estados = $("#novaTarefaForm #estados").data("kendoDropDownList");
            estados.select(0);
            var categorias = $('#novaTarefaForm #categorias').data("kendoDropDownList");
            categorias.select(0);
            $('#novaTarefaForm #data').val("");
            $('#novaTarefaForm #horaInicio1').val("");
            $('#novaTarefaForm #horaFim1').val("");
            $('#novaTarefaForm #horaInicio2').val("");
            $('#novaTarefaForm #horaFim2').val("");

            if(kendo.support.mobileOS === false){

                $("input[type=date]").kendoDatePicker({format: "dd/MM/yyyy"});
                $("input[type=time]").kendoTimePicker({format: 'HH:mm'});

            }
        },

        publicar: function () {
            var validator = $("#novaTarefaForm").kendoValidator({
                rules: {
                    requiredIfNotUrgent: function (input) {
                        if (input.is("[data-required-if-not-urgent]") && input.val() == null && NovaTarefaModel.novaTarefa.Service.urgent != true) {
                            return false;
                        }
                        return true;
                    },
                    requiredIfSelecionarEndereco: function (input) {
                        if (input.is("[data-required-if-selecionarendereco]")) {
                            var dropDown = input.data("kendoDropDownList");
                            if (dropDown != null && dropDown.select() == 0 && NovaTarefaModel.usarEnderecoNovo != true) {
                                return false;
                            } else if (input.val() == null && NovaTarefaModel.usarEnderecoNovo != true) {
                                return false;
                            }
                        }
                        return true;
                    },
                    requiredIfNovoendereco: function (input) {
                        if (input.is("[data-required-if-novoendereco]")) {
                            var dropDown = input.data("kendoDropDownList");
                            if (dropDown != null && dropDown.select() == 0 && NovaTarefaModel.usarEnderecoNovo == true) {
                                return false;
                            } else if (input.val() == null && NovaTarefaModel.usarEnderecoNovo == true) {
                                return false;
                            }
                        }
                        return true;
                    }
                }
            }).data("kendoValidator");

            if (validator.validate()) {
                this.novaTarefa.Service.set("Customer_Id", userID);
                this.novaTarefa.Service.set("Status", TAREFA_PENDENTE);

                var dataAtual = new Date();
                if (!this.novaTarefa.Service.urgent) {
                    var dataInicio1, dataFim1, dataInicio2, dataFim2;
                    dataInicio1 = $('#novaTarefaForm #data').val() + 'T' + $('#novaTarefaForm #horaInicio1').val();
                    dataFim1 = $('#novaTarefaForm #data').val() + 'T' + $('#novaTarefaForm #horaFim1').val();
                    dataInicio2 = $('#novaTarefaForm #data').val() + 'T' + $('#novaTarefaForm #horaInicio2').val();
                    dataFim2 = $('#novaTarefaForm #data').val() + 'T' + $('#novaTarefaForm #horaFim2').val();

                    if (kendo.parseDate(dataFim1, "dd/MM/yyyyTHH:mm") <= dataAtual || kendo.parseDate(dataFim2, "dd/MM/yyyyTHH:mm") <= dataAtual) {
                        navigator.notification.alert("Escolha uma data futura.", null, "Aviso", "OK");
                        return;
                    }
                    if (dataFim1 <= dataInicio1) {
                        navigator.notification.alert("A hora de inicio deve ser menor do que a hora final.", null, "Aviso", "OK");
                        return;
                    }
                    if (dataFim2 <= dataInicio2) {
                        navigator.notification.alert("A hora de inicio deve ser menor do que a hora final.", null, "Aviso", "OK");
                        return;
                    }

                    dataInicio1 = kendo.parseDate(dataInicio1, "dd/MM/yyyyTHH:mm");
                    dataFim1 = kendo.parseDate(dataFim1, "dd/MM/yyyyTHH:mm");
                    dataInicio2 = kendo.parseDate(dataInicio2, "dd/MM/yyyyTHH:mm");
                    dataFim2 = kendo.parseDate(dataFim2, "dd/MM/yyyyTHH:mm");

                    dataInicio1 = kendo.toString(dataInicio1, "yyyy'-'MM'-'dd'T'HH':'mm");
                    dataFim1 = kendo.toString(dataFim1, "yyyy'-'MM'-'dd'T'HH':'mm");
                    dataInicio2 = kendo.toString(dataInicio2, "yyyy'-'MM'-'dd'T'HH':'mm");
                    dataFim2 = kendo.toString(dataFim2, "yyyy'-'MM'-'dd'T'HH':'mm");

                    this.novaTarefa.Schedules[0].set("startAt", dataInicio1);
                    this.novaTarefa.Schedules[0].set("entAt", dataFim1);
                    this.novaTarefa.Schedules[1].set("startAt", dataInicio2);
                    this.novaTarefa.Schedules[1].set("entAt", dataFim2);


                } else {                    
                    var inicio = kendo.toString(dataAtual, "yyyy'-'MM'-'dd'T'HH':'mm':'ss");
                    dataAtual.setHours(dataAtual.getHours() + 1);
                    var fim = kendo.toString(dataAtual, "yyyy'-'MM'-'dd'T'HH':'mm':'ss");

                    this.novaTarefa.set("Schedules", [{ startAt: inicio, entAt: fim }]);
                }
                
                var novaTarefa = JSON.stringify(this.novaTarefa);
                publicaTarefa();
                //publicaTarefaLocal();
            } else {
                navigator.notification.alert("Preencha todos os campos.", null, "Aviso", "OK");
            };
        }

    });

    function publicaTarefaLocal() {
        var tarefa = {
            service_Id: 1,
            title: NovaTarefaModel.novaTarefa.Service.Title,
            description: NovaTarefaModel.novaTarefa.Service.Description,
            schedules: NovaTarefaModel.novaTarefa.Schedules,
            status: NovaTarefaModel.novaTarefa.Service.status,
            urgent: NovaTarefaModel.novaTarefa.Service.urgent
        }

        pendentes.push(tarefa);
        tarefasPendentesDS.add(tarefa);
        app.navigate('views/cliente/main.html');
    }

    function publicaTarefa() {
        //alert(JSON.stringify(NovaTarefaModel.novaTarefa.Schedules));
        //return;
        app.showLoading();
        $.ajax({
            url: url + 'api/ServiceScheduleAddress',
            type: "POST",
            data: JSON.stringify(NovaTarefaModel.novaTarefa),
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + access_token },
            success: function (data) {
                var tarefa = {
                    service_Id: 1,
                    status: TAREFA_PENDENTE,
                    title: NovaTarefaModel.novaTarefa.Service.Title,
                    description: NovaTarefaModel.novaTarefa.Service.Description,
                    schedules: NovaTarefaModel.novaTarefa.Schedules
                }
                for (i = 0 ; i < tarefa.schedules.length ; i++) {
                    tarefa.schedules[i].endAt = tarefa.schedules[i].entAt
                }
                tarefasPendentesDS.add(tarefa);
                app.hideLoading();
                app.navigate('views/cliente/main.html');
                return false;
            },
            error: function (msg) {
                app.hideLoading();
                navigator.notification.alert("Ocorreu um Erro.", null, "Erro", "OK");
                return false;
            }
        });
    }

})(jQuery, console, document);