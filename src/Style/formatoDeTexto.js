import moment from "moment";

class FormatoDeTexto
{
    CEP (numero)
    {
        numero = numero.toString().replace( /^\D+/g, "").replace(",", "").replace(".", "")
                 .toString().replace(".", "").replace("-", "");

        switch (numero.length)
        {
            case 1:
                numero = numero.replace(/(\d{1})/, '$1');
                break;
            case 2:
                numero = numero.replace(/(\d{2})/, '$1');
                break;
            case 3:
                numero = numero.replace(/(\d{2})(\d{1})/, '$1.$2');
                break;
            case 4:
                numero = numero.replace(/(\d{2})(\d{2})/, '$1.$2');
                break;
            case 5:
                numero = numero.replace(/(\d{2})(\d{3})/, '$1.$2');
                break;
            case 6:
                numero = numero.replace(/(\d{2})(\d{3})(\d{1})/, '$1.$2-$3');
                break;
            case 7:
                numero = numero.replace(/(\d{2})(\d{3})(\d{2})/, '$1.$2-$3');
                break;
            case 8:
                numero = numero.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2-$3');
                break;
            case 9:
                numero = numero.substring(0, 8).replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2-$3');
                break;
        }

        return numero;
    }
    CPF_CNPJ (numero)
    {
        if (numero == null)
        {
            return "";
        }
        else 
        {
            numero = numero.toString().replace( /^\D+/g, "").replace(",", "").replace(".", "")
            .toString().replace(".", "").replace("-", "").replace("/", "");

            switch (numero.length)
            {
                case 1:
                    numero = numero.replace(/(\d{1})/, '$1');
                    break;
                case 2:
                    numero = numero.replace(/(\d{2})/, '$1');
                    break;
                case 3:
                    numero = numero.replace(/(\d{3})/, '$1');
                    break;
                case 4:
                    numero = numero.replace(/(\d{3})(\d{1})/, '$1.$2');
                    break;
                case 5:
                    numero = numero.replace(/(\d{3})(\d{2})/, '$1.$2');
                    break;
                case 6:
                    numero = numero.replace(/(\d{3})(\d{3})/, '$1.$2');
                    break;
                case 7:
                    numero = numero.replace(/(\d{3})(\d{3})(\d{1})/, '$1.$2.$3');
                    break;
                case 8:
                    numero = numero.replace(/(\d{3})(\d{3})(\d{2})/, '$1.$2.$3');
                    break;
                case 9:
                    numero = numero.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
                    break;
                case 10:
                    numero = numero.replace(/(\d{3})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
                    break
                case 11:
                    numero = numero.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                    break;
                case 12:
                    numero = numero.replace(/(\d{2})(\d{3})(\d{3})(\d{4})/, "$1.$2.$3/$4");
                    break
                case 13:
                    numero = numero.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1})/, "$1.$2.$3/$4-$5");
                    break;
                case 14:
                    numero = numero.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
                    break;
                case 15:
                    numero = numero.substring(0, 14).replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
                    break;
            }

            return numero;
        }
    }
    Telefone (numero)
    {
        if(numero == null)
        {
            return null;
        }
        else
        {
            numero = numero.toString().replace( /^\D+/g, "").replace("+", "").replace("(", "").replace(")", "").replace(" ", "").replace("-", "").toString().replace("+", "").replace("(", "").replace(")", "").replace(" ", "").replace("-", "");
            switch (numero.length)
            {
                case 1:
                    numero = numero.replace(/(\d{1})/, '$1');
                    break;
                case 2:
                    numero = numero.replace(/(\d{2})/, '$1');
                    break;
                case 3:
                    numero = numero.replace(/(\d{2})(\d{1})/, '($1) $2');
                    break;
                case 4:
                    numero = numero.replace(/(\d{2})(\d{2})/, '($1) $2');
                    break;
                case 5:
                    numero = numero.replace(/(\d{2})(\d{3})/, '($1) $2');
                    break;
                case 6:
                    numero = numero.replace(/(\d{2})(\d{4})/, '($1) $2');
                    break;
                case 7:
                    numero = numero.replace(/(\d{2})(\d{5})/, '($1) $2');
                    break;
                case 8:
                    numero = numero.replace(/(\d{2})(\d{5})(\d{1})/, '($1) $2 $3');
                    break;
                case 9:
                    numero = numero.replace(/(\d{2})(\d{5})(\d{1})/, '($1) $2 $3');
                    break;
                case 10:
                    numero = numero.replace(/(\d{2})(\d{5})(\d{1})/, '($1) $2 $3');
                    break;
                case 11:
                    numero = numero.replace(/(\d{2})(\d{5})(\d{1})/, '($1) $2 $3');
                    break;
                case 12:
                    numero = numero.substring(0, 11).replace(/(\d{2})(\d{5})(\d{1})/, '($1) $2 $3');
                    break;
            }
        }

        return numero;
    }
    Moeda (numero)
    {
        if (numero == null || numero == "R$ 0,0" || numero == "R$")
        {
            return null;
        }
        else
        {
            numero = numero.toString().replace( /^\D+/g, "").replace(",", "").replace(".", "").replace(" ", "");
            numero = (numero.length <= 4) ? (parseFloat(numero) / 100).toFixed(2).toString().replace(".", "") : (numero.substr(0, 2) == "00" ? numero.replace("00", "") : numero);

            var Contador = -2;
            var NovoNumero = "";
            numero.replace(".", "").split("").reverse().forEach(Item =>
            {
                if (!isNaN(Item))
                {
                    if (Contador == 0)
                    {
                        NovoNumero += "," + Item;
                    }
                    else
                    {
                        if (Contador== 3)
                        {
                            NovoNumero += '.' + Item;
                            Contador = 0;
                        }
                        else
                        {
                            NovoNumero += Item;
                        }
                        
                    }
                    Contador++;
                }
            })
            numero = NovoNumero.split("").reverse().join("");
            return "R$ " + numero;
        }
    }
    MoedaABSOriginal (numero)
    {
        if (numero == null)
        {
            return null;
        }
        else
        {
            var NovoNumero = "";
            numero.toString().split("").forEach(Item =>
            {
                if (!isNaN(Item))
                {
                    NovoNumero += Item;
                }
            })
            return require("big-integer")(NovoNumero);  
        }
    }
    MoedaOriginal (numero)
    {
        if (numero == null)
        {
            return null;
        }
        else
        {
            numero = numero.toString().replace( /^\D+/g, "").replace(",", "").replace(".", "");
            numero = (numero.length <= 4) ? (parseFloat(numero) / 100).toFixed(2).toString().replace(".", "") : (numero.substr(0, 2) == "00" ? numero.replace("00", "") : numero);

            var Contador = -2;
            var NovoNumero = "";
            numero.replace(".", "").split("").reverse().forEach(Item =>
            {
                if (!isNaN(Item))
                {
                    if (Contador == 0)
                    {
                        NovoNumero += "." + Item;
                    }
                    else
                    {
                        NovoNumero += Item;
                    }
                    Contador++;
                }
            })
            return parseFloat(NovoNumero.split("").reverse().join(""));
        }
    }
    FormatarTexto(TextoNaoFormatado) {
        if (TextoNaoFormatado == null || TextoNaoFormatado == "R$ 0,0" || TextoNaoFormatado == "R$")
        {
            return "R$ 0,00"
        }
        else
        {
            var Contador = -2;
            var NovoNumero = "";
            TextoNaoFormatado.toFixed(2).toString().replace(".", "").split("").reverse().forEach(Item =>
            {
                if (!isNaN(parseFloat(Item)))
                {
                    if (Contador == 0)
                    {
                        NovoNumero += "," + Item;
                    }
                    else
                    {
                        if (Contador== 3)
                        {
                            NovoNumero += '.' + Item;
                            Contador = 0;
                        }
                        else
                        {
                            NovoNumero += Item;
                        }
                        
                    }
                    Contador++;
                }
            })
            return "R$ " + NovoNumero.split("").reverse().join("");
        }
    };
    DesformatarTexto(TextoFormatado) {
        
        if (TextoFormatado == null)
        {
            return null;
        }
        else
        {
            TextoFormatado = TextoFormatado.toString().replace( /^\D+/g, "").replace(",", "").replace(".", "");
            TextoFormatado = (TextoFormatado.length <= 4) ? (parseFloat(TextoFormatado) / 100).toFixed(2).toString().replace(".", "") : (TextoFormatado.substr(0, 2) == "00" ? TextoFormatado.replace("00", "") : TextoFormatado);

            var Contador = -2;
            var NovoNumero = "";

            
            TextoFormatado.replace(".", "").split("").reverse().forEach(Item =>
            {
                if (!isNaN(parseFloat(Item)))
                {
                    if (Contador == 0)
                    {
                        NovoNumero += "." + Item;
                    }
                    else
                    {
                        NovoNumero += Item;
                    }
                    Contador++;
                }
            })
            return parseFloat(NovoNumero.split("").reverse().join(""));
        }
    };
    Data (numero)
    {
        if (numero == null) 
        {
            
            return null;

        } 
        else 
        {

            numero = (numero.toString().replace( /^\D+/g, "").replace(",", "").replace(".", "")
                    .toString().replace(".", "").replace("-", "").replace("/", "")).toString().replace("/", "");

            switch (numero.length)
            {
                case 1:
                    numero = numero.substring(0, 1);
                    break;
                case 2:
                    numero = numero.substring(0, 2);
                    break;
                case 3:
                    numero = numero.substring(0, 2) + "/" + numero.substring(2, 3);
                    break;
                case 4:
                    numero = numero.substring(0, 2) + "/" + numero.substring(2, 4);
                    break;
                case 5:
                    numero = numero.substring(0, 2) + "/" + numero.substring(2, 4) + "/" + numero.substring(4, 5);
                    break;
                case 6:
                    numero = numero.substring(0, 2) + "/" + numero.substring(2, 4) + "/" + numero.substring(4, 6);
                    break;
                case 7:
                    numero = numero.substring(0, 2) + "/" + numero.substring(2, 4) + "/" + numero.substring(4, 7);
                    break;
                case 8:
                    numero = numero.substring(0, 2) + "/" + numero.substring(2, 4) + "/" + numero.substring(4, 8);
                    break
                case 9:
                    numero = numero.substring(0, 2) + "/" + numero.substring(2, 4) + "/" + numero.substring(4, 8);
                    break
            }
        }
        return numero;
    }
    Percentual (numero)
    {
        if (numero == null)
        {
            return null;
        }
        else
        {
            numero = numero.toString().replace( /^\D+/g, "").replace(",", "").replace(".", "");
            numero = (parseFloat(numero) / 10000).toFixed(4).toString();
            numero = numero.replace(".", ",");
            return numero; + " %";
        }
    }
    NumeroInteiro (numero)
    {
        if (numero == null || numero == "")
        {
            return null;
        }
        else 
        {
            numero = Math.round(numero).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return numero > 9 ? "" + numero: "0" + numero;
        }
    }
    NumeroDecimal (numero)
    {
        if (numero == null)
        {
            return null;
        }
        else
        {
            numero = numero.toString().replace( /^\D+/g, '');
            numero = (numero[numero.length - 3] == "." || numero[numero.length - 3] == ",") ? numero : numero + "00";
            numero = (parseFloat(numero.replace(".", "").replace(",", "")) / 100).toFixed(2).toString();
            return numero.replace(/\B(?=(\d{3})+(?!\d))/g, ",").replace(".", " ").replace(",", ".").replace(" ", ",");
        }
    }
    CEPOriginal (numero)
    {
        if (numero == null)
        {
            return null;
        }
        else
        {
            return numero.toString().replace( /^\D+/g, "").replace(",", "").replace(".", "").toString().replace(".", "").replace("-", "").replace("/", "");
        }
    }
    CPF_CNPJOriginal (numero)
    {
        if (numero == null)
        {
            return null;
        }
        else
        {
            return numero.toString().replace( /^\D+/g, "").replace("-", "").replace("/", "").replace(",", "").replace(".", "").toString().replace(".", "");
        }
    }
    TelefoneOriginal (numero)
    {
        if (numero == null)
        {
            return null;
        }
        else
        {
            return numero.toString().replace( /^\D+/g, "").replace("+", "").replace("(", "").replace(")", "").replace(" ", "").replace("-", "").toString().replace("+", "").replace("(", "").replace(")", "").replace(" ", "").replace("-", "");
        }
    }
    NumeroDecimalOriginal (numero)
    {
        if (numero == null)
        {
            return null;
        }
        else
        {
            numero = numero.toString().replace( /^\D+/g, '').replace(".", "").replace(",", "");
            return parseFloat(numero) / 100;
        }
    }
    DataOriginal (numero)
    {
        if(numero == null)
        {
            return null;
        }
        else 
        {
            return moment(numero, 'DD/MM/YYYY', true).toDate()
        }
    }
    DataAPI (numero)
    {
        if(numero == null) 
        {   
            
            return null;
        }
        else 
        {
            return moment(numero, 'DD/MM/YYYY', true).format("MM-DD-YYYY");
        }
    }
    DataJSON (numero)
    {
        if(numero == null) 
        {
            return null;
        } 
        else 
        {
            return moment(numero, 'DD/MM/YYYY', true).format("YYYY-MM-DD");
        }
    }
    DataInvertendoJSON (numero)
    {
        if(numero == null)
        {
            return null;
        }
        else
        {
            return moment(numero, 'YYYY-MM-DD', true).format("DD/MM/YYYY")
        }
    }
    TextoValido(Texto) {
        var Soma = 0;
        var Resto = 0;
        Texto = Texto.replace(/^\D+/g, "")
            .replace(",", "").replace(".", "")
            .replace(".", "").replace("-", "")
            .replace("/", "");

        if (Texto == "00000000000") {
            return false;
        }
        for (let i = 1; i <= 9; i++) {
            Soma = Soma + parseInt(Texto.substring(i - 1, i)) * (11 - i);
        }
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11)) {
            Resto = 0;
        }
        if (Resto != parseInt(Texto.substring(9, 10))) {
            return false;
        }

        Soma = 0;
        for (let i = 1; i <= 10; i++) {
            Soma = Soma + parseInt(Texto.substring(i - 1, i)) * (12 - i);
        }
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11)) {
            Resto = 0;
        }
        if (Resto != parseInt(Texto.substring(10, 11))) {
            return false;
        }
        return true;
    }
}

export default new FormatoDeTexto();