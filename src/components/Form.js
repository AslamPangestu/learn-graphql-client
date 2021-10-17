import React, { useEffect } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useLazyQuery } from '@apollo/client';

import { CREATE_BOOK, GET_BOOK, UPDATE_BOOK } from 'services/graphql/books';

export default function Form() {
    const history = useHistory();
    const params = useParams();
    const [newBook, { loading: newBookLoading, error: newBookError }] = useMutation(CREATE_BOOK)
    const [updatedBook, { loading: updatedBookLoading, error: updatedBookError }] = useMutation(UPDATE_BOOK)
    const [getBook, { loading: getDetailLoading, error: getDetailError, data: bookData }] = useLazyQuery(GET_BOOK, { variables: { _id: params.id } })

    const onSubmit = async (event) => {
        event.preventDefault();
        // SETUP DATA
        const target = event.target
        const payload = {};
        for (let index = 0; index < target.length; index++) {
            const element = target[index];
            if (element.nodeName === "INPUT") {
                let val = element.value
                if (element.name === 'release_year') {
                    val = Number(element.value)
                }
                payload[element.name] = val
            }
        }
        if (params.id) {
            payload._id = params.id
        }
        // HIT SERVICE
        try {
            const services = params.id ? updatedBook : newBook
            const res = await services({ variables: { ...payload } })
            if (res) {
                history.push('/books')
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (params.id) {
            getBook();
        }
    }, [params.id, getBook])

    useEffect(() => {
        if (bookData) {
            const form = document.getElementById('book-form')
            if(form){
                for (let index = 0; index < form.length; index++) {
                    const element = form[index];
                    if (element.nodeName === "INPUT") {
                        element.value = bookData.getDetailBook[element.name]
                    }
                }
            }
        }
    }, [bookData])

    if (params.id && getDetailLoading) return "Loading..."
    if (newBookLoading || updatedBookLoading) return "Data sedang diproses"
    if (newBookError || updatedBookError || getDetailError) return "Ada masalah dengan service"

    return (
        <div>
            <h1><Link to="/books" style={{ fontSize: 12 }}>Back</Link>Formulir Buku</h1>
            <form id="book-form" style={{ maxWidth: 500 }} onSubmit={onSubmit}>
                {/* FORM */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="title">Title: </label>
                    <input type="text" id="title" name="title" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="author">Author: </label>
                    <input type="text" id="author" name="author" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="description">Description: </label>
                    <input type="text" id="description" name="description" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="release_year">Relase Year: </label>
                    <input type="number" id="release_year" name="release_year" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="genre">Genre: </label>
                    <input type="text" id="genre" name="genre" />
                </div>
                {/* ACTION */}
                <button type="button" onClick={() => history.push('/books')}>Back</button>
                <button type="submit">{params.id ? 'Update' : 'Create'}</button>
            </form>
        </div>
    )
}
