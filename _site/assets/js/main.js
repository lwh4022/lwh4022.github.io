document.addEventListener('DOMContentLoaded', function() {
  var elem = document.querySelector('.sidenav');
  var instance = M.Sidenav.init(elem)
  document.querySelector("[data-target=slide-out]").addEventListener('click', function(){
    instance.open();
  })
});

