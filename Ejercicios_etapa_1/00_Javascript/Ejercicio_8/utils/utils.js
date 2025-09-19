const getproductHandles = products => {
    return products.map(product => product.handle);
}

const getproductIds = products => {
    return products.map(product => product.id);
}