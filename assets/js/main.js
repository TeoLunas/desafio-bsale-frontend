const urlDev = 'http://localhost:4000/api/v1';


/**
 * Funciones de consulta a la API
 */
/**
 * Funcion para obtener todos los productos
 */
const getProducts = async() => {
    const res = await fetch(`${urlDev}/products`);
    const data = await res.json();
    if(res.status === 404){
        console.log(data.message);
        return;
    };
    return data;
};

/**
 * Funcion para obtener todas las categorias
 */
const getCategories = async() => {
    const res = await fetch(`${urlDev}/category`);
    const data = await res.json();
    if(res.status === 404){
        console.log(data.message);
        return;
    };
    return data;
};

/** 
 * Funcion para obtener los productos asociados a una categoria
 * Se debe enviar el id de la categoria
*/
const getProductByCategory = async(id) => {
    const res = await fetch(`${urlDev}/category/${id}`);
    const data = await res.json();
    if(res.status === 404){
        console.log(data.message);
        return;
    };
    return data;
};
