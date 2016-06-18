import 'bootstrap.min';
import home from './home';
import signup from './signup';
import features from './features';

const pages = {
  home,
  signup,
  features
};

$('html').attr('class').split(' ').forEach(function(pageClass) {
  const fn = pages[pageClass];
  if (typeof fn === 'function') {
    fn();
  }
});
