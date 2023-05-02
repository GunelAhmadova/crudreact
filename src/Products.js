import React, { useEffect, useState } from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';

const Products = () => {
    const [products, setProducts] = useState([])
    const apiPoint = 'http://localhost:3000/products'

    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [category, setCategory] = useState("")
    const [editing, setEditing] = useState(false)
    const [editId, setEditId] = useState(null)

    useEffect(() => {
        const getData = async () => {
            const response = await axios.get(apiPoint)
            setProducts(response.data)
        }
        getData();
    }, [])

    const nameHandler = (event) => {
        setName(event.target.value)
    }

    const priceHandler = (event) => {
        setPrice(event.target.value)
    }

    const categoryHandler = (event) => {
        setCategory(event.target.value)
    }

    const addPostHandler = async () => {
        const newPost = {
            name: name,
            price: price,
            category: category,
            id: products[products.length - 1].id + 1
        }
        await axios.post(apiPoint, newPost)
        setProducts([...products, newPost])
        setName("")
        setPrice("")
        setCategory("")
    }

    const deleteHandler = async (id) => {
        await axios.delete(`${apiPoint}/${id}`)
        setProducts(products.filter(p => p.id !== id))
    }

    const editHandler = (id) => {
        setEditing(true)
        setEditId(id)
        const product = products.find(p => p.id === id)
        setName(product.name)
        setPrice(product.price)
        setCategory(product.category)
    }

    const updateHandler = async () => {
        const updatedProduct = {
            name: name,
            price: price,
            category: category,
            id: editId
        }
        await axios.put(`${apiPoint}/${editId}`, updatedProduct)
        const updatedProducts = products.map(p => {
            if (p.id === editId) {
                return updatedProduct
            }
            return p
        })
        setProducts(updatedProducts)
        setEditing(false)
        setEditId(null)
        setName("")
        setPrice("")
        setCategory("")
    }

    return (
        <div>
            <h1>Create Productsssss</h1>
            <input onChange={nameHandler} type='text' placeholder='Enter Product Name' value={name} />
            <input onChange={priceHandler} type='text' placeholder='Enter Price' value={price} />
            <input onChange={categoryHandler} type='text' placeholder='Enter Category' value={category} />
            {editing ? (
                <button onClick={updateHandler}>Update</button>
            ) : (
                <button onClick={addPostHandler}>Add</button>
            )}
            {editing && (
                <button onClick={() => setEditing(false)}>Cancel</button>
            )}

            {products.map(product => (
                <div key={product.id}>
                    <h1>{product.id}</h1>
                    <h1>{product.name}</h1>
                    <h4>{product.category}</h4>
                    <button>{product.price}</button>
                    <button onClick={() => deleteHandler(product.id)} className='btn btn-danger'>Delete</button>
                    <button onClick={() => editHandler(product.id)} className='btn btn-warning'>Edit</button>
                </div>
            ))}
        </div>
    )
}

export default Products