let typeChange = document.getElementById('type');
let typegame =  document.getElementById('typegameboard');
let typegb = document.getElementById('typegb');
let selec = ``;

window.onload = () => {
    axios.get('http://tableflips.herokuapp.com/getgames')
    .then(response => {
        response.data.forEach(element => {
            selec += `<option value="${element._id}"> ${element.name} </option>`;
        });
        typegame.innerHTML = selec;
    });
};

typeChange.onchange = () => {
    if(typeChange.value === 'boardgame'){
      typegb.setAttribute('style','display:inherit;');
      typegame.setAttribute('style','display:inherit;');
      typegame.innerHTML = selec;
    } else if( typeChange.value === 'cardgame'){
      typegb.setAttribute('style','display:inherit;');
      typegame.setAttribute('style','display:inherit;');
      typegame.innerHTML = `
      <option value="Magic: The Gathering"> Magic The Gathering</option>
      <option value="Yu-Gi-Oh"> Yu-Gi-Oh</option>
      `;
    } else {
      typegb.setAttribute('style','display:none;');
      typegame.setAttribute('style','display:none;');
      typegame.innerHTML='';
    }
};