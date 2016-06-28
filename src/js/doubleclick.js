export default function(cat) {
  var axel = Math.random() + "";
  var a = axel * 10000000000000;
  $('body').append($('<div class="doubleclick">').html(`
    <iframe src="https://5804501.fls.doubleclick.net/activityi;src=5804501;type=nitro0;cat=${cat};dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;ord='${a}'?"
    width="1" height="1" frameBorder="0" style="display:none;"></iframe>
  `));
}