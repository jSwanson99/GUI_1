const list = document.querySelector('ul');

// ADD NEW ITEM TO END OF LIST
const kaleElement = document.createElement('li');
kaleElement.innerText = "kale";
list.prepend(kaleElement);

// ADD NEW ITEM START OF LIST
const creamElement = document.createElement('li');
creamElement.innerText = "cream";
list.append(creamElement);


// ADD A CLASS OF COOL TO ALL LIST ITEMS
const listItems = document.querySelectorAll('ul li');
listItems.forEach(el => el.classList.add('cool') );

// ADD NUMBER OF ITEMS IN THE LIST TO THE HEADING
const header = document.querySelector('h2');
header.innerText = header.innerText + ` (${listItems.length})`;