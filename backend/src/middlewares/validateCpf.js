function validateCPF(cpf){
    //remove digitos
    cpf = cpf.replace(/\D/g, '');

    //verifica tamanho (obrigatoriamente 11 digitos)
    if (cpf.length !== 11) return false;

    if(/^(\d)\1{10}$/.test(cpf)) return false;

    //calcula o primeiro digito de verificacao
    let soma = 0
    for(let i = 0;i < 9;i++) {
        soma += parseInt(cpf[i]) * (10 - i);
    }
    let resto = (soma* 10) % 11;
    if(resto === 10|| resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) return false;

    //calcula o segundo digito de verificacao
    soma = 0;
    for(let i = 0;i < 10;i++){
        soma += parseInt(cpf[i] * (11 - i));
    }
    resto = (soma * 10) % 11;
    if(resto === 10 || resto === 11) resto = 0;
    if(resto !== parseInt(cpf[10])) return false;

    return true;

}

module.exports = validateCPF;