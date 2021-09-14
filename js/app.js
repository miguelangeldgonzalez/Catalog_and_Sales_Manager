export function get(url, callBack = () => {}, json = false){
    fetch(url)
        .then(r => json ? r.json() : r.text())
        .then(r => {callBack(r)});
}
export function postForm(url, form, callBack = () => {}, json = false){
    let data = new FormData(form);
	fetch(url, {method : "POST", body: data})
        .then(r => json ? r.json() : r.text())
        .then(r => {callBack(r)});
}
export function post(url, data, callBack, json = true){
	let dataForm = new FormData();
	let keys = Object.keys(data);

	for(let i = 0; i < keys.length; i++){
		dataForm.append(keys[i], data[keys[i]]);
	}

	fetch(url, {method : "POST", body: dataForm})
        .then(r => json ? r.json() : r.text())
        .then(r => {callBack(r)});
}

export function s(element){
    let selection = document.querySelectorAll(element);
    
    if(selection.length == 1){
        return selection[0];
    }else{
        return selection;
    }
}