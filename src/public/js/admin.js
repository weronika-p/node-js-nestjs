const deleteProduct = async (btn) => {
    const prodId = btn.parentNode.querySelector('[name=productId]').value;
    const productElement = btn.closest('article');

    try {
        const result = await fetch(`/admin/product/${prodId}`, {method: 'DELETE'});
        const data = await result.json();
        console.log(data);
        productElement.parentNode.removeChild(productElement);
    } catch (error) {
        console.log(error)
    }
};