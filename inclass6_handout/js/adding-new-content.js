$(function() {
    $('ul').before('<p> Just Updated </p>');
    $('ul').append('<li> <em> gluten-free </em> soy sauce </li>')
    $('li.hot').each((i, el) => $(el).html('+ ' + $(el).text()) );
});