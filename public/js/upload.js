(function($) {
    $.fn.epAjaxUpload = function(options) {
        var settings = $.extend({
            progressBar: null,
            progressCounter: null,
            bootstrap: true,
            sucesso: function() {
            },
            url: null,
            error: null
        }, options);

        var parentSelector = this;

        if (!settings.progressBar && !settings.progressCounter && settings.bootstrap === false) {
            $('<progress></progress>').insertAfter(parentSelector);
        }

        var progressHandlingFunction = function(e) {
            if (e.lengthComputable) {
                if (settings.progressBar) {
                    $(settings.progressBar).css({width: Math.round((e.loaded / e.total) * 100) + '%'});
                }

                if (settings.progressCounter) {
                    $(settings.progressCounter).html(Math.round((e.loaded / e.total) * 100));
                }

                if (!settings.progressBar && !settings.progressCounter) {
                    $('progress').attr({value: e.loaded, max: e.total});
                }
            }
        };

        this.submit(function(e) {
            e.preventDefault();

            var formData = new FormData($('form')[0]);

            $.ajax({
                url: settings.url,
                type: 'POST',
                dataType: "json",
                xhr: function() {
                    var myXhr = $.ajaxSettings.xhr();
                    if (myXhr.upload) {
                        myXhr.upload.addEventListener('progress', progressHandlingFunction, false);
                    }
                    return myXhr;
                },
                beforeSend: function() {
                    if (settings.progressBar) {
                        $(settings.progressBar).css({width: '0%'});
                    }

                    if (settings.progressCounter) {
                        $(settings.progressCounter).html('0');
                    }

                    if (!settings.progressBar && !settings.progressCounter) {
                        parentSelector.find('progress').attr({value: e.loaded, max: e.total});
                    }
                },
                success: function(data) {
                    settings.sucesso();
                },
                error: function(msgError) {

                },
                data: formData,
                cache: false,
                contentType: false,
                processData: false
            });
        });
    };
}(jQuery));