$(function() {
    //$('li#one').remove();
    $('li#two').text('almonds');
    $('li.hot').each((i, el) => {
        $(el).html('<em>  + ' + $(el).text() + '</em>') 
    });
    $('ul').before('<p> Just Updated </p>');
    $('ul').append('<li> <em> gluten-free </em> soy sauce </li>')
});