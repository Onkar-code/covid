$(document).ready(function(){
    let covidPerCountryRaw = {
        'recovered' : undefined,
        'deaths' : undefined,
        'confirmed' : undefined,
        'date' : undefined,
    };

    let covidPerCountry = [{}];
    let arrayAPICovidResults = [];
    getCountryAPI();

    let arrayAPICovidResultsDate = arrayAPICovidResults;
    let dateFrom = $('.date-from').val();
    let dateTo =  $('.date-to').val();

    console.log(dateFrom);
    console.log(dateTo);

    $('.date-from').change( async () => {
        arrayAPICovidResultsDate;
        let data = []

        //await chargeChart(data);
    })

    $('.date-to').change( async () => {
        arrayAPICovidResultsDate;
        let data = []
        //await chargeChart(data);
    })


    $("#countries").change( async function() {
        let country = $('#countries').find(":selected").text();
        let slug = $('#countries').val();
        $('#country').html(`${country}`);
        await getCovidPerCountryData(slug, "recovered");
        await getCovidPerCountryData(slug, "deaths");
        await getCovidPerCountryData(slug, "confirmed");
        console.log(arrayAPICovidResults);
        
        if (arrayAPICovidResults.length > 0 ) {
            await chargeChart(arrayAPICovidResults);
        }else{
            noResult();
        }
        
        arrayAPICovidResults = [];

    });
    
    function getCountryAPI(){
        $.get("https://api.covid19api.com/countries", response => {
            let countries = sortArray(response);
            template = '';
            countries.forEach( country => {
                $('#countries').append(`<option value="${country.Slug}">${country.Country}</option>`);
            })
        })
    }
    async function getCovidPerCountryData(slug, status){
        const result = await $.ajax({
            method: "GET",
            dataType: "json",
            data: '',
            url: `https://api.covid19api.com/total/country/${slug}/status/${status}`,
        });
        
        if ( result != null) {
            if (arrayAPICovidResults.length == 0) {
                result.forEach(r => {
                    arrayAPICovidResults.push([{ "recovered": r.Cases}]);
                });
            }
            else {
                for (let i = 0; i<arrayAPICovidResults.length; i++){
                    if ( result[i].Status == "deaths"){
                        arrayAPICovidResults[i].push({ "deaths" : result[i].Cases})
                        arrayAPICovidResults[i].push({ "date" : result[i].Date})
                    }else{
                        arrayAPICovidResults[i].push({ "confirmed" : result[i].Cases})
                    }
                }
            }
        }else{
            console.log(slug);
        }
        //fillcovidPerCountryRaw(result, status);
    }   

    function noResult(){
        $('#chartdiv').html('<h1>No results Found</h1>')
    }

    async function chargeChart(arrayAPICovidResults){
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end
        
        // Create chart instance
        var chart = am4core.create("chartdiv", am4charts.XYChart);
        
        //
        
        // Increase contrast by taking evey second color
        chart.colors.step = 2;
        
        // Add data
        chart.data = generateChartData();
        
        // Create axes
        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 50;
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        
        // Create series
        function createAxisAndSeries(field, name, opposite, bullet) {
        //   var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        //   if(chart.yAxes.indexOf(valueAxis) != 0){
        //       valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
        //   }
          
          var series = chart.series.push(new am4charts.LineSeries());
          series.dataFields.valueY = field;
          series.dataFields.dateX = "date";
          series.strokeWidth = 2;
          series.yAxis = valueAxis;
          series.name = name;
          series.tooltipText = "{name}: [bold]{valueY}[/]";
          series.tensionX = 0.8;
          series.showOnInit = true;
          
          var interfaceColors = new am4core.InterfaceColorSet();
          
          switch(bullet) {
            case "triangle":
              var bullet = series.bullets.push(new am4charts.Bullet());
              bullet.width = 12;
              bullet.height = 12;
              bullet.horizontalCenter = "middle";
              bullet.verticalCenter = "middle";
              
              var triangle = bullet.createChild(am4core.Triangle);
              triangle.stroke = interfaceColors.getFor("background");
              triangle.strokeWidth = 2;
              triangle.direction = "top";
              triangle.width = 12;
              triangle.height = 12;
              break;
            case "rectangle":
              var bullet = series.bullets.push(new am4charts.Bullet());
              bullet.width = 10;
              bullet.height = 10;
              bullet.horizontalCenter = "middle";
              bullet.verticalCenter = "middle";
              
              var rectangle = bullet.createChild(am4core.Rectangle);
              rectangle.stroke = interfaceColors.getFor("background");
              rectangle.strokeWidth = 2;
              rectangle.width = 10;
              rectangle.height = 10;
              break;
            default:
              var bullet = series.bullets.push(new am4charts.CircleBullet());
              bullet.circle.stroke = interfaceColors.getFor("background");
              bullet.circle.strokeWidth = 2;
              break;
          }
          
          valueAxis.renderer.line.strokeOpacity = 1;
          valueAxis.renderer.line.strokeWidth = 2;
          valueAxis.renderer.line.stroke = series.stroke;
          valueAxis.renderer.labels.template.fill = series.stroke;
          valueAxis.renderer.opposite = opposite;
        }
        
        createAxisAndSeries("confirmed", "Confirmed", false, "circle");
        createAxisAndSeries("deaths", "Deaths", true, "triangle");
        createAxisAndSeries("recovered", "Recovered", true, "rectangle");
        
        // Add legend
        chart.legend = new am4charts.Legend();
        
        // Add cursor
        chart.cursor = new am4charts.XYCursor();
        
        // generate some random data, quite different range
        function generateChartData() {
          let chartData = []
          arrayAPICovidResults.forEach( item => {
            date = item[2].date;
            confirmed = item[3].confirmed;
            deaths = item[1].deaths;
            recovered = item[0].recovered;
            
            chartData.push({
                date: date,
                confirmed: confirmed,
                deaths: deaths,
                recovered: recovered
            });
          });

          console.log(chartData)
          return chartData;
        }
    }
    function fillcovidPerCountryRaw(data, status){
        // console.log(data);
        
        for (let i = 0; i<100; i++){
            //reset if already has values
            // if ( covidPerCountry.lenght == 0) {
            // }
            var c = {
                'recovered' : undefined,
                'deaths' : undefined,
                'confirmed' : undefined,
                'date' : undefined,
            };

            switch (data[i].Status) {
                case "recovered":
                    c.recovered = data[i].Cases
                    break;
                case "confirmed":
                    c.confirmed = data[i].Cases
                    break;
                case "deaths":
                    c.deaths = data[i].Cases
                    break;
            }
            //var result = Object.keys(c).map((key) => [String(key), c[key]]);
            //console.log(c);
            covidPerCountry.push(c);
        }
        console.log(covidPerCountry)
        debugger;
    }

    function sortArray(myArray){
        myArray.sort((a,b) => (a.Country > b.Country) ? 1 : ((b.Country > a.Country) ? -1 : 0))
        return myArray;
    }

});
