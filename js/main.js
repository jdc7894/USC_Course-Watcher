var url_selection = "";
var once = true; 
var valid = true; 
var raw = "";
var school_clicked = false; 
var department_clicked = false; 
//jQuery.ajaxSetup({async:false});

$(document).ready(function () {
    /* Listeners for buttons */
    $("#tabs").tabs();
    $('#refreshPage').click(function () { buttonPageRefresh() });
    $('#saveOptionsOnExtension').click(function () { save_options(); });
    fetch_feed();
    setup_school();
    setup_department();
});

function fetch_feed() {
    chrome.runtime.sendMessage({greeting:"hello",url:localStorage}, function(response) {
    });
}

function notify_user() {
    var opt = {
       type: "basic",
       title: "Deploy",
       message: "This class is now full!",
       iconUrl: "bob48.png"
    };
    chrome.notifications.create("",opt,function(id) {});
}

function save_options() {
    var new_section = textMemberID.value; 
    new_section = new_section.replace('R', '');
    new_section = new_section.replace('D', '');
    if(!new_section) {
        document.getElementById("save_status").innerHTML = "You need to provide a section id!"; 
        return; 
    }
     if(!school_clicked) {
        document.getElementById("save_status").innerHTML = "You have to select the school name!";
        return;
    }
    if(!department_clicked) {
        document.getElementById("save_status").innerHTML = "You have to select the department name!";
        return;
    }
    $.get("http://classes.usc.edu/term-20151/classes/" + url_selection, function (data) {
        if(check_valid_section(data,new_section) == false) {
            valid = false; 
            document.getElementById("save_status").innerHTML = "The section id is invalid. Please try again"; 
        }
        else {
            if(localStorage.hasOwnProperty(new_section)) {      // element does not show up in the list now
                document.getElementById("save_status").innerHTML = "You already signed up for this section";
            } else {
                localStorage[new_section] = "http://classes.usc.edu/term-20151/classes/" + url_selection;
                document.getElementById("save_status").innerHTML = "section: " + new_section + " is saved to the watched list.";
                reload_Page();
            }
        }
    }); 
}

function check_valid_section(rawData, session) {
    if(raw != rawData) {
    raw = rawData;
    holdingdata.innerHTML = raw;
    /* Needed for parsing to work! */
    var theNode = document.getElementById("About");
        if (theNode) {
            holdingdata.innerHTML = "";
            holdingdata.appendChild(theNode);
        }
    }
    var new_session = "." + session;
    var current_row = 'tr' + new_session;
    var class_name = $(new_session).parents("div:eq(1)").attr("id");
    if(typeof class_name == 'undefined') return false; 
    else return true; 
}

/* Should be called from background.html */
function reload_Page() {
    $('#main_table').find("tr:gt(0)").remove();
    $.each(localStorage, function(key,value) {
        var xhr = new XMLHttpRequest();
         xhr.open("GET", value, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
              setCourseData(xhr.responseText,key);
            }
        }
     xhr.send();
    });
}

function setCourseData(rawData, session) { 
    if(raw != rawData) {
    raw = rawData;
    holdingdata.innerHTML = raw;
    /* Needed for parsing to work! */
    var theNode = document.getElementById("About");
        if (theNode) {
            holdingdata.innerHTML = "";
            holdingdata.appendChild(theNode);
        }
    }
    var new_session = "." + session;
    var current_row = 'tr' + new_session;
    var class_name = $(new_session).parents("div:eq(1)").attr("id");
    var lecture_type = $(current_row).find('td.type').text();
    var div = $(new_session).find("div");       // if class is closed, there will be a div with id closed
        if(div.length) {            // class is full
            $("#main_table tr:last").after("<tr id =" + new_session + "style=\"text-align: center\"><td>" + class_name + "</td><td>" + session + "</td>Random<td>" + lecture_type + "</td><td>Full</td><td>" + "<input type=\"button\" value=\"Delete\" id =" + session + ">" + "</td></tr>");
            $('#' + session).click(function () {
                 delete localStorage[this.id];
                 $("#new_session").remove();
                 reload_Page();
             });
        }  
        else {              // class is available 
            $("#main_table tr:last").after("<tr id =" + new_session + "style=\"text-align: center\"><td>" + class_name + "</td><td>" + session + "</td>Random<td>" + lecture_type + "</td><td>Available</td><td>" + "<input type=\"button\" value=\"Delete\" id =" + session + ">" + "</td></tr>");
            $('#' + session).click(function () { 
                delete localStorage[this.id];
                $("#new_session").remove();
                reload_Page();
             });
        }
    }

function clickHandler(e) {
    chrome.tabs.update({url:"http://classes.usc.edu/term-20151/classes/"+url_selection});
    window.close(); // Note: window.close(), not this.close()
}

document.addEventListener('DOMContentLoaded', function () {
    chrome.alarms.create("myAlarm", {delayInMinutes: 0.2} );
    document.getElementById('find-section').addEventListener('click', clickHandler);

});

function setup_department() {
    $("#department").change(function() {
        department_clicked = true;
        if($("#department").val() == "ali") {
            url_selection = "ali";
        }
        if($("#department").val() == "amst") {
            url_selection = "amst";
        }
        if($("#department").val() == "anth") {
            url_selection = "anth";
        }
        if($("#department").val() == "ahis") {
            url_selection = "ahis";
        }
        if($("#department").val() == "astr") {
            url_selection = "astr";
        }
        if($("#department").val() == "bisc") {
            url_selection = "bisc";
        }
        if($("#department").val() == "chem") {
            url_selection = "chem";
        }
        if($("#department").val() == "clas") {
            url_selection = "clas";
        }
        if($("#department").val() == "colt") {
            url_selection = "colt";
        }
        if($("#department").val() == "cslc") {
            url_selection = "cslc";
        }
        if($("#department").val() == "ealc") {
            url_selection = "ealc";
        }
        if($("#department").val() == "easc") {
            url_selection = "easc";
        }
        if($("#department").val() == "econ") {
            url_selection = "econ";
        }
        if($("#department").val() == "engl") {
            url_selection = "engl";
        }
        if($("#department").val() == "enst") {
            url_selection = "enst";
        }
        if($("#department").val() == "fren") {
            url_selection = "fren";
        }
        if($("#department").val() == "fsem") {
            url_selection = "fsem";
        }
        if($("#department").val() == "swms") {
            url_selection = "swms";
        }
        if($("#department").val() == "geog") {
            url_selection = "geog";
        }
        if($("#department").val() == "geol") {
            url_selection = "geol";
        }
        if($("#department").val() == "germ") {
            url_selection = "germ";
        }
        if($("#department").val() == "gr") {
            url_selection = "gr";
        }
        if($("#department").val() == "hebr") {
            url_selection = "hebr";
        }
        if($("#department").val() == "hist") {
            url_selection = "hist";
        }
        if($("#department").val() == "hbio") {
            url_selection = "hbio";
        }
        if($("#department").val() == "inds") {
            url_selection = "inds";
        }
        if($("#department").val() == "ir") {
            url_selection = "ir";
        }
        if($("#department").val() == "ital") {
            url_selection = "ital";
        }
        if($("#department").val() == "js") {
            url_selection = "js";
        }
        if($("#department").val() == "lat") {
            url_selection = "lat";
        }
        if($("#department").val() == "lbst") {
            url_selection = "lbst";
        }
        if($("#department").val() == "ling") {
            url_selection = "ling";
        }
        if($("#department").val() == "mpw") {
            url_selection = "mpw";
        }
        if($("#department").val() == "math") {
            url_selection = "math";
        }
        if($("#department").val() == "mdes") {
            url_selection = "mdes";
        }
        if($("#department").val() == "mda") {
            url_selection = "mda";
        }
        if($("#department").val() == "neur") {
            url_selection = "neur";
        }
        if($("#department").val() == "nsci") {
            url_selection = "nsci";
        }
        if($("#department").val() == "os") {
            url_selection = "os";
        }
        if($("#department").val() == "phil") {
            url_selection = "phil";
        }
        if($("#department").val() == "phed") {
            url_selection = "phed";
        }
        if($("#department").val() == "phys") {
            url_selection = "phys";
        }
        if($("#department").val() == "pepp") {
            url_selection = "pepp";
        }
        if($("#department").val() == "posc") {
            url_selection = "posc";
        }
        if($("#department").val() == "poir") {
            url_selection = "poir";
        }
        if($("#department").val() == "port") {
            url_selection = "port";
        }
        if($("#department").val() == "psyc") {
            url_selection = "psyc";
        }
        if($("#department").val() == "rel") {
            url_selection = "rel";
        }
        if($("#department").val() == "sll") {
            url_selection = "sll";
        }
        if($("#department").val() == "soci") {
            url_selection = "soci";
        }
        if($("#department").val() == "ssem") {
            url_selection = "ssem";
        }
        if($("#department").val() == "span") {
            url_selection = "span";
        }
        if($("#department").val() == "ssci") {
            url_selection = "ssci";
        }
        if($("#department").val() == "core") {
            url_selection = "core";
        }
        if($("#department").val() == "usc") {
            url_selection = "usc";
        }
        if($("#department").val() == "writ") {
            url_selection = "writ";
        }
        if($("#department").val() == "acct") {
            url_selection = "acct";
        }
        if($("#department").val() == "arch") {
            url_selection = "arch";
        }
        if($("#department").val() == "face") {
            url_selection = "face";
        }
        if($("#department").val() == "facs") {
            url_selection = "facs";
        }
        if($("#department").val() == "fadn") {
            url_selection = "fadn";
        }
        if($("#department").val() == "fadw") {
            url_selection = "fadw";
        }
        if($("#department").val() == "fa") {
            url_selection = "fa";
        }
        if($("#department").val() == "fain") {
            url_selection = "fain";
        }
        if($("#department").val() == "fapt") {
            url_selection = "fapt";
        }
        if($("#department").val() == "faph") {
            url_selection = "faph";
        }
        if($("#department").val() == "fapr") {
            url_selection = "fapr";
        }
        if($("#department").val() == "pas") {
            url_selection = "pas";
        }
        if($("#department").val() == "fasc") {
            url_selection = "fasc";
        }
        if($("#department").val() == "acad") {
            url_selection = "acad";
        }
        if($("#department").val() == "buad") {
            url_selection = "buad";
        }
        if($("#department").val() == "buco") {
            url_selection = "buco";
        }
        if($("#department").val() == "baep") {
            url_selection = "baep";
        }
        if($("#department").val() == "dso") {
            url_selection = "dso";
        }
        if($("#department").val() == "fbe") {
            url_selection = "fbe";
        }
        if($("#department").val() == "gsba") {
            url_selection = "gsba";
        }
        if($("#department").val() == "lim") {
            url_selection = "lim";
        }
        if($("#department").val() == "mor") {
            url_selection = "mor";
        }
        if($("#department").val() == "mkt") {
            url_selection = "mkt";
        }
        if($("#department").val() == "ctan") {
            url_selection = "ctan";
        }
        if($("#department").val() == "cntv") {
            url_selection = "cntv";
        }
        if($("#department").val() == "ctcs") {
            url_selection = "ctcs";
        }
        if($("#department").val() == "ctin") {
            url_selection = "ctin";
        }
        if($("#department").val() == "iml") {
            url_selection = "iml";
        }
        if($("#department").val() == "cmpp") {
            url_selection = "cmpp";
        }
        if($("#department").val() == "ctpr") {
            url_selection = "ctpr";
        }
        if($("#department").val() == "ctwr") {
            url_selection = "ctwr";
        }
        if($("#department").val() == "comm") {
            url_selection = "comm";
        }
        if($("#department").val() == "cmgt") {
            url_selection = "cmgt";
        }
        if($("#department").val() == "dsm") {
            url_selection = "dsm";
        }
        if($("#department").val() == "jour") {
            url_selection = "jour";
        }
        if($("#department").val() == "pubd") {
            url_selection = "pubd";
        }
        if($("#department").val() == "danc") {
            url_selection = "danc";
        }
        if($("#department").val() == "cby") {
            url_selection = "cby";
        }
        if($("#department").val() == "dhyg") {
            url_selection = "dhyg";
        }
        if($("#department").val() == "dpbl") {
            url_selection = "dpbl";
        }
        if($("#department").val() == "dent") {
            url_selection = "dent";
        }
        if($("#department").val() == "gden") {
            url_selection = "gden";
        }
        if($("#department").val() == "gspd") {
            url_selection = "gspd";
        }
        if($("#department").val() == "diag") {
            url_selection = "diag";
        }
        if($("#department").val() == "ofpm") {
            url_selection = "ofpm";
        }
        if($("#department").val() == "pedo") {
            url_selection = "pedo";
        }
        if($("#department").val() == "peri") {
            url_selection = "peri";
        }
        if($("#department").val() == "thtr") {
            url_selection = "thtr";
        }
        if($("#department").val() == "educ") {
            url_selection = "educ";
        }
        if($("#department").val() == "edco") {
            url_selection = "edco";
        }
        if($("#department").val() == "edpt") {
            url_selection = "edpt";
        }
        if($("#department").val() == "edhp") {
            url_selection = "edhp";
        }
        if($("#department").val() == "ame") {
            url_selection = "ame";
        }
        if($("#department").val() == "aste") {
            url_selection = "aste";
        }
        if($("#department").val() == "bme") {
            url_selection = "bme";
        }
        if($("#department").val() == "che") {
            url_selection = "che";
        }
        if($("#department").val() == "ce") {
            url_selection = "ce";
        }
        if($("#department").val() == "csci") {
            url_selection = "csci";
        }
        if($("#department").val() == "ee") {
            url_selection = "ee";
        }
        if($("#department").val() == "engr") {
            url_selection = "engr";
        }
        if($("#department").val() == "ene") {
            url_selection = "ene";
        }
        if($("#department").val() == "ise") {
            url_selection = "ise";
        }
        if($("#department").val() == "inf") {
            url_selection = "inf";
        }
        if($("#department").val() == "itp") {
            url_selection = "itp";
        }
        if($("#department").val() == "masc") {
            url_selection = "masc";
        }
        if($("#department").val() == "pte") {
            url_selection = "pte";
        }
        if($("#department").val() == "sae") {
            url_selection = "sae";
        }
        if($("#department").val() == "wct") {
            url_selection = "wct";
        }
        if($("#department").val() == "gct") {
            url_selection = "gct";
        }
        if($("#department").val() == "scin") {
            url_selection = "scin";
        }
        if($("#department").val() == "scis") {
            url_selection = "scis";
        }
        if($("#department").val() == "arlt") {
            url_selection = "arlt";
        }
        if($("#department").val() == "si") {
            url_selection = "si";
        }
        if($("#department").val() == "gero") {
            url_selection = "gero";
        }
        if($("#department").val() == "grsc") {
            url_selection = "grsc";
        }
        if($("#department").val() == "law") {
            url_selection = "law";
        }
        if($("#department").val() == "acmd") {
            url_selection = "acmd";
        }
        if($("#department").val() == "amed") {
            url_selection = "amed";
        }
        if($("#department").val() == "anst") {
            url_selection = "anst";
        }
        if($("#department").val() == "bioc") {
            url_selection = "bioc";
        }
        if($("#department").val() == "cbg") {
            url_selection = "cbg";
        }
        if($("#department").val() == "cnb") {
            url_selection = "cnb";
        }
        if($("#department").val() == "dsr") {
            url_selection = "dsr";
        }
        if($("#department").val() == "hp") {
            url_selection = "hp";
        }
        if($("#department").val() == "intd") {
            url_selection = "intd";
        }
        if($("#department").val() == "medb") {
            url_selection = "medb";
        }
        if($("#department").val() == "meds") {
            url_selection = "meds";
        }
        if($("#department").val() == "med") {
            url_selection = "med";
        }
        if($("#department").val() == "mbio") {
            url_selection = "mbio";
        }
        if($("#department").val() == "micb") {
            url_selection = "micb";
        }
        if($("#department").val() == "mss") {
            url_selection = "mss";
        }
        if($("#department").val() == "path") {
            url_selection = "path";
        }
        if($("#department").val() == "phbi") {
            url_selection = "phbi";
        }
        if($("#department").val() == "pm") {
            url_selection = "pm";
        }
        if($("#department").val() == "pcpa") {
            url_selection = "pcpa";
        }
        if($("#department").val() == "pthl") {
            url_selection = "pthl";
        }
        if($("#department").val() == "scrm") {
            url_selection = "scrm";
        }
        if($("#department").val() == "artl") {
            url_selection = "artl";
        }
        if($("#department").val() == "mucm") {
            url_selection = "mucm";
        }
        if($("#department").val() == "muco") {
            url_selection = "muco";
        }
        if($("#department").val() == "mucd") {
            url_selection = "mucd";
        }
        if($("#department").val() == "mujz") {
            url_selection = "mujz";
        }
        if($("#department").val() == "musc") {
            url_selection = "musc";
        }
        if($("#department").val() == "mued") {
            url_selection = "mued";
        }
        if($("#department").val() == "muen") {
            url_selection = "muen";
        }
        if($("#department").val() == "muhl") {
            url_selection = "muhl";
        }
        if($("#department").val() == "muin") {
            url_selection = "muin";
        }
        if($("#department").val() == "mtec") {
            url_selection = "mtec";
        }
        if($("#department").val() == "mpem") {
            url_selection = "mpem";
        }
        if($("#department").val() == "mpgu") {
            url_selection = "mpgu";
        }
        if($("#department").val() == "mpks") {
            url_selection = "mpks";
        }
        if($("#department").val() == "mppm") {
            url_selection = "mppm";
        }
        if($("#department").val() == "mpst") {
            url_selection = "mpst";
        }
        if($("#department").val() == "mpva") {
            url_selection = "mpva";
        }
        if($("#department").val() == "mpwp") {
            url_selection = "mpwp";
        }
        if($("#department").val() == "mscr") {
            url_selection = "mscr";
        }
        if($("#department").val() == "ot") {
            url_selection = "ot";
        }
        if($("#department").val() == "cxpt") {
            url_selection = "cxpt";
        }
        if($("#department").val() == "hcda") {
            url_selection = "hcda";
        }
        if($("#department").val() == "mptx") {
            url_selection = "mptx";
        }
        if($("#department").val() == "pmep") {
            url_selection = "pmep";
        }
        if($("#department").val() == "psci") {
            url_selection = "psci";
        }
        if($("#department").val() == "phrd") {
            url_selection = "phrd";
        }
        if($("#department").val() == "rsci") {
            url_selection = "rsci";
        }
        if($("#department").val() == "bkn") {
            url_selection = "bkn";
        }
        if($("#department").val() == "pt") {
            url_selection = "pt";
        }
        if($("#department").val() == "aest") {
            url_selection = "aest";
        }
        if($("#department").val() == "hmgt") {
            url_selection = "hmgt";
        }
        if($("#department").val() == "ms") {
            url_selection = "ms";
        }
        if($("#department").val() == "naut") {
            url_selection = "naut";
        }
        if($("#department").val() == "nsc") {
            url_selection = "nsc";
        }
        if($("#department").val() == "ppd") {
            url_selection = "ppd";
        }
        if($("#department").val() == "ppde") {
            url_selection = "ppde";
        }
        if($("#department").val() == "red") {
            url_selection = "red";
        }
        if($("#department").val() == "plus") {
            url_selection = "plus";
        }
        if($("#department").val() == "sowk") {
            url_selection = "sowk";
        }
    });

}
function setup_school() {
    $("#school").change(function() {
        school_clicked = true; 
        if($("#school").val() == "dornslife") {
            var list = ' <option selected = "selected" value="pick">Please choose your department </option><option value="ali">- American Language Institute (ALI)</option><option value="amst">- American Studies and Ethnicity (AMST)</option><option value="anth">- Anthropology (ANTH)</option><option value="ahis">- Art History (AHIS)</option><option value="astr">- Astronomy (ASTR)</option><option value="bisc">- Biological Sciences (BISC)</option><option value="chem">- Chemistry (CHEM)</option><option value="clas">- Classics (CLAS)</option><option value="colt">- Comparative Literature (COLT)</option><option value="core">- Thematic Option (CORE)</option><option value="cslc">- Comparative Studies in Literature and Culture (CSLC)</option><option value="ealc">- East Asian Languages and Cultures (EALC)</option><option value="easc">- East Asian Studies (EASC)</option><option value="econ">- Economics (ECON)</option><option value="engl">- English (ENGL)</option><option value="enst">- Environmental Studies Program (ENST)</option><option value="fren">- French (FREN)</option><option value="fsem">- Freshman Seminars (FSEM)</option><option value="geog">- Geography (GEOG)</option><option value="geol">- Geological Sciences (GEOL)</option><option value="swms">- Gender Studies (SWMS)</option><option value="germ">- German (GERM)</option><option value="gr">- Greek (GR)</option><option value="hebr">- Hebrew (HEBR)</option><option value="hist">- History (HIST)</option><option value="hbio">- Human Biology (HBIO)</option><option value="inds">- Interdisciplinary Major Program (INDS)</option><option value="ir">- International Relations (IR)</option><option value="ital">- Italian (ITAL)</option><option value="js">- Judaic Studies (JS)</option><option value="lat">- Latin (LAT)</option><option value="lbst">- Liberal Studies (LBST)</option><option value="ling">- Linguistics (LING)</option><option value="math">- Mathematics (MATH)</option><option value="mpw">- Master of Professional Writing (MPW)</option><option value="mdes">- Middle East Studies (MDES)</option><option value="mda">- Multidisciplinary Activities (MDA)</option><option value="neur">- Neuroscience (NEUR)</option><option value="nsci">- Neuroscience - Graduate (NSCI)</option><option value="os">- Ocean Sciences (OS)</option><option value="phed">- Physical Education (PHED)</option><option value="phil">- Philosophy (PHIL)</option><option value="phys">- Physics (PHYS)</option><option value="pepp">- Political Economy and Public Policy (PEPP)</option><option value="posc">- Political Science (POSC)</option><option value="poir">- Political Science and International Relations (POIR)</option><option value="port">- Portuguese (PORT)</option><option value="psyc">- Psychology (PSYC)</option><option value="rel">- Religion (REL)</option><option value="sll">- Slavic Languages and Literatures (SLL)</option><option value="soci">- Sociology (SOCI)</option><option value="ssem">- Sophomore Seminar (SSEM)</option><option value="span">- Spanish (SPAN)</option><option value="ssci">- Spatial Sciences (SSCI)</option><option value="usc">- University of Southern California (USC)</option><option value="writ">- Writing (WRIT)</option>';
            $('#department').empty();
            $("#department").append(list);
        }
        if($("#school").val() == "leventhal") {
            var list = '<option selected = "selected" value="pick">Please choose your department </option><option value="acct">- Accounting (ACCT)</option>';
            $('#department').empty();
            $("#department").append(list);
        }  
        if($("#school").val() == "arch") {
            var list = '<option selected = "selected" value="pick">Please choose your department </option><option value="arch">- Architecture (ARCH)</option>';
            $('#department').empty();
            $("#department").append(list);
        }
        if($("#school").val() == "rosk") {
            var list = '<option selected = "selected" value="pick">Please choose your department </option><option value="fa">- Fine Arts (FA)</option><option value="face">- Ceramics (FACE)</option><option value="facs">- Critical Studies (FACS)</option><option value="fadn">- Design (FADN)</option><option value="fadw">- Drawing (FADW)</option><option value="fain">- Intermedia (FAIN)</option><option value="faph">- Photography (FAPH)</option><option value="fapt">- Painting (FAPT)</option><option value="fapr">- Printmaking (FAPR)</option><option value="fasc">- Sculpture (FASC)</option><option value="pas">- Public Art Studies (PAS)</option>';
            $('#department').empty();
            $("#department").append(list);
        }
        if($("#school").val() == "acad") {
            var list = '<option selected = "selected" value="pick">Please choose your department </option><option value="acad">Arts, Technology and the Business of Innovation (ACAD)</option>';
            $('#department').empty();
            $("#department").append(list);
        }
        if($("#school").val() == "marshall") {
            var list = '<option selected = "selected" value="pick">Please choose your department </option><option value="baep">- Business Entrepreneurship (BAEP)</option><option value="buad">- Business Administration (BUAD)</option><option value="buco">- Business Communication (BUCO)</option><option value="dso">- Data Sciences and Operations (DSO)</option><option value="fbe">- Finance and Business Economics (FBE)</option><option value="gsba">- Graduate School of Business Administration (GSBA)</option><option value="lim">- Library and Information Management (LIM)</option><option value="mkt">- Marketing (MKT)</option><option value="mor">- Management and Organization (MOR)</option>';
            $('#department').empty();
            $("#department").append(list);
        }
        if($("#school").val() == "cinema") {
            var list = '<option selected = "selected" value="pick">Please choose your department </option><option value="cntv">- Cinematic Arts (CNTV)</option><option value="ctan">- Animation (CTAN)</option><option value="ctcs">- Critical Studies (CTCS)</option><option value="ctin">- Interactive Media (CTIN)</option><option value="ctpr">- Production (CTPR)</option><option value="ctwr">- Writing (CTWR)</option><option value="cmpp">- Motion Picture Producing (CMPP)</option><option value="iml">- Media Arts and Practice (IML)</option>';
            $('#department').empty();
            $("#department").append(list);
        }
        if($("#school").val() == "annenberg") {
            var list = '<option selected = "selected" value="pick">Please choose your department </option><option value="cmgt">- Communication Management (CMGT)</option><option value="comm">- Communication (COMM)</option><option value="dsm">- Digital Social Media (DSM)</option><option value="jour">- Journalism (JOUR)</option><option value="pubd">- Public Diplomacy (PUBD)</option>';
            $('#department').empty();
            $("#department").append(list);
        }
        if($("#school").val() == "dance") {
            var list = '<option selected = "selected" value="pick">Please choose your department </option><option value="danc">- Dance (DANC)</option>';
            $('#department').empty();
            $("#department").append(list);
        }
        if($("#school").val() == "ostrow") {
            var list = '<option selected = "selected" value="pick">Please choose your department </option><option value="dent">- Dentistry (DENT)</option><option value="cby">- Craniofacial Biology (CBY)</option><option value="dhyg">- Dental Hygiene (DHYG)</option><option value="diag">- Oral Diagnosis And Radiology (DIAG)</option><option value="dpbl">- Dental Problem Based Learning (DPBL)</option><option value="gden">- Geriatric Dentistry (GDEN)</option><option value="gspd">- GSPD (GSPD)</option><option value="ofpm">- Orofacial Pain and Oral Medicine (OFPM)</option><option value="pedo">- Pediatric Dentistry (PEDO)</option><option value="peri">- Periodontics (PERI)</option>';
            $('#department').empty();
            $("#department").append(list);
        }
        if($("#school").val() == "thtr") {
            var list = '<option selected = "selected" value="pick">Please choose your department </option><option value="thtr">- Dramatic Arts (THTR)</option>';
            $('#department').empty();
            $("#department").append(list);
        }
       if($("#school").val() == "education") {
            var list = '<option selected = "selected" value="pick">Please choose your department </option><option value="edco">- Education Counseling (EDCO)</option><option value="edhp">- Higher and Postsecondary Education (EDHP)</option><option value="edpt">- Educational Psychology and Technology (EDPT)</option><option value="educ">- Education (EDUC)</option>';
            $('#department').empty();
            $("#department").append(list);
       }
       if($("#school").val() == "thtr") {
            var list = '<option selected = "selected" value="pick">Please choose your department </option><option value="thtr">- Dramatic Arts (THTR)</option>';
            $('#department').empty();
            $("#department").append(list);
        }
        if($("#school").val() == "viterbi") {
            var list = '<option selected = "selected" value="pick">Please choose your department </option><option value="ame">- Aerospace and Mechanical Engineering (AME)</option><option value="aste">- Astronautical Engineering (ASTE)</option><option value="bme">- Biomedical Engineering (BME)</option><option value="che">- Chemical Engineering (CHE)</option><option value="ce">- Civil Engineering (CE)</option><option value="csci">- Computer Science (CSCI)</option><option value="ee">- Electrical Engineering (EE)</option><option value="ene">- Environmental Engineering (ENE)</option><option value="engr">- Engineering (ENGR)</option><option value="inf">- Informatics (INF)</option><option value="ise">- Industrial and Systems Engineering (ISE)</option><option value="itp">- Information Technology Program (ITP)</option><option value="masc">- Materials Science (MASC)</option><option value="pte">- Petroleum Engineering (PTE)</option><option value="sae">- Systems Architecting and Engineering (SAE)</option>';
            $('#department').empty();
            $("#department").append(list);
        }
        if($("#school").val() == "ge") {
            var list = '<option selected = "selected" value="pick">Please choose your department </option><option value="wct">- Category I: Western Cultures and Traditions (WCT)</option><option value="gct">- Category II: Global Cultures and Traditions (GCT)</option><option value="scin">- Category III: Scientific Inquiry (SCIN)</option><option value="scis">- Category IV: Science and Its Significance (SCIS)</option><option value="arlt">- Category V: Arts and Letters (ARLT)</option><option value="si">- Category VI: Social Issues (SI)</option>';
            $('#department').empty();
            $("#department").append(list);
        }
        if($("#school").val() == "gero") {
            var list = '<option selected = "selected" value="pick">Please choose your department </option><option value="gero">- Gerontology (GERO)</option>';
            $('#department').empty();
            $("#department").append(list);
        }
        if($("#school").val() == "grsc") {
            var list = '<option selected = "selected" value="pick">Please choose your department </option><option value="grsc">Graduate Studies (GRSC)</option>';
            $('#department').empty();
            $("#department").append(list);
        }
        if($("#school").val() == "law") {
            var list = '<option selected = "selected" value="pick">Please choose your department </option><option value="law">Law (LAW)</option>';
            $('#department').empty();
            $("#department").append(list);
        }
        if($("#school").val() == "keck") {
            var list = '<option selected = "selected" value="pick">Please choose your department </option><option value="acmd">- Academic Medicine (ACMD)</option><option value="amed">- Anesthesia And Medicine (AMED)</option><option value="anst">- Anesthesiology (ANST)</option><option value="bioc">- Biochemistry (BIOC)</option><option value="cbg">- Cancer Biology & Genomics (CBG)</option><option value="cnb">- Cell and Neurobiology (CNB)</option><option value="dsr">- Development, Stem Cells and Regenerative Medicine (DSR)</option><option value="hp">- Health Promotion and Disease Prevention Studies (HP)</option><option value="intd">- Interdepartmental (INTD)</option><option value="mbio">- Microbiology And Immunology (MBIO)</option><option value="med">- Medicine (MED)</option><option value="medb">- Medical Biology (MEDB)</option><option value="meds">- Medical Sciences (MEDS)</option><option value="micb">- Molecular Microbiology and Immunology (MICB)</option><option value="mss">- Molecular Structure & Signaling (MSS) (MSS)</option><option value="nsci">- Neuroscience - Graduate (NSCI)</option><option value="path">- Pathology (PATH)</option><option value="pcpa">- Primary Care Physician Assistant (PCPA)</option><option value="phbi">- Physiology and Biophysics (PHBI)</option><option value="pm">- Preventive Medicine (PM)</option><option value="pthl">- PTHL (PTHL)</option><option value="scrm">- Stem Cell Biology and Regenerative Medicine (SCRM)</option>';
            $('#department').empty();
            $("#department").append(list);
        }
        if($("#school").val() == "music") {
            var list = '<option selected = "selected" value="pick">Please choose your department </option><option value="artl">- Arts Leadership (ARTL)</option><option value="mscr">- Sacred Music (MSCR)</option><option value="mtec">- Music Technology (MTEC)</option><option value="mucm">- Choral Music (MUCM)</option><option value="muco">- Composition (MUCO)</option><option value="mucd">- Conducting (MUCD)</option><option value="mued">- Music Education (MUED)</option><option value="muen">- Music Ensemble (MUEN)</option><option value="muhl">- Music History and Literature (MUHL)</option><option value="muin">- Music Industry (MUIN)</option><option value="mujz">- Jazz Studies (MUJZ)</option><option value="mpem">- Performance (Early Music) (MPEM)</option><option value="mpgu">- Performance (Guitar) (MPGU)</option><option value="mpks">- Performance (Keyboard Studies) (MPKS)</option><option value="mppm">- Performance (Popular Music) (MPPM)</option><option value="mpst">- Performance (Strings) (MPST)</option><option value="mpva">- Performance (Vocal Arts) (MPVA)</option><option value="mpwp">- Performance (Winds and Percussion) (MPWP)</option><option value="musc">- Music (MUSC)</option><option value="ot">- Occupational Science and Occupational Therapy (OT)</option>';
            $('#department').empty();
            $("#department").append(list);
        }
        if($("#school").val() == "ot") {
            var list = '<option selected = "selected" value="pick">Please choose your department </option><option value="ot">Occupational Science and Occupational Therapy (OT)</option>';
            $('#department').empty();
            $("#department").append(list);
        }
        if($("#school").val() == "pharm") {
            var list = '<option selected = "selected" value="pick">Please choose your department </option><option value="cxpt">- Clinical and Experimental Therapeutics (CXPT)</option><option value="hcda">- Healthcare Decision Analysis (HCDA)</option><option value="mptx">- Molecular Pharmacology and Toxicology (MPTX)</option><option value="phrd">- Pharmacy (PHRD)</option><option value="pmep">- Pharmaceutical Economics and Policy (PMEP)</option><option value="psci">- Pharmaceutical Sciences (PSCI)</option><option value="rsci">- Regulatory Science (RSCI)</option><';
            $('#department').empty();
            $("#department").append(list);
        }
        if($("#school").val() == "pt") {
            var list = '<option selected = "selected" value="pick">Please choose your department </option><option value="bkn">- Biokinesiology (BKN)</option><option value="pt">- Physical Therapy (PT)</option>';
            $('#department').empty();
            $("#department").append(list);
        }
        if($("#school").val() == "price") {
            var list = '<option selected = "selected" value="pick">Please choose your department </option><option value="hmgt">- Health Care Management (HMGT)</option><option value="ms">- Military Science (MS)</option><option value="nsc">- Naval Science (NSC)</option><option value="ppd">- Policy, Planning and Development (PPD)</option><option value="ppde">- Policy, Planning and Development - Expanded (PPDE)</option><option value="plus">- Urban and Regional Planning (PLUS)</option><option value="red">- Real Estate Development (RED)</option><option value="naut">- Nautical Science (NAUT)</option><option value="aest">- Aerospace Studies (AEST)</option>';
            $('#department').empty();
            $("#department").append(list);
        }
        if($("#school").val() == "social") {
            var list = '<option selected = "selected" value="pick">Please choose your department </option><option value="sowk">Social Work (SOWK)</option>  ';
            $('#department').empty();
            $("#department").append(list);
        }
    });
}
