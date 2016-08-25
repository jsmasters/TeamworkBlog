
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
    takeRecentPosts();
    
    $('#formLogin').submit(function (e) { e.preventDefault(); login(); });
    $('#formRegister').submit(function (e) { e.preventDefault(); register(); });
    $('#formCreatePost').submit(function (e) { e.preventDefault(); createPost(); });
    
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
		showHideMenuLinks();
		$("#veiwLogin").hide();
		$("#veiwHome").show();
		$("#posts").show();
        if(response._id == '57bf113506bad3ac3f678050') {
            $("#linkNewPost").show();
        }
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
            postsData.sort(function (elem1, elem2) {
                let date1 = new Date(elem1._kmd.ect);
                let date2 = new Date(elem2._kmd.ect);
                return date2 - date1;
            });
            let posts = $('#posts');
            let postsCounter = 1;
            for(let post of postsData) {
                posts.append($('<li>').attr('class', 'single-post').append($('<article>').attr('id', 'post-' + postsCounter)).
                append(
                    $('<div>').attr('class', 'dot'),
                    $('<h3>').attr('class', 'title').text(post.title),
                    $('<p>').attr('class', 'subtitle').text("Posted on " + post.date + " by admin"),
                    $('<p>').attr('class', 'post-content').html(post.content))
                );
                
                postsCounter++;
            }
            $('#veiwHome').append(posts);
        }
    }
}

function createPost() {
    const kinveyPostsUrl = kinveyBaseUrl + "appdata/" + kinveyAppKey + "/posts";
    const kinveyAuthHeaders = {
        'Authorization': 'Kinvey' + ' ' + sessionStorage.getItem('authToken')
    };

    let postData = {
        title: $('#title').val(),
        content: CKEDITOR.instances.content.getData(),
        date: moment().format('MMMM Do YYYY HH:mm')
    };

    $.ajax({
        method: 'POST',
        url: kinveyPostsUrl,
        headers: kinveyAuthHeaders,
        data: postData,
        success: createPostSuccess,
        error: handleAjaxError
    });

    function createPostSuccess(response) {
        $("#veiwNewPost").hide();
        $('#veiwHome').show();
        showInfoBox("Post successfully created!");
        listPosts();
        takeRecentPosts();
    }
}

function takeRecentPosts() {
    $('#recent-posts').empty();

    const kinveyPostsUrl = kinveyBaseUrl + "appdata/" + kinveyAppKey + "/posts";
    const kinveyAuthHeaders = {
        'Authorization': 'Kinvey' + ' ' + guestCredentials,
        'Content-Type': 'application/json'
    };

    $.ajax({
        method: 'GET',
        url: kinveyPostsUrl,
        headers: kinveyAuthHeaders,
        success: loadRecentPostsSuccess,
        error: handleAjaxError
    });
    
    function loadRecentPostsSuccess(postsData) {
        postsData.sort(function (elem1, elem2) {
            let date1 = new Date(elem1._kmd.ect);
            let date2 = new Date(elem2._kmd.ect);
            return date2 - date1;
        });
        let recentPosts = $('#recent-posts');
        for(let i=0; i<5; i++) {
            recentPosts.append($('<li>').attr('class', 'single-recent-post').append($('<a>').attr('href', '#post-' + (i+1)).attr('class', 'single-menu-element-link').text(postsData[i].title)));
        }
        $('#nav').append(recentPosts);
    }
}