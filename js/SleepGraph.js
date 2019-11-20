"use strict";

function displayChart() {
    var AccessToken = getAccessToken();
    var SleepTab = getSleepData(AccessToken);
    
    var fallingAsleepDuration = getFallingAsleepDuration(SleepTab);
    var sleepDuration = getSleepDuration(SleepTab);
    console.log(fallingAsleepDuration);
    console.log(sleepDuration);
    
    // date List (X) ==> Récupérer la date exacte
    var date;
    var enddateymd = new Date.now();

    for (var day = 0; day < 6; day++) {
        var d = new Date();
        d.setDate(enddateymd.getDate() - 6 + day);
        date[day] = d.toDateString();
    }
    console.log(date);

    // Create Graph
    var myChart = echarts.init(document.getElementById('sleepchart'));
    var option = {
        title: {
            text: "Sleep monitoring"
        },
        legend: {
            data: ['date', 'hours']
        },
        series: [{
            type: 'line',					
            data: [6, 7, 7.5, 8, 7, 7.4, 7.3],
            name: 'Sleep Duration'

        }, {
            type: 'line',
				
            data: [0.5, 1, 1, 0.2, 0.8, 1, 1.3],
            name: 'Falling asleep Duration'

        }],
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} hours'
            },
            maxInterval: 0.5
        },
        xAxis: {
            type: 'category',
            bundaryGap: false,
            categories: date
        },
        tooltip: {
            trigger: 'axis'
        }
    };

    myChart.setOption(option);
}

    // Get Authorisation code and Access Token - Return Access Code (string)
    function getAccessToken() {

        // Path Parameters
        var client_id = 'a7036bab0c2585592d4b7410bb9e4b76fc316cfca05f7ed2709aeefbbbe3264f';
        var client_secret = '1f992430981aa97da2dea42c837e1f347bd5a4ca0a8b4fca8a3fe4e86e6a0479';
        var scope = ['https://wbsapi.withings.net/v2/user.activity'];
        
        // quelle url de callback ???
        var redirect_uri = 'http://localhost:80/SleepSensor';



        var Withings_client = new jso.JSO({            
            client_id: client_id,
            response_type: 'code',
            client_secret: client_secret,
            token: "https://account.withings.com/oauth2/token",
            authorization: 'https://account.withings.com/oauth2_user/authorize2',
            redirect_uri: redirect_uri,
            scopes: {request: ['user.activity'], require: ['user.activity']},
            debug: true,
            request: 1
        });

        Withings_client.callback();

        Withings_client.getToken({  client_id: client_id,
                                    response_type: 'code',
                                    client_secret: client_secret,
                                    redirect_uri: redirect_uri,
                                    scopes: {request: ['user.activity'], require: ['user.activity']},
                                    token: "https://account.withings.com/oauth2/token"}).then((token)=>{
            console.log("I got the token: ", token)
        });

    }

    // Get Sleep Data - Return tab 
    function getSleepData(AccessToken) {
        var enddateymd = new Date.now();
        var startdateymd = new Date();
        startdateymd.setDate(enddateymd.getDate() - 6);

        // get sleep data (7 days)
        var Url = "https://wbsapi.withings.net/v2/sleep?" + "action=getsummary" + "&startdateymd=" + startdateymd + "&enddateymd=" + enddateymd + "&data_fields=" + data_fields;

        var request = new XMLHttpRequest();
        request.open("GET", Url, false);
        request.setRequestHeader("Authorization: Bearer ", AccessToken);

        request.send();
        var res = request.responseXML.series;
        console.log(res);
        return res;
    }

    // Get Falling asleep duration data - Return Tab
    function getFallingAsleepDuration(res) {
        var SleepTab = [];
        for (var i = 0; i < res.length; i++) {
            SleepTab[i] = (res[i]['durationtosleep'])/360;
        }
        console.log(SleepTab);
        return SleepTab;   
    }

    // Get Sleep duration
    function getSleepDuration(res) {
        var SleepTab = [];
        for (var i = 0; i < res.length; i++) {
            SleepTab[i] = (res[i]['deepsleepduration'] + res[i]['remsleepduration'] + res[i]['lightsleepduration']) / 360;
        }
        console.log(SleepTab);
        return SleepTab;
    }
