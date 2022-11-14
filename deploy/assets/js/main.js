// const urlApi = 'https://bsale-backend-api.herokuapp.com/api/v1/';
const urlApi = 'https://bsale-api-app-deplo.herokuapp.com/api/v1';
const cardContainer = document.getElementById('card-container');
const liContainerCategories = document.getElementById('li-container');
const searchProductInput = document.getElementById('searchProduct');
const btnSearch = document.getElementById('btn-search');
const spinner = document.getElementById('spinner');
const paginationContainer = document.getElementById('pagination');
const notFoundContainer = document.getElementById('notFoundContainer');

const imgRes = 'https://raw.githubusercontent.com/TeoLunas/desafio-bsale-frontend/main/assets/img/default.png'

const cardTemplate = document.querySelector('#template-card').content;
const liTemplate = document.querySelector('#template-li').content;
const paginationTemplate = document.querySelector('#template-pagination').content;
const fragment = document.createDocumentFragment();
const fragmentLi = document.createDocumentFragment();

document.addEventListener('DOMContentLoaded', () => {startApp()})

const startApp = async() => {
    const products = await getProducts();
    renderCards(products.rows);
    hiddenSpinner();
    renderCategories();
    renderPagination();
}

btnSearch.addEventListener('click', async (e) => {
    e.preventDefault()
    //Validacion para que solo se acepten letras y espacios.
    const expr = /([^\w\d])+/g;
    let testInput = expr.test(searchProductInput.value);
    if (testInput || searchProductInput.value === '') {
        searchProductInput.classList.add('border-danger');
        setTimeout(() => {
            searchProductInput.classList.remove('border-danger');
        }, 3000);
        return;
    } else {
        cleanHtml(cardContainer)
        const products = await getSearchProducts(searchProductInput.value)
        showSpinner();
        renderCards(products);
        hiddenSpinner();
        hiddenErrorNotFound();
        if (products.statusCode === 404) {
            showErrorNotFound()
        }
    }
})

liContainerCategories.addEventListener('click', async(e)=> {
    if(e.target.classList.contains('nav-link')){
        const categoryId = e.target.dataset.id;
        const products = await getProductByCategory(categoryId);
        cleanHtml(cardContainer);
        showSpinner();
        renderCards(products);
        hiddenSpinner();
    }
})

paginationContainer.addEventListener('click', async(e)=> {
    if(e.target.classList.contains('page-link')){
        const page = e.target.dataset.id;
        const products = await getProducts(page);
        console.log(products)
        cleanHtml(cardContainer);
        showSpinner();
        renderCards(products.rows);
        hiddenSpinner();
    }
})

/**
 * funcion que se carga cuando se abre la pagina principal.
 */


/**
 * Funciones de consulta a la API
 */
/**
 * Funcion para obtener todos los productos
 */
const getProducts = async(pageNumber = 1) => {
    const res = await fetch(`${urlApi}/products/?page=${pageNumber}`);
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
        return data;
    };
    return data;
};

/**
* Funcion para buscar productos
*/
const getSearchProducts = async (productName) => {
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
        liTemplate.querySelector('.nav-link').dataset.id = id;
        const clone = liTemplate.cloneNode(true);
        fragmentLi.appendChild(clone);
    })
    liContainerCategories.appendChild(fragmentLi)

};

const renderCards = async (array) => {
    array.forEach(product => {
        const { name, url_image, price, discount } = product;
        const amountDiscount = discount === 0 ? 0 : (discount * price) / 100;
        // console.log(price, discount)
        // console.log(price - amountDiscount)
        cardTemplate.querySelector('img').setAttribute('src', url_image);
        if(!url_image){
            cardTemplate.querySelector('img').setAttribute('src', imgRes);
        }
        cardTemplate.querySelector('.card-title').textContent = name;
        cardTemplate.querySelector('.card-text').textContent = `${discount}%`;
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

const showErrorNotFound = () => {
    if(notFoundContainer.classList.contains('hidden-price')){
        notFoundContainer.classList.remove('hidden-price');
    }
}

const hiddenErrorNotFound = () => {
    notFoundContainer.classList.add('hidden-price');
}

const showSpinner = () => {
    spinner.classList.remove('hidden-price')
};

const hiddenSpinner = () => {
    spinner.classList.add('hidden-price')
};

const generatorNumPages = async() => {
    const { totalPages } = await getProducts()
    return Array.from({ length: totalPages }, (x, i) => i+1);
}

const renderPagination = async() => {
    const pages = await generatorNumPages();
    pages.forEach( pageNumber => {
        paginationTemplate.querySelector('a').textContent = pageNumber
        paginationTemplate.querySelector('a').dataset.id = pageNumber
        const clone = paginationTemplate.cloneNode(true);
        fragment.appendChild(clone)
    })
    paginationContainer.appendChild(fragment)
}
