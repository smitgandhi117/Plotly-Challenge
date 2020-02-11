// Belly Button Biodiversity - app.js

// Building the Dashboard
function buildDash() {
    var testID = d3.select("#sel1").node().value;
    console.log(testID);
    d3.select('#demog').text("");
    buildMetadata(testID);
    buildCharts(testID);
};

// Building the Metadata 
function buildMetadata(sample) {

    // Using d3.json to Fetch the Metadata for a Sample
    d3.json('data/samples.json').then((data) => {
        // Use d3 to Select the Panel with id of `#sample-metadata`
        console.log(data)
        var metadata = data.metadata.filter(function(d) { return d.id == sample; })[0];
        console.log(metadata)
        var P = d3.select("#demog");
        Object.entries(metadata).forEach(([key, value]) => {
            P.append("p").text(`${key}:${value}`);
        });

        // Building Gauge Chart
        buildGauge(metadata.wfreq);
    });
};

// Building th bar and bubble graphs
function buildCharts(sample) {
    // Using d3.json to Fetch the Sample Data for the Plots
    d3.json('data/samples.json').then((data) => {
        // Build a the graph and Bubble Chart Using the Sample Data
        let samples = data.samples.filter(function(d) { return d.id == sample; })
            .sort(function compareFunction(firstNum, secondNum) { return secondNum - firstNum; })[0];
        let otu_ids = samples.otu_ids.slice(0, 10);
        let otu_labels = samples.otu_labels.slice(0, 10);
        let sample_values = samples.sample_values.slice(0, 10);

        // Create the data array for the bubble plot
        var bub_Data = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }];

        // Define the bubble plot layout
        var bub_Layout = {
            margin: { t: 0 },
            hovermode: "closests",
            height: 600,
            width: 1600,
            xaxis: {
                title: "OTU ID",
                zeroline: true
            },
            yaxis: {
                zeroline: true,
            },
            font: {
                size: 25
            }
        }

        Plotly.newPlot("bbl-plot", bub_Data, bub_Layout);
        var ticks = otu_ids.map(element => `OTU ${element}`);
        // Creating the trace using sample_values
        var trace = {
            y: ticks,
            x: sample_values,
            type: "bar",
            orientation: "h"
        };

        // Create the data array for the bar plot
        var data = [trace];

        // Define the bar plot layout
        var layout = {
            autosize: false,
            height: 800,
            width: 450,
            margin: {
                l: 100,
                r: 10,
                b: 20,
                t: 30,
                pad: 0
            },
            font: {
                size: 18,
                weight: 'bold'
            },
            yaxis: {
                autorange: 'reversed',
            },

            config: {
                'displayModeBar': true
            },
        };

        // Plot the chart to a div tag with id "bar-plot"
        Plotly.newPlot("bar-plot", data, layout);
    });
};

// Handeling the Change
d3.selectAll("#sel1").on("change", buildDash);

// Creating an function to initialize the dashboard
function init() {
    // Grab a Reference to the Dropdown Select Element
    var selector = d3.select("#sel1");

    // Use the List of Sample Names to Populate the Select Options
    d3.json('data/samples.json').then((data) => {
        let sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Use the First Sample from the List to Build Initial Plots
        var firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
};

// Initialize the Dashboard
init();