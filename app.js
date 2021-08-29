var video_dict = {}; 

var searchBar = document.querySelector("#searchbar");
searchBar.addEventListener("keypress", function(e){searchRequest(e)}, false); //whenever a key is pressed, called the searchRequest function

/* 
Whenever a user enters a search term, this function makes a request to the YouTube API with that search term. 
The response is then converted to a JSON object and passed into the makeVideoList() function
*/
function searchRequest(e){
    //API request is made only if enter key is pressed (and not whenevever anything is entered in the search bar)
    if (e.key == "Enter"){
        //if there was already a video list rendered from a previous search, remove that list
        if (document.querySelector('.video-list')){
            document.querySelector('.video-list').parentElement.removeChild(document.querySelector('.video-list')); 
            video_dict = {}; 
        }
        if (document.querySelector('.iframe-div')){
            document.querySelector('.iframe-div').parentElement.removeChild(document.querySelector('.iframe-div')); 
        }
        //making API request
        var searchTerm = searchBar.value; 
        var request = new XMLHttpRequest();
        var url = `https://www.googleapis.com/youtube/v3/search?key=${config.MY_KEY}&type=video&part=snippet&q=${searchTerm}`; 
        request.onreadystatechange = function() {
            //whenver response comes in, convert it to JSON and pass it into makeVideoList function
            if (this.readyState == 4 && this.status == 200) {
                makeVideoList(JSON.parse(this.response), null);
            }
          };
        request.open("GET", url); 
        request.send(); 
    }
}

/*
This function renders the list of videos given through the API response
*/
function makeVideoList(responseObject, target){
    //create a div for the list of videos
    var videoList = document.createElement("div"); 
    videoList.className = "video-list"; 
    document.querySelector('body').appendChild(videoList);
    //for every video given in the response, render the video 
    for (let i = 0; i < responseObject.items.length; i++){
        //every video is given its own row, which will contain thumbnail, title, 
        var video = responseObject.items[i]; 
        if (target && video_dict[target.id] == video){
            continue; 
        }
        var row = document.createElement("div"); 
        row.className = "row";
        row.id = "video" + (i+1); 
        video_dict[row.id] = video; 
        videoList.appendChild(row);

        //thumbnail is rendered in its own div, on the left side of the row
        var thumbnail = document.createElement("div");  
        thumbnail.innerHTML = `<img src="${video.snippet.thumbnails.medium.url}">`; 
        row.appendChild(thumbnail); 


        //all the other elements will fall under this one videoInfo div
        var videoInfo = document.createElement("div"); 
        videoInfo.className = "video-info"; 
        row.appendChild(videoInfo); 
        var videoTitle = addTitle(video); 
        var dateDiv = addDate(video);
        var channelDiv = addChannel(video); 
        var descriptionDiv = addDescription(video); 
        //appending all the video information to the main div
        videoInfo.appendChild(videoTitle); 
        videoInfo.appendChild(dateDiv);
        videoInfo.appendChild(channelDiv); 
        videoInfo.appendChild(descriptionDiv);
    }
    selectVideo(responseObject); 
}

function addTitle(video){
    var videoTitle = document.createElement("h1");
    videoTitle.innerText = `${video.snippet.title}`; 
    videoTitle.className = "video-title"; 
    return videoTitle; 
}

function addDate(video){
    var dateDiv = document.createElement("div"); 
    dateDiv.className = "date-div"
    var date_icon = document.createElement("i"); 
    date_icon.innerText = "date_range"; 
    date_icon.className="material-icons";; 
    var videoPublishDate = document.createElement("p"); 
    videoPublishDate.innerText = `${dateConverter(video.snippet.publishedAt)}`; 
    videoPublishDate.className = "publish-date"; 
    dateDiv.appendChild(date_icon); 
    dateDiv.appendChild(videoPublishDate); 
    return dateDiv; 
}

/*
Function to format the date published
*/
function dateConverter(dateTimeString){
    let date = dateTimeString.split('T')[0]; 
    let dateFragments = date.split('-'); 
    let day = parseInt(dateFragments[2]); 
    let year = dateFragments[0]; 
    let month = dateFragments[1]; 
    return date; 
}

function addChannel(video){
    var channelDiv = document.createElement("div"); 
    channelDiv.className = "channel-div"
    var person_icon = document.createElement("i"); 
    person_icon.innerText = "account_circle"; 
    person_icon.className="material-icons"; 
    var videoChannel = document.createElement("p"); 
    videoChannel.innerText = `${video.snippet.channelTitle}`; 
    videoChannel.className = "channel"; 
    channelDiv.appendChild(person_icon); 
    channelDiv.appendChild(videoChannel);
    return channelDiv; 
}

function addDescription(video){
    var descriptionDiv = document.createElement("div"); 
    descriptionDiv.className = "description-div"; 
    var description_icon = document.createElement("i"); 
    description_icon.innerText = "article"; 
    description_icon.className = "material-icons"; 
    var videoDescription = document.createElement("p"); 
    videoDescription.innerText = `${video.snippet.description}`; 
    videoDescription.className = "description"; 
    descriptionDiv.appendChild(description_icon); 
    descriptionDiv.appendChild(videoDescription); 
    return descriptionDiv; 
}



function selectVideo(responseObject){
    var numberOfVideos = document.querySelectorAll('.row').length;
    for (let i = 1; i < numberOfVideos+1; i++){
        classString = "#video" + i;  
        if (document.querySelector(classString)){
            document.querySelector(classString).addEventListener('click', function(e){videoSelected(e, responseObject), false});
        }

    }
}

function videoSelected(e, responseObject){ 
    var body = document.querySelector('body');
    var target = e.target; 
    while (target.className != "row"){
        target = target.parentElement; 
    }
    if (document.querySelector('.iframe-div')){
        body.removeChild(document.querySelector('.iframe-div')); 
    }
    if (document.querySelector('.video-list')){
        body.removeChild(document.querySelector('.video-list')); 
        makeVideoList(responseObject, target); 
    }
    var iframeDiv = document.createElement('div'); 
    iframeDiv.className = "iframe-div"; 
    iframeDiv.setAttribute("align", "center"); 
    body.appendChild(iframeDiv); 
    
    var playerTitle = document.createElement('h1');
    playerTitle.className = "playerTitle"
    playerTitle.innerText = video_dict[target.id].snippet.title;
    iframeDiv.appendChild(playerTitle);

    var dateChannelDiv = document.createElement('div');
    dateChannelDiv.className = "date-channel"
    var playerDate = document.createElement('p');
    playerDate.className = "player-date";
    playerDate.innerText = `${dateConverter(video_dict[target.id].snippet.publishedAt)}`; 
    dateChannelDiv.appendChild(playerDate); 
    var circle_icon = document.createElement("i"); 
    circle_icon.innerText = "circle"; 
    circle_icon.className = "material-icons"; 
    circle_icon.id = "circle_icon"
    dateChannelDiv.appendChild(circle_icon);
    var playerChannel = document.createElement('p');
    playerChannel.innerText = video_dict[target.id].snippet.channelTitle;
    playerChannel.className = "player-channel";
    dateChannelDiv.appendChild(playerChannel);
    iframeDiv.appendChild(dateChannelDiv);

    embed_link = `https://www.youtube.com/embed/${video_dict[target.id].id.videoId}`; 
    var player = document.createElement("iframe"); 
    // player.setAttribute("width", "560"); 
    // player.setAttribute("height", "315"); 
    if (screen.width >= 1000){
        player.setAttribute("width", "800"); 
        player.setAttribute("height", "450"); 
    } else{
        widthsize = 0.96 * screen.width; 
        heightsize = 0.54 * screen.width; 
        player.setAttribute("width", widthsize); 
        player.setAttribute("height", heightsize);
        playerTitle.style.width = String(widthsize);
    }
     
    player.setAttribute("align", "center"); 
    player.setAttribute("src", embed_link); 
    player.setAttribute("title", "YouTube video player"); 
    player.setAttribute("frameborder", "0"); 
    player.setAttribute("allowfullscreen", true); 
    player.setAttribute("autoplay", true); 
    player.setAttribute("muted", true); 
    iframeDiv.appendChild(player);

     
    var videoList = document.querySelector('.video-list'); 
    body.appendChild(videoList);  

    document.querySelector('.searchdiv').scrollIntoView(); 
}

