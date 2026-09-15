const actionDisplay=document.querySelector('#actionTimer');
const minuteDisplay=document.querySelector('#minuteDisplay');
const startBtn=document.querySelector('#startBtn');
const resetBtn=document.querySelector('#resetBtn');
const inputTask=document.querySelector('#inputTask');
const addTaskBtn=document.querySelector('#addTask');
const taskList=document.querySelector('#taskList');
const message=document.querySelector('#message');

const workingDuration=1500;
const breakDuration=300;


let isRunning=false;
let tasks=[];

function formattedTime(time){
    const min=Math.floor(time/60);
    const sec=time%60;
    const timer=`${min} : ${sec.toString().padStart(2,'0')}`;
    return timer
}


const timerFactory=function createTimer(onTick, onSwitchMode){
    let seconds=workingDuration ;
    let intervalValid=null;
    let mode='work';
    

    function start(){
        if(intervalValid!==null)return;

        intervalValid=setInterval(()=>{
            seconds--;
            onTick(seconds);
            if(seconds===0){
                stop();
                switchMode();
            }
        },1000)
    }

    function stop(){
        if(intervalValid===null)return;
        clearInterval(intervalValid);
        intervalValid=null;
    }

    function reset(){
        stop();
        mode='work';
        onSwitchMode('work')
        seconds=workingDuration;
        onTick(seconds);
    }

    function switchMode(){
        if(mode==='work'){
            mode='break';
            seconds=breakDuration;
            onSwitchMode('break')
        }else{
            mode='work';
            seconds=workingDuration;
            onSwitchMode('work')
        }
        onTick(seconds);
    }
    function getSeconds(){
        return seconds
    }
    function getFormattedTime(){
        return formattedTime(seconds)
    }
    return {start,stop,reset,getSeconds,getFormattedTime}
}
   
    function updateTimerDisplay(seconds){
        minuteDisplay.textContent=formattedTime(seconds)
    }

    function updateModeLabel(newMode){
        if(newMode==='work'){
            actionDisplay.textContent='work';
        }else{
            actionDisplay.textContent='Break'
            }
    }
    function renderTask(actualTasks){
        taskList.innerHTML='';
        actualTasks.forEach((task)=>{
        const newLi=document.createElement('li');
        newLi.className='task-input-list';

        const newP=document.createElement('p');
        newP.className='task-name';
        newP.textContent=task.input;

        const newButton=document.createElement('button');
        newButton.className='delete-btn';
        newButton.setAttribute('data-id', task.id);
        newButton.textContent='Delete';

        newLi.append(newP, newButton);
        taskList.append(newLi);
        })

    }

    function updateTheList(){
        if(inputTask.value===''){
            alert('The input task cannot be empty');
            return;
        }
        const taskName=inputTask.value.trim();
        const taskData={
            input:taskName,
            id:Date.now()
        }
        tasks.push(taskData);
        
        const key='taskKey';
        const json=JSON.stringify(tasks);
        localStorage.setItem(key,json);
        inputTask.value='';
        renderTask(tasks);
    }

    function pageLoader(){
        const taskValue=localStorage.getItem('taskKey');
        const data=JSON.parse(taskValue);
        if(!data)return;
        tasks=data;
        renderTask(tasks)
    }
    const controller=timerFactory(updateTimerDisplay, updateModeLabel)
    controller.reset();

startBtn.addEventListener('click',()=>{
    if(isRunning===false){
        isRunning=true;
        controller.start();
        startBtn.textContent='Pause'
    }else{
        if(isRunning===true){
            controller.stop();
            isRunning=false
            startBtn.textContent='Start'
        }
    }
   

})
resetBtn.addEventListener('click',()=>{
    controller.reset();
    isRunning=false;
    startBtn.textContent='Start'

})

addTaskBtn.addEventListener('click',updateTheList);

taskList.addEventListener('click',(e)=>{
    const deleteBtn=e.target.closest('.delete-btn');
    if(!deleteBtn)return;

    const deleteId=Number(deleteBtn.dataset.id);

    const foundDeleteBtn=tasks.findIndex(del=>del.id===Number(deleteId))
    if(foundDeleteBtn!==-1){
        tasks.splice(foundDeleteBtn, 1)
    }
    renderTask(tasks);
});


pageLoader();