let typeChange = document.getElementById('type');
let typegame =  document.getElementById('typegameboard');
let selec = `<option selected value="none"> Find by Game </option>`;

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
      typegame.setAttribute('style','display:inherit;');
      typegame.innerHTML = selec;
    } else if( typeChange.value === 'cardgame'){
      typegame.setAttribute('style','display:inherit;');
      typegame.innerHTML = `
      <option selected value="none"> Find by Game </option>
      <option value="Magic: The Gathering"> Magic The Gathering</option>
      <option value="Yu-Gi-Oh"> Yu-Gi-Oh</option>
      `;
    } else {
      typegame.setAttribute('style','display:none;');
      typegame.innerHTML='';
    }
};