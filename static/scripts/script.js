var myRealTime = new Realtime(
        "/json/location.json",
        1000,
        10000,
        true,
        function (data) {
            document.getElementById("vehicle").innerHTML = JSON.stringify(data);
        }
);

var myRealTimeShip = new Realtime(
    "/json/location_ship.json",
    3000,
    10000,
    true,
    function (data) {
        document.getElementById("ship").innerHTML = JSON.stringify(data);
    }
);
