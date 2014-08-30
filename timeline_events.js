// JavaScript Document

/* Events */
function onLoad() {
	SimileAjax.History.enabled = false;
	
	Timeline.DefaultEventSource.Event.prototype.fillInfoBubble = function(elmt, theme, labeller) {
        var doc = elmt.ownerDocument;
        
        var title = this.getText();
        var link = this.getLink();
        var image = this.getImage();
        
        if (image != null) {
            var img = doc.createElement("img");
            img.src = image;
            
            theme.event.bubble.imageStyler(img);
            elmt.appendChild(img);
        }
        
        var divTitle = doc.createElement("div");
        //var textTitle = doc.createTextNode(title);
        if (link != null) {
            var a = doc.createElement("a");
            a.href = link;
            //a.appendChild(textTitle);
			a.innerHTML = title;
            divTitle.appendChild(a);
        } else {
            //divTitle.appendChild(textTitle);
			divTitle.innerHTML = title;
        }
        theme.event.bubble.titleStyler(divTitle);
        elmt.appendChild(divTitle);
        
        var divBody = doc.createElement("div");
        this.fillDescription(divBody);
        theme.event.bubble.bodyStyler(divBody);
        elmt.appendChild(divBody);
        
        var divTime = doc.createElement("div");
        this.fillTime(divTime, labeller);
        theme.event.bubble.timeStyler(divTime);
        elmt.appendChild(divTime);
        
        var divWiki = doc.createElement("div");
        this.fillWikiInfo(divWiki);
        theme.event.bubble.wikiStyler(divWiki);
        elmt.appendChild(divWiki);
    }
	
	gEventSource_Edu = new Timeline.DefaultEventSource();
	gEventSource_IT = new Timeline.DefaultEventSource();
	gEventSource_Mixed = new Timeline.DefaultEventSource();
	gEventSource_All = new Timeline.DefaultEventSource();
 
	var theme = Timeline.ClassicTheme.create();
	theme.event.bubble.width = 320;
	theme.event.bubble.height = 180;
	theme.timeline_start = new Date(Date.UTC(1983, 0, 1));
	theme.timeline_stop  = new Date(Date.UTC((new Date()).getFullYear() +2, 0, 1));
	theme.event.tape.height = 2;
	theme.event.track.gap = 6;

 
	var threeDaysFromNow = new Date(((new Date).getTime()) + 3 * 24 * 60 * 60 * 1000);
	var timeZone = get_timezone();
	var intervalUnit = Timeline.DateTime.MONTH;
	var intervalPixels = 15;

	var bandInfos = [
		Timeline.createBandInfo({
			eventSource: gEventSource_Edu,
			date: threeDaysFromNow,
			timeZone: timeZone,
			width: '24%', 
			intervalUnit: intervalUnit, 
			intervalPixels: intervalPixels,
			theme: theme
		}),
		Timeline.createBandInfo({
			eventSource: gEventSource_IT,
			date: threeDaysFromNow,
			timeZone: timeZone,
			width: '30%', 
			intervalUnit: intervalUnit, 
			intervalPixels: intervalPixels,
			theme: theme
		}),
		Timeline.createBandInfo({
			eventSource: gEventSource_Mixed,
			date: threeDaysFromNow,
			timeZone: timeZone,
			width: '30%', 
			intervalUnit: intervalUnit, 
			intervalPixels: intervalPixels,
			theme: theme
		}),/*
		Timeline.createBandInfo({
			date: threeDaysFromNow,
			timeZone: timeZone,
			width: '1%', 
			intervalUnit: Timeline.DateTime.YEAR, 
			intervalPixels: intervalPixels * 12,
			theme: theme
		}),*/
		Timeline.createBandInfo({
			eventSource: gEventSource_All,
			date: threeDaysFromNow,
			timeZone: timeZone,
			width: '15%', 
			intervalUnit: Timeline.DateTime.DECADE, 
			intervalPixels: intervalPixels * 20,
			theme: theme,
			layout: 'overview'
		})
	];

	bandInfos[1].syncWith = 0;
	bandInfos[1].highlight = true;

	bandInfos[2].syncWith = 0;
	bandInfos[2].highlight = true;

	bandInfos[3].syncWith = 0;
	bandInfos[3].highlight = true;

	/*bandInfos[4].syncWith = 0;
	bandInfos[4].highlight = true;*/
	
	for (var i = 0; i < bandInfos.length; i++) {
		bandInfos[i].decorators = [
			new Timeline.SpanHighlightDecorator({
				startDate:  "1", // The year 1 Common Era

				endDate:    theme.timeline_start,
				cssClass:   "timeline-ether-bg", // use same color as background
				inFront:    true, // we want this decorator to be in front
				theme:      theme
			}),
			new Timeline.SpanHighlightDecorator({
				startDate:  theme.timeline_stop,
				endDate:    new Date(Date.UTC(2050, 0, 1)),
				cssClass:   "timeline-ether-bg",
				inFront:    true, // we want this decorator to be in front
				theme:      theme
			})
		];
	}
	bandInfos[3].decorators.push(
		new Timeline.SpanHighlightDecorator({
			startDate:  theme.timeline_start,
			endDate:    theme.timeline_stop,
			color:      "#FFC080",
			opacity:    25,
			startLabel: ">",
			endLabel:   "<",
			theme:      theme
	}));
	
	tl = Timeline.create(document.getElementById('timeline'), bandInfos);
 
 	loadGData('tltm0gffvvoreueefpo5h0un1g@group.calendar.google.com', 'loadGDataCallback_Edu');
 	loadGData('fo62kbdjj8tjenvqfp7q3ah3s4@group.calendar.google.com', 'loadGDataCallback_IT');
 	loadGData('glmcdo0r9urppr8phaps7sk8ig@group.calendar.google.com', 'loadGDataCallback_Mixed');
}
 
var resizeTimerID = null;
function onResize() {
	if (resizeTimerID == null) {
		resizeTimerID = window.setTimeout(function() {
			resizeTimerID = null;
			tl.layout();
		}, 500);
	}
}