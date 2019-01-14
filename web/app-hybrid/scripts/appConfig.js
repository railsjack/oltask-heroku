var url = 'http://consvita.w06.wh-2.com/oltaskapi/api/';

var TAREFA_PENDENTE = 1;
var TAREFA_AGENDADA = 2;
var TAREFA_CONCLUIDA = 3;
var TAREFA_CANCELADA = 4;
var TAREFA_AGUARDANDO_ESCOLHA = 5;
var TAREFA_SEM_PROPOSTA_VENCIDA = 6;

var QUOTE_ABERTO = 1;
var QUOTE_APROVADO = 2;
var QUOTE_REJEITADO = 3;
var QUOTE_CANCELADO = 4;
var QUOTE_CONCLUIDO = 5;

var ROLE_PROFISSIONAL = 2;
var ROLE_CLIENTE = 3;
var ROLE_PARCEIRO = 4;
var ROLE_PROFISSIONAL_AGUARDANDO = 5;

var app, access_token, inAppBrowserRef;
var account, userName, userID, userRole;
var initialView = "LoginView";

var cadastroGender, cadastroFirstName, cadastroLastName, cadastroEmail;
