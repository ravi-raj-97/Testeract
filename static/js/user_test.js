var ans_str='';
var qnos = 0;

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            time_expired();
        }
    }, 1000);
}

window.onload = function () {
    var duration = parseInt(document.getElementById('time').textContent)*60;
    display = document.querySelector('#time');
    startTimer(duration, display);
    console.log(duration);
    window.qnos =parseInt($('span.noq').text())
    for (var i=0;i<qnos;i++){
        window.ans_str+='0';
    }
    console.log(window.ans_str)
};

$(document).on('change','.opt',function () {
    var ans = $(this).attr('id');
    var qno = parseInt(ans[1])-1;
    var ano = ans[3];
    window.ans_str = replace(window.ans_str, qno, ano)
});

function replace(str, pos, rep) {
    return str.substr(0,pos)+ rep +str.substr(pos+1, str.length)
}

function time_expired() {
    $.ajaxSetup({
        contentType: "application/json; charset=utf-8"
    });
    var usn = $(document).find('#usn').text();
    $.ajax({
        method: 'PUT',
        url: '/user/' + window.location.href.split("/")[4],
        data: JSON.stringify({'ans_str':window.ans_str, 'usn':usn})
    }).done(function () {
        window.location.replace('/finished')
    })


}