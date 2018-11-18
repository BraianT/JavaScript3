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

    //blocks of content within the descriptive block
    createAndAppend("div", description, {id: "description1"});
    createAndAppend("h5", description1, {id:"repository", text: "Repository: ", class: "headings"});
    createAndAppend("p", description1, {id: "repositoryName", class:"text" });
    let repositoryName = document.getElementById("repositoryName");

    createAndAppend("div", description, {id: "description2"});
    createAndAppend("h5", description2, {id:"descriptionTitle", text: "Descritpion: ", class: "headings"});
    createAndAppend("p", description2, {id:"descriptionText", class:"text" });
    let descriptionText = document.getElementById("descriptionText")

    createAndAppend("div", description, {id:"description3"});
    createAndAppend("h5", description3, {id:"fork", text: "Forks: ", class: "headings"});
    createAndAppend("p", description3, {id: "forkText", class: "text" });
    let forkText = document.getElementById("forkText")

    createAndAppend("div", description, {id:"description4"});
    createAndAppend("h5", description4, {id:"update", text:"Updated: ", class: "headings"});
    createAndAppend("p", description4, {id:"updateText", class:"text" });
    let updateText = document.getElementById("updateText")


    let repoName = [];
    let repoDescription= [];
    let repoFork = [];
    let repoUpdate = [];
    let repoContributor = [];

    //Extracting data and distributing content

    for (let i = 0; i < data.length; i++) {
      repoName.push(data[i].name);
      repoDescription.push(data[i].description);
      repoFork.push(data[i].forks);
      repoUpdate.push(data[i].updated_at);
      repoContributor.push(data[i].contributors_url);
    }

    selectOptions(repoName)

    let select = document.getElementById("select");
    select.addEventListener("change", function(e) {
      let option = this.options[selectedIndex].value;
      printRepoContent(repoContributor, option, repoName, repoDescription, repoFork, repoUpdate);
      const i = e.target.value;
      getContributors(right, data[i])
     })
    });
  }//main

  //create the element option within the element "select", assign the indexes name as value of "option"
  function selectOptions(name) {
    let select = document.getElementById("repositories");

    for (let i = 0; i < name.length; i++) {
      let option = document.createElement("option");
      option.value = i;
      option.text = name[i];
      select.appendChild(option);
    }
  }

  //fill the content of the descritive block
  function printRepoContent(arr, option, name, description, forks, update){
    for(let i = 0; i < arr.length; i++){
      if(option == i){
        repositoryName.innerHTML = "<a href= '#' target='_blank'>" + name[i] + "</a>";
        descriptionText.innerHTML = description[i];
        forkText.innerHTML = forks[i];
        updateText.innerHTML = update[i];
      }
    }
  }

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}
