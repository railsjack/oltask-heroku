﻿(function ($, console, doc) {

    window.ClienteAgendamentoModel = kendo.observable({
        tarefa: null,
        quote: null,
        schedule: null,
        data: function () {
            if (ClienteAgendamentoModel.get("schedule") != null) {
                return "Data: " + kendo.toString(kendo.parseDate(ClienteAgendamentoModel.schedule.startAt), "dd/MM/yyyy");
            }
            return null;
        },
        horario: function () {
            if (ClienteAgendamentoModel.get("schedule") != null) {
                return "Horário: " + kendo.toString(kendo.parseDate(ClienteAgendamentoModel.schedule.startAt), "HH':'mm")
                + " às " + kendo.toString(kendo.parseDate(ClienteAgendamentoModel.schedule.endAt), "HH':'mm");
            }
            return null;
        },
        valor: function () {
            if (ClienteAgendamentoModel.get("quote") != null) {
                return "Valor R$ " + kendo.toString(ClienteAgendamentoModel.quote.visitValue, "0.00");
            }
            return null;
        },
        photo: function () {
            if (ClienteAgendamentoModel.get("quote") != null && ClienteAgendamentoModel.get("quote.photoUrl") != null) {
                var url = ClienteAgendamentoModel.get("quote.photoUrl");
                var publicID = url.substring(url.lastIndexOf("/") + 1);
                return $.cloudinary.url(publicID, {
                    width: 150, height: 150, crop: 'thumb', gravity: 'face'
                });
            }
            return null;
        }
    });

})(jQuery, console, document);