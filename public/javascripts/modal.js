// // $(document).ready(function(){
// // 	console.log("things");
// //    $('#exampleModal').on('show.bs.modal', function (event) {
// //   var button = $(event.relatedTarget) // Button that triggered the modal
// //   var recipient = button.data('lat') // Extract info from data-* attributes
// //   // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
// //   // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
// //   var modal = $(this)
// //   modal.find('.modal-title').text('New message to ' + recipient)
// //   modal.find('.modal-body input').val(recipient)
// // })
// // });

// var map;        
//             var myCenter=new google.maps.LatLng(53, -1.33);
// var marker=new google.maps.Marker({
//     position:myCenter
// });

// function initialize() {
//   var mapProp = {
//       center:myCenter,
//       zoom: 14,
//       draggable: false,
//       scrollwheel: false,
//       mapTypeId:google.maps.MapTypeId.ROADMAP
//   };
  
//   map=new google.maps.Map(document.getElementById("map-canvas"),mapProp);
//   marker.setMap(map);
    
//   google.maps.event.addListener(marker, 'click', function() {
      
//     infowindow.setContent(contentString);
//     infowindow.open(map, marker);
    
//   }); 
// };
// google.maps.event.addDomListener(window, 'load', initialize);

// google.maps.event.addDomListener(window, "resize", resizingMap());

// $('#myMapModal').on('show.bs.modal', function() {
//    //Must wait until the render of the modal appear, thats why we use the resizeMap and NOT resizingMap!! ;-)
//    resizeMap();
// })

// function resizeMap() {
//    if(typeof map =="undefined") return;
//    setTimeout( function(){resizingMap();} , 400);
// }

// function resizingMap() {
//    if(typeof map =="undefined") return;
//    var center = map.getCenter();
//    google.maps.event.trigger(map, "resize");
//    map.setCenter(center); 
// }

var map;        
var myCenter=new google.maps.LatLng(53, -1.33);
var marker=new google.maps.Marker({
    position:myCenter
    });

function initialize() {
  var mapProp = {
      center:myCenter,
      zoom: 14,
      draggable: false,
      scrollwheel: false,
      mapTypeId:google.maps.MapTypeId.ROADMAP
  };
  
map=new google.maps.Map(document.getElementById("map-canvas"),mapProp);
  marker.setMap(map);
    
  google.maps.event.addListener(marker, 'click', function() {
      
    infowindow.setContent(contentString);
    infowindow.open(map, marker);
    
  }); 
};
google.maps.event.addDomListener(window, 'load', initialize);

google.maps.event.addDomListener(window, "resize", resizingMap());

$('#myMapModal').on('show.bs.modal', function() {
   //Must wait until the render of the modal appear, thats why we use the resizeMap and NOT resizingMap!! ;-)
   resizeMap();
})

function resizeMap() {
   if(typeof map =="undefined") return;
   setTimeout( function(){resizingMap();} , 400);
}

function resizingMap() {
   if(typeof map =="undefined") return;
   var center = map.getCenter();
   google.maps.event.trigger(map, "resize");
   map.setCenter(center); 
}