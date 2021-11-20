/*
    File: index.js 
    GUI Assignment:  HW4B - Multiplication table
    Jonathan Swanson, UMass Lowell Computer Science, jonathan_swanson@student.uml.edu 
    Copyright (c) 2021 by Jonathan.  All rights reserved.  May be freely copied or 
    excerpted for educational purposes with credit to the author. 
    updated by JS on November 20, 2021 at 12:00 PM 
*/

// JQuery Input Validator
let validator;

// Element constants
const inputElements = $("form input");
const sliderElements =$(".slider");
let num_tabs = 0;
let cur_tabs = [];

// JQuery Slider Additional Options
const sliderOptions = {
    min: -50,
    max: 50,
    step: 1,
    value: 0,
    change: function () {
        i = $(this).data("num");
        $(inputElements[i]).val($(this).slider("value"));
        if(validator.form() && cur_tabs.length) {
            updateCurrentTable();
        }
    }
};

// When page loads
$(document).ready(() => {
    $("#tabs").tabs(); // Init JQuery Tabs
    enableValidator();

    inputElements.each((i, el) =>  el.value = i**2 ); // Set default values

    // Set default slide values, and add meta-data for indexing
    $(".slider").slider(sliderOptions); 
    sliderElements.each((i, el) => {
        $(el).slider("value", i**2);
        $(el).data("num", i);
    });
    
    // Bind text inputs to sliders
    inputElements.each((i, el) => {
        $(el).change(function () {
            $(sliderElements.eq(i)).slider("value", $(el).val());
            validator.form();
        });
    });

    // Override submit function to prevent page reload
    $("#input_form").submit((event) => {
        event.preventDefault();
        return false;
    });

    // Add various event listeners 
    addDeleteListener();
    addCheckBoxListener();
});

function enableValidator() {
    validator = $("#input_form").validate({
        rules: {
            minRowNum: { 
                minr_gt_maxr: true,
                range: [-50, 50]
             }, 
            maxRowNum: { 
                minr_gt_maxr: true,
                range: [-50, 50] 
            }, 
            minColNum: { 
                minc_gt_maxc: true,
                range: [-50, 50] 
            }, 
            maxColNum: { 
                minc_gt_maxc: true,
                range: [-50, 50]
            }
        },
        submitHandler: () => {
            const inputs = parseInputs();
            createNewTab(generateTable(inputs), inputs);
        }
    });

    addCustomRules(); // Min/Max Checking rules
}

// Enforced min/max checking on input pairs when one input changes
// --> When min row changes, max row is also checked
function addCustomRules() {
    $.validator.addMethod("minr_gt_maxr", (value, el) => {
        minr = parseInt($("#minRowNum").val());
        maxr = parseInt($("#maxRowNum").val());
        return minr < maxr;
    }, "Min row must be less than max row");
    $.validator.addMethod("minc_gt_maxc", (value, el) => {
        minc = parseInt($("#minColNum").val());
        maxc = parseInt($("#maxColNum").val());
        return minc < maxc;
    }, "Min col must be less than max col");
}

// Handles marked for deletion class
function addCheckBoxListener() {
    $(document).on('click', 'ul li input', function() {
        $(this).closest('li').toggleClass('markedDeletion');
    });
}

// Listens for clicks on trashcan icons
function addDeleteListener() {
    // When we click the delete icon
    $(document).on('click', 'ul li i', function() {
        const id = parseInt($(this).closest('i').attr('id')); // Get that tabs ID
        let flag = cur_tabs[activeTabID()] == id; // Determine if this is our active tab

        // Delete all checked boxes (if any)
        $('input:checkbox:checked').each(function (i, el) {
            const cur_removed_id = parseInt($(el).parent().find('i').attr('id'));
            if(cur_removed_id === id)
                $("#tabs").tabs("option", "active", cur_tabs[0]); // Selects another tab

            $("#tab-container").children()[cur_tabs.indexOf(cur_removed_id)].remove();
            cur_tabs = cur_tabs.filter(el => el !== cur_removed_id)
            $(el).parent().remove();
        });

        $(this).parent().remove(); // Remove required tab
        $("#tabs").tabs("refresh"); // Refresh tabs after deleting them

        // Remove the required tab's content
        $("#tab-container").children().each((i, el) => {
            if(i === cur_tabs.indexOf(id)) {
                $(el).remove();
                cur_tabs = cur_tabs.filter(el => el !== id );
            }
        });

        // Hide the tabs if we've deleted all of them
        if(cur_tabs.length === 0) {
            $("#tabs").hide();
        // ow select a new tab's if we've deleted the current tab
        } else if(flag) {
            $("#tabs").tabs("option", "active", cur_tabs[0]);
            $("#tabs").tabs("refresh"); // Refreshing tab widget to recognize new tab
        }

        // Refresh tabs after potentially re-selecting an active tab / hiding a tab
        $("#tabs").tabs("refresh"); 
    });
}

// Generates table based on previously validated inputs
function generateTable(inputs) {
    $("#tabs").show();

    const [minRow, maxRow, minCol, maxCol] = inputs;
    const table = document.createElement('table');

    // Generate table using + 1 length to row and columns for the headers
    for (let i = minRow - 1; i <= maxRow; i++) {
        const row = table.insertRow();

        for (let j = minCol - 1; j <= maxCol; j++) {
            let cell = row.insertCell();
            // Row header
            if(i < minRow && j >= minCol) {
                const columnHeader = document.createElement('th');
                columnHeader.appendChild(document.createTextNode(j))
                cell.appendChild(columnHeader);
            // Column header
            } else if(j < minCol && i >= minRow) {
                const rowHeader = document.createElement('th');
                rowHeader.appendChild(document.createTextNode(i))
                cell.appendChild(rowHeader);
            // Actual datapoint / not a header
            } else if (i >= minRow && j >= minCol) {
                cell.appendChild(document.createTextNode(i * j));
            }
        }
    }

    // Insert the generated table in a div
    const tc = document.createElement('div');
    $(tc).attr('class', 'table-container');
    $(tc).append(table);

    return tc;
}

// Updates the selected tab
function updateCurrentTable() {
    const id = cur_tabs[activeTabID()];
    const inputs = parseInputs();
    const t = generateTable(inputs);
    const title = inputs[0] + " x " + inputs[1] + '<br>' + inputs[2] + ' x ' + inputs[3]

    // Replace active tab's content with new table
    const tab = $("#tab-container").children()[cur_tabs.indexOf(id)];
    $(tab).children().first().replaceWith(t);

    // Update tab title
    $("#tabs ul li a").eq(activeTabID()).html(title);  
    $("#tabs").tabs("refresh"); // Likely an unneccesary refresh
}

/*  Generates and selects a new tab
    Source: https://stackoverflow.com/questions/14702631/in-jquery-ui-1-9-how-do-you-create-new-tabs-dynamically
    The documentation provided was outdated, and does not work for the current version of jquery (at least the version I found) */
function createNewTab(new_table) {
    const inputs = parseInputs();

    // Div containing new tab content
    const new_content = document.createElement('div');
    new_content.id = `tab${num_tabs}`;
    new_content.append(new_table);

    // Adds new tab to list
    const title = inputs[0] + " x " + inputs[1] + '<br>' + inputs[2] + ' x ' + inputs[3]
    $("#tabs ul").append("<li> <i id=" + num_tabs + " class='bi bi-x'></i> <input type='checkbox' class='ckbx'> <a href='#tab" + num_tabs + "'>" + title  + "</a></li>");
    $("#tab-container").append(new_content);

    $("#tabs").tabs("refresh"); // Refreshing tab widget to recognize new tab
    $("#tabs").tabs("option", "active", cur_tabs.length); // Selects latest tab
    
    // Manage internal representation of tabs
    cur_tabs.push(num_tabs)
    num_tabs ++;

    $("#tabs").tabs("refresh"); // Refresh tabs after selecting new tab
}

// Returns the index of our active tab
function activeTabID() {
    return $("#tabs").tabs("option", "active");
}

// Returns inputs as an array of integers
function parseInputs() {
    return ($.map(inputElements, el => parseInt(el.value)))
}