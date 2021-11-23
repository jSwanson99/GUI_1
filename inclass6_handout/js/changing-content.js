$(function() {
    $('li#one').remove();
    $('li#two').text('almonds');
    $('li.hot').each((i, el) => $(el).html('<em> ' + $(el).text() + '</em>') );
});