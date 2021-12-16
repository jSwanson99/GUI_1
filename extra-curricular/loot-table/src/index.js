const nodeField = $("#inputNode");
const itemField = $("#inputItem");
const lbidField = $("#inputLBID");
const searchNodesBtn = $("#searchNodes");
const searchItemsBtn = $("#searchItems");
const searchBucketsBtn = $("#searchBuckets");

let loottables, lootbuckets, names;
const _ltid = "LootTableID";

$(document).ready(() => {
    loottables = require("../json/javelindata_loottables.json");
    lootbuckets = require("../json/javelindata_lootbuckets.json");
    names = getNames();

    $(searchNodesBtn).on("click", function () {
        const query = nodeField.val();
        const nodes = searchNodes(query);
        updateTable(nodes, "#nodeTable");
    });

    $(searchItemsBtn).on("click", function () {
        const query = itemField.val();
        const nodes = searchItems(query);
        updateTable(nodes, "#itemTable");
    });

    $(searchBucketsBtn).on("click", function () {
        const query = lbidField.val();
        const buckets = searchBuckets(query);
        updateTable(buckets, "#bucketTable");
    });
});

function searchBuckets(query) {
    const bucketIDs = Object.keys(lootbuckets[0])
        .filter((key) => key.indexOf("LootBucket") !== -1)
        .filter((key) => lootbuckets[0][key].indexOf(query) !== -1)
        .map((key) => parseInt(key.slice("LootBucket".length)));
    return bucketIDs.map((id) => {
        return [
            id,
            lootbuckets.map((bucket) => {
                return Object.keys(bucket)
                    .map((key) => key === "Item" + id)
                    .map(key => bucket[key])
                }),
        ];
    });
}

function searchNodes(query) {
    return names
        .filter((el) => el.indexOf("_") === -1)
        .filter((el) => el.indexOf(query) !== -1)
        .map((el) => [
            el,
            loottables[names.indexOf(el)]["LuckSafe"] ? true : false,
        ]);
}

function searchItems(query) {
    // Loot tables that might contain our item
    return (
        loottables
            .filter((el) => el[_ltid].indexOf("_") === -1)
            .filter((el) => {
                for (let key of Object.keys(el))
                    if (
                        keyContains(key, "Item") &&
                        valueContains(el, key, query)
                    )
                        return true;
                return false;
            })
            // Builds structure: [LTID, [drop_matches], [drop_rates], [drop_qty]]
            .map((obj) => {
                // Important keys in each object
                const itemKeys = Object.keys(obj).filter(
                    (key) =>
                        keyContains(key, "Item") &&
                        valueContains(obj, key, query)
                );
                return [
                    obj[_ltid],
                    // Filters out keys that do not contain "Item*": "*query*"
                    itemKeys.map((key) => {
                        return [
                            obj[key],
                            loottables.filter(
                                (tb) => tb[_ltid] === obj[_ltid] + "_Probs"
                            )[0][key],
                        ];
                    }),
                ];
            })
    );
}

function updateTable(tableData, table) {
    console.log(tableData);
    $(table).html("");
    tableData.forEach((entry) => {
        const newRow = $("<tr> </tr>");
        entry.forEach((el, i) => {
            console.log(el);
            if (i === 0) newRow.append(`<th scope="row"> ${el} </th>`);
            else if (el.length > 1) {
                el.forEach((e) =>
                    newRow.append(
                        `<tr> <th scope="row"></th> <td>${e}</td> </tr>`
                    )
                );
            } else newRow.append(`<td> ${el} </td>`);
        });
        $(table).append(newRow);
    });
}

function getNames() {
    return loottables.map((el) => el[_ltid]);
}

function valueContains(obj, key, phrase) {
    if (typeof obj[key] === "string" && obj[key].indexOf(phrase) !== -1) {
        return true;
    }
    return false;
}

function keyContains(key, phrase) {
    return key.indexOf(phrase) !== -1;
}
