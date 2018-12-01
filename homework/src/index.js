'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status < 400) {
        cb(null, xhr.response);
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error('Network request failed'));
    xhr.send();
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach((key) => {
      const value = options[key];
      if (key === 'text') {
        elem.innerText = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } /*else {
        createAndAppend('pre', root, { text: JSON.stringify(data, null, 2) });
    }*/
    data.sort((a, b) => a.name.localeCompare(b.name));

    selectRepository(data) //1repository list callback
    descriptiveBlock(data[0]);
    contributorsList(data[0]);

    document.getElementById("repoList").onchange = function(){
        let selectedItemIndex = this.options[this.selectedIndex].value;
        let table = document.getElementById("descriptionContent");
        table.parentNode.removeChild(table);
        let contributors = document.getElementById('contributorsBlock');
        contributors.parentNode.removeChild(contributors);

        descriptiveBlock(data[selectedItemIndex])
        contributorsList(data[selectedItemIndex])
    }//listener

    }); //fetch JSON
  }//main

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);

//------------1 Repository List
  function selectRepository(array){
    const header = document.getElementById('top')
    createAndAppend('p', header, {text: "HYF Repositories: ", class: "title"} );
    createAndAppend('select', header, {id : "repoList"});
    let listRoot = document.getElementById('repoList');
    for(let i = 0 ; i < array.length; i++){
      createAndAppend('option', listRoot, { text: array[i].name, value: i} )
    }  
  }
//-------------1
 

function descriptiveBlock(element){
    //creating table for repository overwiew 
    let table = createAndAppend("table", description, {id: "descriptionContent"});
    let repoRow = createAndAppend("tr", table);
    //creating row for repository and link 
    createAndAppend("td", repoRow, {text:"Repository:"})
    let repoLink = createAndAppend("td", repoRow, );
    createAndAppend("a", repoLink, {href: element.html_url,text: element.name , target: "_blank"})
    //creating row for repo description 
    let descriptionRow = createAndAppend("tr", table);
    createAndAppend("td", descriptionRow, {text:"Description:"})
    createAndAppend("td", descriptionRow, {text: element.description});
    //creating row for forks
    let forkRow = createAndAppend("tr", table);
    createAndAppend("td", forkRow, {text:"Fork:"})
    createAndAppend("td", forkRow, {text: element.forks_count});
    // creating 'last time updated' row 
    let updatedRow = createAndAppend("tr", table);
    createAndAppend("td", updatedRow, {text:"Updated:"})
    let date =  new Date (element.updated_at); 
    date = date.toUTCString();
    createAndAppend("td", updatedRow, {text:date});
}//end funtion descriptiveBlock

function contributorsList(element){
    fetchJSON(element.contributors_url, (err, data) => {
        createAndAppend('div', root, {id: "contributorsBlock", class: "block"});
        createAndAppend("p", contributorsBlock, {class: "title" , text: "Contributors"} );
        let ul = createAndAppend("ul", contributorsBlock, {id: "contributorsList"});
       
        for(let i = 0; i<data.length; i++){
            let li = createAndAppend("li",ul, {class: "contributorItem"} );
            createAndAppend("img", li, {src:data[i].avatar_url, class: "contributorsAvatar"}) 
            createAndAppend("a", li, {text: data[i].login, href:data[i].html_url, target: "_blank", class:"contributorName"});
            createAndAppend("p", li,{text: data[i].contributions, class:"contributorBadge"} );
        }
    });
}//end function contributorsList
  
}
