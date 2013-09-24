/* [ ---- Gebo Admin Panel - extended form elements ---- ] */

$(document).ready(function() {
    
    date = new Date();
    month = date.getMonth() + 1;
    
    $('.btns_state').find('button[rel=' + month + ']').addClass(' active');
    
    //app_loading_div.init();
    app_update.init();
    app_loading.init(month, false);
    app_movement.init();
    app_form.init();
    app_home.init();
    app_fullcalendar.init();
    app_datepicker.init();
    app_mask_input.init();
    app_spinners.init();
    app_colorCategory.init();
});

app_update = {
    init: function (){
        $('#update-box').click(function(){
            date = new Date();
            month = date.getMonth() + 1;
    
            app_loading.init(month, false);
        });
    }
}

app_loading_div = {
    init: function (){
        // loading
        loading = $('div.loading');
        loading.ajaxStart(function(){
            $(this).css('display', 'block');
        }).ajaxStop(function(){
            $(this).css('display', 'none');
        });
    }
};

app_fullcalendar = {
    init: function (){
        // Ao clicar no campo titlo remove a classe error
        $('#dialogo-titulo').click(function(){
            $(this).removeClass('error')
        });
	
        // selects layout for schedule
        if ( window.location.pathname == '/agenda/calendario'){
            var paramDefaultView = 'month';
            var paramHeight = 650;
            var paramHeader = { 
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            };	
        }else{
            var paramDefaultView = 'basicDay';
            var paramHeight = 200;
            var paramHeader = { 
                left: '',
                center: 'prev,today,next',
                right: ''
            };		
        }
    
        $('#calendar').fullCalendar({
            editable: true,
            draggable: true,
            events: "/agenda/json-eventos",
            theme:false,
            timeFormat: { // for event elements
                ' ': 'HH:mm ' // default
            },
            defaultView: paramDefaultView,
            height: paramHeight,
		
            eventDrop: function(event, delta) {
			
                $.ajax({
                    type: "POST",
                    url: "/agenda/atualizar-evento-data-inicio",
                    data: "cdevento="+ event.id +"&delta="+ delta,
                    success: function(){
                    }
                });
			
            },
	   
            // dayClick -----------------------------------------------------
            dayClick: function(date, allDay, jsEvent, view) 
            {
                var curr_day = date.getDate();
                if(curr_day < 10)  curr_day = '0' + curr_day;
                var curr_month = date.getMonth() + 1;
                if(curr_month < 10) curr_month = '0' + curr_month;					
                var curr_year = date.getFullYear();		
                var data = curr_day + '/' + curr_month + '/' + curr_year;
			
                $('#evento-data-inicio').val(data);
                $('#evento-data-fim').val(data);
			
                if (allDay) 
                {
                    $('#evento-dia-inteiro').attr('checked', true);
                    $("#evento-hora-inicio").hide();
                    $("#evento-hora-fim").hide();
				
                }else{				
				
                    $('#evento-dia-inteiro').attr('checked', false);
                    $("#evento-hora-inicio").show();
                    $("#evento-hora-fim").show();	
				
                    var curr_hours = date.getHours();
                    if(curr_hours < 10){
                        curr_hours = '0' + curr_hours;
                    }
                    var curr_minutes = date.getMinutes();
                    if(curr_minutes < 10){
                        curr_minutes = '0' + curr_minutes;					
                    }	
				
                    $('#evento-hora-inicio').val( curr_hours + ':' + curr_minutes );
                    $('#evento-hora-fim').val( curr_hours + ':' + curr_minutes );				
                }
			
                dialogo();
            },
		
            eventMouseover: function (event, jsEvent, view) {

            }, //end full calendar mouseover event

		
            // eventClick -------------------------------------------------
            eventClick: function(event, jsEvent){
			
                var eventStart = event.start;
                var eventEnd   = event.end;
			
                if(eventStart)
                {
                    var startDay    = eventStart.getDate();
                    if( startDay < 10 ) startDay = '0' + startDay;
                    var startMonth  = eventStart.getMonth() + 1; //months are zero based
                    if( startMonth < 10 ) startMonth = '0' + startMonth;
                    var startYear   = eventStart.getFullYear();
				
                    $('#evento-data-inicio').val( startDay + '/' + startMonth + '/' + startYear );
                }
			
                if(eventEnd)
                {
                    var endDay    = eventEnd.getDate();
                    if( endDay < 10 ) endDay = '0' + endDay;
                    var endMonth  = eventEnd.getMonth() + 1; //months are zero based
                    if( endMonth < 10 ) endMonth = '0' + endMonth;
                    var endYear   = eventEnd.getFullYear();
				
                    $('#evento-data-fim').val( endDay + '/' + endMonth + '/' + endYear );
                }else{
                    $('#evento-data-fim').val( startDay + '/' + startMonth + '/' + startYear );
                }
			
                if(!event.allDay)
                {
                    if(eventStart){
                        var startHours  = eventStart.getHours();
                        if(startHours < 10) startHours = '0' + startHours;
                        var startMnutes = eventStart.getMinutes();
                        if(startMnutes < 10) startMnutes = '0' + startMnutes;
                        $('#evento-hora-inicio').val( startHours + ':' + startMnutes );
                    }
				
                    if(eventEnd){
                        var endHours  = eventEnd.getHours();
                        if(endHours < 10) endHours = '0' + endHours;
                        var endMnutes = eventEnd.getMinutes();
                        if(endMnutes < 10) endMnutes = '0' + endMnutes;
                        $('#evento-hora-fim').val( endHours + ':' + endMnutes );
                    }else{
                        $('#evento-hora-fim').val( startHours + ':' + startMnutes );
                    }
				
                    $("#evento-hora-inicio").show();
                    $("#evento-hora-fim").show();	
                    $('#evento-dia-inteiro').attr('checked', false);
                }else{
                    $("#evento-hora-inicio").hide();
                    $("#evento-hora-fim").hide();	
                    $('#evento-dia-inteiro').attr('checked', true);
                }
			
                if(event.completed) {
                    $('#evento-completed').attr('checked', true);
                } else {
                    $('#evento-completed').attr('checked', false);
                }
                        
                $('#evento-id').val( event.id );
                $('#evento-titulo').val( event.title );			
                $('#evento-descricao').val( event.description );
			
                dialogoEditar();
            },

            header: paramHeader		
        });
    
        function dialogo ( )
        {
            $("#evento").dialog({
                autoOpen: false,
                modal: true,		
                width: 600,
                resizable: false,
                closeText: 'fechar',
                buttons: {
                    Cancelar: function () {
                        $('#dialogo-titulo').removeClass('error');
                        $(this).dialog("close");
                    
                    },
                    Cadastrar: function () {				
                        var titulo      = $('#evento-titulo').attr('value');
                        var data_inicio = $('#evento-data-inicio').attr('value');
                        var completed   = $('#evento-completed').attr('checked');
                        var data_fim    = $('#evento-data-fim').attr('value');
                        var hora_inicio = $('#evento-hora-inicio').attr('value');
                        var hora_fim    = $('#evento-hora-fim').attr('value');				
                        var descricao   = $('#evento-descricao').attr('value');
                        var flAllDay    = $('#evento-dia-inteiro').attr('checked');
    				
                        if(titulo == ''){
                            $('#dialogo-titulo').addClass('error');
                            return false;
                        }
    				
                        $.ajax({
                            type: "POST",
                            url: "/agenda/inserir-evento",
                            dataType: "json",
                            data: "title="+ titulo +"&start_date="+ data_inicio + " " + hora_inicio +"&end_date="+ data_fim + " " + hora_fim +"&description="+ descricao + "&full_day=" + flAllDay + "&completed=" + completed,
                            success: function( resposta ){						
                                if( resposta.status == 'success' )
                                {				
                                    app_loading.getEvents();
                                    data_inicio_sql = dtbr2sql( data_inicio );								
                                    data_fim_sql = dtbr2sql( data_fim );
                                    
                                    // Define a cor do evento
                                    var color = completed == 'checked' ? '#62C462': '#f77669';
    							
                                    if( flAllDay == "checked" ){
                                        $('#calendar').fullCalendar('renderEvent', {
                                            id: resposta.evento_id,
                                            title: titulo,
                                            description: descricao,
                                            completed: completed,
                                            start: data_inicio_sql,
                                            end: data_fim_sql,
                                            editable: false,
                                            allDay: true,
                                            backgroundColor: color
                                        }, false);
                                    }else{
                                        $('#calendar').fullCalendar('renderEvent', {
                                            id: resposta.evento_id,
                                            title: titulo,
                                            description: descricao,
                                            completed: completed,
                                            start: data_inicio_sql + ' ' + hora_inicio + ':00',
                                            end: data_fim_sql + ' ' + hora_fim + ':00',
                                            editable: false,
                                            allDay: false,
                                            backgroundColor: color
                                        }, false);	
                                    }
                                }else{
                                    alert( 'Erro ao salvar evento, para mais informações entre em contato com o administrador do sismtema.' );
                                }
                            }
                        });
                        
                        $('#dialogo-titulo').removeClass('error');
                        $(this).dialog("close");				
                    }
                },
                open: function () {
                    $('button:contains("Cancelar")').removeClass().addClass('btn');
                    $('button:contains("Cadastrar")').removeClass().addClass('btn btn-primary');
                },
                close: function () {
                    resetForm('form-evento');
                }
            }).dialog("open");
        
        }
    
        function dtbr2sql(data){
            data = data.split('/');
            return data[2] + '-' + data[1] + '-' + data[0];
        }
    
        function resetForm(id) {
            $('#'+id).each(function(){
                this.reset();
            });
        }
    
        $("#evento-dia-inteiro").change(function() 
        {
            $("#evento-hora-inicio").toggle();
            $("#evento-hora-fim").toggle();
        });
	
        function dialogoEditar()
        {
            // modal dialog init: custom buttons and a "close" callback reseting the form inside
            // editar evento
            $("#evento").dialog({
                autoOpen: false,
                resizable: false,
                modal: true,
                width: 600,
                closeText: 'fechar',		
                buttons: {
                    Cancelar: function () {
                        $(this).dialog("close");
                    },		
                    Excluir: function () {
                        
                        var answer = confirm("Realmente deseja excluir este evento?")
                        if (answer){
                                
                            var eventoId = $('#evento-id').attr('value');
                            $.ajax({
                                type: "POST",
                                url: "/agenda/excluir-evento",
                                data: "id="+ eventoId,
                                success: function(){
                                    app_loading.getEvents();
                                    $('#calendar').fullCalendar('removeEvents', eventoId);
                                }
                            });
                            $(this).dialog("close");
                                
                        } else {
                            $(this).dialog("close");
                            return false;
                        }
                        
					
                    },
                    // edidar | atualizar no banco
                    Salvar: function () {
	            	
                        // Armazena os valores dos campos em variaveis
                        var evento_id = $('#evento-id').attr('value');
                        var titulo = $('#evento-titulo').attr('value');
                        var data_inicio = $('#evento-data-inicio').attr('value');		
                        var data_fim = $('#evento-data-fim').attr('value');				
                        var hora_inicio = $('#evento-hora-inicio').attr('value');				
                        var hora_fim = $('#evento-hora-fim').attr('value');								
                        var descricao = $('#evento-descricao').attr('value');
                        var dia_inteiro = $('#evento-dia-inteiro').attr('checked');
                        var completed = $('#evento-completed').attr('checked');

                        $.ajax({
                            type: "POST",
                            url: "/agenda/editar-evento",
                            data: "id=" + evento_id 
                            + "&title=" + titulo 
                            + "&start_date=" + data_inicio + " " + hora_inicio  
                            + "&end_date=" + data_fim  + " " + hora_fim
                            + "&description=" + descricao 
                            + "&full_day=" + dia_inteiro 
                            + "&completed=" + completed,
                            success: function()
                            {
                                app_loading.getEvents();
                                // Remove o evento editado
                                $('#calendar').fullCalendar('removeEvents', evento_id);
							
                                // Altera o padrão da data
                                data_inicio_sql = dtbr2sql( data_inicio );
                                data_fim_sql = dtbr2sql( data_fim );
						
                                var color = completed == 'checked' ? '#62C462': '#f77669';
                                                
                                // Verifica se o evento é de dia inteiro
                                if( dia_inteiro == 'checked' ){
                                    hora_inicio = '00:00';
                                    hora_fim = '00:00';							
                                        editable: false,
                                        renderAllDay = true;							
                                }else{
                                    renderAllDay = false;							
                                }						
							
                                // Adiciona o evento editado
                                $('#calendar').fullCalendar('renderEvent', {
                                    id: evento_id, 
                                    title: titulo, 
                                    description: descricao,
                                    completed: completed,
                                    start: data_inicio_sql + ' ' + hora_inicio + ':00', 
                                    end: data_fim_sql + ' ' + hora_fim + ':00',
                                    editable: false,
                                    allDay: renderAllDay,
                                    backgroundColor: color
                                }, false);
                            }
                        });
                        $(this).dialog("close");
                    }
                },
                open: function () {
                    $('button:contains("Cancelar")').removeClass().addClass('btn');
                    $('button:contains("Salvar")').removeClass().addClass('btn btn-primary');				
                    $('button:contains("Excluir")').removeClass().addClass('btn btn-red');			
                },
                close: function () {
                    resetForm('form-evento');
                }
            }).dialog("open");		
        }
        
    }
};

app_movement = {
    init: function(){
        app_movement.addMovement();
        app_movement.deleteMovement();
        app_movement.statusMovement();
        app_movement.editMovement();
    },
    alterNotification: function(action, id){
        
        var elem = $('#' + id + '.' + action + '-notification');
        elem.html('<img alt="activity indicator" src="/img/ajax-loader.gif" title="Carregando...">');
        
        $.ajax({
            type: 'POST',
            data: 'action=update-notification' 
            + '&id=' + id 
            + '&attr=' + action,
            url:  '/ajax',
            dataType: "json",
            success: function(response){
                if( response.status == 'success' ){
                    
                    $.sticky(response.message, {
                        autoclose : 5000, 
                        position: "top-center", 
                        type: "st-success"
                    });
                    
                    month = $('.active').attr('rel');
                    app_loading.init(month, id, action);
                } else {
                    $.sticky(response.message, {
                        autoclose : 5000, 
                        position: "top-center", 
                        type: "st-error"
                    });
                }
            }
        });
        
    },
    addMovement: function(){
        $('#add-movement').click(function(){
            
            app_form.reset();
            
            $("#movimentacao").dialog({
                autoOpen: false,
                modal: false,		
                width: 560,
                resizable: false,
                closeText: 'fechar',
                open: function (){
                    app_form.reset();
                }
            }).dialog("open");
        });
    },
    deleteMovement: function (){
        $('a[class=delete-notification]').live('click', function(e){
            e.preventDefault();
            var elem = $(this);
            var id = elem.attr('id');
            var answer = confirm("Você tem certeza que deseja apagar esta movimentação?")
            if (answer){
                app_movement.alterNotification('delete', id);
            } 
        });
        
    },
    statusMovement: function (){
        $('.status-notification').live('click', function(e){
            e.preventDefault();
            var elem = $(this);
            var id = elem.attr('id');
            app_movement.alterNotification('status', id);
        });
    },
    editMovement: function (){
        $('a[class=edit-notification]').live('click', function(e){
            e.preventDefault();
            var id = $(this).attr('rel');
            app_form.reset();
            
            $("#movimentacao").dialog({
                autoOpen: false,
                modal: false,		
                width: 560,
                resizable: false,
                closeText: 'fechar',
                open: function(){
                    $.ajax({
                        type: "POST",
                        data: 'id=' + id,
                        url: "/index/get-movement",
                        dataType: "json",
                        success: function(response){
                            if(response.type == '1')
                                $('#type')[0].checked = true;
                        
                            $('#id').val(response.id);
                            $('#description').val(response.description);
                            $('#value').val(response.value);
                            $('#date').val(response.date);
                            $('#category').val(response.category);
                        }
                    });
                },
                close: function () {
                    app_form.reset();
                }
            }).dialog("open");
        });
    }
};

app_form = {
    init: function (){
        app_form.reset();
        app_form.ajax();
    },
    reset: function (){
        var forms = $('form[name=form_ajax]');
        
        $('#id').val('');
        if( forms.length )
            forms[0].reset();
    },
    ajax: function (){
        $('form[name=form_ajax]').live('submit', function()
        {
            var form  = $(this);
            var dados = form.serialize(); 
            var url   = form.attr('action');
                        
            $.ajax({
                type: 'POST',
                data: dados,
                url:  url,
                dataType: "json",
                success: function(response){
                    if( response.status == 'success' ){
                        
                        $("#movimentacao").dialog('close')
                        
                        $.sticky("Movimentação salva com sucesso!", {
                            autoclose : 5000, 
                            position: "top-center", 
                            type: "st-success"
                        });
                        id    = $('input[name=id]').val();
                        app_form.reset();
                        month = $('.active').attr('rel');
                        app_loading.init(month, id, 'edit');
                    }
                    else {
                        $.sticky("Erro ao salvar movimentação!!", {
                            autoclose : 5000, 
                            position: "top-center", 
                            type: "st-error"
                        });
                    }
                }
            });
            return false;
        });
    }
};

app_home = {
    init: function (){
        app_home.buttonMonth();
    },
    buttonMonth: function (){
        $('.btns_state').find('.btn').click(function(e) {
            $this_btn = $(this);
            month = $this_btn.attr('rel');
            $this = $this_btn.closest('.btns_state');
            $this_btn.button('loading');
            
            $('.btns_state').find('.btn').removeClass(' active');
            $this_btn.addClass('active');
           
            app_loading.init(month);
            e.preventDefault();
            $this_btn.button('reset');

        });
    }
};

app_loading = {
    init: function (month, id, action){
        var htmlLoading = '<div style="padding: 50px; text-align: center;"><img src="/img/ajax_loader.gif" title="Carregando..."></div>';
        
        if($('#sortable_panels').length){
            app_loading.boxNotPayable(month, htmlLoading, id);
            app_loading.boxNotReceivable(month, htmlLoading, id);
            app_loading.boxNotToPayable(month, htmlLoading, id);
            app_loading.boxNotToReceivable(month, htmlLoading, id);
            //app_loading.boxNotReportReceivable(month, htmlLoading);
            //app_loading.boxNotReportPayable(month, htmlLoading);
            app_loading.boxNotOverview(month, htmlLoading);
            app_loading.getNotifications();
            app_loading.getEvents();
            app_loading.boxUsersLastAccessed(htmlLoading);
            app_loading.boxUsersLastAccessed(htmlLoading);
        }
        
        if($('#sortable_transactions').length){
            app_loading.listMovements(month, htmlLoading, id, action);
            app_loading.boxNotOverview(month, htmlLoading);
            app_loading.calcMovements(month, htmlLoading);
            app_loading.calcMovementsPrev(month, htmlLoading);
        }
    },
    boxNotPayable: function (month, htmlLoading, id){
                
        if(id){
            var elem = $('#' + id);
            elem.html('<img alt="activity indicator" src="/img/ajax-loader.gif" title="...">');
        } else {
            $('#notification_payable').html(htmlLoading);
        }   

        $.get("/index/ajax-notification/type/0/month/" + month, function(response){
            $('#notification_payable').html(response);
        });
    },
    boxNotReceivable: function(month, htmlLoading, id){
        
        if(id){
            var elem = $('#' + id);
            elem.html('<img alt="activity indicator" src="/img/ajax-loader.gif" title="...">');
        } else {
            $('#notification_receivable').html(htmlLoading);
        }
        
        $.get("/index/ajax-notification/type/1/month/" + month, function(response){
            $('#notification_receivable').html(response);
        });
    },
    boxNotOverview: function (month, htmlLoading){
        $('#box_overview').html(htmlLoading);
        $.get("/index/get-overview/month/" + month,function(response){
            $('#box_overview').html(response);
        });
    },
    boxNotToPayable: function (month, htmlLoading, id){
        if(!id){
            $('#accounts_payable').html(htmlLoading);
        }
        
        $.get("/index/accounts-payable/month/" + month, function(response){
            $('#accounts_payable').html(response);
        });
    },
    boxNotToReceivable: function (month, htmlLoading, id){
        if(!id){
            $('#accounts_to_receivable').html(htmlLoading);
        }
        
        $.get("/index/accounts-to-receivable/month/" + month, function(response){
            $('#accounts_to_receivable').html(response);
        });
    },
    boxNotReportReceivable: function (month, htmlLoading){
        $('#fl_1').html(htmlLoading);
        $.ajax({
            type: 'POST',
            data: "type=1" + "&month="+ month + "&status=" + 0,
            url:  '/movimentacao/json-report',
            dataType: "json",
            success: function(response){


                elem = $('#fl_1');
           
                var data = response.data;
			
                // Setup the flot chart using our data
                $.plot(elem, data,         
                {
                    label: "Visitors by Location",
                    series: {
                        pie: {
                            show: true,
                            highlight: {
                                opacity: 0.2
                            }
                        }
                    },
                    grid: {
                        hoverable: true,
                        clickable: true
                    },
                    colors: response.colors
                }
                );
                // Create a tooltip on our chart
                elem.qtip({
                    prerender: true,
                    content: 'Loading...', // Use a loading message primarily
                    position: {
                        viewport: $(window), // Keep it visible within the window if possible
                        target: 'mouse', // Position it in relation to the mouse
                        adjust: {
                            x: 7
                        } // ...but adjust it a bit so it doesn't overlap it.
                    },
                    show: false, // We'll show it programatically, so no show event is needed
                    style: {
                        classes: 'ui-tooltip-shadow ui-tooltip-tipsy',
                        tip: false // Remove the default tip.
                    }
                });
         
                // Bind the plot hover
                elem.on('plothover', function(event, pos, obj) {
                
                    // Grab the API reference
                    var self = $(this),
                    api = $(this).qtip(),
                    previousPoint, content,
         
                    // Setup a visually pleasing rounding function
                    round = function(x) {
                        return Math.round(x * 1000) / 1000;
                    };
         
                    // If we weren't passed the item object, hide the tooltip and remove cached point data
                    if(!obj) {
                        api.cache.point = false;
                        return api.hide(event);
                    }
         
                    // Proceed only if the data point has changed
                    previousPoint = api.cache.point;
                    if(previousPoint !== obj.seriesIndex)
                    {
                        percent = parseFloat(obj.series.percent).toFixed(2);
                        // Update the cached point data
                        api.cache.point = obj.seriesIndex;
                        // Setup new content
                        content = obj.series.label + ' ( ' + percent + '% )';
                        // Update the tooltip content
                        api.set('content.text', content);
                        // Make sure we don't get problems with animations
                        //api.elements.tooltip.stop(1, 1);
                        // Show the tooltip, passing the coordinates
                        api.show(pos);
                    }
                });
            }
        });
    },
    boxNotReportPayable: function (month, htmlLoading){
        $('#fl_2').html(htmlLoading);
        $.ajax({
            type: 'POST',
            data: "type=0" + "&month="+ month + "&status=" + 0,
            url:  '/movimentacao/json-report',
            dataType: "json",
            success: function(response){


                elem = $('#fl_2');
           
                var data = response.data;
			
                // Setup the flot chart using our data
                $.plot(elem, data,         
                {
                    label: "Visitors by Location",
                    series: {
                        pie: {
                            show: true,
                            highlight: {
                                opacity: 0.2
                            }
                        }
                    },
                    grid: {
                        hoverable: true,
                        clickable: true
                    },
                    colors: response.colors
                }
                );
                // Create a tooltip on our chart
                elem.qtip({
                    prerender: true,
                    content: 'Loading...', // Use a loading message primarily
                    position: {
                        viewport: $(window), // Keep it visible within the window if possible
                        target: 'mouse', // Position it in relation to the mouse
                        adjust: {
                            x: 7
                        } // ...but adjust it a bit so it doesn't overlap it.
                    },
                    show: false, // We'll show it programatically, so no show event is needed
                    style: {
                        classes: 'ui-tooltip-shadow ui-tooltip-tipsy',
                        tip: false // Remove the default tip.
                    }
                });
         
                // Bind the plot hover
                elem.on('plothover', function(event, pos, obj) {
                
                    // Grab the API reference
                    var self = $(this),
                    api = $(this).qtip(),
                    previousPoint, content,
         
                    // Setup a visually pleasing rounding function
                    round = function(x) {
                        return Math.round(x * 1000) / 1000;
                    };
         
                    // If we weren't passed the item object, hide the tooltip and remove cached point data
                    if(!obj) {
                        api.cache.point = false;
                        return api.hide(event);
                    }
         
                    // Proceed only if the data point has changed
                    previousPoint = api.cache.point;
                    if(previousPoint !== obj.seriesIndex)
                    {
                        percent = parseFloat(obj.series.percent).toFixed(2);
                        // Update the cached point data
                        api.cache.point = obj.seriesIndex;
                        // Setup new content
                        content = obj.series.label + ' ( ' + percent + '% )';
                        // Update the tooltip content
                        api.set('content.text', content);
                        // Make sure we don't get problems with animations
                        //api.elements.tooltip.stop(1, 1);
                        // Show the tooltip, passing the coordinates
                        api.show(pos);
                    }
                });
            }
        });
         
    },
    boxListNotification: function (month, htmlLoading, id, action){
        
        date = new Date();
        month = date.getMonth() + 1;
        
        if(id){
            var elem = $('#' + id + '.' + action + '-notification');
            elem.html('<img alt="activity indicator" src="/img/ajax-loader.gif" title="...">');
        } else {
            $('#sortable_transactions').html(htmlLoading);
        }
        
        $.get("/movimentacao/ajax-transactions/month/" + month, function(response){
            $('#sortable_transactions').html(response);
        });
    },
    getNotifications: function (){
        date = new Date();
        month = date.getMonth() + 1;
        
        $.ajax({
            type: 'POST',
            data: 'action=get-notifications&month=' + month, 
            url:  '/ajax',
            dataType: "json",
            success: function(response){
                if(response.total > 0)
                    $('#nav-notification').html('<span class="label label-important"> +' + response.total + ' </span> Notificações');
                else
                    $('#nav-notification').html(' Notificações');
            }
        });
    },
    getEvents: function (){
        $.ajax({
            type: 'POST',
            data: 'action=get-events', 
            url:  '/ajax',
            dataType: "json",
            success: function(response){
                if(response.total > 0)
                    $('#nav-events').html('<span class="label label-info"> +' + response.total + ' </span> Agenda');
                else
                    $('#nav-events').html(' Agenda');
            }
        });
    },
    boxUsersLastAccessed: function (htmlLoading){
        
        if($('#box_users').length){
            
            $('#box_users').html(htmlLoading);
            
            $.ajax({
                type: 'POST',
                data: 'action=users-last-accessed', 
                url:  '/ajax',
                success: function(response){
                    $('#box_users').html(response);
                }
            });
        }
    },
    listMovements: function (month, htmlLoading, id, action){
 
        if(id){
            var elem = $('#' + id + '.' + action + '-notification');
            elem.html('<img alt="activity indicator" src="/img/ajax-loader.gif" title="...">');
        } else {
            $('#sortable_transactions').html(htmlLoading);
        }
        
        $.ajax({
            type: 'POST',
            data: 'action=list-movements&month=' + month, 
            url:  '/ajax',
            success: function(response){
                $('#sortable_transactions').html(response);
            }
        });
    },
    calcMovements: function (month, htmlLoading, id, action){
 
 
        load = '<img src="/img/ajax_loader.gif" title="Carregando...">';
        if(!id){
            $('#sRecipe').html(load);
            $('#sExpense').html(load);
            $('#sTotal').html(load);
            $('#sOverdue').html(load);
            $('#sTotalClass').removeClass()
        }
        
        $.ajax({
            type: 'POST',
            data: 'action=calc-movements&month=' + month + '&status=1', 
            url:  '/ajax',
            dataType: "json",
            success: function(response){
                $('#sRecipe').html(response.sRecipe);
                $('#sExpense').html(response.sExpense);
                $('#sTotal').html(response.sTotal);
                $('#sTotalClass').addClass(response.classTotal);
                $('#sOverdue').html(response.sOverdue);
            }
        });
    },
    calcMovementsPrev: function (month, htmlLoading, id, action){
        load = '<img src="/img/ajax_loader.gif" title="Carregando...">';
        if(!id){
            $('#sPRecipe').html(load);
            $('#sPExpense').html(load);
            $('#sPTotal').html(load);
            $('#sPOverdue').html(load);
            $('#sPTotalClass').removeClass()
        }
        
        $.ajax({
            type: 'POST',
            data: 'action=calc-movements&month=' + month, 
            url:  '/ajax',
            dataType: "json",
            success: function(data){
                $('#sPRecipe').html(data.sRecipe);
                $('#sPExpense').html(data.sExpense);
                $('#sPTotal').html(data.sTotal);
                $('#sPTotalClass').addClass(data.classTotal);
                $('#sPOverdue').html(data.sOverdue);
            }
        });
    }
};
	
//* bootstrap datepicker
app_datepicker = {
    init: function() {
        $("#date").datepicker({
            dateFormat: 'dd/mm/yy',
            dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'
            ],
            dayNamesMin: [
            'D','S','T','Q','Q','S','S','D'
            ],
            dayNamesShort: [
            'Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom'
            ],
            monthNames: [  'Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro',
            'Outubro','Novembro','Dezembro'
            ],
            monthNamesShort: [
            'Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set',
            'Out','Nov','Dez'
            ]
        });
    }
};

//* masked input
app_mask_input = {
    init: function() {
        $("#date").inputmask("99/99/9999",{
            placeholder:"__/__/____"
        });
        $("#mask_phone").inputmask("(999) 999-9999");
        $("#mask_ssn").inputmask("999-99-9999");
        $("#mask_product").inputmask("AA-999-A999");
    }
};

//* spinners
app_spinners = {
    init: function() {
        $("#value").spinner({
            currency: 'R$ ',
            max: 999999,
            min: 0
        });
    }
};	

//* colorpicker
app_colorCategory = {
    init: function(){
        $('#color').colorpicker({
            format: 'hex'
        });
    }
};

	
	
