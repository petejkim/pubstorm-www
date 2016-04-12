import 'bootstrap.min';

$('.npm-cmd').click(function() {
  $(this).select();
});

$('.copy-npm-cmd-btn').click(function(e) {
  e.preventDefault();
  $('.npm-cmd').select();
  document.execCommand('copy');
}).tooltip({
  container: 'body',
  trigger: 'hover'
});

$('.get-started-btn').click(function() {
  location.hash = '';
  $('html, body').animate({
    scrollTop: $('#get-started').offset().top
  }, {
    duration: 300,
    complete() {
      location.hash = 'get-started';
    }
  });
}).tooltip({
  trigger: 'hover'
});
