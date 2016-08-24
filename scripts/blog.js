
const kinveyBaseUrl = 'https://baas.kinvey.com/';
const kinveyAppKey = "kid_HyTJqHwc";
const kinveyAppSecret = "3660086338f4450da0ff997b3abd94e3";
var guestCredentials = "30cc2302-7540-4295-ab12-4d26591ffa49.vy/ofGK/OPzR09zK/W0YCTI3llMJciiaXwUin3CCzbo=";

function showInfoBox(massageText) {
    $("#infoBox").text(massageText).show().delay(3000).fadeOut();
}
function showErrorBox(massageText) {
    $("#errorBox").text(massageText).show().delay(3000).fadeOut();
}


$(function () {
    listPosts();


    $('#formLogin').submit(function (e) { e.preventDefault(); login(); });
    $('#formRegister').submit(function (e) { e.preventDefault(); register(); });
    $('#formCreateBook').submit(function (e) { e.preventDefault(); createBook(); });
    
});

function register() {
    const kinveyRegisterUrl = kinveyBaseUrl + "user/" + kinveyAppKey + "/";
    const kinveyAuthHeaders = {
        'Authorization' : 'Basic ' + btoa(kinveyAppKey + ":" + kinveyAppSecret)
    };
    let userData = {
        username: $('#registerUser').val(),
        password: $('#registerPass').val()
    };

    $.ajax({
        method: 'POST',
        url: kinveyRegisterUrl,
        headers: kinveyAuthHeaders,
        data: userData,
        success: registerSuccess,
        error: handleAjaxError
    });

    function registerSuccess() {
        showInfoBox("Register successfull!");
		$("#veiwLogin").show();
		$("#veiwRegister").hide();
		

    }
}

function handleAjaxError(response) {
    let errorMsg = JSON.stringify(response);
    if(response.readyState === 0) {
        errorMsg = "Cannot connect due to network error.";
    }
    if(response.responseJSON && response.responseJSON.description) {
        errorMsg = response.responseJSON.description;
        showErrorBox("Error!!!");
    }
}

function login() {
    const kinveyLoginUrl = kinveyBaseUrl + 'user/' + kinveyAppKey + "/login";
    const kinveyAuthHeaders = {
        'Authorization': 'Basic ' + btoa(kinveyAppKey + ":" + kinveyAppSecret)
    };
    let userData = {
        username: $('#loginUser').val(),
        password: $('#loginPass').val()
    };
    $.ajax({
        method: 'POST',
        url: kinveyLoginUrl,
        data: userData,
        headers: kinveyAuthHeaders,
        success: loginSuccess,
        error: handleAjaxError
    });

    function loginSuccess(response) {
        let userAuth = response._kmd.authtoken;
        sessionStorage.setItem('authToken', userAuth);
		window.open ("file:///E:/TeamworkBlog-master/index.html#");
        showInfoBox("Login successfull!");
		window.location.href = 'index.html';
        
    }
}

function listPosts() {
    $('#posts').empty();

    const kinveyPostsUrl = kinveyBaseUrl + "appdata/" + kinveyAppKey + "/posts";
    const kinveyAuthHeaders = {
        'Authorization': 'Kinvey' + ' ' + guestCredentials,
        'Content-Type': 'application/json'
    };

    $.ajax({
        method: 'GET',
        url: kinveyPostsUrl,
        headers: kinveyAuthHeaders,
        success: loadPostsSuccess,
        error: handleAjaxError
    });

    function loadPostsSuccess(postsData) {
        if(postsData.length == 0) {
            $('#posts').text("No posts in the blog.");
        } else {
            let posts = $('#posts');
            for(let post of postsData) {
                posts.append($('<li>').attr('class', 'single-post').append($('<article>')).
                append(
                    $('<div>').attr('class', 'dot'),
                    $('<h3>').attr('class', 'title').text(post.title),
                    $('<p>').attr('class', 'subtitle').text("Posted on " + post.date + " by admin"),
                    $('<p>').attr('class', 'content').text(post.content))
                );
            }
            $('main').append(posts);
        }
    }
}