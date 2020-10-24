$.ready(function(){
    var fabIcon = document.getElementById('fabIcon')
    var standardFab = document.getElementById('standardFab')
})
$('#homeContainer').ready(function(){
    if(localStorage.getItem('setUp')== null){
        view.onboard()
    }else{
    homeData()
    }
    if(localStorage.getItem("timerStartTime")!= null){
        timeStarted = new Date(localStorage.getItem("timerStartTime"))
        currentMS =  (Date.parse((new Date).toUTCString())-Date.parse(timeStarted.toUTCString()))
        view.timer((localStorage.getItem('timerNight')==="true"), true)
    }
    if(installPrompt._iOS()){
        installPrompt.show(true)
    }
    _generateSkillChips()

})
var timeStarted;
var currentTime;
var currentNight;
var currentMS;
const view = {
    "start":function(arg){
        var timerContainer = document.getElementById('timerContainer')
        var startContainer = document.getElementById('startContainer')
        homeContainer.classList.add('disappearing')
        startContainer.classList.add('appearing')
        startContainer.hidden=false
        fabIcon.innerHTML='play_arrow'
        document.getElementById('share').hidden = true;
        document.getElementById('closeButton').hidden = false;
        if((new Date).getHours < 5 || (new Date).getHours > 21){
            var predictedTime = 'night'
        }else{
            var predictedTime = 'day'
        }
        if(timeChips.selectedChipIds.indexOf(predictedTime) == -1){
            document.getElementById(predictedTime).click()
        }
        document.getElementById('printButton').hidden = true;
        standardFab.onclick = function(){
            view.timer(timeChips.selectedChipIds.indexOf('night') != -1, false)
        }
        setTimeout(function(){
            homeContainer.hidden=true
            homeContainer.classList.remove('disappearing')
        }, 300)
    },
    "timer": function(night, continued){
        var homeContainer = document.getElementById('homeContainer')
        var startContainer = document.getElementById('startContainer')
        var timerContainer = document.getElementById('timerContainer')
        startContainer.classList.add('disappearing')
        homeContainer.classList.add('homeContainer')
        timerContainer.classList.add('appearing')
        timerContainer.hidden=false
        document.getElementById('share').hidden = true;
        document.getElementById('printButton').hidden = true;
        document.getElementById('speedButton').hidden = false;
        document.getElementById('closeButton').hidden = false;
        standardFab.classList.add('mdc-fab--exited')
        document.getElementById('stopFab').classList.remove('mdc-fab--exited')
        currentNight = night;
        timer.start(continued)
        setTimeout(function(){
            startContainer.hidden=true
            homeContainer.hidden=true;
        }, 300)
        if(night){
            localStorage.setItem('timerNight', true);
            if(localStorage.getItem('darkMode') != "true"){
            document.querySelector('html').classList.add("night")
            }
        }else{
            localStorage.setItem('timerNight', false);
        }
    },
    "ended": function(){
        if(localStorage.getItem('darkMode') != "true"){
        document.querySelector('html').classList.remove('night')
        }
        var timerContainer = document.getElementById('timerContainer')
        var endContainer = document.getElementById('endContainer')
        endContainer.classList.add('appearing')
        timerContainer.classList.add('disappearing')
        endContainer.hidden=false
        document.getElementById('printButton').hidden = true;
        document.getElementById('speedButton').hidden = true;
        standardFab.classList.remove('mdc-fab--exited')
        fabIcon.innerHTML="save"
        standardFab.onclick=function(){
            timer.save()
        }
        document.getElementById('stopFab').classList.add('mdc-fab--exited')
        comment.value = ""
        setTimeout(function(){
            timerContainer.hidden=true
        }, 300)
    },
    "home":function(){
        var endContainer = document.getElementById('endContainer')
        var homeContainer = document.getElementById('homeContainer')
        endContainer.classList.add('disappearing')
        homeContainer.classList.add('appearing')
        homeContainer.classList.remove('disappearing')
        homeContainer.hidden=false;
        document.getElementById('printButton').hidden = false;
        document.getElementById('speedButton').hidden = true;
        document.getElementById('share').hidden = false;
        document.getElementById('closeButton').hidden = true;
        $('.container').each(function() {
            if(this.id != "homeContainer"){
                this.classList.remove('disappearing')
                this.classList.remove('appearing')
                this.hidden=true;
            }
        });
        fabIcon.innerHTML='play_arrow'
        if((new Date).getHours < 5 || (new Date).getHours > 21){
            var predictedTime = 'night'
        }else{
            var predictedTime = 'day'
        }
        if(timeChips.selectedChipIds.indexOf(predictedTime) == -1){
            document.getElementById(predictedTime).click()
        }
        standardFab.onclick = function(){
            view.start()
        }
        fabIcon.innerHTML="timer"
        homeData()
    },
    "onboard":function(){
        var homeContainer = document.getElementById('homeContainer')
        var onboardingContainer = document.getElementById('onboardingContainer')
        homeContainer.hidden = true
        standardFab.classList.add('mdc-fab--exited')
        onboardingContainer.classList.add('appearing')
        onboardingContainer.hidden=false
        fabIcon.innerHTML="done"
        loadStates()
        standardFab.onclick = function(){
            finishSetup()
        }
    }
}

const skills = [
    {id:"construction", icon:"construction", name:"Construction"},
    {id:"parking", icon:"local_parking", name:"Parking"},
    {id:"roundabouts", icon:"cached", name:"Roundabouts"},
    {id:"highways", icon:"speed", name:"Highways"},
    {id:"city", icon:"traffic", name:"City Driving"},
    {id:"winter", icon:"ac_unit", name:"Winter Driving"}
]

const timer={
    "start":function(continued){
        var html = document.getElementById("timer")
        html.innerHTML="00:00:00"
        timer.update(html)
        document.getElementById('tip').innerHTML = drivingTips[Math.floor(Math.random() * drivingTips.length)];
        if(!continued){
            currentMS = 0;
            timeStarted= new Date;
            localStorage.setItem('timerStartTime', timeStarted.toString());
            currentTime=[00,00,00]
        }
    },
    "update" : function(html){
        setTimeout(function(){
            var difference = timer.format(Date.parse((new Date).toUTCString())-Date.parse(timeStarted.toUTCString()))
            html.innerHTML= timePrintLayout(difference).join(':')
            timer.update(html)
            currentTime = difference;
            currentMS = (Date.parse((new Date).toUTCString())-Date.parse(timeStarted.toUTCString()));
        }, 1000)
    },
    "format": function(ms) {
        var d, h, m, s;
        s = Math.floor(ms / 1000);
        m = Math.floor(s / 60);
        s = s % 60;
        h = Math.floor(m / 60);
        m = m % 60;
        return [h,m,s];
    },
    "stop": function(){
        view.ended()
        var endTime = currentTime;
        document.getElementById('endTime').innerHTML = timePrintLayout(endTime).join(':')
        localStorage.removeItem("timerStartTime")
        localStorage.removeItem("timerNight")
        speedometer.stop()
    },
    "save": function(){
        var endContainer = document.getElementById('endContainer')
        if(localStorage.getItem("drivingLog") != null){
            var log = JSON.parse(localStorage.getItem("drivingLog"))
        }else{
            var log = []
        }
        var thisTrip = new Object;
        thisTrip.time = currentTime;
        thisTrip.skills = hazardChips.selectedChipIds;
        thisTrip.comment= comment.value;
        thisTrip.night= currentNight;
        thisTrip.date= (new Date).toString()
        thisTrip.ms= currentMS;
        log.push(thisTrip)
        localStorage.setItem('drivingLog', JSON.stringify(log))
        snackbar.labelText = "Your drive was saved."
        snackbar.open()
        view.home()
    }
}
function printLog(){
    document.getElementById('printTableContent').innerHTML=""
    if(localStorage.getItem("drivingLog") != null){
        var log = JSON.parse(localStorage.getItem("drivingLog"))
    }else{
        snackbar.labelText = "There isn't anything on your log. You can't print it."
        snackbar.open()
        return "error"
    }
    for(var i=0;i<log.length;i++){
        document.getElementById('printTableContent').innerHTML += '<tr class="mdc-data-table__row"><th class="mdc-data-table__cell" scope="row">'+log[i].time.join(':')+'</th><th class="mdc-data-table__cell" scope="row">'+(new Date(log[i].date)).toLocaleDateString()+'</th><td class="mdc-data-table__cell" id="'+i+'night"></td><td class="mdc-data-table__cell mdc-data-table__cell--numeric">'+log[i].skills.length+'</td><td class="mdc-data-table__cell">'+log[i].comment+'</td></tr>'
        if(log[i].night){
            document.getElementById(i+'night').innerHTML="Yes"
            
        }else{
            document.getElementById(i+'night').innerHTML="No"
        }
    }
    document.getElementById('printTable').hidden = false;
    var totalHours = getTotalTime()[0]
    var nightHours = getTotalTime()[1]
    document.getElementById('printTableContent').innerHTML += "<tr class='mdc-data-table__row table-row__total'><th class='mdc-data-table__cell table-text__total' scope='row'><i class='material-icons align-bottom'>directions_car</i> Total Driving Time: "+timePrintLayout(totalHours).join(':')+"</tr><th class='mdc-data-table__cell table-text__total' scope='row'><i class='material-icons align-bottom'>nights_stay</i> Total Night Driving Time: "+timePrintLayout(nightHours).join(':')+"</th></tr>"
    printContent('printTable')
    window.print()
}
const drivingTips = ["Turn on Do Not Disturb to reduce distractions on the road.", "Try turning off driver assist features to become less dependant on these features.", "Stop driving if you feel tired", "Remember to buckle up!", "Feel free to exit the app. Your timer will stay here."]
function printContent(el){

    }
function getTotalTime(){
    if(localStorage.getItem('drivingLog') != null){
    var totalHours = 0;
    var nightHours = 0;
    var log = JSON.parse(localStorage.getItem('drivingLog'))
    for(var i=0;i<log.length;i++){
        totalHours += log[i].ms
        if(log[i].night){
            nightHours += log[i].ms
        }
    }
    totalHours = timer.format(totalHours)
    nightHours = timer.format(nightHours)
    return [totalHours, nightHours]
}else{
    return [[0,0,0],[0,0,0]]
}
}
function homeData(){
    var allTime = getTotalTime()
    var hours = JSON.parse(localStorage.getItem('hours'))
    if(allTime[0][0] >= hours[0] && allTime[1][0] >= hours[1]){
        document.getElementById('welcome-text').innerHTML = "You've finished your hours!"
    }else if(allTime[0][0] >= hours[0]){
        document.getElementById('welcome-text').innerHTML = "You Have "+allTime[1][0]+" Night Hours<br><p style='font-size:14px;' class='text-muted'>Finish up your night hours!</p>"
    }else if(allTime[0][0] != 0){
        document.getElementById('welcome-text').innerHTML = "You've Driven "+allTime[0][0]+" Hours"
    }else if(allTime[0][1] != 0){
        document.getElementById('welcome-text').innerHTML = "You've Driven "+allTime[0][1]+" Minutes"
    }else if(allTime[0][2] != 0){
        document.getElementById('welcome-text').innerHTML = "You've Driven "+allTime[0][2]+" Seconds"
    }else{
        document.getElementById('welcome-text').innerHTML = "No Time Logged"
    }
    document.getElementById('night-card-text').innerHTML = allTime[1][0]+"/"+hours[1]+" Hours Completed"
    document.getElementById('general-card-text').innerHTML = allTime[0][0]+"/"+hours[0]+" Hours Completed"
    document.getElementById('welcome-text').innerHTML += '<p style="font-size:1rem">Press <i class="material-icons align-bottom">timer</i> to start a drive</p>'
    //skills card
    if(localStorage.getItem('drivingLog') != null){
    var log= JSON.parse(localStorage.getItem('drivingLog'))
    var skillCount = new Object
    var skillsPracticed=0;
    for(var i=0;i<log.length;i++){
        var currentSkills = log[i].skills
        for(var rep=0;rep<currentSkills.length;rep++){
            if(!skillCount[log[i].skills[rep]]){
                skillCount[log[i].skills[rep]] = 0
            }
            skillCount[log[i].skills[rep]]++
            if(skillCount[log[i].skills[rep]] === 3){
                skillsPracticed++
            }
        }
    }
    document.getElementById('skill-card-text').innerHTML = skillsPracticed+"/"+skills.length+" Skills Practiced"
    document.getElementById('skillList').innerHTML = ''
    for(var i=0; i<skills.length;i++){
        if(skillCount[skills[i].id]){
            document.getElementById('skillList').innerHTML+= '<li class="mdc-list-item" tabindex="0"> <span class="mdc-list-item__ripple"></span> <span class="mdc-list-item__graphic material-icons" aria-hidden="true">'+skills[i].icon+'</span><span class="mdc-list-item__text"><span class="mdc-list-item__primary-text">'+skills[i].name+'</span> <span class="mdc-list-item__secondary-text">Practiced '+skillCount[skills[i].id]+' Times</span></span></li>'
        }else{
            document.getElementById('skillList').innerHTML+= '<li class="mdc-list-item" tabindex="0"> <span class="mdc-list-item__ripple"></span> <span class="mdc-list-item__graphic material-icons" aria-hidden="true">'+skills[i].icon+'</span><span class="mdc-list-item__text"><span class="mdc-list-item__primary-text">'+skills[i].name+'</span> <span class="mdc-list-item__secondary-text">Never Practiced</span></span></li>'
        }
    }
}else{
    document.getElementById('skill-card-text').innerHTML = "0/"+skills.length+" Skills Practiced"
    document.getElementById('skillList').innerHTML = ''
    for(var i=0; i<skills.length;i++){
        document.getElementById('skillList').innerHTML+= '<li class="mdc-list-item" tabindex="0"> <span class="mdc-list-item__ripple"></span> <span class="mdc-list-item__graphic material-icons" aria-hidden="true">'+skills[i].icon+'</span><span class="mdc-list-item__text"><span class="mdc-list-item__primary-text">'+skills[i].name+'</span> <span class="mdc-list-item__secondary-text">Never Practiced</span></span></li>'
    }
}
}
function timePrintLayout(time){
    var output= [];
    for(var i=0;i<time.length;i++){
        var formattedNumber = ("0" + time[i]).slice(-2);
        output.push(formattedNumber)
    }
    return output
}
function loadStates(){
    $.getScript( "assets/states.js", function() {
        console.log(states)
        var list=document.getElementById('stateSelectList')
        for(var i=0; i< states.length; i++)[
            list.innerHTML += '<li class="mdc-list-item" aria-selected="false" data-value="'+i+'" role="option"><span class="mdc-list-item__ripple"></span><span class="mdc-list-item__text">'+states[i].name+'</span></li>'
        ]
      });
}
function expandCard(element){
    $header = $(element);
    $comments = $header.contents('.expandable')
    $comments.slideToggle(200, function () {
        //execute this after slideToggle is done
        //change text of header based on visibility of content div
    });
    

}
function discardTimer(){
    if(!(document.getElementById("timerContainer").hidden))
    timer.stop()
    view.home()
}
function manualSave(element, night){
    var saveObject= new Object;
    element.querySelector('small').innerHTML = ""
    saveObject.time = [];
    if(night){
        var type="night"
    }else{
        var type="day"
    }
    for(var i=0; i<manualFields[type].length; i++){
        var field = manualFields[type][i]
        if(field.valid){
            if(field.root.id == 'comment'){
                saveObject.comment=field.value;
            }else{        
                if(field.value==""){
                    field.value ="0"
                }
                saveObject.time.push(parseInt(field.value))
            }
        }else{
            element.querySelector('small').innerHTML += "<br>Something didn't work. Make sure everything is valid."
            return 'Invalid Values'; //stops script, doesn't save
        }
    }
    saveObject.ms = (+saveObject.time[0] * (60000 * 60)) + (+saveObject.time[1] * 60000)
    saveObject.time.push(0)
    saveObject.night = night
    saveObject.skills = []
    saveObject.date=(new Date).toString()
    if(localStorage.getItem("drivingLog") != null){
        var log = JSON.parse(localStorage.getItem("drivingLog"))
    }else{
        var log = []
    }
    log.push(saveObject)
    localStorage.setItem('drivingLog', JSON.stringify(log))
    snackbar.labelText = "Your Drive was Saved"
    snackbar.open()
    homeData()
}
function openShareMenu(){
    menu.open = true
    if(navigator.share){
        menu.items[1].hidden = false
    }
}
function jsShare(){
    navigator.share({
        title: "I've driven "+getTotalTime()[0][0]+" student driving hours!",
        text: "I've driven a total of "+getTotalTime()[0][0]+" hours, including "+getTotalTime()[1][0]+" night hours."
      })
}
function exportData(el){
    if(localStorage.getItem('drivingLog')!== null){
    function fallback(){
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(localStorage.getItem("drivingLog"));
        el.setAttribute("href",     dataStr     );
        el.setAttribute("download", "drivingLog.json");
    }
    if(['iPad','iPhone','iPod'].includes(navigator.platform) && navigator.clipboard){
        navigator.clipboard.writeText(localStorage.getItem("drivingLog")).then(function(){
            snackbar.labelText = "Your driving log was copied to your clipboard. Save it in the notes app."
            snackbar.actionEl_.hidden=false
            snackbar.open()
            setTimeout(function(){
                snackbar.actionEl_.hidden=true
            }, (snackbar.timeoutMs + 1000))
        }).catch(function(){
            fallback()
        })
    }else{
        fallback()
        console.log('Not a iOS device with iOS 13.4 or later')
    }
    }
    snackbar.labelText = "You cant export a log with nothing on it."
    snackbar.open()
}
function deleteData(){
    var confirmed = window.confirm("Are you sure you want to DELETE your log and all other data? This action can't be undone unless you have a backup.")
    if(confirmed){
        localStorage.clear()
        location.reload()
    }
}
let deferredPrompt;
const installPrompt = {
    show:function(iOS){
        snackbar.labelText = ""
        if(!iOS){
            snackbar.labelText = "Want to install the app? Open Settings"
            document.getElementById('installItem').hidden=false
        }
        snackbar.open()
        if(iOS){
            snackbar.labelEl_.innerHTML = 'Want to install the app? Press <i class="material-icons align-bottom">ios_share</i> then click <i class="material-icons align-bottom">add_box</i> "Add to Home Screen"'
        }
    },
    install: function(){
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          } else {
            console.log('User dismissed the install prompt');
          }
        });
    },
    _iOS: function() {
        return !(('standalone' in window.navigator) && (window.navigator.standalone)) && ['iPad Simulator','iPhone Simulator','iPod Simulator','iPad','iPhone','iPod'].includes(navigator.platform)
    }
}
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installPrompt.show(false);
  });
  var goalSetter;
  var newInputs;
  function setNewGoal(){
    if(document.getElementById('newGoalSetter') == null){
        var dialog = document.getElementById('newGoalSetterWrapper')
        dialog.innerHTML += '<div class="mdc-dialog" id="newGoalSetter"><div class="mdc-dialog__container"><div class="mdc-dialog__surface" role="alertdialog" aria-modal="true"><div class="mdc-dialog__content" id="my-dialog-content"> Setting a New Hour Goal<br><div class="hourrow"> <label class="mdc-text-field mdc-text-field--filled hour-input"> <span class="mdc-text-field__ripple"></span> <input class="mdc-text-field__input" type="number"> <span class="mdc-floating-label" id="my-label-id">Total Hours</span> <span class="mdc-line-ripple"></span> </label> <label class="mdc-text-field mdc-text-field--filled hour-input"> <span class="mdc-text-field__ripple"></span> <input class="mdc-text-field__input" type="number"> <span class="mdc-floating-label" id="my-label-id">Night Hours</span> <span class="mdc-line-ripple"></span> </label></div></div><div class="mdc-dialog__actions"> <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="cancel"><div class="mdc-button__ripple"></div> <span class="mdc-button__label">Cancel</span> </button> <button type="button" class="mdc-button mdc-button--raised mdc-dialog__button" onclick="saveNewHours()" data-mdc-dialog-action="exit"><div class="mdc-button__ripple"></div> <span class="mdc-button__label">Save</span> </button></div></div></div><div class="mdc-dialog__scrim"></div></div>'
        goalSetter = new mdc.dialog.MDCDialog(document.getElementById('newGoalSetter'));
        newInputs = [].map.call(dialog.querySelectorAll('.hour-input'), function(el) {
            return new mdc.textField.MDCTextField(el);
          });
    }
    settings.close()
    goalSetter.open()
  }
  const readoutUnits = {
    mph: 2.23694,
    kmh: 3.6
  };
  var speedWatch;
  var currentUnit = 'kmh';
 const speedometer = {
     start: function(){
        const options = {
            enableHighAccuracy: true
          };
        if(navigator.language.split('-')[1]=="US"){
            currentUnit="mph"
        }
        console.log('Starting Speedometer')
        document.getElementById('speedometer').innerHTML="<hr><h4>Speedometer</h4><p class='text-muted'>Speed is approximate</p><h1 id='speed'>...</h1><h5>"+currentUnit+"</h5>"
        document.getElementById('speedometer').innerHTML+= "<span><small><u onclick='speedometer.switchUnits(this)'>Switch to "+((currentUnit == "mph") ? "km/h" : "mph")+ "</u></small></span>"
        document.getElementById('speedometer').hidden = false;
        speedWatch= navigator.geolocation.watchPosition(speedometer._update, null, options);
        document.getElementById('speedButton').onclick= function(){
            speedometer.stop()
        }
        if(!speedometer.noSleepLoaded){
            $.getScript( "assets/nosleep.js", function() {
                speedometer.noSleep= new NoSleep() 
                console.log("NoSleep is Ready")
                speedometer.noSleep.enable()
                speedometer.noSleepLoaded = true
              });
        }else{
            speedometer.noSleep.enable()
        }
        speedometer.started=true;
     },
     stop: function(){
        document.getElementById('speedometer').hidden = true;
        navigator.geolocation.clearWatch(speedWatch);
        document.getElementById('speedButton').onclick= function(){
            speedometer.start()
        }
        speedometer.started= false
        if(speedometer.noSleep != null){
         speedometer.noSleep.disable()
        }
     },
     _update: function(position){
        document.getElementById('speed').textContent = Math.round(
            position.coords.speed * readoutUnits[currentUnit]);
     },
     started: false,
     noSleepLoaded: false,
     noSleep: null,
     switchUnits: function(text){
        currentUnit = ((currentUnit == "mph") ? "kmh" : "mph");
        document.getElementById('speedometer').querySelector('h5').innerHTML = currentUnit;
        text.innerHTML = "Switch to "+ ((currentUnit == "mph") ? "km/h" : "mph")
        document.getElementById('speed').innerHTML="..."
     }
 }

function saveNewHours(){
    var save= [];
    save.push(newInputs[0].value)
    save.push(newInputs[1].value)
    localStorage.setItem('hours', JSON.stringify(save))
    homeData()
}
  
function toggleAlwaysNight(){
    if(localStorage.getItem("darkMode")=="true"){
        localStorage.setItem("darkMode", "false")
        darkModeSwitch.checked = false
        document.querySelector('html').classList.remove('night')
    }else{
        localStorage.setItem("darkMode", "true")
        darkModeSwitch.checked = true
        document.querySelector('html').classList.add('night')
    }
}

function _generateSkillChips(){
    for(var i=0; i<skills.length;i++){
        const chipEl = document.createElement('div');
        chipEl.classList.add('mdc-chip')
        chipEl.id = skills[i].id
        chipEl.innerHTML = '<div class="mdc-chip__ripple"></div> <i class="material-icons mdc-chip__icon mdc-chip__icon--leading">'+skills[i].icon+'</i> <span class="mdc-chip__checkmark" > <svg class="mdc-chip__checkmark-svg" viewBox="-2 -3 30 30"> <path class="mdc-chip__checkmark-path" fill="none" stroke="black" d="M1.73,12.91 8.1,19.28 22.79,4.59"/> </svg> </span> <span role="gridcell"> <span role="checkbox" tabindex="0" aria-checked="false" class="mdc-chip__primary-action"> <span class="mdc-chip__text">'+skills[i].name+'</span> </span> </span>'
        hazardChips.root.appendChild(chipEl);
        hazardChips.addChip(chipEl);
    }
}
