
$('#create-url').on('click', function (event) {
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
              // TODO
            } else {
              // TODO
            }
         }
       });
});
