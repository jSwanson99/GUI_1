$(function() {
    const old_bgc = $("li").css('background-color');
    $("ul").append(`<p> ${old_bgc} </p>`);

    $("li").css({
        'font-family': 'Georgia',
        'color': 'black',
        'font-size': '+=2',
        'background-color': '#c5a996',
        'border': '1px solid white',
        'text-shadow': 'none',
    });
});