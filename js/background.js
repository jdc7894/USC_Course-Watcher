var opening  = false; 
var courseIsRegistered = false;

/* Alarm Listener: periodically check class availability and 
   send notification if any class is available  */
chrome.alarms.onAlarm.addListener(function(alarm){
  for(var section in localStorage) {
       var xhr = new XMLHttpRequest();
       xhr.open("GET", localStorage[section], false);
       xhr.onreadystatechange = function() {
          if (xhr.readyState == 4) {
            checkAvailability(xhr.responseText,section);
          }
      }
      if(opening) {
        chrome.browserAction.setIcon({path:'images/available.png'});
      } else {
        chrome.browserAction.setIcon({path:'images/full.png'});      // all classes are full
      }
      xhr.send();
  }
  if (localStorage.length == 0) { 
    chrome.browserAction.setIcon({path:'images/watcher.png'});      // all classes are full
  }
 opening = false; 
});

/* Make Ajax call */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var popups = chrome.extension.getViews({type:"popup"});
    var url_storage = request.url;
    $.each(localStorage, function(key,value) {
        var xhr = new XMLHttpRequest();
        if (request.greeting == "hello") {
            xhr.onreadystatechange = function(data) {
              if (xhr.readyState == 4) {
                if (popups.length != 0) {
                  var popup = popups[0];
                  var data = xhr.responseText;
                  popup.setCourseData(data,key);    // parse and display courses 
                } 
              } 
            }
        xhr.open("GET", value, true);
        xhr.send();
        sendResponse({farewell: "goodbye"});
        }
    });
});

/* Send notificatio if there is available class */
function checkAvailability(rawData,session) {
    if(session) courseIsRegistered = true;
    else courseIsRegistered = false;  
    var raw = rawData;
    holdingdata.innerHTML = raw;
    var new_session = "." + session;
    var class_name = $(new_session).parents("div:eq(1)").attr("id");
    var opt = {
       type: "basic",
       title: "Course opening!",
       message: class_name + " is now available!",
       iconUrl: "images/watcher.png"
    };
    var div = $(new_session).find("div");       // if class is closed, there will be a div with id closed
    if(!div.length) {                           // class is available
      chrome.browserAction.setIcon({path:'images/available.png'});
      chrome.notifications.create(new_session,opt,function(id) {});  
      opening = true; 
    }  
}