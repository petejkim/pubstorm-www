import 'bootstrap.min';
import home from './home';
import signup from './signup';
import features from './features';
import pricing from './pricing';
import templates from './templates';

const pages = {
  home,
  signup,
  features,
  pricing,
  templates
};

$('html').attr('class').split(' ').forEach(function(pageClass) {
  const fn = pages[pageClass];
  if (typeof fn === 'function') {
    fn();
  }
});
