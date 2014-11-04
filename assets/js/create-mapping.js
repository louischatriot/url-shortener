
$('#create-mapping').on('click', function (event) {
  var from = $('#from').val()
    , to = $('#to').val()
    , newUrl = { from: from, to: to }
    ;

  event.preventDefault();

  $.ajax({ url: '/api/mappings'
         , type: 'POST'
         , data: JSON.stringify(newUrl)
         , dataType: 'json'
         , contentType: 'application/json'
         , complete: function (jqXHR) {
            if (jqXHR.status === 200) {
              window.location = '/web/view/' + from;
            } else {
              var message = '';
              console.log(jqXHR.responseJSON);

              if (jqXHR.responseJSON && jqXHR.responseJSON.messages) {
                message += '<ul>';
                jqXHR.responseJSON.messages.forEach(function (msg) {
                  message += '<li>' + msg + '</li>';
                });
                message += '</ul>';
              } else {
                message = 'Unknown error, please raise a bug';
              }

              $('#feedback').html(message);
              $('#feedback').css('display', 'block');
            }
         }
       });
});
