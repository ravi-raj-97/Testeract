$(document).on('click','.edit_question', function () {
    var old_q = $(this).siblings("span.question").text();
    var old_a = $(this).siblings("span.answer").text();
    var a = $(this).siblings("ol").children("li:nth-child(1)").text();
    var b = $(this).siblings("ol").children("li:nth-child(2)").text();
    var c = $(this).siblings("ol").children("li:nth-child(3)").text();
    var d = $(this).siblings("ol").children("li:nth-child(4)").text();

    $(this).siblings("span.question").replaceWith("Question<input class='new_q' value='"+old_q+"'>");
    $(this).siblings("span.answer").replaceWith("<select class='new_a'>" +
        "<option value='1'>1</option>" +
        "<option value='2'>2</option>" +
        "<option value='3'>3</option>" +
        "<option value='4'>4</option>" +
        "</select>" );
    $(this).siblings("select").children("option[value="+old_a+"]").prop('selected', true);
    $(this).siblings("ol").children("li:nth-child(1)").replaceWith("<li><input class='new_a' value="+a+" /></li>");
    $(this).siblings("ol").children("li:nth-child(2)").replaceWith("<li><input class='new_b' value="+b+" /></li>");
    $(this).siblings("ol").children("li:nth-child(3)").replaceWith("<li><input class='new_c' value="+c+" /></li>");
    $(this).siblings("ol").children("li:nth-child(4)").replaceWith("<li><input class='new_d' value="+d+" /></li>");
    $(this).replaceWith("<button class='submit_edit btn btn-table4'>Add</button>")
});

$(document).on('click','.submit_edit', function () {
    var a = $(this).siblings("ol").children("li:nth-child(1)").children().val();
    var b = $(this).siblings("ol").children("li:nth-child(2)").children().val();
    var c = $(this).siblings("ol").children("li:nth-child(3)").children().val();
    var d = $(this).siblings("ol").children("li:nth-child(4)").children().val();
    var i = $(this).parent().attr('id');
    var q = $(this).siblings("input.new_q").val();
    var ans = $(document).find("select.new_a").children("option:selected").val();

    var data = {'q_index': parseInt(i)-1, 'question': q, 'options':[a,b,c,d], 'ans':ans};
    $.ajaxSetup({
    contentType: "application/json; charset=utf-8"
    });
    $.ajax({
        url: '/admin/' + window.location.href.split("/")[4],
        method: 'PUT',
        data: JSON.stringify(data),
    }).done(function () {
      window.location.reload();
    });
    console.log(ans)
});

$(document).on('click','.delete_question', function () {
    var i = $(this).parent().attr('id');
    var data = {'q_index': parseInt(i)-1};
    $.ajaxSetup({
    contentType: "application/json; charset=utf-8"
    });
    $.ajax({
        url: '/admin/' + window.location.href.split("/")[4],
        method: 'DELETE',
        data: JSON.stringify(data),
    }).done(function () {
      window.location.reload();
    });
});
