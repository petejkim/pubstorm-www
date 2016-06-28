import doubleclick from './doubleclick';

export default function() {
  doubleclick('homep0');

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

  $('.get-started-btn').tooltip({
    trigger: 'hover'
  });

  // cli animation
  const $demo = $('#demo'),
        $cli = $demo.find('.terminal .cli'),
        $t2 = $cli.find('.t2'),
        $t3 = $cli.find('.t3'),
        $t4 = $cli.find('.t4'),
        $t5 = $cli.find('.t5'),
        $t6 = $cli.find('.t6'),
        $t7 = $cli.find('.t7'),
        $t8 = $cli.find('.t8'),
        $browser = $demo.find('.browser'),
        $url = $browser.find('.url-field span'),
        $blog = $browser.find('.blog'),
        t2t = $t2.text();

  const animateCli = function() {
    $t2.hide();
    $t3.hide();
    $t4.hide();
    $t5.hide();
    $t6.hide();
    $t7.hide();
    $t8.hide();
    $url.hide();
    $blog.hide();

    const animateShow = function($el, delay, duration=50, complete) {
      $el.delay(delay).css({opacity: 0}).animate({
        opacity: 1
      }, {
        duration,
        start() {
          $el.show();
        },
        complete
      });
    };

    const animateProgress = function($el, delay, duration) {
      const $pb = $el.find('.cli-progress-bar').css({'white-space': 'pre'}),
            $pp = $el.find('.cli-progress-percentage'),
            pbt = $pb.text();

      $el.delay(delay).css({opacity: 0}).animate({
        opacity: 1
      }, {
        duration: 50,
        start() {
          $pb.text(' '.repeat(pbt.length));
          $pp.text('0.0');
          $el.show();
        }
      });
      $({textLen: 0}).delay(delay+200).animate({
        textLen: pbt.length
      }, {
        duration,
        easing: 'linear',
        step(i) {
          const fi = Math.floor(i);
          $pb.text(pbt.slice(0, fi) + ' '.repeat(pbt.length - fi));
          $pp.text((i / pbt.length * 100).toFixed(1));
        }
      });
    };

    $({textLen: 0}).animate({
      textLen: t2t.length
    }, {
      duration: 1000,
      easing: 'linear',
      start() {
        $t2.text('').show();
      },
      step(i) {
        $t2.text(t2t.slice(0, Math.floor(i)));
      }
    });

    animateShow($t3, 1200);
    animateShow($t4, 1500);
    animateProgress($t5, 1800, 500);
    animateProgress($t6, 2850, 500);
    animateShow($t7, 3900);
    animateShow($t8, 4500);

    animateShow($url, 4600, 300);

    $({blur: 5}).delay(4900).animate({
      blur: 0
    }, {
      duration: 600,
      start() {
        $blog.css({
          '-webkit-filter': 'blur(5px)',
          '-moz-filter': 'blur(5px)',
          '-ms-filter': 'blur(5px)',
          '-o-filter': 'blur(5px)',
          'filter': 'blur(5px)'
        });
      },
      step(i) {
        $blog.css({
          '-webkit-filter': `blur(${i}px)`,
          '-moz-filter': `blur(${i}px)`,
          '-ms-filter': `blur(${i}px)`,
          '-o-filter': `blur(${i}px)`,
          'filter': `blur(${i}px)`
        });
      }
    });

    animateShow($blog, 4900, 600, function() {
      window.setTimeout(animateCli, 5000);
    });
  };

  animateCli();
}
