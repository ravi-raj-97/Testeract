function admin_login() {
    var name = $("#login").val();
    var pass = $("#pass").val();
    $.ajax({
        url:"/login",
        method:'GET',
        headers:{'Name':name, 'Pass':pass}
    }).done(function (data) {
        console.log(data);
        window.location = '/admin'
    }).fail(function () {
        console.log('incorrect pass')
    })
}

function student_login(str) {
    console.log(str);
    window.location.replace('/user/'+str);
}