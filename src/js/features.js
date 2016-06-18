export default function() {
  $('.npm-cmd').click(function() {
    $(this).select();
  });

  $('.copy-npm-cmd-btn').click(function(e) {
    e.preventDefault();
    $('.npm-cmd').select();
    document.execCommand('copy');
  });
}