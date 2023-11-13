import { 
    Canister, 
    query, 
    text, 
    update, 
    Void, 
    Principal,
    Record,
    StableBTreeMap,
    ic,
    Opt,
    Vec,
    Variant,
    Err,
    Ok,
    Result
} from 'azle';

// Esta variable contiene el ID con el que se genera el certificado
let certificaID = Principal;

const Certifica=Record({
    usuario: Principal,
    curso: text,
    alumno: text,
    instructor: text,
    fecha: text,
    modalidad : text,
    lugar: text,
});

const CertificaError=Variant({
    CertificaNoExiste: Principal,
});

const listaCertifica=Record({
    ids:Vec(Principal),
    Certificar:Vec(Certifica)
});
//Generando la variable estable
let certificas= StableBTreeMap(Principal,Certifica,0);

export default Canister({
    crearCertificado: update([text, text,text, text,text,text],Principal,
        (curso, alumno, instructor, fecha, modalidad, lugar) => {
            const id=generaCertificaId();
            const certificad: typeof Certifica = {
                usuario: ic.caller(),
                curso,
                alumno,
                instructor,
                fecha,
                modalidad, 
                lugar
            };
        certificas.insert(id,certificad);
        return id
        }),
        
    leerCertificados :query ([],listaCertifica ,()=>{
        const listaCertifica1: typeof listaCertifica = {
            ids : certificas.keys(),
            Certificar : certificas.values()
        };
        return listaCertifica1
    }),

    leerCertificado: query([Principal],Opt(Certifica),(id)=>{
        return certificas.get(id)
    }),

    ActualizaCertificado: update([Principal, text,text,text,text,text,text], Result (Principal, CertificaError), (id, curso, alumno, instructor, fecha, modalidad, lugar) => {
        
        //Buscamos el post en nuestro mapa. Como puede que exista o puede que no, el tipo de dato será Opt(Post)
        const CertificaOpt = certificas.get(id);

        //Evaluamos, si nuestra búsqueda arriba retorna algo vacío entonces envíamos el error
        if ('None' in CertificaOpt) {
            return Err({
                CertificaNoExiste: id
            });
        }

        //Si llegamos a esta linea entonces podemos asumir que nuestra variable no estaba vacía. Por lo que es seguro hacer un unwrap utilizando Some.
        const Certifical = CertificaOpt.Some;

        //Creamos un nuevo post, con el spread operator (...) le indicamos que copie todas las propiedades que nuestro post original tenía
        //excepto el mensaje, el cual estamos pasando al constructor para agregar el mensaje modificado.
        const nuevoCertificado: typeof Certifica = {
                usuario: ic.caller(),
                curso,
                alumno,
                instructor,
                fecha,
                modalidad, 
                lugar
        };

        //Insertamos el post modificado.
        certificas.insert(id, nuevoCertificado);


        //Y regresamos Ok y el post. Es necesario regresar Ok si nuestro tipo de dato de retorno fue Result.
        return Ok(id);
    }),
    //Método de escritura que borra un post si lo encuentra. Muy similar al método de arriba.
    borraCertificado: update([Principal], Result(Principal, CertificaError), (id) => {
        const certificaOpt = certificas.get(id);

        if ('None' in certificaOpt) {
            return Err({
                CertificaNoExiste: id
            });
        }

        const certifica = certificaOpt.Some;
        //La única diferencia es que en vez de modificar algo simplemente lo borramos de nuestro mapa.
        certificas.remove(id);
        
        return Ok(id);
    }),
});

function generaCertificaId(): Principal {
    const randomBytes = new Array(29)
        .fill(0)
        .map((_) => Math.floor(Math.random() * 256));

    return Principal.fromUint8Array(Uint8Array.from(randomBytes));
}
