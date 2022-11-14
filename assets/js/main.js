const urlApi = 'https://bsale-backend-api.herokuapp.com/api/v1/';
const cardContainer = document.getElementById('card-container');
const liContainer = document.getElementById('li-container');
const searchProductInput = document.getElementById('searchProduct');
const btnSearch = document.getElementById('btn-search');
const spinner = document.getElementById('spinner');

console.log(btnSearch)

const imgRes = 'http://127.0.0.1:5500/assets/img/default.png'

const cardTemplate = document.querySelector('#template-card').content;
const liTemplate = document.querySelector('#template-li').content;
const fragment = document.createDocumentFragment();
const fragmentLi = document.createDocumentFragment();


btnSearch.addEventListener('click', async(e)=> {
    e.preventDefault();
    cleanHtml(cardContainer)
    try {
        showSpinner();
        const products = await searchProducts(searchProductInput.value)
        console.log(products)
        renderCards(products);
        hiddenSpinner();

    } catch (error) {
        console.log(error.message)
    }
})

document.addEventListener('DOMContentLoaded', () => {
    startApp()
})

/**
 * funcion que se carga cuando se abre la pagina principal.
 */
const startApp = async() => {
    const products = await getProducts();
    renderCards(products.rows);
    hiddenSpinner();
}

/**
 * Funciones de consulta a la API
 */
/**
 * Funcion para obtener todos los productos
 */
const getProducts = async() => {
    const res = await fetch(`${urlApi}/products`);
    const data = await res.json();
    return data;

};

/**
 * Funcion para obtener todas las categorias
 */
const getCategories = async() => {
    const res = await fetch(`${urlApi}/category`);
    const data = await res.json();
    if(res.status === 404){
        console.log(data)
        return data;
    };
    return data;
};

/**
* Funcion para buscar productos
*/
const searchProducts = async (productName) => {
    try {
        const res = await fetch(`${urlApi}/products/search?productName=${productName}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error)   
    }
};

/** 
 * Funcion para obtener los productos asociados a una categoria
 * Se debe enviar el id de la categoria
*/
const getProductByCategory = async(id) => {
    const res = await fetch(`${urlApi}/category/${id}`);
    const data = await res.json();
    if(res.status === 404){
        return data.message;
    };
    return data;
};

const renderCategories = async() => {
    const categories = await getCategories();
    categories.forEach(category => {
        const { id, name } = category;
        liTemplate.querySelector('.nav-link').textContent = name;
        const clone = liTemplate.cloneNode(true);
        fragmentLi.appendChild(clone);
    })

    liContainer.appendChild(fragmentLi)

}

renderCategories();

const renderCards = async (array) => {
    array.forEach(product => {
        const { name, url_image, price, discount } = product;
        const amountDiscount = discount === 0 ? 0 : (discount * price) / 100;
        cardTemplate.querySelector('img').setAttribute('src', url_image);
        if(!url_image){
            cardTemplate.querySelector('img').setAttribute('src', imgRes);
        }
        cardTemplate.querySelector('.card-title').textContent = name;
        // cardTemplate.querySelector('.card-text').textContent = formatMoney(price);
        // discount != 0 ? console.log({name, discount}) : console.log({name, discount})
        // discount != 0 ? cardTemplate.querySelector('.card-text').textContent = formatMoney(price) : console.log({name, discount})
        // cardTemplate.querySelector('.card-text').classList.add('hidden-price')
        cardTemplate.querySelector('.fw-bold').textContent = formatMoney((price - amountDiscount));
        
        // cardTemplate.querySelector('').textContent = "";
        const clone = cardTemplate.cloneNode(true);
        fragment.appendChild(clone);
    });
    cardContainer.appendChild(fragment)
}

/**
 * 
 * Funcion que formatea CLP un monto
 * Se le debe pasar como parametro un INTEGER 
 * Retorna el parametro en formato de CLP 
 * ejemplo 1500 lo retorna como $1500 
 * ejmeplo 2 500 lo retorna como $500
 */
const formatMoney = amount =>{
    const format = new Intl.NumberFormat("es-CL", { style: "currency", "currency": "CLP" });
    return format.format(amount);
}


//Eliminar las cards de los productos.
const cleanHtml = (container) => {
    while (container.firstChild) {
        container.removeChild(container.lastChild);
    }
}

const errorNotFound = () => {
    alert('not found')
}
const showSpinner = () => {
    spinner.classList.remove('hidden-price')

};

const hiddenSpinner = () => {
    spinner.classList.add('hidden-price')
}
