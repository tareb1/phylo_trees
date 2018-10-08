$(document).ready(function() {      
    var related_gene = 
        [
            [0, 15489, 11842, 11565, 11949, 4725, 795, 3420, 276],  // cow
            [15489, 0, 11347, 11150, 11311, 4479, 2700, 3152, 235],  // chimp   
            [11842, 11347, 0, 11262, 10882, 4017, 2491, 2864, 232],  // turtle
            [11565, 11150, 11262, 0, 10526, 4135, 2432, 2879, 228],  // chicken
            [11949, 11311, 10882, 10526, 0, 4248, 2742, 3119, 245],  // frog
            [4725, 4479, 4017, 4135, 4348, 0, 2243, 2587, 232],  // Fruit Flies
            [2915, 2700, 2491, 2432, 2742, 2243, 0, 8175, 315],  // potato
            [3420, 3152, 2864, 2879, 3119, 2587, 8175, 0, 431],  // moss
            [276, 235, 232, 228, 245, 232, 335, 431, 0]   // m.jan
        ]

    var com_ancestors =
        [
            [0, 97.5, 320.5, 320.5, 355.7, 847, 1514, 1514, 4290],
            [97.5, 0, 320.5, 320.5, 355.7, 847, 1514, 1514, 4290],
            [320.5, 320.5, 0, 252.6, 355.7, 847, 1514, 1514, 4290],
            [320.5, 320.5, 252.6, 0, 355.7, 847, 1514, 1514, 4290],
            [355.7, 355.7, 355.7, 355.7, 0, 847, 1514, 1514, 4290],
            [847, 847, 847, 847, 847, 0, 1514, 1514, 4290],
            [1514,  1514, 1514, 1514, 1514, 1514, 0, 557, 4290],
            [1514, 1514, 1514, 1514, 1514, 1514, 551, 0, 4290],
            [4290, 4290, 4290, 420, 4290, 4290, 4290, 4290, 0]
        ]

    var state = 0;

    var width = 850, height = 450;

    var svg = d3.select("#visualization_1").append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append('g')
        .attr('transform', 'translate(50, 50)');

    var tree = d3.layout.tree()
        .size([270, 270]);

    var species_1 = $('#sp_1');
    var species_2 = $('#sp_2');

    var c1;
    var c2;

    createTimeline(270, 400, 520, 400);


    // create timeline
    d3.json('/data/data.json', function(error, data) {

        var nodes = tree.nodes(data);     
        var links = tree.links(nodes);

        var node = svg.selectAll('#chart .node')
            .data(nodes)
            .enter()
            .append('g')
                .attr('class', 'node')
                .attr('transform', function(d) { return 'translate(' + (d.y + 237)  + ',' + (d.x + 100) + ')';})
                .on('click', function(d) {
                    show_descrip(d, links);
                })

        node.append('circle')
            .attr('r', function(d) {return d.radius})
            .attr('fill', 'steelblue')
            .on('mouseover', function(d) {
                d3.select('#image_tooltip')
                    .transition()
                    .duration(50)
                    .style('left', (d.y + 245) + 'px')
                    .style('top',  (d.x + 15) + 'px')
                    .style('background-image', 'url("./img/' + d.image + '")')
                    .style('opacity', 1)               
            })
            .on('mouseout', function(d) {
                d3.select('#image_tooltip')
                    .transition()
                    .duration(100)
                    .style('opacity', 0)
            })

        node.append('text')
            .text(function(d) { return d.name;})
            .attr('x', 17)
            .attr('y', 6)
            .style('font-weight', 'bold');
  

        var diagonal = d3.svg.diagonal()
            .projection(function(d) { return [d.y + 230, d.x + 100]; });


        svg.selectAll('path.link')
            .data(links)
            .enter()
            .append('path')
            .attr('class', 'link')
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('d', diagonal);
    })

    function createTimeline(x1, y1, x2, y2) {
        svg.append('line')
            .attr('class', 'timeline_line')
            .style('stroke', '#808080')
            .style('stroke-width', 2)
            .attr('x1', x1)
            .attr('y1', y1)
            .attr('x2', x2)
            .attr('y2', y2);

        svg.append('line')
            .attr('class', 'timeline_arrow1')
            .style('stroke', '#808080')
            .style('stroke-width', 2)
            .attr('x1', 510)
            .attr('y1', 405)
            .attr('x2', 520)
            .attr('y2', 400);

        svg.append('line')
            .attr('class', 'timeline_arrow2')
            .style('stroke', '#808080')
            .style('stroke-width', 2)
            .attr('x1', 510)
            .attr('y1', 395)
            .attr('x2', 520)
            .attr('y2', 400);


        svg.append('text')
            .attr('class', 'left_text')
            .text('Ancestors')
            .attr('x', 210)
            .attr('y', 403)
            .style('fill', '#808080')
            .style('font-size', '9pt')
            .style('font-style', 'italic')
            // .style('font-weight', 'bold');

        svg.append('text')
            .attr('class', 'right_text1')
            .text('Present-Day')
            .attr('x', 530)
            .attr('y', 393)
            .style('font-size', '9pt')
            .style('fill', '#808080')
            .style('font-style', 'italic')

            // .style('font-weight', 'bold');

        svg.append('text')
            .attr('class', 'right_text2')
            .text('Species')
            .attr('x', 545)
            .attr('y', 410)
            .style('fill', '#808080')
            .style('font-size', '9pt')
            .style('font-style', 'italic')

            // .style('font-weight', 'bold');
    }

    function shiftTimelineRight() {
        d3.select('.timeline_line')
            .transition()
            .duration(500)
            .attr('x1', 270)
            .attr('x2', 520)

        d3.select('.timeline_arrow1')
            .transition()
            .duration(500)
            .attr('x1', 510)
            .attr('x2', 520)

        d3.select('.timeline_arrow2')
            .transition()
            .duration(500)
            .attr('x1', 510)
            .attr('x2', 520)

        d3.select('.left_text')
            .transition()
            .duration(500)
            .attr('x', 210)

        d3.select('.right_text1')
            .transition()
            .duration(500)
            .attr('x', 530)

        d3.select('.right_text2')
            .transition()
            .duration(500)
            .attr('x', 540)
    }

    function shiftTimelineLeft() {
        d3.select('.timeline_line')
            .transition()
            .duration(500)
            .attr('x1', 90)
            .attr('x2', 340)

        d3.select('.timeline_arrow1')
            .transition()
            .duration(500)
            .attr('x1', 330)
            .attr('x2', 340)

        d3.select('.timeline_arrow2')
            .transition()
            .duration(500)
            .attr('x1', 330)
            .attr('x2', 340)

        d3.select('.left_text')
            .transition()
            .duration(500)
            .attr('x', 30)

        d3.select('.right_text1')
            .transition()
            .duration(500)
            .attr('x', 350)

        d3.select('.right_text2')
            .transition()
            .duration(500)
            .attr('x', 360)
    }


    function show_descrip(data) {

        highlight_link(data, data.depth, data.color);

        if (state == 0) {

            c1 = data;

            $('#sp_1 h4').text(data.name.toUpperCase());            
            $('#sp_1 p').text(data.description);
            $('#sp_1 h6').text(data.genes + " GENES");

            // shift tree to the left
            var diagonal_new = d3.svg.diagonal()  
                .projection(function(d) { return [d.y + 55, d.x + 100]; });

            svg.selectAll('path.link')
                .transition()
                .duration(500)
                .attr('d', diagonal_new)


            d3.selectAll('.node')
                .transition()
                .duration(500)
                .attr('transform', function(d) { return 'translate(' + (d.y + 62)  + ',' + (d.x + 100) + ')';})

            d3.selectAll('.node')
                .on('mouseover', function(d) {

                    d3.select('#image_tooltip')
                        .transition()
                        .duration(50)
                        .style('left', (d.y + 70) + 'px')
                        .style('top',  (d.x + 15) + 'px')
                        .style('background-image', 'url("./img/' + d.image + '")')
                        .style('opacity', 1)               
                })
                .on('mouseout', function(d) {
                    d3.select('#image_tooltip')
                        .transition()
                        .duration(100)
                        .style('opacity', 0)
                })

            // shift timeline to the left
            shiftTimelineLeft()

            $('#sp_1').animate({
               top: '160px',
               opacity: 1
            })
        }

        if (state == 1) {
            var filled_display;
            var empty_display;

            if ($('#sp_1 h4').text().length > 0) { 
                filled_display = '#sp_1';
                empty_display = '#sp_2';
            }

            if ($('#sp_2 h4').text().length > 0) {
                filled_display = '#sp_2';
                empty_display = '#sp_1';
            }

            if ($(filled_display + ' h4').text() == data.name.toUpperCase()) {
                state = -1;
                $(filled_display + ' h4').empty();
                $(filled_display + ' p').empty();
                $(filled_display + ' h6').empty();

                // shift tree back to the center
                var diagonal_new = d3.svg.diagonal()  
                    .projection(function(d) { return [d.y + 230, d.x + 100]; });
                svg.selectAll('path.link')
                    .transition()
                    .duration(500)
                    .attr('d', diagonal_new)


                d3.selectAll('.node')
                    .transition()
                    .duration(500)
                    .attr('transform', function(d) { return 'translate(' + (d.y + 237)  + ',' + (d.x + 100) + ')';})


                // node hover 
                d3.selectAll('.node')
                .on('mouseover', function(d) {

                    d3.select('#image_tooltip')
                        .transition()
                        .duration(50)
                        .style('left', (d.y + 245) + 'px')
                        .style('top',  (d.x + 15) + 'px')
                        .style('background-image', 'url("./img/' + d.image + '")')
                        .style('opacity', 1)               
                })
                .on('mouseout', function(d) {
                    d3.select('#image_tooltip')
                        .transition()
                        .duration(100)
                        .style('opacity', 0)
                })

                // shift timeline back to the center
                shiftTimelineRight();

                if (filled_display == '#sp_1') {
                    $('#sp_1').animate({
                       top: '-100px',
                       opacity: 0
                    })
                } else {
                    $('#sp_2').animate({
                       top: '160px',
                       opacity: 0
                    })
                }

                // unhighlight tree
                unhighlight_link(data, data.depth);

            } else {

                if (empty_display == '#sp_1') {
                    c1 = data
                } else {
                    c2 = data
                }


                $(empty_display + ' h4').text(data.name.toUpperCase());
                $(empty_display + ' p').text(data.description);
                $(empty_display + ' h6').text(data.genes + " GENES");


                $('#sp_1').animate({
                   top: '15px',
                   opacity: 1
                })

                $('#sp_2').animate({
                   top: '265px',
                   opacity: 1
                })

                // append circles
                svg.append('circle')
                    .attr('id', 'species_1')
                    .attr('cx', '623px')
                    .attr('cy', '215px')
                    .attr('r', 0)
                    .transition()
                    .duration(1000)
                    .attr('fill', c1.color)
                    .style('opacity', 0.5)
                    .attr('r', c1.gene_rad);
                                    
                svg.append('circle')
                    .attr('id', 'species_2')
                    .attr('cx', '648px')
                    .attr('cy', '215px')
                    .attr('r', 0)
                    .transition()
                    .duration(1000)
                    .attr('fill', c2.color)
                    .style('opacity', 0.5)
                    .attr('r', c2.gene_rad)

                // show related genes
                d3.select('#rg_left')
                    .transition()
                    .duration(1000)
                    .style('opacity', 1)

                setTimeout(function() {
                    d3.select('#rg_left h5')
                        .text(related_gene[c1.id][c2.id]);

                    d3.select('#com_ances span')
                        .text(com_ancestors[c1.id][c2.id]);
                }, 250)
 
                d3.select('#rg_right')
                    .transition()
                    .duration(1000)
                    .style('opacity', 1);

                // appeend common_ancestor
                d3.select('#com_ances')
                    .transition()
                    .duration(1000)
                    .style('opacity', 1);
            }
        }

        if (state == 2) {
            if (data.name.toUpperCase() == $('#sp_1 h4').text()) {
                $('#sp_1 h4').empty();
                $('#sp_1 p').empty();
                $('#sp_1 h6').empty();

                $('#sp_1').animate({
                   top: '-100',
                   opacity: 0
                })

                $('#sp_2').animate({
                   top: '160',
                   opacity: 1
                })

                //unhighlight links
                unhighlight_link(data, data.depth);
                highlight_link(c2, c2.depth, c2.color);

            } else if (data.name.toUpperCase() == $('#sp_2 h4').text()) {
                $('#sp_2 h4').empty();
                $('#sp_2 p').empty();
                $('#sp_2 h6').empty();

                $('#sp_1').animate({
                   top: '165',
                   opacity: 1
                })

                $('#sp_2').animate({
                   top: '490',
                   opacity: 0
                })

                //unhighlight links
                unhighlight_link(data, data.depth);
                highlight_link(c1, c1.depth, c1.color);

            } else {
                c1 = data;

                $('#sp_2 h4').empty();
                $('#sp_2 p').empty();
                $('#sp_2 h6').empty();

                $('#sp_1 h4').text(data.name.toUpperCase());
                $('#sp_1 p').text(data.description);
                $('#sp_1 h6').text(data.genes + " GENES");

                $('#sp_1').animate({
                   top: '160px',
                   opacity: 1
                })

                $('#sp_2').animate({
                   top: '490px',
                   opacity: 0
                })

                unhighlight_link(data, 0);
                highlight_link(data, data.depth, data.color);

            }

            d3.select('#species_1')
                .transition()
                .duration(500)
                .attr('r', 0)
                .remove()

            d3.select('#species_2')
                .transition()
                .duration(500)
                .attr('r', 0)
                .remove()

            d3.select('#rg_left')
                .transition()
                .duration(500)
                .style('opacity', 0)

            d3.select('#rg_right')
                .transition()
                .duration(500)
                .style('opacity', 0);

            // appeend common_ancestor
            d3.select('#com_ances')
                .transition()
                .duration(500)
                .style('opacity', 0);

            state = 0;

        }

        state++;
    }

    function highlight_link(node, depth, color) {

        var source_node;
        if (depth == 1) {
            d3.selectAll(".link")
                .filter(function(d) {
                    return d.target === node;
                })
                .style("stroke", color)
                .style('stroke-width', '5px')
                .style('opacity', 0.8);
        } else {
            d3.selectAll(".link")
                .filter(function(d) {
                    if (d.target === node) {
                        source_node = d.source;
                        return d;
                    }
                })
                .style("stroke", color)
                .style('stroke-width', '5px ')
                .style('opacity', 0.8);

            highlight_link(source_node, source_node.depth, color);
        }
    }

    function unhighlight_link(node, depth) {

        var source_node;
        if (depth == 0) {
            d3.selectAll('.link')
                .style("stroke", '#bdbdbd')
                .style('stroke-width', '1px')
                .style('opacity', 1);

        } else if (depth == 1) {
            d3.selectAll(".link")
                .filter(function(d) {
                    return d.target === node;
                })
                .style("stroke", '#bdbdbd')
                .style('stroke-width', '1px')
                .style('opacity', 1);

        } else {
            d3.selectAll(".link")
                .filter(function(d) {
                    if (d.target === node) {
                        source_node = d.source;
                        return d;
                    }
                })
                .style("stroke", '#bdbdbd')
                .style('stroke-width', '1px')
                .style('opacity', 1);

            unhighlight_link(source_node, source_node.depth);
        }
    }
});


