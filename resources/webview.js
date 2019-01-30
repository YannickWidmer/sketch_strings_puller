// Disable the context menu to have a more native feel
/* document.addEventListener("contextmenu", function(e) {
  e.preventDefault();
}); */



window.addElement = function (name, index) {

  var node = document.createElement("LI");                 // Create a <li> node
  node.innerHTML = `<a href="#">${name}</a>`
  //var textnode = document.createTextNode(name);         // Create a text node
  //node.appendChild(textnode);
  node.addEventListener('click', function () {
    window.postMessage('selected', index)
  })
  document.getElementById('list').appendChild(node);
}



//window.postMessage('nativeLog', name);