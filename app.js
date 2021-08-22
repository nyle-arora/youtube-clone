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
        if (document.querySelector('iframe')){
            document.querySelector('iframe').parentElement.removeChild(document.querySelector('iframe')); 
        }
        //making API request
        var searchTerm = searchBar.value; 
        var request = new XMLHttpRequest();
        var url = `https://www.googleapis.com/youtube/v3/search?key=${config.MY_KEY}&type=video&part=snippet&q=${searchTerm}`; 
        request.onreadystatechange = function() {
            //whenver response comes in, convert it to JSON and pass it into makeVideoList function
            if (this.readyState == 4 && this.status == 200) {
                makeVideoList(JSON.parse(this.response));
            }
          };
        request.open("GET", url); 
        request.send(); 
    }
}

/*
This function renders the list of videos given through the API response
*/
function makeVideoList(responseObject){
    //create a div for the list of videos
    var videoList = document.createElement("div"); 
    videoList.className = "video-list"; 
    document.querySelector('body').appendChild(videoList);
    //for every video given in the response, render the video 
    for (let i = 0; i < responseObject.items.length; i++){
        //every video is given its own row, which will contain thumbnail, title, 
        var video = responseObject.items[i]; 
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
        //vieo title is rendered as h1 element
        var videoTitle = document.createElement("h1");
        videoTitle.innerText = `${video.snippet.title}`; 
        videoTitle.className = "video-title"
        //the date is formatted using a helper function and given a calendar icon
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
        //the channel information is given an account icon
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
        //the description is given an article icon
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
        //appending all the video information to the main div
        videoInfo.appendChild(videoTitle); 
        videoInfo.appendChild(dateDiv);
        videoInfo.appendChild(channelDiv); 
        videoInfo.appendChild(descriptionDiv);
    }
    selectVideo(); 
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

function selectVideo(){
    document.querySelector('#video1').addEventListener('click', function(e){videoSelected(e), false}); 
    document.querySelector('#video2').addEventListener('click', function(e){videoSelected(e), false}); 
    document.querySelector('#video3').addEventListener('click', function(e){videoSelected(e), false}); 
    document.querySelector('#video4').addEventListener('click', function(e){videoSelected(e), false}); 
    document.querySelector('#video5').addEventListener('click', function(e){videoSelected(e), false}); 
}

function videoSelected(e){ 
    var body = document.querySelector('body');
    if (document.querySelector('iframe')){
        body.removeChild(document.querySelector('iframe')); 
    }
    var iframeDiv = document.createElement('div'); 
    iframeDiv.className = "iframe-div"; 
    iframeDiv.setAttribute("align", "center"); 
    body.appendChild(iframeDiv); 
    var target = e.target; 
    while (target.className != "row"){
        target = target.parentElement; 
    }
    embed_link = `https://www.youtube.com/embed/${video_dict[target.id].id.videoId}`; 
    console.log(video_dict);
    console.log(embed_link); 
    var player = document.createElement("iframe"); 
    // player.setAttribute("width", "560"); 
    // player.setAttribute("height", "315"); 
    if (screen.width >= 1000){
        player.setAttribute("width", "40%"); 
    } else{
        player.setAttribute("width", "100%")
    }
    player.setAttribute("height", "315"); 
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
}


// for (row in document.getElementsByClassName('.row')){
//     // console.log(row); 
//     // row.addEventListener("click", videoSelected(row)); 
// }; 

