var myRealTime = new Realtime(
        "/json/location.json",
        1000,
        10000,
        true
);

var myRealTimeShip = new Realtime(
    "/json/location_ship.json",
    3000,
    10000,
    true
);
