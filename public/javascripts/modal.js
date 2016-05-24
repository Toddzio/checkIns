   var element = $(this);
    var map;

    function initialize(myCenter) {
        var marker = new google.maps.Marker({
            position: myCenter
        });

      var mapProp = {
            center: myCenter,
            zoom: 17,
            //draggable: false,
            //scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById("map-canvas"), mapProp);
        marker.setMap(map);
    };

        $('#myMapModal').on('shown.bs.modal', function(e) {
        var element = $(e.relatedTarget);
        var data = element.data("lat").split(',')
        initialize(new google.maps.LatLng(data[0], data[1]));
    });
