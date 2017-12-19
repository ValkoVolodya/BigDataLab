
fs = require('fs');

// TODO: some config
const THEME_TYPE = "theme";
const COURSE_TYPE = "course";
const SEMESTER_TYPE = "semester";
const YEAR_TYPE = "year";
const EMPTY_TYPE = "empty";

const EMPTY_EDGE_TYPE = "emptyEdge";
const SPECIAL_EDGE_TYPE = "specialEdge";

const NODE_TYPES = [
  THEME_TYPE,
  COURSE_TYPE,
  SEMESTER_TYPE,
  YEAR_TYPE,
  EMPTY_TYPE,
]

const TYPES_BORDERS = {
    YEAR: 10,
    SEMESTER: 19,
    COURSE: 100,
    THEME: 10000,
}

function csvJS(csv){
    
    var lines=csv.split("\n");

    var result = [];

    var headers=lines[0].split(",");

    for(var i=1;i<lines.length;i++){

        var obj = {};
        var currentline=lines[i].split(",");

        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }

        result.push(obj);

    }
    return result;
}

let graph = {
    nodes: [],
    edges: [],
}

let lastX = {
    YEAR_TYPE: 0,
    SEMESTER_TYPE: 0,
    COURSE_TYPE: 0,
    THEME_TYPE: 0,
}

function processData(data) {
    let nodes = csvJS(data);
    console.log(nodes);
    let edges = [];
    nodes = nodes.map((node) => {
        //rework it in future
        if (node.id < TYPES_BORDERS.YEAR) {
            lastX.YEAR_TYPE += 8000;
            return {
                id: Number(node.id),
                parentId: Number(node.parentId),
                priority: node.priority,
                type: YEAR_TYPE,
                title: node.title,
                y: 500,
                x: Number(lastX.YEAR_TYPE),
            };
        }
        if (node.id < TYPES_BORDERS.SEMESTER) {
            lastX.SEMESTER_TYPE += 8000;
            return {
                id: Number(node.id),
                parentId: Number(node.parentId),
                priority: node.priority,
                type: SEMESTER_TYPE,
                title: node.title,
                y: 1000,
                x: Number(lastX.SEMESTER_TYPE),
            };
        }
        if (node.id < TYPES_BORDERS.COURSE) {
            lastX.COURSE_TYPE += 1000;
            return {
                id: Number(node.id),
                parentId: Number(node.parentId),
                priority: node.priority,
                type: COURSE_TYPE,
                title: node.title,
                y: 1500,
                x: Number(lastX.COURSE_TYPE),
                prevId: Number(node['prevId\r']) || 0,
            };
        }
        if (node.id < TYPES_BORDERS.THEME) {
            lastX.THEME_TYPE += 100;
            return {
                id: Number(node.id),
                parentId: Number(node.parentId),
                priority: node.priority,
                type: THEME_TYPE,
                title: node['title\r'],
                y: 2000,
                x: Number(lastX.THEME_TYPE),
            };
        }
        return node;
    });
    nodes.map((node) => {
        if (node.parentId === 0) {
            return;
        }
        if (node.parentId) {
            edges.push({
                source: Number(node.parentId) || 2,
                target: Number(node.id),
                type: EMPTY_EDGE_TYPE,
            });
        }
        if (node.prevId) {
            edges.push({
                source: Number(node.prevId) || 2,
                target: Number(node.id),
                type: EMPTY_EDGE_TYPE,
            });
        }
    });
    nodes.push({
        "id": 0,
        "title": "Node A",
        "x": 258.3976135253906,
        "y": 331.9783248901367,
        "type": COURSE_TYPE
    });
    graph.nodes = graph.nodes.concat(nodes);
    graph.edges = graph.edges.concat(edges);

    fs.writeFile('../dist/graph.json', JSON.stringify(graph), 'utf8', (err) => {
        if (err) {
            return console.log('Some shit happened(');
        }
        console.log('Result is written to dist/graph.json ');
    });
}

const files = {
    courses: './data/courses.csv',
    firstThemes: './data/themes1.csv',
    secondThemes: './data/themes2.csv',
    thirdThemes: './data/themes3.csv',
}

for (const prop in files) {
    processData(fs.readFileSync(files[prop], 'utf-8'));
}