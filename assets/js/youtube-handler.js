function checkConsent() {
    var cookie = getCookie("cookie-consent");
    if (cookie === "true") {
        updateYouTubeEmbeds();
    }else if(cookie === "false"){
        //leave as is
    }else{
        showConsentRequest();
    } 
}
function showConsentRequest(){
    var noticeDiv = document.createElement("div");
    noticeDiv.className="notice--warning cookie-consent"
    noticeDiv.id="cookie-consent-notice"
    noticeDiv.innerHTML="<b>Cookie Consent:</b> This site includes embedded YouTube videos which if viewed may cause <a href='https://policies.google.com/technologies/cookies?hl=en-GB' target='_blank' title='Link to page describing YouTube's use of cookies'>cookies from Google</a> to be set. By default these videos will not be embedded in the site, clicking on them will open a link to the video on YouTube. If you click accept on this banner the videos will be embedded within the page and you will be able to view them without leaving this site. Clicking either Accept or Reject will cause your preference to be saved in a cookie for the current browser session, which will be deleted after you restart your browser."
    
    var acceptBtn = document.createElement("button");
    acceptBtn.innerText="Accept";
    acceptBtn.className=".btn .btn--primary"
    acceptBtn.style.marginLeft="5px";
    acceptBtn.addEventListener("click", function(){
        document.cookie="cookie-consent=true; Path=/PUPS;SameSite=Strict; Secure";       
        noticeDiv.parentElement.removeChild(noticeDiv);
        updateYouTubeEmbeds();
    })

    noticeDiv.append(acceptBtn);
    var rejectBtn = document.createElement("button");
    rejectBtn.innerText="Reject";
    rejectBtn.style.marginLeft="5px";
    rejectBtn.className=".btn .btn--primary"
    rejectBtn.addEventListener("click", function(){
        document.cookie="cookie-consent=false; Path=/PUPS; SameSite=Strict; Secure";       
        noticeDiv.parentElement.removeChild(noticeDiv);
        updateYouTubeEmbeds();
    })
    noticeDiv.append(rejectBtn);
    document.body.append(noticeDiv);
}
function updateYouTubeEmbeds() {
    var cookie = getCookie("cookie-consent");
    if (cookie === "true") {
        videos = document.getElementsByClassName("youtube-placeholder");
        for(var i = videos.length-1; i >= 0; i--){
            var video = videos.item(i);
            var url = video.dataset.youtubeLink;
            if(url !== null && url !==""){
                var yt_iframe = document.createElement("iframe");
                yt_iframe.width="560";
                yt_iframe.height="315";
                yt_iframe.src = video.dataset.youtubeEmbed;
                yt_iframe.title = "YouTube video player";
                yt_iframe.frameborder="0";
                yt_iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                yt_iframe.allowFullscreen=true;
                video.parentElement.replaceChild(yt_iframe,video);                
            }
        }
    }
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
} 