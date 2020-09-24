var states =[
    {"name":"Alabama", "total":50, "night":0}, {"name":"Alaska", "total":40, "night":10, "message":"Night Driving counts towards \"Challenging Circumstances\". Use night mode in these circumstances."}, {"name":"Arizona", "total":30, "night":10}, {"name":"Arkansas", "total":0, "night":0, "message":"Arkansas has no time requirements to get a restricted license. You can set a goal above or later in settings."}, {"name":"California", "total":50, "night":10}, {"name":"Colorado", "total":50, "night":10},  {"name":"Connecticut", "total":40, "night":0}, {"name":"Delaware", "total":50, "night":10}, {"name":"Florida", "total":50, "night":10}, {"name":"Georgia", "total":40, "night":6}, {"name":"Hawaii", "total":50, "night":10, "message":"Hawaii has different requirements for each island. Look up the drivers manual for your island and add the times above."}, {"name":"Idaho", "total":50, "night":10}, {"name":"Illinois", "total":50, "night":0},{"name":"Indiana", "total":50, "night":10},{"name":"Iowa", "total":20, "night":2},{"name":"Kansas", "total":50, "night":10},{"name":"Kentucky", "total":60, "night":10}, {"name":"Louisiana", "total":50, "night":15, "message":"In Louisiana, to get a permit, you must practice for 8 hours. This app will track the 50 hours required to get a license unless you specify different hours above."}, {"name":"Maine", "total": 70, "night":10}, {"name":"Maryland", "total": 50, "night":15}, {"name":"Massachusetts", "total": 40, "night":0}, {"name":"Michigan", "total": 50, "night":10}, {"name":"Minnesota", "total": 50, "night":15, "message":"If the parent has completed the parent class, the reqirements are 40 hours and 15."}, {"name":"Mississippi", "total": 0, "night":0, "message":"Mississippi doesn't have any time requirements. Set it above or later in settings."}
]
document.addEventListener("MDCSelect:change", function(index){
    if(typeof states[stateSelect.selectedIndex].message != 'undefined'){
        document.getElementById('setupMessage').innerHTML= states[stateSelect.selectedIndex].message
    }else{
        document.getElementById('setupMessage').innerHTML= ""
    }
    fabCheck()
})
setupInputs[1].root.addEventListener("input", function(){
    fabCheck()
})
setupInputs[0].root.addEventListener("input", function(){
    fabCheck()
})

function fabCheck(){
    var blank =2;
    $.each(setupInputs, function(index){
        var value=setupInputs[index]
        if(value.value !="" && !isNaN(value.value)){
            blank--
        }
    })
    if(blank==0){
        standardFab.classList.remove('mdc-fab--exited')
    }else if(stateSelect.selectedIndex != -1){
        standardFab.classList.remove('mdc-fab--exited')
    }else{
        standardFab.classList.add('mdc-fab--exited')
    }
}
function finishSetup(){
    var hours = []
    var blank=2
    $.each(setupInputs, function(index){
        var value=setupInputs[index]
        if(value.value !="" && !isNaN(value.value)){
            blank--
        }
    })
    if(blank==0){
        $.each(setupInputs, function(index){
            var value=setupInputs[index]
            hours.push(parseInt(value.value))
        })
    }else{
        var state = states[stateSelect.selectedIndex]
        hours = [state.total, state.night]
    }
    console.log(hours)
    localStorage.setItem('hours', JSON.stringify(hours))
    localStorage.setItem('setUp', true)
    view.home()
}