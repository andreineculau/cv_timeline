// JavaScript Document

var loaded = {}, data = {};
var gEventSource_Edu;
var gEventSource_IT;
var gEventSource_Mixed;
var gEventSource_All;

function loadAll() {
	if (loaded.Edu && loaded.IT && loaded.Mixed && !loaded.All) {
		data.All = data.Edu.slice();
		data.All = data.All.concat(data.IT);
		data.All = data.All.concat(data.Mixed);
		loaded.All = true;
		gEventSource_All.addMany(data.All);
		tl.layout();
		tl.getBand(0).setCenterVisibleDate(new Date());
	}
}

function loadGData(key, callback) {
	var feedUrl = 'http://www.google.com/calendar/feeds/' + key + '/public/full';
 
	var startDate = new Date((new Date).getDate());
	var endDate = new Date(((new Date).getTime()) + 3 * 30 * 24 * 60 * 60 * 1000);

	var getParams = '?start-min=' + convertToGDataDate(startDate) +
					'&start-max=' + convertToGDataDate(endDate) +
					'&alt=json-in-script' +
					'&callback=' + callback
					'&max-results=5000'; // choose 5000 as an arbitrarily large number
	feedUrl += getParams;
	var scriptTag = document.createElement('script');
	scriptTag.src = feedUrl;
	document.body.appendChild(scriptTag);
}
 
function loadGData_json(json, color, icon) {
	var entries = json.feed.entry || [];
	var timelinerEntries = [];
	icon = icon?(Timeline_urlPrefix + 'images/' + icon):null;
	
	for (var i = 0; i < entries.length; ++i) {
		var entry = entries[i];
		if(entry['gd$when'] == null) continue;
		var when = entry['gd$when'][0];
		var where = entry['gd$where'][0] || null;
		var start = convertFromGDataDate(when.startTime);
		var end = convertFromGDataDate(when.endTime);
		var isDuration = (end > start);
		var content = entry['content']['$t'];
		if (content) {
			content = nl2br(content);
			content = remove_nl(content);
		} else {
			content = '{}';
		}
		content = eval('(' + content + ')');
		content['description'] = content['description'] || '';
		content['link'] = content['link'] || null;
		content['image'] = content['image'] || null;
		var caption;
		caption = (!isDuration)?(convertToGDataDate(start)):(convertToGDataDate(start) + "\r\n" + convertToGDataDate(end));
		
		if (!color) {
			color = 'blue';
		}
		if (!icon) {
			icon = 'dull-blue-circle.png';
		}
		
		if (content['link']) {
			content['linkTitle'] = content['linkTitle'] || 'Click to read more';
			content['description'] += '<br /><br /><a href="' + content['link'] + '">' + content['linkTitle'] + '</a>';
		}
		
		content['description'] += '<br /><br />' + nl2br(caption);
		
		var text = entry.title.$t;
		var text_split = text.split(', ');
		var text = text_split.shift();
		text += ' <span>' + text_split.join(', ') + '</span>';
		
		var latestStart = content['latestStart']?convertFromGDataDate(content['latestStart']):null;
		var earliestEnd = content['earliestEnd']?convertFromGDataDate(content['earliestEnd']):null;
		var latestEnd = content['latestEnd']?convertFromGDataDate(content['latestEnd']):null;
		if (latestEnd && !earliestEnd) {
			earliestEnd = end;
			end = latestEnd;
		}
		
		timelinerEntries.push(new Timeline.DefaultEventSource.Event({
			'start': start,
			'latestStart': latestStart,
			'end': end,
			'earliestEnd': earliestEnd,
			'caption': caption,
			'instant': !isDuration,
			'text': text,
			'description': content['description'],
			'link': content['link'],
			'image': content['image'],
			'color': color,
			'textColor': 'black',
			'icon': icon
		}));
	}
	return timelinerEntries;
};

function loadGDataCallback_Edu(json) {
	data.Edu = loadGData_json(json, 'blue', 'dull-blue-circle.png');
	gEventSource_Edu.addMany(data.Edu);
	loaded.Edu = true;
	loadAll();
};

function loadGDataCallback_IT(json) {
	data.IT = loadGData_json(json, 'red', 'dull-red-circle.png');
	gEventSource_IT.addMany(data.IT);
	loaded.IT = true;
	loadAll();
};

function loadGDataCallback_Mixed(json) {
	data.Mixed = loadGData_json(json, 'green', 'dull-green-circle.png');
	gEventSource_Mixed.addMany(data.Mixed);
	loaded.Mixed = true;
	loadAll();
};