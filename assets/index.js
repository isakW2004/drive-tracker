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
        view.timer(false, true)
    }
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
        standardFab.onclick = function(){
            view.timer(timeChips.selectedChipIds.indexOf('night') != -1, false)
        }
        setTimeout(function(){
            homeContainer.hidden=true
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
            document.querySelector('html').classList.add("night")
        }
    },
    "ended": function(){
        document.querySelector('html').classList.remove('night')
        var timerContainer = document.getElementById('timerContainer')
        var endContainer = document.getElementById('endContainer')
        endContainer.classList.add('appearing')
        timerContainer.classList.add('disappearing')
        endContainer.hidden=false
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
    "format": function(duration) {
        var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    
      hours = (hours < 10) ?  + hours : hours;
      minutes = (minutes < 10) ? + minutes : minutes;
      seconds = (seconds < 10) ? + seconds : seconds;
    
      return [hours, minutes, seconds];
    },
    "stop": function(){
        view.ended()
        var endTime = currentTime;
        document.getElementById('endTime').innerHTML = timePrintLayout(endTime).join(':')
        localStorage.removeItem("timerStartTime")
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
const drivingTips = ["Turn on Do Not Disturb to reduce distractions on the road.", "Try turning off driver assist features to become less dependant on these features.", "Stop driving if you feel tired", "Use the left lane to take the third exit on most double lane roundabouts", "Neighborhoods with no posted speed limits have a speed limit of 25 mph", "Feel free to exit the app. Your timer will stay here."]
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
        document.getElementById('welcome-text').innerHTML = "You've Finished Your Required Hours!"
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
    $comments = $header.contents('form')
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
    console.log()
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