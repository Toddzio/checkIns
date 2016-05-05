$(function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
            console.log("this is working");
        } else { 
            alert("Hey, at least something is happening")
        }
    function showPosition(position) {
      console.log(position.coords.latitude);
      $("#lat").val(position.coords.latitude);
      $("#long").val(position.coords.longitude)
    }
});