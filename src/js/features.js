import doubleclick from './doubleclick';

export default function() {
  doubleclick('featu0');
  $('.npm-cmd').click(function() {
    $(this).select();
  });

  $('.copy-npm-cmd-btn').click(function(e) {
    e.preventDefault();
    $('.npm-cmd').select();
    document.execCommand('copy');
  });
}
