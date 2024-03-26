const divPorcentagem = document.querySelector("#divPorcentagem")
const porcentagem = document.querySelector("#porcentagem")
const estatisticas = document.querySelector("#estatisticas")

const divAddRef = document.querySelector("#addRef")
const btnAddRef = document.querySelector("#btnAddRef")

const divForm = document.querySelector("#divForm")
const form = document.querySelector("#form")
const formInputs = Array.from(document.querySelectorAll("#form input"))
const formDescricao = document.querySelector("#form textarea")
const cadastrar = document.querySelector("#cadastrar")

const formEdit = document.querySelector("#divUpdateRefs")

const nomeEdit = document.querySelector("#nomeEdit")
const descricaoEdit = document.querySelector("#descricaoEdit")
const dataEdit = document.querySelector("#dataEdit")
const horaEdit = document.querySelector("#horaEdit")
const radioSaudavelEdit = document.querySelector('#estaNaDietaEdit')
const radioNaoSaudavelEdit = document.querySelector('#naoEstaNaDietaEdit')

const maiorSequenciaSaudavel = document.querySelector('#sequencia')

let indexDia = 0
let indexRef = 0

const barDown = document.querySelector("#barDown")
const barUp = document.querySelector("#barUp")

const lista = document.querySelector("#lista")

const dias = []


/* CADASTRAR REFEIÇÃO */

cadastrar.addEventListener("click", (e) => {
    
    e.preventDefault()
    
    let agoraEmMilissegundos = new Date().getTime()
    
    if (formCheck() == false) {
        alert("Preencha o Fórmulario")
        return
    }
    
    if (!formInputs[3].checked && !formInputs[4].checked) {
        alert("Indique se o alimento está ou não dentro da dieta")
        return
    }
    
    let ref = {}
        ref.nome = formInputs[0].value
        ref.descricao = descricao.value
        ref.data = formInputs[1].value
        ref.hora = formInputs[2].value
        if(formInputs[3].checked) {
            ref.saudavel = "saudavel"
        } else if (formInputs[4].checked){
            ref.saudavel = "naoSaudavel"
        }
    
    let refEmMilissegundos = Date.parse(ref.data)
    
    if(refEmMilissegundos > agoraEmMilissegundos-10800000) {
        alert('Escolha uma data válida')
        return
    }
    
    /* 10800000 = 3 horas em milissegundos para atingir o horário universal */
    
    if(!dias.some(dia => dia.nome == formInputs[1].value)) {
        
        let novoObj = {}
        novoObj.nome = formInputs[1].value
        novoObj.refs = []
        novoObj.refs.push(ref)
        dias.push(novoObj)
        
    } else {
        
        let index = dias.findIndex(dia => dia.nome == formInputs[1].value)
        dias[index].refs.push(ref)
        
    }
    
    if(ref.saudavel == 'saudavel') {
        divParabens.classList.remove('d-none')
        divParabens.classList.add('d-grid')
    }
    
    if(ref.saudavel == 'naoSaudavel') {
        divCondolencias.classList.remove('d-none')
        divCondolencias.classList.add('d-grid')
    }
    
    updateRefs()
    updateStatics()
    
    divAddRef.style.display = "none"
    divForm.style.display = "none"
    porcentagem.style.display = "none"
    
})

/* Cancelar Cadastro de Refeição */

const cancelarCadastro = document.querySelector("#cancelarCadastro")

cancelarCadastro.addEventListener("click", () => {

    let question = window.confirm('Deseja cancelar o cadastro ?')
    
    if(question == false) {
        return
    } else {
        divAddRef.style.display = "block"
        divForm.style.display = "none"
        porcentagem.style.display = "block"
    }
    
})

/*ATUALIZAR LISTA DE REFEIÇÕES*/

function updateRefs() {

    lista.innerHTML = ""
    
    dias.sort((a,b) => {
        return a.nome < b.nome ? 1 : a.nome > b.nome ? -1: 0;
    })
    
    dias.forEach(dia => {
        
        let tituloDia = document.createElement("p")
        
        tituloDia.classList.add("fs-6", "fw-bold", "mb-0", "ms-1")
        
        let diaToString = dia.nome.toString()
        
        let d = ""
        let m = ""
        let a = ""
        
        for(x = 8; x <= 9; x++) {
            d+= diaToString[x]
        }
        for(x = 5; x <= 6; x++) {
            m+= diaToString[x]
        }
        for(x = 0; x <= 3; x++) {
            a+= diaToString[x]
        }
        
        tituloDia.innerHTML = d + "/" + m + "/" + a
        /*tituloDia.innerHTML = dia.nome*/
        
        lista.appendChild(tituloDia)
        
        dia.refs.sort((a,b) => {
            return a.hora < b.hora ? -1 : a.hora > b.hora ? 1 : 0;
        })
        
        dia.refs.forEach(ref => {
            
            let p = document.createElement("p")
            let bolinha = ""
            
            p.classList.add("w-100", "border-gray", "p-3", "mb-2", "mx-auto", "rounded-3", "row", "p-br", "refeicao")
        
            if (ref.saudavel == "saudavel") {
                bolinha = "bg"
            } else if (ref.saudavel == "naoSaudavel") {
                bolinha = "br"
            }
        
            p.innerHTML = "<span class='col-9 fw-bold fs-6'>" + ref.hora + " | <span class='ms-2 fw-normal'>" + ref.nome + "</span> </span> <div class='col-3 d-flex align-items-center justify-content-center'> <span class='" + bolinha + "' </span> <span class='ms-5 fs-6' style='cursor: pointer;'> <i class='bi bi-pencil-square'> </i> </span> </div>"
        
            lista.appendChild(p)
        
            p.addEventListener('click', () => {
        
                indexDia = dias.findIndex(dia => dia.nome == ref.data)
                indexRef = dia.refs.indexOf(ref)
                
                formEdit.style.display = 'block'
                
                nomeEdit.value = ref.nome
                descricaoEdit.value = ref.descricao
                dataEdit.value = ref.data
                horaEdit.value = ref.hora
                if (ref.saudavel == 'saudavel') {
                    radioSaudavelEdit.checked = true
                } else if (ref.saudavel == 'naoSaudavel') {
                    radioNaoSaudavelEdit.checked = true
                }

                porcentagem.style.display = 'none'
                divAddRef.style.display = 'none'
 
            })
            
        })
        
    })
    
    let seq = []
    
    dias.forEach(dia => {
        dia.refs.forEach(ref => {
            seq.push(ref.saudavel)
        })
    })
    
    let contador = 0
    let maiorSeq = 0
    
    for(x = 0; x < seq.length; x++) {
        
        if (seq[x] == 'saudavel') {
            contador++
            if(maiorSeq < contador) {
                maiorSeq = contador
            }
        } else {
            contador = 0
        }
        
    }
    
    maiorSequenciaSaudavel.innerHTML = maiorSeq
    
}



/* ESTATISTICAS / PORCENTAGEM - CLICK */

porcentagem.addEventListener("click", () => {
    
    if (estatisticas.style.display == "none") {
        estatisticas.style.display = "block"
        divAddRef.style.display = "none"
        barDown.style.display = "none"
        barUp.style.display = "block"
    } else {
        estatisticas.style.display = "none"
        divAddRef.style.display = "block"
        barDown.style.display = "block"
        barUp.style.display = "none"
    }
    
    updateStatics()
    
})


/* Update Estatísticas */

function updateStatics() {

    const porcentagemDeRefeicoesSaudaveis = document.querySelector("#porcentagemDeRefeicoesSaudaveis")

    const refeicoesRegistradas = document.querySelector("#refeicoesRegistradas")

    const refeicoesSaudaveis = document.querySelector("#refeicoesSaudaveis")
    
    const refeicoesNaoSaudaveis = document.querySelector("#refeicoesNaoSaudaveis")
    
    let registradas = 0
    let saudaveis = 0
    let naoSaudaveis = 0
    
    dias.forEach(dia => {
    
        dia.refs.forEach(ref => {
        
            registradas ++
            
            if (ref.saudavel == "naoSaudavel") {
                naoSaudaveis++
            } else if (ref.saudavel == "saudavel") {
                saudaveis++
            }
            
        })
    })
    
    porcentagemDeRefeicoesSaudaveis.innerHTML = ((saudaveis*100) / registradas).toFixed(2)
    
    if (porcentagemDeRefeicoesSaudaveis.innerHTML == 'NaN') {
        porcentagemDeRefeicoesSaudaveis.innerHTML = 0
    }
    
    refeicoesRegistradas.innerHTML = registradas
    refeicoesSaudaveis.innerHTML = saudaveis
    refeicoesNaoSaudaveis.innerHTML = naoSaudaveis
    
    
    
    if (((saudaveis*100) / registradas).toFixed(2) < 50) {
        
        divPorcentagem.classList.remove('bg-lightGreen')
divPorcentagem.classList.remove('bg-lightYellow')
divPorcentagem.classList.add('bg-lightRed')

barUp.classList.remove('text-success')
barUp.classList.remove('text-warning')
barUp.classList.add('text-danger')

barDown.classList.remove('text-success')
barDown.classList.remove('text-warning')
barDown.classList.add('text-danger')
        
    } else if(((saudaveis*100) / registradas).toFixed(2) == 50) {
        
        divPorcentagem.classList.remove('bg-lightGreen')
divPorcentagem.classList.remove('bg-lightRed')
divPorcentagem.classList.add('bg-lightYellow')

barUp.classList.remove('text-success')
barUp.classList.remove('text-danger')
barUp.classList.add('text-warning')

barDown.classList.remove('text-success')
barDown.classList.remove('text-danger')
barDown.classList.add('text-warning')
        
    } else {
        
        divPorcentagem.classList.remove('bg-lightYellow')
divPorcentagem.classList.remove('bg-lightRed')
divPorcentagem.classList.add('bg-lightGreen')

barUp.classList.add('text-success')
barUp.classList.remove('text-warning')
barUp.classList.remove('text-danger')

barDown.classList.add('text-success')
barDown.classList.remove('text-warning')
barDown.classList.remove('text-danger')
        
    }
    
}


/* BOTÃO ADICIONAR REFEIÇÃO */
btnAddRef.addEventListener("click", () => {
    
    form.reset()
    divAddRef.style.display = "none"
    divForm.style.display = "block"
    porcentagem.style.display = "none"
    
})



/* CHECAGEM DE NOME, HORA E DATA */
function formCheck() {

    if (formInputs[0].value == "" || formInputs[1].value == "" || formInputs[2].value == "") return false
    
}

/* FUNÇÃO FORM EDIT CANCEL*/
    document.querySelector('#delete').addEventListener('click', () => {
    
    let deleteConfirm = window.confirm('Deseja excluir a refeição da lista ?')
    
    if (deleteConfirm == false) {
        return
    } else {
        dias[indexDia].refs.splice(indexRef,1)
        
        if(dias[indexDia].refs.length == 0) {
            dias.splice(indexDia, 1)
        }
    }
    
    porcentagem.style.display = 'block'
    divAddRef.style.display = 'block'
    formEdit.style.display = 'none'
    
    updateStatics()
    updateRefs()
    
})

/* FUNÇÃO FORM EDIT SAVE */

document.querySelector('#save').addEventListener('click', () => {

    let agoraEmMilissegundos = new Date().getTime()

    let refAntiga = dias[indexDia].refs[indexRef]

    let novaRef = {}
    novaRef.nome = nomeEdit.value
    novaRef.descricao = descricaoEdit.value
    novaRef.data = dataEdit.value
    novaRef.hora = horaEdit.value
    if(radioSaudavelEdit.checked) {
        novaRef.saudavel = "saudavel"
    } else if (radioNaoSaudavelEdit.checked){
        novaRef.saudavel = "naoSaudavel"
    }
    
    let refEmMilissegundos = Date.parse(novaRef.data)
    
    if(refEmMilissegundos > agoraEmMilissegundos-10800000) {
        alert('Escolha uma data válida')
        return
    }
    
    let existeEsseDia = dias.some(dia => dia.nome == dataEdit.value)
    
    if (novaRef.data == refAntiga.data) {
        
        refAntiga = Object.assign(refAntiga,novaRef)
        
    } else {
        
        if(existeEsseDia == false) {
        
            dias[indexDia].refs.splice(indexRef,1)
            
            let novoDia = {}
            novoDia.nome = novaRef.data
            novoDia.refs = []
            novoDia.refs.push(novaRef)
            dias.push(novoDia)
            
            if(dias[indexDia].refs.length == 0) {
                dias.splice(indexDia, 1)
            }
            
        } else {
        
            dias[indexDia].refs.splice(indexRef,1)
            
            let i = dias.findIndex(dia => dia.nome == dataEdit.value)
            
            dias[i].refs.push(novaRef)
            
            if(dias[indexDia].refs.length == 0) {
                dias.splice(indexDia, 1)
            }
            
        }
        
    }
    
    updateStatics()
    updateRefs()
    
    porcentagem.style.display = 'block'
    divAddRef.style.display = 'block'
    formEdit.style.display = 'none'
    
})

/* FUNÇÃO FORM EDIT CANCEL */

document.querySelector('#cancel-edit').addEventListener('click', () => {

    updateStatics()
    updateRefs()
    
    porcentagem.style.display = 'block'
    divAddRef.style.display = 'block'
    formEdit.style.display = 'none'

})

/* MENSAGEM PARABENS */
const divParabens = document.querySelector("#divParabens")

const btnParabens = document.querySelector("#btnParabens")

btnParabens.addEventListener('click', () => {
    
    divParabens.classList.add('d-none')
    divAddRef.style.display = "block"
    divForm.style.display = "none"
    porcentagem.style.display = "block"
    
})

/* MENSAGEM CONDOLÊNCIAS */
const divCondolencias = document.querySelector("#divCondolencias")

const btnCondolencias = document.querySelector('#btnCondolencias')

btnCondolencias.addEventListener('click', () => {
    
    divCondolencias.classList.add('d-none')
    divAddRef.style.display = "block"
    divForm.style.display = "none"
    porcentagem.style.display = "block"
    
})
