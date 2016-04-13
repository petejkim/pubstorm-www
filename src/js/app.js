import 'bootstrap.min';
import home from './home';

const pages = {
  home
};

$('html').attr('class').split(' ').forEach(function(pageClass) {
  const fn = pages[pageClass];
  if (typeof fn === 'function') {
    fn();
  }
});
