
let typeChange = document.getElementById('type');
let typegame =  document.getElementById('typegameboard');
let selec = ``;

window.onload = () => {

    axios.get('http://localhost:3000/algumacoisa')
    .then(response => {
        // console.log(response.data);
        response.data.forEach(element => {
            selec += `<option value="${element._id}"> ${element.name} </option>`;
        });
        typegame.innerHTML = selec;
    });

}

typeChange.onchange = () => {

    if(typeChange.value === 'boardgame'){

      typegame.setAttribute('style','display:inherith;');
      typegame.innerHTML = selec;

    } else if( typeChange.value === 'cardgame'){

      typegame.setAttribute('style','display:inherith;');
      typegame.innerHTML = `
      <option value="magic"> Magic The Gathering</option>
      <option value="yugioh"> Yu-Gi-Oh</option>
      `;

    } else {
      typegame.setAttribute('style','display:none;');
      typegame.innerHTML='';
    }

};