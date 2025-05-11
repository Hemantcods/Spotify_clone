console.log("lets wite java script");
let currentSong=new Audio();
let started=false; 
let currfolder
function formatTime(seconds) {
    const totalSeconds = Math.floor(seconds);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
function getProgressPercentage(currentTime, totalDuration) {
    if (totalDuration === 0) return 0;
    return ((currentTime / totalDuration) * 100).toFixed(1);
}


async function getSongs(folder){
    let a=await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response=await a.text();
    let div=document.createElement("div");
    div.innerHTML=response;
    let as=div.getElementsByTagName("a");
    let songs=[];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")){
            songs.push(element.href); 
        }
    } 
    return songs;  
}

const playMusic= (track,pause=false)=>{
    // let audio=new Audio("/songs/"+track)
    if(!pause){
        currentSong.play()
    }
    currentSong.src=`/${currfolder}/`+track;
    currentSong.play();
    document.querySelector(".songinfo").innerHTML=decodeURI(track).split(".mp3")[0]
    document.querySelector(".songtime").innerHTML="00:00"
}
async function main(){
    let songs=await getSongs('songs/phonk')
    folder="songs/phonk";
    currfolder=folder;
    console.log(songs);
    // playMusic(songs[0].split("/").pop().replaceAll("%20"," ").split(".")[0],true)
    let audio=new Audio(songs[4]); 
    audio.addEventListener("loadeddata", () => {
    let duration = audio.duration;
    console.log("duration",duration,"seconds"," current duration",audio.currentTime,"seconds");
    // The duration variable now holds the duration (in seconds) of the audio clip
    });
       

    let songul=document.querySelector(".songlist").getElementsByTagName("ul")[0];  // addihng the card to the ul
    for (const song of songs) {
        // let songname=song.split("/").pop().replaceAll("%20"," ").split(".")[0];
        let songname=decodeURI(song).split("/").pop().replaceAll("%20"," ").split(".")[0];
        songul.innerHTML=songul.innerHTML+`
                        <li>
                            <div class="small_card">
                                <img src="music.svg" class="music invert" alt="">
                                <div class="info">
                                    <h2>${songname}</h2>
                                    <p>Hemant</p>
                                </div>
                                <img class="small_play" src="pause.svg" alt="">
                            </div>
                        </li>
                        `;
    }
    // attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((li,index)=>{
        li.addEventListener("click",element=>{
            console.log(li.querySelector(".info").firstElementChild.innerHTML);
            playMusic(li.querySelector(".info").firstElementChild.innerHTML.replaceAll(" ","%20")+".mp3");
            play.src="play.svg";
        })
       
    })

    // button=document.getElementById("play1");
    // button.addEventListener("click",function(){
    //     let audio=new Audio(songs[4]); 
    //     audio.play();
    // });
    //  play the song button
    console.log(songs[0].split("/").pop());

    // Add event listeners to the previous,next buttons 
    play.addEventListener("click",()=>{
        if (!started) {
        playMusic(songs[0].split("/").pop(),true)
        started=true;
        }
        else{
            if (currentSong.paused) {
            currentSong.play();
            play.src="play.svg";
        }
            else{
            currentSong.pause();
            play.src="pause.svg";
        }
        }
    

    })

    // listen for time update event
    currentSong.addEventListener("timeupdate",()=>{
        let currentTime = currentSong.currentTime;
        let duration = currentSong.duration;
        document.querySelector(".songtime").innerHTML=`${formatTime(currentTime)} / ${formatTime(duration)}`;
        // console.log("current time",currentTime,"seconds"," duration",duration,"seconds");  
        document.querySelector(".circle").style.left=`${getProgressPercentage(currentTime,duration)}%`; 
        document.querySelector(".circle").style.transition=`left 0.1s  ease-in-out`;
    })

    // add event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        console.log((e.offsetX/e.target.getBoundingClientRect().width)*100 +"%");
        console.log(e.offsetX,e.target.getBoundingClientRect().width);
        document.querySelector(".circle").style.left=`${(e.offsetX/e.target.getBoundingClientRect().width)*100}%`;
        currentSong.currentTime=(e.offsetX/e.target.getBoundingClientRect().width)*currentSong.duration;

    })


    // add event listner to menu button
    document.querySelector(".menu").addEventListener("click",e=>{
        document.querySelector(".left").style.left="0%";
    })

    // add event listner to close button
    document.querySelector(".close").addEventListener("click",e=>{
        document.querySelector(".left").style.left="-100%";
    })

    // add event listner to previous and next button
    previous.addEventListener("click",e=>{
        let currentIndex=songs.indexOf(currentSong.src);
        // console.log(currentSong.src)
        // console.log(currentIndex);
        if (currentIndex==0) {
            currentIndex=songs.length-1;
        }
        else{
            currentIndex-=1;
        }
        playMusic(songs[currentIndex].split("/").pop());
    })
    next.addEventListener("click",e=>{
        let currentIndex=songs.indexOf(currentSong.src);
        // console.log(currentSong.src)
        // console.log(currentIndex);
        if (currentIndex==songs.length-1) {
            currentIndex=0;
        }
        else{
            currentIndex+=1;
        }
        playMusic(songs[currentIndex].split("/").pop());
    })

    // add event listner to volume button
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",e=>{
        currentSong.volume=e.target.value/100;
        console.log(e.target.value);

    })
}

main();
