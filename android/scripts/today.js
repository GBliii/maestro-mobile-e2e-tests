// Builds today's date in the format the Community feed uses: "Today - Nov 08, 2026"
var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var d = new Date();
var day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
output.today = 'Today - ' + months[d.getMonth()] + ' ' + day + ', ' + d.getFullYear();
