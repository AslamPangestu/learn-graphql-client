import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';

import { GET_BOOKS, DELETE_BOOK } from 'services/graphql/books';

export default function List() {
    const [deletedId, setDeletedId] = useState(null)
    const { loading, error, data } = useQuery(GET_BOOKS, { fetchPolicy: 'no-cache' })
    const [deleteBook, { loading: deleteBookLoading }] = useMutation(DELETE_BOOK, {
        refetchQueries: [GET_BOOKS],
        onError: err => {
            console.error(err.networkError);
        }
    })

    const onDelete = async (_id) => {
        setDeletedId(_id)
        // HIT SERVICE
        try {
            await deleteBook({ variables: { _id } })
        } catch (error) {
            console.error(error);
        }
    }

    if (loading) return "Loading..."
    if (error) return error?.graphQLErrors.map(error => error) ?? error.networkError

    return (
        <div>
            <h1>List Buku <Link to="/books/new" style={{ fontSize: 12 }}>+ Tambah Buku</Link></h1>
            {
                data.getAllBooks.length === 0 ? "Data Kosong" :
                    data.getAllBooks.map(item => (
                        <div key={item._id}>
                            {item.title}
                            [<Link to={`/books/${item._id}/edit`}>Ubah</Link>|
                            {deleteBookLoading && deletedId === item._id ? 'On Deleting' : <span onClick={() => onDelete(item._id)} style={{ textDecoration: 'underline', cursor: 'pointer', color: 'blue' }}>Hapus</span>}
                            ]
                        </div>
                    ))
            }
        </div>
    )
}
