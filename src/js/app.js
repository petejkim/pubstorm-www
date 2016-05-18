import 'bootstrap.min';
import home from './home';
import signup from './signup';

const pages = {
  home,
  signup
};

$('html').attr('class').split(' ').forEach(function(pageClass) {
  const fn = pages[pageClass];
  if (typeof fn === 'function') {
    fn();
  }
});
