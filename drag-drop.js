var names = document.querySelectorAll('.names .name');
[].forEach.call(names, function(name) {
  name.addEventListener('dragstart', function(e) {
      e.dataTransfer.setData("text/name", name.innerHTML)
  })
}) 

function hasData(type, e) {
    return (e.dataTransfer.types[0] == type)
}

function onLeave(e) {
    e.target.classList.remove("dragover")
}

var namesTarget = document.getElementById("namesTarget")

namesTarget.addEventListener('dragover', function(e) {
    if (!hasData("text/name", e)) return
    e.preventDefault()
    return false
})

namesTarget.addEventListener('dragenter', function(e) {
    if (!hasData("text/name", e)) return
    e.target.classList.add("dragover")
})

namesTarget.addEventListener('dragleave', onLeave)
namesTarget.addEventListener('drop', function(e) {

    var namesTarget =  document.getElementById('namesTarget');
    if(namesTarget.getElementsByClassName('name') && namesTarget.getElementsByClassName('name').length < 40 ) {
        var data = e.dataTransfer.getData("text/name")
        var blockid = 'block' + (namesTarget.getElementsByClassName('name').length + 1);
        namesTarget.innerHTML += "<div id='" + blockid + "' class='name block-style' onclick='deleteBlock(\"" + blockid + "\")' >" + data + "</div>";    

    }
  
    onLeave(e)
})

function deleteBlock(blockid) {
    var block = document.getElementById(blockid);
    block.remove();
}

