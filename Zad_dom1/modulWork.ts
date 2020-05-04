export function appendSubmit(father : HTMLElement, value : string) : HTMLInputElement{
    let submit = document.createElement('input');
    submit.setAttribute('type', 'submit');
    submit.setAttribute('value', value);
    father.appendChild(submit);
    return submit;
}