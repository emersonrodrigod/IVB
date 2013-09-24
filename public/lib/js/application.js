$(document).ready(function() {
    // Setup uf
    app.dialogConfirm();
    app.alerts();
});

app = {
    dialogConfirm: function(){
        
        $('.confirm').click(function(e){
            e.preventDefault();
            var url = $(this).attr('href');
            var answer = confirm("Realmente deseja excluir este registro?");
            if (answer){
                window.location = url;
            } else {
                return false;
            }
        });

    },
    
    alerts: function(){
        // Efeito slide nos alertas
        $(".close").click(function(){
            $(this).parent().delay(100).slideUp("fast");
        });
    }

};


