import React, {useEffect} from 'react';
import * as d3 from 'd3';

export default function PieChart(props) {
    const {
        name,
        data,
        outerRadius,
        innerRadius,
        type
    } = props;

    const colorScale = d3
        .scaleSequential()
        .interpolator(type == 0 ? d3.interpolateReds : d3.interpolateGreens)
        .domain([0, data.length]);

    useEffect(() => {
        drawChart();
    }, [data]);

    function drawChart() {
        // Remove the old svg
        d3.select(`#${name}`)
            .select('svg')
            .remove();

        // Create new svg
        const svg = d3
            .select(`#${name}`)
            .append('svg')
            .attr('width', "100%")
            .attr('height', "100%")
            .attr("viewBox", "-100, -100, 200, 200")
            .append('g')
        //.attr('transform', `translate(${width / 2}, ${height / 2})`);

        const arcGenerator = d3
            .arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        const pieGenerator = d3
            .pie()
            .padAngle(0)
            .value((d) => d.value);

        const arc = svg
            .selectAll()
            .data(pieGenerator(data))
            .enter();

        // Append arcs
        arc
            .append('path')
            .attr('d', arcGenerator)
            .style('fill', (_, i) => colorScale(i))
            .style('stroke', '#ffffff')
            .style('stroke-width', 0);

        // Append text labels
        arc
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .text((d) => d.data.label)
            .style('fill', (_, i) => colorScale(data.length - i))
            .attr('transform', (d) => {
                const [x, y] = arcGenerator.centroid(d);
                return `translate(${x}, ${y})`;
            });
    }

    return <div id={name}/>;
}