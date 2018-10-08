$(function() {


    var descrip_data = [
        {"term": "Root", "id": "root", "description" : "The root of a phylogenetic tree represents a series of ancestors leading up to the most recent common ancestor of all the species represented in that tree. "},
        {"term": "Node", "id": "node", "description" : "A node is a branch point that represents a divergence event where a lineage splits into two different descendant groups."},
        {"term": "Sister Groups", "id":"sister", "description" : "Sister groups are two monophyletic groups that are each other’s closest relatives."},
        {"term": "Terminal Node","id":"terminal", "description" : "A terminal node is a node that appears as a branch tip on a phylogenetic tree"},
        {"term": "Character", "id": "chara_2","description" : "A character is a recognizable feature of an organism."}
    ]

    var descript = "";

    var state = 0;

	var width = 850, height = 450;


    // var selectColor = "#386b97";
    var selectColor = "steelblue";
    var selectOpacity = 1;

    var svg = d3.select("#visualization_2").append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append('g')
        .attr('transform', 'translate(50, 50)');

    var tree = d3.layout.tree()
        .size([270, 270]);




    //d3.json('../data/vis2_data.json', function(json) {
     d3.json("./data/vis2_data.json", function(json) {

    	var nodes = tree.nodes(json);
    	var links = tree.links(nodes);


        var node = svg.selectAll('.vis2_node')
            .data(nodes)
            .enter()
            .append('g')
                .attr('class', 'vis2_node')
                .attr('transform', function(d) { return 'translate(' + (d.x + 100)  + ',' + (d.y + 70) + ')';})
 			
 		node.append('circle')
            .attr('r', function(d) {return d.radius})
            .attr('fill', 'grey')
   
        node.append('text')
            .text(function(d) { return d.name;})
            .attr('x', -6)
            .attr('y', '25px')
            .style('font-weight', 'bold')
            .style('font-size', '1rem');

        var diagonal = d3.svg.diagonal()
            .projection(function(d) { return [d.x + 100, d.y + 65]; });

        svg.selectAll('.vis2_link')
            .data(links)
            .enter()
            .append('path')
            .attr('class', 'vis2_link')
            .attr('fill', 'none')
            .attr('stroke', 'lightgrey')
            .attr('stroke-width', '1.5px')
            .attr('d', diagonal);  

        createCharacters('chara', 310, 180);
        createCharacters('chara', 297, 290);


        createCircles(180, 30, 1);
        createCircles(110, 115, 2);
        createCircles(205, 390, 3);
        createCircles(355, 370, 4);
        createCircles(265, 210, 5);

        $('.click_circle').on('click', function() {
            console.log($(this).attr('id'));

            if ($(this).attr('id') == 1) {
                display_description(0, 'root');

            }

            if ($(this).attr('id') == 2) {
                display_description(1, 'node');        
            }

            if ($(this).attr('id') == 3) {
                display_description(2, 'sister');
        
            }

            if ($(this).attr('id') == 4) {
                display_description(3, 'terminal');
                
            }

            if ($(this).attr('id') == 5) {
                display_description(4, 'character');      
            }
        })




 
        createTimeline(65, 80, 65, 365);
        
      //   <line x1="20" y1="100" x2="100" y2="20"
      // stroke-width="2" stroke="black"/>

 	})
    
    function clear_everything() {
        $('#visualization_2 h4').empty();
        $('#visualization_2 p').empty();
        
        $('.character').css('opacity', 0);
        $('#root').css('opacity', 0);
        $('#sister').css('opacity', 0);
        $('#terminal').css('opacity', 0);
        $('#node').css('opacity', 0);  
    }

    function display_description(num, name) {
        console.log("name: " + name);
        if (state == 0) {
            state = 1;

            d3.select('#vis2_description')
                .transition()
                .duration(500)
                .style('opacity', 1);

            $('#visualization_2 h4').text(descrip_data[num].term);
            $('#visualization_2 p').text(descrip_data[num].description);


            if (name == "character") {
                $('.character').css('opacity', 0.3);
            } else {
                d3.select('#' + name)
                    .transition()
                    .duration(500)
                    .style('opacity', 0.35);
            }

            descript = name;
        } else {
            if (descript == name) {
                state = 0;

                d3.select('#vis2_description')
                    .transition()
                    .duration(500)
                    .style('opacity', 0);

                setTimeout(function() {
                    $('#visualization_2 h4').empty();
                    $('#visualization_2 p').empty();                    
                }, 500);


                if (name == "character") {

                    $('.character').css('opacity', 0);
                } else {
                    d3.select('#' + name)
                        .transition()
                        .duration(500)
                        .style('opacity', 0);
                }
                descript = "";
            } else {
                clear_everything();

                d3.select('#vis2_description')
                    .style('opacity', 0)
                    .transition()
                    .duration(700)
                    .style('opacity', 1);

                $('#visualization_2 h4').text(descrip_data[num].term);
                $('#visualization_2 p').text(descrip_data[num].description);
                if (name == "character") {
                    $('.character').css('opacity', 0.3);
                } else {
                   d3.select('#' + name)
                        .transition()
                        .duration(500)
                        .style('opacity', 0.3);
               }
                descript = name;
            }
        }

    }

    function createTimeline(x1, y1, x2, y2) {
        svg.append('line')
            .style('stroke', '#808080')
            .style('stroke-width', 2)
            .attr('x1', x1)
            .attr('y1', y1)
            .attr('x2', x2)
            .attr('y2', y2);

        svg.append('line')
            .style('stroke', '#808080')
            .style('stroke-width', 2)
            .attr('x1', 58)
            .attr('y1', 355)
            .attr('x2', 65)
            .attr('y2', 365);

        svg.append('line')
            .style('stroke', '#808080')
            .style('stroke-width', 2)
            .attr('x1', 72)
            .attr('y1', 355)
            .attr('x2', 65)
            .attr('y2', 365);

        svg.append('text')
            .text('ANCESTORS')
            .attr('x', 22)
            .attr('y', 67)
            .style('fill', '#808080')
            .style('font-size', '11pt')

        svg.append('text')
            .text('PRESENT-DAY')
            .attr('x', 17)
            .attr('y', 390)
            .style('font-size', '11pt')
            .style('fill', '#808080')
            
        svg.append('text')
            .text('SPECIES')
            .attr('x', 37)
            .attr('y', 405)
            .style('fill', '#808080')
            .style('font-size', '11pt')
    }

    function createCharacters(name, x, y) {
        var t = $('<div class="' + name + '"></div>');
        t.css('left', x + 'px');
        t.css('top', y + 'px');
        $('#visualization_2').append(t);
    }

    function createCircles(x, y, id) {
        var t = $('<div id="' + id + '" class="click_circle"></div>');
        var q = $('<span></span>');
        q.css('color', 'white');
        q.text("?");
        t.append(q);

        t.css('padding-top', '2px');
        t.css('background-color', selectColor)
        t.css('width', '30px')
        t.css('height', '30px')
        t.css('border-radius', '50%');
        t.css('left', x + 'px');
        t.css('top', y + 'px');
        $('#visualization_2').append(t);
    }
})