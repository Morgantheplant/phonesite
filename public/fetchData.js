var xhr = new XMLHttpRequest();

xhr.open('GET', encodeURI('https://api.github.com/user/?username=morgantheplant?password=Cbdo3240'));
// xhr.setRequestHeader("username", "morgantheplant")
// xhr.setRequestHeader("password", "Cbdo3240")
xhr.onload = function(e) {
    if (xhr.status === 200) {
        console.log('User\'s name is ' + xhr.responseText, e);
    }
    else {
        alert('Request failed.  Returned status of ' + xhr.status);
    }
};
xhr.send();