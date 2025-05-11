console.log("lets wite java script");
let currentSong=new Audio();
let started=false; 
let currfolder
let user="hemantcods"
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


async function getSongs(address) {
    const res = await fetch('/Spotify_clone/playlist.json');
    // const res = await fetch('/playlist.json');
   
    const playlists = await res.json();

     console.log(playlists);

    const cleanAddress = address.replace(/\\/g, '/');
    const playlist = playlists.find(pl => pl.adress.replace(/\\/g, '/') === cleanAddress);

    if (!playlist) {
        console.warn(`Playlist not found for address: ${address}`);
        return [];
    }

    const baseUrl = '/' + cleanAddress + '/';
    const songs = [];

    for (let i = 0; i < playlist.songs.length; i++) {
        const songFile = playlist.songs[i];
        songs.push(baseUrl + encodeURIComponent(songFile));
    }
    console.log("songs",songs);

    let songul=document.querySelector(".songlist").getElementsByTagName("ul")[0];  // addihng the card to the ul
    songul.innerHTML="";
    for (const song of songs) {
        // let songname=song.split("/").pop().replaceAll("%20"," ").split(".")[0];
        let songname=decodeURI(song).split("/").pop().replaceAll("%20"," ").split(".")[0];
        console.log(songname);
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
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((li, index) => {
        li.addEventListener("click", element => {
            console.log(li.querySelector(".info").firstElementChild.innerHTML);
            playMusic(li.querySelector(".info").firstElementChild.innerHTML.replaceAll(" ", "%20") + ".mp3");
            play.src = "img/play.svg";
        })

    })
    return songs;
}

    const playMusic= async (track,pause=false) =>{
    // let audio=new Audio("/songs/"+track)
    console.log("playing",track);
    if(!pause){
        currentSong.play()
    }
    console.log(`https://hemantcods.github.io/Spotify_clone/${currfolder}/`+track)
    currentSong.src=`https://hemantcods.github.io/Spotify_clone/${currfolder}/`+track;
    currentSong.load();
    currentSong.play();
    document.querySelector(".songinfo").innerHTML=decodeURI(track).split(".mp3")[0]
    document.querySelector(".songtime").innerHTML="00:00"
}

async function displayPlaylists() {
    const res = await fetch('/Spotify_clone/playlist.json'); // adjust path as needed
    // const res = await fetch('/playlist.json');
    const playlists = await res.json();

    const container = document.querySelector(".cardcontainer");
    // container.innerHTML = ""; // Clear any existing content

    for (let i = 0; i < playlists.length; i++) {
        const pl = playlists[i];

        const folder = pl.adress.replace(/\\/g, '/').split('/').pop(); // last folder name

        container.innerHTML += `
            <div data-folder="${folder}" class="card">
                <div class="play" id="play${i}">
                    <img class="play-button" src="pause.svg" alt="">
                </div>
                <img src="${pl.cover_adress}" alt="">
                <h2>${pl.name}</h2>
                <p>${pl.description}</p>
            </div>
        `;
    }
    // Attach event listeners to each card
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            // console.log(item.target.getAttribute("data-folder")); // item.target might be an inner element
            console.log("here",e.getAttribute("data-folder").replaceAll("%20", " ")); // Use e (the card element) to get the attribute
            songs = await getSongs(`songs/${e.getAttribute("data-folder")}`);

            currfolder = `songs/${e.getAttribute("data-folder")}`;
            folder = `songs/${e.getAttribute("data-folder")}`;
            currfolder = folder;
            playMusic(songs[0].split("/").pop(), true);
        })
    });
}
async function main(){
    let songs=await getSongs('songs/ncs')
    folder="songs/ncs";
    currfolder=folder;
    console.log(songs);
    // playMusic(songs[0].split("/").pop().replaceAll("%20"," ").split(".")[0],true)
    let audio=new Audio("https://hemantcods.github.io/Spotify_clone/"+songs[4]); 
    audio.addEventListener("loadeddata", () => {
    let duration = audio.duration;
    console.log("duration",duration,"seconds"," current duration",audio.currentTime,"seconds");
    // The duration variable now holds the duration (in seconds) of the audio clip
    });

    


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
    displayPlaylists();
}

main();
