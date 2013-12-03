$(document).ready(function() {
    // Setup uf
    app.dialogConfirm();
    app.alerts();
});

app = {
    dialogConfirm: function() {

        $('.confirm').click(function(e) {
            e.preventDefault();
            var url = $(this).attr('href');
            var answer = confirm("Realmente deseja excluir este registro?");
            if (answer) {
                window.location = url;
            } else {
                return false;
            }
        });

    },
    alerts: function() {
        // Efeito slide nos alertas
        $(".close").click(function() {
            $(this).parent().delay(100).slideUp("fast");
        });
    }

};

tinyMCE.init({
    selector: "textarea.editor",
    theme: "modern",
    plugins: [
        "advlist autolink lists link image charmap print preview hr anchor pagebreak",
        "searchreplace wordcount visualblocks visualchars code fullscreen",
        "insertdatetime media nonbreaking save table contextmenu directionality",
        "emoticons template paste textcolor filemanager"
    ],
    image_advtab: true,
    toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons |image media"
});


