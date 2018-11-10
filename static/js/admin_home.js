window.onload = function(){
    $('#new_name').val("");
    $('#dur').val("");
};
$(document).on('click','.add_new',function () {
    var name = $('#new_name').val();
    var dur = $('#dur').val();
    console.log(name, dur)
    if(!isNaN(dur)){
        alert('Enter valid duration');
        return;
    }
    $.ajaxSetup({
        contentType: "application/json; charset=utf-8"
    });
    $.ajax({
        method: 'POST',
        url: '/admin',
        data: JSON.stringify({'name': name, 'duration': dur})
    }).done(function (data) {
        console.log(data);
        window.location.reload()
    })
});

$(document).on('click','.edit_name',function () {
    var name = $(this).siblings("span.test_name").text();
    $(this).siblings("span").replaceWith('<input name="new_test_name" size="10" type="text" value="'+name+'" />');
    $(this).replaceWith('<button class="change_name btn btn-table1">Done</button>');
});

$(document).on('click','.change_name',function () {
    var name = $(this).siblings().val();
    var test_url = $(this).parents("tr").find("input[name='test_url']").val();

    $.ajaxSetup({
        contentType: "application/json; charset=utf-8"
    });
    $.ajax({
        method: 'PUT',
        url: '/admin',
        data: JSON.stringify({'key': 'name', 'value': name, 'test_url': test_url})
    }).done(function (data) {
        console.log(data);
        window.location.reload()
    })
});

$(document).on('click','.edit_dur',function () {
    var dur = $(this).siblings("span.duration").text();
    $(this).siblings("span").replaceWith('<input name="new_dur" size="5" type="text" value="'+dur+'" />');
    $(this).replaceWith('<button class="change_dur btn btn-table1">Done</button>');
});

$(document).on('click','.change_dur',function () {
    var dur = $(this).siblings().val();
    var test_url = $(this).parents("tr").find("input[name='test_url']").val();

    $.ajaxSetup({
        contentType: "application/json; charset=utf-8"
    });
    $.ajax({
        method: 'PUT',
        url: '/admin',
        data: JSON.stringify({'key': 'duration', 'value': dur, 'test_url': test_url})
    }).done(function (data) {
        console.log(data);
        window.location.reload()
    })
});

$(document).on('click' ,'.toggle', function () {
    var status = $(this).text().toLowerCase() + 'd';
    var test_url =$(this).parents("tr").find("input[name='test_url']").val();
	console.log(test_url);
    if (status === 'disabled')
        status = 'disabled';
    else
        status = 'enabled';
    console.log(status);
    $.ajaxSetup({
        contentType: "application/json; charset=utf-8"
    });
    $.ajax({
        method: 'PUT',
        url: '/admin',
        data: JSON.stringify({'key': 'status', 'value': status, 'test_url': test_url})
    }).done(function (data) {
        console.log(data);
        window.location.reload()
    })
});

$(document).on('click' ,'.del_test', function () {
    var test_url = $(this).parents("tr").find("input[name='test_url']").val();

    console.log(status);
    $.ajaxSetup({
        contentType: "application/json; charset=utf-8"
    });
    $.ajax({
        method: 'DELETE',
        url: '/admin',
        data: JSON.stringify({'test_url': test_url})
    }).done(function (data) {
        console.log(data);
        window.location.reload()
    })
});
