// import xModal from '../xModalV2.js';

const exemplo1 = new xModal.create({
    el: '#exemplo1',
    resize: true,
    // resize: {
    //     topLeft: true,
    //     buttonRight: true
    // }
});

const exemplo2 = new xModal.create({
    el: '#exemplo2',
    title: 'Exemplo 2',
    width: 400,
    height: 200
});

const exemplo3 = new xModal.create({
    el: '#exemplo3',
    title: 'Exemplo 3',
    left: 80,
    top: 500
});

const exemplo4 = new xModal.create({
    el: '#exemplo4',
    title: 'Exemplo 4',
    closeBtn: false
});

const exemplo5 = new xModal.create({
    el: '#exemplo5',
    title: 'Exemplo 5',
    fullScreen: true
});

const exemplo6 = new xModal.create({
    el: '#exemplo6',
    title: 'Exemplo 6',
    theme: 'xModal-dark'
});

const exemplo7 = new xModal.create({
    el: '#exemplo7',
    title: 'Exemplo 7',
    buttons: {
        cancelar: {
            html: 'Cancelar',
            class: 'left',
            click: () => {
                exemplo7.close();
            }
        },
        confirmar: {
            html: 'Confirmar',
            class: 'right myClass',
            click: () => {
                alert('Botão confirmar pressionado!');
            }
        }
    }
});

const exemplo8 = new xModal.create({
    el: '#exemplo8',
    title: 'Exemplo 8',
    onOpen: () => {
        alert('Abrindo janela!');
    },
    onClose: () => {
        alert('Fechando janela!');
    }
});

const exemplo9 = new xModal.create({
    el: '#exemplo9',
    title: 'Exemplo 9',
    execAfter: {
        time: 15,
        btn: 'fechar'
    },
    buttons: {
        teste: {
            html: 'teste',
            click: () => { }
        },
        fechar: {
            html: 'Fechar',
            click: () => {
                exemplo9.close();
            }
        }
    }
});

const exemplo10 = new xModal.create({
    el: '#exemplo10',
    title: 'Exemplo 10',
    onKeyDown: {
        '13': (e) => { alert('Enter pressionado!') },
        'ctrl+13': (e) => { alert('ctrl + enter pressionado!') },
        'ctrl+shift+13': (e) => { alert('ctrl + shift + Enter pressionado!') },
        'ctrl+shift+alt+13': (e) => { alert('ctrl + shift + alt + Enter pressionado!') },
    }
});

function openExemplo1() {
    exemplo1.open();
}

function openExemplo2() {
    exemplo2.open();
}

function openExemplo3() {
    exemplo3.open();
}

function openExemplo4() {
    exemplo4.open();
}

function openExemplo5() {
    exemplo5.open();
}

function openExemplo6() {
    exemplo6.open();
}

function openExemplo7() {
    exemplo7.open();
}

function openExemplo8() {
    exemplo8.open();
}

function openExemplo9() {
    exemplo9.open();
}

function openExemplo10() {
    exemplo10.open();
}

// function makeResizableDiv(el, topLeft, topRight, buttonLeft, buttonRight) {
//     const element = document.querySelector(el);

//     const conteinerDiv = document.createElement('div')

//     let constCss = 'width: 10px;height: 10px;border-radius: 50%;background: white;border: 3px solid #4286f4;position: absolute;'

//     if (topLeft != false) {
//         const topLeftDiv = document.createElement('div')
//         topLeftDiv.classList.add('top-left', 'resizer')
//         topLeftDiv.style = 'left: -5px;top: -5px;cursor: nwse-resize;' + constCss
//         conteinerDiv.appendChild(topLeftDiv)
//     }

//     if (topRight != false) {
//         const topRightDiv = document.createElement('div')
//         topRightDiv.classList.add('top-right', 'resizer')
//         topRightDiv.style = 'right: -5px;top: -5px;cursor: nesw-resize;' + constCss
//         conteinerDiv.appendChild(topRightDiv)
//     }

//     if (buttonLeft != false) {
//         const buttonLeftDiv = document.createElement('div')
//         buttonLeftDiv.classList.add('bottom-left', 'resizer')
//         buttonLeftDiv.style = 'left: -5px;bottom: -5px;cursor: nesw-resize;' + constCss
//         conteinerDiv.appendChild(buttonLeftDiv)
//     }

//     if (buttonRight != false) {
//         const buttonRightDiv = document.createElement('div')
//         buttonRightDiv.classList.add('bottom-right', 'resizer')
//         buttonRightDiv.style = 'right: -5px;bottom: -5px;cursor: nwse-resize;' + constCss
//         conteinerDiv.appendChild(buttonRightDiv)
//     }

//     conteinerDiv.classList.add('resizers')
//     element.appendChild(conteinerDiv)

//     const resizers = conteinerDiv.querySelectorAll('.resizer')

//     const minimum_size = 20;
//     let original_width = 0;
//     let original_height = 0;
//     let original_x = 0;
//     let original_y = 0;
//     let original_mouse_x = 0;
//     let original_mouse_y = 0;

//     for (let i = 0; i < resizers.length; i++) {

//         resizers[i].addEventListener('mousedown', function (e) {
//             e.preventDefault()
//             original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
//             original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
//             original_x = element.getBoundingClientRect().left;
//             original_y = element.getBoundingClientRect().top;
//             original_mouse_x = e.pageX;
//             original_mouse_y = e.pageY;
//             window.addEventListener('mousemove', resize)
//             window.addEventListener('mouseup', stopResize)
//         })

//         function resize(e) {
//             if (resizers[i].classList.contains('bottom-right')) {
//                 const width = original_width + (e.pageX - original_mouse_x)
//                 const height = original_height + (e.pageY - original_mouse_y)
//                 if (width > minimum_size) element.style.width = width + 'px'
//                 if (height > minimum_size) element.style.height = height + 'px'
//             }
//             else
//                 if (resizers[i].classList.contains('bottom-left')) {
//                     const height = original_height + (e.pageY - original_mouse_y)
//                     const width = original_width - (e.pageX - original_mouse_x)
//                     if (height > minimum_size) element.style.height = height + 'px'
//                     if (width > minimum_size) {
//                         element.style.width = width + 'px'
//                         element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
//                     }
//                 }
//                 else
//                     if (resizers[i].classList.contains('top-right')) {
//                         const width = original_width + (e.pageX - original_mouse_x)
//                         const height = original_height - (e.pageY - original_mouse_y)
//                         if (width > minimum_size) element.style.width = width + 'px'
//                         if (height > minimum_size) {
//                             element.style.height = height + 'px'
//                             element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
//                         }
//                     }
//                     else {
//                         const width = original_width - (e.pageX - original_mouse_x)
//                         const height = original_height - (e.pageY - original_mouse_y)
//                         if (width > minimum_size) {
//                             element.style.width = width + 'px'
//                             element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
//                         }
//                         if (height > minimum_size) {
//                             element.style.height = height + 'px'
//                             element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
//                         }
//                     }
//         }

//         function stopResize() {
//             window.removeEventListener('mousemove', resize)
//         }
//     }
// }

// makeResizableDiv('#exemplo1')



window.openExemplo1 = openExemplo1;
window.openExemplo2 = openExemplo2;
window.openExemplo3 = openExemplo3;
window.openExemplo4 = openExemplo4;
window.openExemplo5 = openExemplo5;
window.openExemplo6 = openExemplo6;
window.openExemplo7 = openExemplo7;
window.openExemplo8 = openExemplo8;
window.openExemplo9 = openExemplo9;
window.openExemplo10 = openExemplo10;
