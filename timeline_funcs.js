// JavaScript Document

/* Helpers */
function zeroPad(n) {
	if (n < 0) throw new Error('n is negative');
	return (n < 10) ? '0' + n : n;
}
 
function convertToGDataDate(/*Date*/ date) {
	return date.getFullYear() + '-' +
			zeroPad(date.getMonth() + 1) + '-' +
			zeroPad(date.getDate());
}
 
function convertFromGDataDate(/*string<YYYY-MM-DD>*/ date) {
	var match = date.match(/(\d{4})-(\d{2})-(\d{2})/);
	return new Date(parseInt(match[1], 10), parseInt(match[2], 10) - 1, parseInt(match[3], 10));
}

function nl2br (str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^,])(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
}

function remove_nl (str) {
    return (str + '').replace(/(\r\n|\n\r|\r|\n)/g, '');
}

function get_timezone() {
	var rightNow = new Date();
	var jan1 = new Date(rightNow.getFullYear(), 0, 1, 0, 0, 0, 0);
	var temp = jan1.toGMTString();
	var jan2 = new Date(temp.substring(0, temp.lastIndexOf(" ")-1));
	var std_time_offset = (jan1 - jan2) / (1000 * 60 * 60);
	
	var june1 = new Date(rightNow.getFullYear(), 6, 1, 0, 0, 0, 0);
	temp = june1.toGMTString();
	var june2 = new Date(temp.substring(0, temp.lastIndexOf(" ")-1));
	var daylight_time_offset = (june1 - june2) / (1000 * 60 * 60);
	var dst;
	if (std_time_offset == daylight_time_offset) {
		dst = 0; // daylight savings time is NOT observed
	} else {
		dst = 1; // daylight savings time is observed
	}
	
	return std_time_offset + dst;
}