(function () {

    window.ProfissionalPropostas = kendo.observable({
        tarefasPublicadasPorCategoria: tarefasPublicadasPorCategoriaDS,

        loaded: false,

        noTasks: false,

        error: false,

        selectedJob: null,

        reset: function () {
            ProfissionalPropostas.set("selectedJob", null);
            ProfissionalPropostas.set("loaded", false);
            ProfissionalPropostas.set("noTasks", false);
            ProfissionalPropostas.set("error", false);
        },

        init: function () {
            tarefasPublicadasPorCategoriaDS.bind("change", function (e) {
                ProfissionalPropostas.set("noTasks", tarefasPublicadasPorCategoriaDS.view().length === 0);
                ProfissionalPropostas.set("error", false);
                ProfissionalPropostas.set("loaded", true);
                app.hideLoading();
            });
            tarefasPublicadasPorCategoriaDS.bind("error", function (e) {
                ProfissionalPropostas.set("loaded", false);
                ProfissionalPropostas.set("error", true);
                ProfissionalPropostas.set("noTasks", false);
                app.hideLoading();
                if (e.xhr.status == 401) {
                    //o token expirou, volta para a tela de login.
                    app.navigate("#LoginView");
                };
            });
        },

        show: function() {
            if (ProfissionalPropostas.loaded === false) {
                app.showLoading();
                tarefasPublicadasPorCategoriaDS.read();
            }
            $('.km-content:visible').data('kendoMobileScroller').reset();
        },
       
        selectedJobGetDate: function () {
            if (ProfissionalPropostas.get("selectedJob") != null) {
                if (ProfissionalPropostas.get("selectedJob").schedules[0] != null) {
                    return kendo.toString(kendo.parseDate(ProfissionalPropostas.get("selectedJob").schedules[0].startAt), "dd/MM/yyyy");
                }
            }
        },
        selectedJobGetOption1: function () {
            if (ProfissionalPropostas.get("selectedJob") != null) {
                if (ProfissionalPropostas.get("selectedJob").schedules[0] != null) {
                    return kendo.toString(kendo.parseDate(ProfissionalPropostas.get("selectedJob").schedules[0].startAt), "HH':'mm") + " às " + kendo.toString(kendo.parseDate(ProfissionalPropostas.get("selectedJob").schedules[0].entAt), "HH':'mm");
                }
            }
        },
        selectedJobGetOption2: function () {
            if (ProfissionalPropostas.get("selectedJob") != null) {
                if (ProfissionalPropostas.get("selectedJob").schedules[1] != null) {
                    return kendo.toString(kendo.parseDate(ProfissionalPropostas.get("selectedJob").schedules[1].startAt), "HH':'mm") + " às " + kendo.toString(kendo.parseDate(ProfissionalPropostas.get("selectedJob").schedules[1].entAt), "HH':'mm");
                }
            }
        },

        confirmar: function () {
            if ($('#modalview-enviarProposta [name=dateOption]:checked').val() == null) {
                alert("Selecione uma opção de horário");
                return;
            }
            if ($('#modalview-enviarProposta [name=propostaValor]').val() > 0) {
                
                var job = ProfissionalPropostas.get("selectedJob");

                var quote = {
                    "service_Id": job.service_Id,
                    "visitValue": $('#modalview-enviarProposta [name=propostaValor]').val(),
                    "appointment_Id": job.schedules[$('#modalview-enviarProposta [name=dateOption]:checked').val()].appointment_Id,
                    "serviceProvider_Id": userID,
                    "status": 1
                };

                app.showLoading();
                $.ajax({
                    url: url + 'api/quotes',
                    type: "POST",
                    data: JSON.stringify(quote),
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + access_token },
                    success: function (data) {

                        var data = {
                            "customer_Id": job.customer_Id,
                            "categorie_Id": job.categorie_Id,
                            "status": TAREFA_AGUARDANDO_ESCOLHA,
                        };

                        $.ajax({
                            url: url + 'api/services/' + job.service_Id,
                            type: "PUT",
                            data: JSON.stringify(data),
                            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + access_token },
                            success: function (data) {
                                tarefasPublicadasPorCategoriaDS.remove(job);
                                app.hideLoading();
                                alert("Proposta enviada com sucesso");
                                $("#modalview-enviarProposta [name=dateOption]:checked").attr("checked", false);
                                $("#modalview-enviarProposta [name=propostaValor]").val("");
                                $("#modalview-enviarProposta").kendoMobileModalView("close");
                            },
                            error: function (msg) {
                                navigator.notification.alert("Ocorreu um Erro.", null, "Erro", "OK");
                                app.hideLoading();
                            }
                        });
                    },
                    error: function (msg) {
                        app.hideLoading();
                        alert("Opss ocorreu um erro :(");
                    }
                });


            } else {
                alert("Forneça um valor");
            }
            
        }
    });


    window.AgendaDeTarefas = kendo.observable({
        data: agendaProfissionalDS,

        loading: false,

        loaded: false,

        noTasks: false,

        error: false,

        reset: function () {
            AgendaDeTarefas.set("loading", false);
            AgendaDeTarefas.set("loaded", false);
            AgendaDeTarefas.set("noTasks", false);
            AgendaDeTarefas.set("error", false);
        },

        init: function () {
            agendaProfissionalDS.bind("change", function (e) {  
                AgendaDeTarefas.set("noTasks", agendaProfissionalDS.view().length === 0);
                if (AgendaDeTarefas.loading) {
                    AgendaDeTarefas.set("error", false);
                    AgendaDeTarefas.set("loaded", true);
                    AgendaDeTarefas.set("loading", false);
                    app.hideLoading();
                }
            });
            agendaProfissionalDS.bind("error", function (e) {
                AgendaDeTarefas.set("loaded", false);
                AgendaDeTarefas.set("error", true);
                AgendaDeTarefas.set("noTasks", false);
                app.hideLoading();
                if (e.xhr.status == 401) {
                    //o token expirou, volta para a tela de login.
                    app.navigate("#LoginView");
                };
            });
            $("#profissionalTarefasView #btnAgendaProfissionalViewToggle").data("kendoMobileButtonGroup").bind("select", function (e) {
                AgendaDeTarefas.tarefasViewChanged(e.sender.selectedIndex);
            });
            $("#profissionalTarefasView #btnAgendaProfissionalViewToggleM").data("kendoMobileButtonGroup").bind("select", function (e) {
                AgendaDeTarefas.tarefasViewChanged(e.sender.selectedIndex);
            });
        },

        show: function () {
            AgendaDeTarefas.tarefasViewChanged($("#profissionalTarefasView #btnAgendaProfissionalViewToggle").data("kendoMobileButtonGroup").current().index());
            AgendaDeTarefas.tarefasViewChanged($("#profissionalTarefasView #btnAgendaProfissionalViewToggleM").data("kendoMobileButtonGroup").current().index());
            if (AgendaDeTarefas.loaded === false) {
                app.showLoading();
                AgendaDeTarefas.set("loading", true);
                agendaProfissionalDS.read();
            }
        },

        tarefasViewChanged: function (index) {
            var isAgendadas = (index === 0);
            var isPendentes = (index === 1);

            $('.km-content:visible').data('kendoMobileScroller').reset();

            if (isAgendadas) {
                mostraTarefasAgendadas();
            } else if (isPendentes) {
                mostraTarefasPendentes();
            } else {
                mostraTarefasConcluidas();
            }
        }

    });

    function mostraTarefasAgendadas() {
        $("#profissionalTarefasView .alert").show();
        $("#profissionalTarefasView .alert").html("<p><label><b>Parabéns, você possui visitas agendadas!</b></label></p>" + 
                    "<p><label><i>Confirme as solicitações enviadas para que seus clientes estejam preparados no prazo confirmado.</i></label></p>");
        
        agendaProfissionalDS.filter({
            "field": "status",
            "operator": "eq",
            "value": QUOTE_APROVADO
        });

        agendaProfissionalDS.fetch();
    };
   
    function mostraTarefasPendentes() {
        $("#profissionalTarefasView .alert").hide();

        agendaProfissionalDS.filter({
            "field": "status",
            "operator": "eq",
            "value": QUOTE_ABERTO
        });

        agendaProfissionalDS.fetch();
    }

    function mostraTarefasConcluidas() {
        $("#profissionalTarefasView .alert").hide();

        agendaProfissionalDS.filter({
            logic: "or",
            filters: [
              { field: "status", operator: "eq", value: QUOTE_CONCLUIDO },
              { field: "status", operator: "eq", value: QUOTE_REJEITADO }
            ]
        });

        agendaProfissionalDS.fetch();
    };
    
}());