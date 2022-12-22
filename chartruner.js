const url = 'wss://fstream.binance.com/ws/';
const soket = new WebSocket(url);
const subscribe = {"method": "SUBSCRIBE", "params": ['ethusdt@trade', 'btcusdt@trade'], "id": 1}
const tradesElement = document.getElementById('trades')

const baseFapiUrl = 'https://fapi.binance.com'
const tradesEndpoint = '/fapi/v1/historicalTrades'


var chart = LightweightCharts.createChart(document.getElementById('chart'), {
	width: 700,
    height: 700,
	layout: {
		backgroundColor: '#000000',
		textColor: '#ffffff',
	},
	grid: {
		vertLines: {
			color: '#404040',
		},
		horzLines: {
			color: '#404040',
		},
	},
	crosshair: {
		mode: LightweightCharts.CrosshairMode.Normal,
	},
	priceScale: {
		borderColor: '#cccccc',
	},
	timeScale: {
		borderColor: '#cccccc',
		timeVisible: true,
	},
});

const Http = new XMLHttpRequest();
Http.open ("GET", 'https://fapi.binance.com/fapi/v1/trades?symbol=BTCUSDT&limit=1000');
Http. send();
var lastTrades = [];
//onreadystatechange
Http.onloadend=(e)=>{
    lastTrades = JSON.parse(Http.responseText);
    displayData = [];

    var count = 0;
    var lastTime =0;
    lastTrades.forEach(element => {
        try{
            var trade;
            if (count==0) {
                trade = { time: parseInt(element.time), open: element.price, high: element.price, low: element.price, close: element.price };
            } else {
                trade = { time: parseInt(element.time), open: lastTrades[count-1].price, high: element.price, low: element.price, close: element.price };
            }
            if(lastTime!=element.time){
                displayData.push(trade);
            }
            count++
            lastTime=element.time
        }
        catch(e){
            console.log(count);
            console.log(e);
        }
        

    
    });

    const candlestickSeries = chart.addCandlestickSeries();
    candlestickSeries.setData(displayData);
    console.log(lastTrades[0]);
    chart.timeScale().fitContent();
}


soket.onopen = function() {
    console.log('soket opened');
    soket.send(JSON.stringify(subscribe));
}

soket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    //console.log(data);

    const tradeElement = document.createElement('div');
    tradeElement.className = 'trade'
    tradeElement.innerHTML = `<b>${data.T}<b> ${data.p} ${data.q}`
    tradesElement.appendChild(tradeElement)

    var elements = document.getElementsByClassName('trade')
    if(elements.length>10){
        tradesElement.removeChild(elements[0])
    }

    
}